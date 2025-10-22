import { useQuery } from "@tanstack/react-query";
import { FetchLoja } from "@/service/Fetch/FetchLoja";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchLoja(loja_id: string) {
  return useQuery({
    queryKey: queryKeys.loja(loja_id),
    queryFn: () => FetchLoja(loja_id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
