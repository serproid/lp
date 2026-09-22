import { useEffect, useState } from "react";

export type PriceOverride = { crmPrice?: number; discountPrice?: number | null };
export type PriceOverrides = Record<string, PriceOverride>;

const KEY = "byd:price-overrides";
const EVENT = "byd:price-overrides-changed";

const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const brl = (value: number) => brlFormatter.format(value);

export function getOverrides(): PriceOverrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as PriceOverrides;
  } catch {
    return {};
  }
}

export function saveOverrides(overrides: PriceOverrides) {
  window.localStorage.setItem(KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event(EVENT));
}

export function clearOverrides() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function usePriceOverrides(): PriceOverrides {
  const [overrides, setOverrides] = useState<PriceOverrides>(() => getOverrides());
  useEffect(() => {
    const update = () => setOverrides(getOverrides());
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return overrides;
}
