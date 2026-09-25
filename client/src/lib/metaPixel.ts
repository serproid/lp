const PIXEL_ID = ((import.meta.env.VITE_META_PIXEL_ID as string) || "").trim();

export function initMetaPixel() {
  if (!PIXEL_ID || typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.fbq === "function") return;

  const n: any = (w.fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod.apply(n, args);
    else n.queue.push(args);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const first = document.getElementsByTagName("script")[0];
  first?.parentNode?.insertBefore(script, first);

  w.fbq("init", PIXEL_ID);
  w.fbq("track", "PageView");
}

export function trackLead(data?: Record<string, unknown>) {
  if (!PIXEL_ID || typeof window === "undefined") return;
  const w = window as any;
  if (typeof w.fbq === "function") w.fbq("track", "Lead", data);
}

export const META_PIXEL_ENABLED = Boolean(PIXEL_ID);
