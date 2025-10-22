// hooks/useCreateLeitura.ts

import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateLeitura } from "../../service/Create/CreateLeitura";
import { LeituraProps } from "@/types";

export function useCreateLeitura(
  tipoMedicao: string | null,
  mes: number | null,
  ano: number | null,
  localidade: string | null,
  searchQuery: string | null,
  options?: UseMutationOptions<LeituraProps, Error, LeituraProps>
) {
  const queryClient = useQueryClient();

  return useMutation<LeituraProps, Error, LeituraProps>({
    mutationFn: async (variables) => {
      const result = await CreateLeitura(variables);
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
      });

      // Chama o toast DEPOIS de tudo
      toast(
        `Leitura da loja ${data.nome_loja_leitura} cadastrada com sucesso!`
      );
    },
    onError: (error) => {
      // Invalida a query
      queryClient.invalidateQueries({
        queryKey: ["medicoes", tipoMedicao, mes, ano, localidade, searchQuery],
      });

      // Chama o toast DEPOIS de tudo
      toast.error("Ops algo deu errado! acione o suporte!");
      console.error(error);
    },
    ...options,
  });
}
