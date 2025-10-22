// src/hooks/useUpdateLojaAndMedidores.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateLoja,
  upsertMedidor,
  deleteMedidor,
} from "@/service/Update/UpdtadeLojaMedidores";
import { toast } from "sonner";
import { Medidores, LojaUpdtadeProps, MedidorPayload } from "@/types"; // Ajuste o caminho das suas interfaces
interface UpdateLojaAndMedidoresInput {
  lojaId: string;
  lojaPayload: LojaUpdtadeProps;

  medidoresStates: {
    ultima_leitura?: number;
    energia: Medidores;
    agua: Medidores;
    gas: Medidores;
    tem_energia_switch: boolean;
    tem_agua_switch: boolean;
    tem_gas_switch: boolean;
    foto_url?: File | string | null;
  };
}

export function useUpdateLojaAndMedidores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lojaId,
      lojaPayload,
      medidoresStates,
    }: UpdateLojaAndMedidoresInput) => {
      // 1. Atualizar dados da loja
      await updateLoja(lojaId, lojaPayload);

      // 2. Lógica para Medidores
      const medidoresToProcess: {
        state: Medidores;
        isActive: boolean;
      }[] = [
        {
          state: medidoresStates.energia,
          isActive: medidoresStates.tem_energia_switch,
        },
        {
          state: medidoresStates.agua,
          isActive: medidoresStates.tem_agua_switch,
        },
        {
          state: medidoresStates.gas,
          isActive: medidoresStates.tem_gas_switch,
        },
      ];

      for (const {
        state: currentMedidorState,
        isActive,
      } of medidoresToProcess) {
        // Validação básica antes de tentar upsert
        if (
          isActive &&
          (!currentMedidorState.numero_relogio ||
            !currentMedidorState.localidade ||
            !currentMedidorState.ultima_leitura)
        ) {
          // Se o medidor está ativo mas dados essenciais faltam, pode lançar um erro
          throw new Error(
            `Campos obrigatórios faltando para o medidor de ${currentMedidorState.tipo_medicao}.`
          );
        }

        if (isActive) {
          const payload: MedidorPayload = {
            id: currentMedidorState.id,
            loja_id: lojaId,
            detalhes: currentMedidorState.detalhes,
            numero_relogio: currentMedidorState.numero_relogio,
            localidade: currentMedidorState.localidade,
            tipo_medicao: currentMedidorState.tipo_medicao as
              | "Energia"
              | "Agua"
              | "Gas", // Assegura o tipo literal
            ultima_leitura: Number(currentMedidorState.ultima_leitura),
            ...(currentMedidorState.tipo_medicao === "Energia" && {
              quadro_distribuicao:
                currentMedidorState.quadro_distribuicao || null,
            }),
          };
          await upsertMedidor(payload);
        } else {
          if (currentMedidorState.id) {
            await deleteMedidor(currentMedidorState.id);
          }
        }
      }
      return { success: true }; // Retorne algo significativo se precisar
    },
    onSuccess: (data, variables) => {
      // Invalida a query da loja para refetch dos dados atualizados
      queryClient.invalidateQueries({
        queryKey: ["lojaData", variables.lojaId],
      });
      toast("Loja e medidores atualizados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao salvar informações:", error);
      toast.error(`Erro ao salvar as informações: ${error.message}`);
    },
  });
}
