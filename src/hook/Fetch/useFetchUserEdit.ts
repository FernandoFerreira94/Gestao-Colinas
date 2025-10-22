import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/service/Fetch/fetchUser";
import type { UsuarioProps } from "@/types";

export function useFetchUserEdit(userID: string) {
  return useQuery<UsuarioProps>({
    queryKey: ["userEdit", userID],
    queryFn: () => fetchUser(userID),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
