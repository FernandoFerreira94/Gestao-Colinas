import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { signInService } from "../../service/Login/signInService";
import { LoginProps, SignInMutationReturn } from "@/types";

export function useSignIn(
  options?: UseMutationOptions<SignInMutationReturn, Error, LoginProps>
) {
  return useMutation<SignInMutationReturn, Error, LoginProps>({
    mutationFn: async (variables) => {
      console.log(variables);
      return await signInService(variables);
    },
    ...options,
  });
}
