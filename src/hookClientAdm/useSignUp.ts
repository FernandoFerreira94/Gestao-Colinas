// src/hooks/useSignUp.ts ou onde seu hook estiver
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import type { UsuarioProps } from "@/types";

// A função que vai chamar a API. É a nova mutationFn.
async function signUp(userData: UsuarioProps) {
  const response = await fetch("/api/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro no cadastro do usuário.");
  }

  return response.json();
}

export function useSignUp(
  options?: UseMutationOptions<UsuarioProps, Error, UsuarioProps>
) {
  return useMutation({
    mutationFn: signUp,
    ...options,
  });
}
