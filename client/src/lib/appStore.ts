import { useEffect, useState } from "react";
import { APP_BUCKET, supabase } from "./supabase";

export type AppPlatform = "android" | "ios" | "web";

export type AppRelease = {
  id: string;
  platform: AppPlatform;
  version: string | null;
  fileName: string | null;
  filePath: string | null;
  fileSize: number | null;
  downloadUrl: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
};

type AppReleaseRow = {
  id: string;
  platform: AppPlatform;
  version: string | null;
  file_name: string | null;
  file_path: string | null;
  file_size: number | null;
  download_url: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
};

export const ENV_APP_DOWNLOAD_URL = (import.meta.env.VITE_APP_DOWNLOAD_URL as string) || "";

function mapRelease(row: AppReleaseRow): AppRelease {
  return {
    id: row.id,
    platform: row.platform,
    version: row.version,
    fileName: row.file_name,
    filePath: row.file_path,
    fileSize: row.file_size,
    downloadUrl: row.download_url,
    notes: row.notes,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export function publicFileUrl(path: string) {
  return supabase.storage.from(APP_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function resolveAppUrl(release: AppRelease | null) {
  if (!release) return ENV_APP_DOWNLOAD_URL;
  if (release.filePath) return publicFileUrl(release.filePath);
  return release.downloadUrl || ENV_APP_DOWNLOAD_URL;
}

export async function fetchActiveRelease(): Promise<AppRelease | null> {
  const { data, error } = await supabase
    .from("app_releases")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRelease(data as AppReleaseRow) : null;
}

export function useActiveApp(): AppRelease | null {
  const [release, setRelease] = useState<AppRelease | null>(null);
  useEffect(() => {
    let active = true;
    const load = () =>
      fetchActiveRelease()
        .then((value) => {
          if (active) setRelease(value);
        })
        .catch(() => undefined);
    window.addEventListener("focus", load);
    load();
    return () => {
      active = false;
      window.removeEventListener("focus", load);
    };
  }, []);
  return release;
}

export async function listReleases(): Promise<AppRelease[]> {
  const { data, error } = await supabase
    .from("app_releases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as AppReleaseRow[]).map(mapRelease);
}

export async function uploadApp(
  file: File,
  meta: { platform: AppPlatform; version?: string; notes?: string },
): Promise<AppRelease> {
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${meta.platform}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(APP_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "application/octet-stream" });
  if (uploadError) throw uploadError;

  const { error: deactivateError } = await supabase
    .from("app_releases")
    .update({ is_active: false })
    .eq("is_active", true);
  if (deactivateError) throw deactivateError;

  const { data, error } = await supabase
    .from("app_releases")
    .insert({
      platform: meta.platform,
      version: meta.version || null,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      notes: meta.notes || null,
      is_active: true,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRelease(data as AppReleaseRow);
}

export async function saveAppLink(meta: {
  platform: AppPlatform;
  version?: string;
  url: string;
  notes?: string;
}): Promise<AppRelease> {
  const { error: deactivateError } = await supabase
    .from("app_releases")
    .update({ is_active: false })
    .eq("is_active", true);
  if (deactivateError) throw deactivateError;

  const { data, error } = await supabase
    .from("app_releases")
    .insert({
      platform: meta.platform,
      version: meta.version || null,
      download_url: meta.url,
      notes: meta.notes || null,
      is_active: true,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRelease(data as AppReleaseRow);
}

export async function setActiveRelease(id: string) {
  const { error: clearError } = await supabase.from("app_releases").update({ is_active: false }).eq("is_active", true);
  if (clearError) throw clearError;
  const { error } = await supabase.from("app_releases").update({ is_active: true }).eq("id", id);
  if (error) throw error;
}

export async function deleteRelease(release: AppRelease) {
  if (release.filePath) {
    await supabase.storage.from(APP_BUCKET).remove([release.filePath]);
  }
  const { error } = await supabase.from("app_releases").delete().eq("id", release.id);
  if (error) throw error;
}
