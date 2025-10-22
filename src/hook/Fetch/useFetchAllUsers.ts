import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/service/Fetch/fetchAllUsers";
import { UsuarioProps } from "@/types";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchAllUsers() {
  return useQuery<UsuarioProps[], Error>({
    queryKey: queryKeys.allUsers(),
    queryFn: () => fetchAllUsers(),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
