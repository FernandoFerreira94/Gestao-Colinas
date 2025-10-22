import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { EditLeituraMedidor } from "@/service/Update/EditLeituraMedidor";
import type { EditLeitura, EditMedidor, EditLoja } from "@/types";

// ✅ 1. Interface para o resultado da mutação (retorno da função de serviço)
interface UpdateResult {
  medidor: EditMedidor;
  loja: EditLoja;
  leitura?: EditLeitura;
}

// ✅ 2. Interface para as variáveis da mutação (o que você passa para mutate)
interface UpdateLeituraMedidorVariables {
  medidor_id: string;
  loja_id: string;
  dataMedidor: EditMedidor;
  leitura_id?: string;
  dataLoja: EditLoja;
  dataLeitura?: EditLeitura;
  ultima_leitura?: number;
  foto_url?: File | string | null;
}

export function useEditLeituraMedidor(
  options?: UseMutationOptions<
    UpdateResult, // ✅ Tipo de retorno
    Error, // ✅ Tipo de erro
    UpdateLeituraMedidorVariables // ✅ Tipo das variáveis
  >
) {
  return useMutation<UpdateResult, Error, UpdateLeituraMedidorVariables>({
    mutationFn: async ({
      leitura_id,
      medidor_id,
      loja_id,
      dataLeitura,
      dataMedidor,
      dataLoja,
    }) => {
      const result = await EditLeituraMedidor(
        medidor_id,
        loja_id,
        dataMedidor,
        dataLoja,
        leitura_id,
        dataLeitura
      );
      return result;
    },
    ...options,
  });
}
