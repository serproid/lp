import { supabase } from "./supabase";

export type LeadStatus = "novo" | "em_contato" | "convertido" | "descartado";
export type PersonType = "fisica" | "juridica";

export type Lead = {
  id: string;
  offerId: string | null;
  model: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  personType: PersonType;
  document: string;
  state: string | null;
  city: string | null;
  cep: string | null;
  details: string | null;
  status: LeadStatus;
  createdAt: string;
};

export type LeadInput = {
  offerId?: string | null;
  model?: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  personType: PersonType;
  document: string;
  state?: string | null;
  city?: string | null;
  cep?: string | null;
  details?: string | null;
};

type LeadRow = {
  id: string;
  offer_id: string | null;
  model: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  person_type: PersonType;
  document: string;
  state: string | null;
  city: string | null;
  cep: string | null;
  details: string | null;
  status: LeadStatus;
  created_at: string;
};

function mapLead(row: LeadRow): Lead {
  return {
    id: row.id,
    offerId: row.offer_id,
    model: row.model,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    email: row.email,
    personType: row.person_type,
    document: row.document,
    state: row.state,
    city: row.city,
    cep: row.cep,
    details: row.details,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function submitLead(input: LeadInput): Promise<void> {
  const { error } = await supabase.from("leads").insert({
    offer_id: input.offerId ?? null,
    model: input.model ?? null,
    first_name: input.firstName,
    last_name: input.lastName,
    phone: input.phone,
    email: input.email,
    person_type: input.personType,
    document: input.document,
    state: input.state ?? null,
    city: input.city ?? null,
    cep: input.cep ?? null,
    details: input.details ?? null,
  });
  if (error) throw error;
}

export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as LeadRow[]).map(mapLead);
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  const { error } = await supabase.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
