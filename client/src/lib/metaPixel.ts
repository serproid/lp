import { supabase } from "./supabase";

type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

const PIXEL_ID = "1298140956724395";

export type PixelAdvancedMatching = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
};

function normalizeMatch(match: PixelAdvancedMatching): Record<string, string> {
  const params: Record<string, string> = {};
  const email = (match.email ?? "").trim().toLowerCase();
  const phone = (match.phone ?? "").replace(/\D/g, "");
  const firstName = (match.firstName ?? "").trim().toLowerCase();
  const lastName = (match.lastName ?? "").trim().toLowerCase();
  const city = (match.city ?? "").trim().toLowerCase().replace(/\s+/g, "");
  const state = (match.state ?? "").trim().toLowerCase().replace(/\s+/g, "");
  const zip = (match.zip ?? "").replace(/\D/g, "");
  const country = (match.country ?? "").trim().toLowerCase() || "br";
  if (email) params.em = email;
  if (phone) params.ph = phone;
  if (firstName) params.fn = firstName;
  if (lastName) params.ln = lastName;
  if (city) params.ct = city;
  if (state) params.st = state;
  if (zip) params.zp = zip;
  if (country) params.country = country;
  return params;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : undefined;
}

function getFbc(): string | undefined {
  const cookie = readCookie("_fbc");
  if (cookie) return cookie;
  if (typeof window === "undefined") return undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

async function sendToConversionsApi(
  eventId: string,
  customData?: Record<string, unknown>,
  match?: PixelAdvancedMatching,
) {
  try {
    await supabase.functions.invoke("meta-capi", {
      body: {
        event_name: "Lead",
        event_id: eventId,
        event_source_url: typeof window !== "undefined" ? window.location.href : undefined,
        user_data: {
          email: match?.email,
          phone: match?.phone,
          firstName: match?.firstName,
          lastName: match?.lastName,
          city: match?.city,
          state: match?.state,
          zip: match?.zip,
          country: match?.country || "br",
          fbp: readCookie("_fbp"),
          fbc: getFbc(),
        },
        custom_data: customData,
      },
    });
  } catch {
    // fire-and-forget: a Conversions API failure must never block the form
  }
}

export function trackLead(data?: Record<string, unknown>, match?: PixelAdvancedMatching) {
  if (typeof window === "undefined") return;
  const w = window as FbqWindow;
  const eventId = newEventId();
  if (typeof w.fbq === "function") {
    if (match) {
      const params = normalizeMatch(match);
      if (Object.keys(params).length > 0) w.fbq("init", PIXEL_ID, params);
    }
    w.fbq("track", "Lead", data, { eventID: eventId });
  }
  void sendToConversionsApi(eventId, data, match);
}
