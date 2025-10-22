// src/hooks/useEditUser.ts

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { UsuarioProps } from "@/types"; // Assumindo que esta tipagem está acessível

// Define o payload que será enviado para a rota PUT
export interface EditPayload {
  userId: string; // ID do usuário a ser editado
  // O userData pode ser uma parte de UsuarioProps, mas garantimos que as chaves usadas para auth (matricula, cpf)
  // estejam presentes se quisermos que a autenticação seja atualizada.
  userData: Partial<UsuarioProps>;
}

async function editUser({ userId, userData }: EditPayload): Promise<void> {
  const response = await fetch(`/api/usuarios/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    // Envia o corpo com os dados da tabela, que o PUT usará para gerar email/senha.
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    let errorData = { error: "Erro ao editar o usuário." };

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json();
    } else {
      errorData.error = `Erro do servidor: Status ${response.status} (${response.statusText})`;
    }

    throw new Error(errorData.error);
  }
}

// O UseMutationOptions usa o tipo 'EditPayload'
export function useEditUser(
  options?: UseMutationOptions<void, Error, EditPayload>
) {
  return useMutation({
    mutationFn: editUser,
    ...options,
  });
}
