import { supabase } from "@/supabase/supabase";

export async function fetchLojaSingle(loja_id: string, medidor_id?: string) {
  const { data: lojaData, error: lojaError } = await supabase
    .from("lojas")
    .select("*")
    .eq("id", loja_id)
    .single();

  if (lojaError) {
    console.error("Erro ao buscar loja:", lojaError.message);
    return null;
  }

  if (!lojaData) {
    console.warn("Loja nao encontrada.");
    return null;
  }

  if (medidor_id !== "" || medidor_id !== undefined || medidor_id !== null) {
    const { data: medidorData, error: medidorError } = await supabase
      .from("medidores")
      .select("*,leituras(*)")
      .eq("loja_id", loja_id)
      .eq("id", medidor_id)
      .single();

    if (medidorError) {
      console.error("Erro ao buscar medidor:", medidorError.message);
      return null;
    }

    if (!medidorData) {
      console.warn("Medidor nao encontrado.");
      return null;
    }

    return {
      loja: lojaData,
      medidor: medidorData,
    };

    return lojaData;
  }
}
