import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/service/Fetch/fetchUser";
import type { UsuarioProps } from "@/types";

export function useFetchUserSingle(id: string) {
  return useQuery<UsuarioProps>({
    queryKey: ["user"],
    queryFn: () => fetchUser(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
