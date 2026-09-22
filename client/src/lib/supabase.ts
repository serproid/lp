import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

if (!url || !anonKey) {
  console.warn("[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY não configurados.");
}

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const APP_BUCKET = "app-downloads";
