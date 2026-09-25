const GRAPH_VERSION = "v21.0";
const DEFAULT_PIXEL_ID = "1298140956724395";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const normalizeText = (v?: string | null) => (v ?? "").trim().toLowerCase();
const normalizeAddress = (v?: string | null) => normalizeText(v).replace(/\s+/g, "");
const normalizeDigits = (v?: string | null) => (v ?? "").replace(/\D/g, "");

type UserPayload = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  fbp?: string;
  fbc?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const pixelId = Deno.env.get("META_PIXEL_ID") || DEFAULT_PIXEL_ID;
  const token = Deno.env.get("META_CAPI_TOKEN");
  if (!token) return json({ ok: false, error: "META_CAPI_TOKEN not configured" }, 500);

  let body: {
    event_name?: string;
    event_id?: string;
    event_source_url?: string;
    user_data?: UserPayload;
    custom_data?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const user = body.user_data ?? {};
  const userData: Record<string, string> = {};
  if (user.email) userData.em = await sha256(normalizeText(user.email));
  if (user.phone) userData.ph = await sha256(normalizeDigits(user.phone));
  if (user.firstName) userData.fn = await sha256(normalizeText(user.firstName));
  if (user.lastName) userData.ln = await sha256(normalizeText(user.lastName));
  if (user.city) userData.ct = await sha256(normalizeAddress(user.city));
  if (user.state) userData.st = await sha256(normalizeAddress(user.state));
  if (user.zip) userData.zp = await sha256(normalizeDigits(user.zip));
  userData.country = await sha256(normalizeText(user.country || "br"));
  if (user.fbp) userData.fbp = user.fbp;
  if (user.fbc) userData.fbc = user.fbc;

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (clientIp) (userData as Record<string, string>).client_ip_address = clientIp;
  const userAgent = req.headers.get("user-agent");
  if (userAgent) (userData as Record<string, string>).client_user_agent = userAgent;

  const payload = {
    data: [
      {
        event_name: body.event_name || "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: body.event_id,
        event_source_url: body.event_source_url,
        action_source: "website",
        user_data: userData,
        custom_data: body.custom_data ?? {},
      },
    ],
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const text = await res.text();
  return json({ ok: res.ok, status: res.status, response: text });
});
