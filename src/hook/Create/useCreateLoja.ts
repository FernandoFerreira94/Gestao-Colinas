import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { CreateLojaData, CreateLojaResponse } from "@/types";
import { CreateLojaService } from "../../service/Create/CreateLojaService";

export function useCreateLoja(
  options?: UseMutationOptions<CreateLojaResponse, Error, CreateLojaData>
) {
  return useMutation<CreateLojaResponse, Error, CreateLojaData>({
    mutationFn: async (variables) => {
      console.log(variables);
      const result = await CreateLojaService(variables);
      return result;
    },
    ...options,
  });
}
