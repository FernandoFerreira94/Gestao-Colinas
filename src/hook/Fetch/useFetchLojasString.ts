import { useQuery } from "@tanstack/react-query";
import { fetchLojasString } from "@/service/Fetch/fetchLojasString";
import { queryKeys } from "@/lib//queryKeys";

export function useFetchLojasString(searchQuery: string | null = null) {
  return useQuery({
    queryKey: queryKeys.lojas(searchQuery),
    queryFn: () => fetchLojasString(searchQuery),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
