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

export function trackLead(data?: Record<string, unknown>, match?: PixelAdvancedMatching) {
  if (typeof window === "undefined") return;
  const w = window as FbqWindow;
  if (typeof w.fbq !== "function") return;
  if (match) {
    const params = normalizeMatch(match);
    if (Object.keys(params).length > 0) w.fbq("init", PIXEL_ID, params);
  }
  w.fbq("track", "Lead", data);
}
