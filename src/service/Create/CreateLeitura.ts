import { supabase } from "@/supabase/supabase";
import type { LeituraProps } from "@/types";
import { uploadImageToSupabase } from "../StorageImg/StorageService";

export async function CreateLeitura(new_leitura: LeituraProps) {
  let fotoUrl: string | null = null;

  // Verifica se veio um arquivo de foto
  if (new_leitura.foto_url && typeof new_leitura.foto_url !== "string") {
    try {
      fotoUrl = await uploadImageToSupabase(
        new_leitura.foto_url,
        new_leitura.nome_loja_leitura,
        new_leitura.medidor_id
      );
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw new Error(
        "Não foi possível enviar a imagem para o Supabase Storage."
      );
    }
  }

  // Monta o objeto final para inserir
  const leituraToInsert = {
    ...new_leitura,
    foto_url: fotoUrl || null,
  };

  // Insere a leitura no banco
  const { data: insertedData, error: insertError } = await supabase
    .from("leituras")
    .insert(leituraToInsert)
    .select("*")
    .single();

  if (insertError) {
    throw new Error("Erro ao inserir a leitura: " + insertError.message);
  }

  // Atualiza a última leitura no medidor correspondente
  const { medidor_id, leitura_atual } = insertedData;
  const { error: updateError } = await supabase
    .from("medidores")
    .update({ ultima_leitura: leitura_atual })
    .eq("id", medidor_id);

  if (updateError) {
    throw new Error("Erro ao atualizar o medidor: " + updateError.message);
  }

  return insertedData;
}
