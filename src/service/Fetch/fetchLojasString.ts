import { supabase } from "@/supabase/supabase";
import type { ErroProps, LojaProps } from "@/types";

export async function fetchLojasString(
  searchQuery: string | null = null
): Promise<LojaProps[] | null> {
  const baseQuery = () => {
    const query = supabase.from("lojas").select(`*`);

    return query;
  };

  let data: LojaProps[] | null = null;
  let error: ErroProps | null = null;

  if (searchQuery) {
    const formattedQuery = `%${searchQuery.toLowerCase()}%`;

    const orClauses = [];

    // Busca por nome e prefixo
    orClauses.push(
      `nome_loja.ilike.${formattedQuery},prefixo_loja.ilike.${formattedQuery}`
    );

    // Consulta 1: Busca em campos da loja (nome, prefixo, número)
    const { data: dataLojas, error: errorLojas } = await baseQuery().or(
      orClauses.join(",")
    );
    console.log(dataLojas);
    data = dataLojas as LojaProps[];
    error = errorLojas;
  } else {
    // Se não houver busca, executa a query normal
    const { data: normalData, error: normalError } = await baseQuery();
    console.log(normalData);
    data = normalData as LojaProps[];
    error = normalError;
  }

  if (error) {
    console.error("Erro ao buscar lojas, medidores e leituras:", error.message);
    throw new Error(error.message);
  }

  return data;
}
