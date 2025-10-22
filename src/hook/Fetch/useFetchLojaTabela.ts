import { useQuery } from "@tanstack/react-query";
import { fetchLojasTabela } from "@/service/Fetch/FetchLojaTabela";
import { queryKeys } from "@/lib/queryKeys";
export function useFetchLojaTabela(
  tipoMedicao: string,
  mes: number,
  ano: number
) {
  return useQuery({
    queryKey: queryKeys.lojas(tipoMedicao, mes, ano),
    queryFn: () => fetchLojasTabela(tipoMedicao, mes, ano),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
