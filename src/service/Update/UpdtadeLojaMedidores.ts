// @repo/utils/supabaseFunctions.ts (crie um novo arquivo ou adicione ao existente)

import { supabase } from "@/supabase/supabase"; // Ajuste o caminho
import { LojaUpdtadeProps, Medidores } from "@/types";

export async function updateLoja(lojaId: string, payload: LojaUpdtadeProps) {
  const { data, error } = await supabase
    .from("lojas")
    .update(payload)
    .eq("id", lojaId)
    .select()
    .single();

  if (error) {
    console.error("Erro ao atualizar loja:", error.message);
    throw error;
  }
  return data;
}

export async function upsertMedidor(medidor: Medidores) {
  const { data, error } = await supabase
    .from("medidores")
    .upsert(medidor, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar/atualizar medidor:", error.message, medidor);
    throw error;
  }
  return data;
}

export async function deleteMedidor(medidorId: string) {
  const { error } = await supabase
    .from("medidores")
    .delete()
    .eq("id", medidorId);

  if (error) {
    console.error("Erro ao deletar medidor:", error.message);
    throw error;
  }
  return true;
}
