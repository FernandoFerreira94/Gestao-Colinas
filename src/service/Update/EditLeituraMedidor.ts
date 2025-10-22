import { supabase } from "@/supabase/supabase";
import type { EditLeitura, EditMedidor, EditLoja } from "@/types";
import { uploadImageToSupabase } from "../StorageImg/StorageService";

export async function EditLeituraMedidor(
  medidor_id: string,
  loja_id: string,
  dataMedidor: EditMedidor,
  dataLoja: EditLoja,
  leitura_id?: string,
  dataLeitura?: EditLeitura
) {
  let fotoUrl: string | null = null;

  if (
    dataLeitura?.foto_url &&
    (dataLeitura.foto_url instanceof File ||
      typeof dataLeitura.foto_url === "object")
  ) {
    try {
      fotoUrl = await uploadImageToSupabase(
        dataLeitura.foto_url,
        dataLeitura.nome_loja_leitura,
        dataLeitura.medidor_id
      );
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      throw new Error(
        "Não foi possível enviar a imagem para o Supabase Storage."
      );
    }
  }
  const leituraToInsert = {
    ...dataLeitura,
    foto_url: fotoUrl || null, // agora é uma URL string ou null
  };

  try {
    let data_loja = null;
    let data_leitura = null;
    let data_medidor = null;

    const { data: lojaData, error: error_loja } = await supabase
      .from("lojas")
      .update(dataLoja)
      .eq("id", loja_id)
      .select("*");

    if (error_loja)
      throw new Error("Erro ao editar Loja: " + error_loja.message);
    data_loja = lojaData;

    if (leitura_id && dataLeitura) {
      const { data: leituraData, error: error_leitura } = await supabase
        .from("leituras")
        .update(leituraToInsert)
        .eq("id", leitura_id)
        .select("*");

      if (error_leitura)
        throw new Error("Erro ao editar Leitura: " + error_leitura.message);
      data_leitura = leituraData;
    }

    const { data: medidorData, error: error_medidor } = await supabase
      .from("medidores")
      .update(dataMedidor)
      .eq("id", medidor_id)
      .select("*");

    if (error_medidor)
      throw new Error("Erro ao editar Medidor: " + error_medidor.message);
    data_medidor = medidorData;

    return {
      leitura: data_leitura?.[0] || null,
      medidor: data_medidor?.[0] || null,
      loja: data_loja?.[0] || null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error("Erro ao editar leitura e medidor: " + errorMessage);
  }
}
