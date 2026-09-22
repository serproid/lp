import { useEffect, useState } from "react";

export type AppConfig = { downloadUrl: string };

const KEY = "byd:app-config";
const EVENT = "byd:app-config-changed";

export const APP_DOWNLOAD_URL = (import.meta.env.VITE_APP_DOWNLOAD_URL as string) || "";

export function getAppConfig(): AppConfig {
  if (typeof window === "undefined") return { downloadUrl: "" };
  try {
    return { downloadUrl: "", ...(JSON.parse(window.localStorage.getItem(KEY) || "{}") as Partial<AppConfig>) };
  } catch {
    return { downloadUrl: "" };
  }
}

export function saveAppConfig(config: AppConfig) {
  window.localStorage.setItem(KEY, JSON.stringify(config));
  window.dispatchEvent(new Event(EVENT));
}

export function resolveAppUrl(config: AppConfig) {
  return config.downloadUrl || APP_DOWNLOAD_URL;
}

export function useAppConfig(): AppConfig {
  const [config, setConfig] = useState<AppConfig>(() => getAppConfig());
  useEffect(() => {
    const update = () => setConfig(getAppConfig());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return config;
}
