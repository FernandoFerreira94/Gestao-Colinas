// services/CreateLojaService.ts

import { supabase } from "@/supabase/supabase";
import type { CreateLojaData, CreateLojaResponse } from "@/types";

export async function CreateLojaService({
  loja,
  medidores,
}: CreateLojaData): Promise<CreateLojaResponse> {
  try {
    // 1. Verifique se a loja já existe.
    const { data: existingLoja, error: fetchError } = await supabase
      .from("lojas")
      .select("id")
      .eq("prefixo_loja", loja.prefixo_loja)
      .eq("numero_loja", loja.numero_loja);

    if (fetchError) {
      throw new Error("Erro na verificação de loja: " + fetchError.message);
    }

    if (existingLoja && existingLoja.length > 0) {
      throw new Error(
        `Já existe uma loja com o prefixo "${loja.prefixo_loja}" e número "${loja.numero_loja}".`
      );
    }

    // 2. Insira a nova loja
    const { data: lojaData, error: lojaError } = await supabase
      .from("lojas")
      .insert([loja])
      .select("*");

    if (lojaError) {
      throw new Error("Erro ao inserir a loja: " + lojaError.message);
    }

    const loja_id = lojaData[0].id;

    // 3. Verifique duplicidade de medidores antes de inserir
    if (medidores.length > 0) {
      for (const medidor of medidores) {
        const { data: existingMedidor, error: medidorCheckError } =
          await supabase
            .from("medidores")
            .select("id")
            .eq("numero_relogio", medidor.numero_relogio)
            .eq("tipo_medicao", medidor.tipo_medicao)
            .eq("loja_id", loja_id);

        if (medidorCheckError) {
          throw new Error(
            "Erro na verificação de medidor: " + medidorCheckError.message
          );
        }

        if (existingMedidor && existingMedidor.length > 0) {
          throw new Error(
            `Já existe um medidor com o número de relógio "${medidor.numero_relogio}" e tipo "${medidor.tipo_medicao}" para esta loja.`
          );
        }
      }

      // 4. Insere os medidores se não houver duplicatas
      const { data: insertedMedidoresData, error: medidorError } =
        await supabase
          .from("medidores")
          .insert(medidores.map((m) => ({ ...m, loja_id })))
          .select("*");

      if (medidorError) {
        throw new Error(
          "Erro ao inserir os medidores: " + medidorError.message
        );
      }

      return { lojaData, medidorData: insertedMedidoresData };
    }

    return { lojaData, medidorData: null };
  } catch (error) {
    console.error("Erro no serviço de criação da loja:", error);
    throw error;
  }
}
