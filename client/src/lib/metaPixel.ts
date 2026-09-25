type FbqWindow = Window & { fbq?: (...args: unknown[]) => void };

export function trackLead(data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as FbqWindow;
  if (typeof w.fbq === "function") w.fbq("track", "Lead", data);
}
