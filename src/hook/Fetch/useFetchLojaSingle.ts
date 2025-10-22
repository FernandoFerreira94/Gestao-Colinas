"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchLojaSingle } from "@/service/Fetch/fetchLojaSingle";

export function useFetchLojaSingle(loja_id: string, medidor_id?: string) {
  return useQuery({
    queryKey: ["medicoesSingle", loja_id, medidor_id],
    queryFn: () => fetchLojaSingle(loja_id, medidor_id),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
