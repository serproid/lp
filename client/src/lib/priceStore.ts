import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type PriceOverride = { crmPrice: number; discountPrice: number | null };
export type PriceOverrides = Record<string, PriceOverride>;

const CACHE_KEY = "byd:price-overrides";
const EVENT = "byd:price-overrides-changed";

const brlFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const brl = (value: number) => brlFormatter.format(value);

type PriceRow = { offer_id: string; crm_price: number | string; discount_price: number | string | null };

let cache: PriceOverrides = readCache();

function readCache(): PriceOverrides {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || "{}") as PriceOverrides;
  } catch {
    return {};
  }
}

function writeCache(value: PriceOverrides) {
  cache = value;
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}

export function getOverrides(): PriceOverrides {
  return cache;
}

export async function fetchOverrides(): Promise<PriceOverrides> {
  const { data, error } = await supabase.from("offer_prices").select("offer_id, crm_price, discount_price");
  if (error) throw error;
  const next: PriceOverrides = {};
  ((data ?? []) as PriceRow[]).forEach((row) => {
    next[row.offer_id] = {
      crmPrice: Number(row.crm_price),
      discountPrice: row.discount_price === null ? null : Number(row.discount_price),
    };
  });
  writeCache(next);
  return next;
}

export async function saveOverrides(overrides: PriceOverrides) {
  const rows = Object.entries(overrides).map(([offer_id, value]) => ({
    offer_id,
    crm_price: value.crmPrice,
    discount_price: value.discountPrice,
  }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("offer_prices").upsert(rows, { onConflict: "offer_id" });
  if (error) throw error;
  await fetchOverrides();
}

export async function deleteOverride(offerId: string) {
  const { error } = await supabase.from("offer_prices").delete().eq("offer_id", offerId);
  if (error) throw error;
  await fetchOverrides();
}

export async function removeOverrides(offerIds: string[]) {
  if (offerIds.length === 0) return;
  const { error } = await supabase.from("offer_prices").delete().in("offer_id", offerIds);
  if (error) throw error;
  await fetchOverrides();
}

export async function clearOverrides() {
  const { error } = await supabase.from("offer_prices").delete().neq("offer_id", "");
  if (error) throw error;
  await fetchOverrides();
}

function refresh() {
  return fetchOverrides().catch(() => undefined);
}

export function usePriceOverrides(): PriceOverrides {
  const [overrides, setOverrides] = useState<PriceOverrides>(() => getOverrides());
  useEffect(() => {
    let active = true;
    const update = () => {
      if (active) setOverrides(getOverrides());
    };
    const reload = () => {
      refresh().then(update);
    };
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    window.addEventListener("focus", reload);
    reload();
    return () => {
      active = false;
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", reload);
    };
  }, []);
  return overrides;
}
