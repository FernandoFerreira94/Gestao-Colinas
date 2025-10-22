// src/hooks/useDeleteUser.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

async function deleteUser(userId: string) {
  const response = await fetch(`/api/usuarios/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  if (!response.ok) {
    let errorData = { error: "Erro ao deletar o usuário." };

    // ⭐️ Verificação adicionada: Tenta parsear JSON apenas se o Content-Type for JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json();
    } else {
      // Caso não seja JSON (ex: HTML 404), use a mensagem de erro do status
      errorData.error = `Erro do servidor: Status ${response.status} (${response.statusText})`;
    }

    throw new Error(errorData.error);
  }

  const data = await response.json();
  return data;
}

export function useDeleteUser(
  options?: UseMutationOptions<unknown, Error, string>
) {
  return useMutation({
    mutationFn: deleteUser,
    ...options,
  });
}
