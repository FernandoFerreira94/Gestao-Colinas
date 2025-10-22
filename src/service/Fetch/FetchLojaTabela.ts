import { supabase } from "@/supabase/supabase";
import type { LojaProps } from "@/types";

export async function fetchLojasTabela(
  tipoMedicao: string | null = null,
  mes: number,
  ano: number
): Promise<LojaProps[] | null> {
  // ✅ 1. Calcule o mês e o ano anterior
  const mesAnterior = mes === 1 ? 12 : mes - 1;

  // ✅ 2. Use a sintaxe de filtro correta para tabelas aninhadas
  let query = supabase.from("lojas").select(`
    *,
    medidores!inner(
     *,
      leituras(
        *
      )
    )
  `);

  // ✅ 3. Aplique o filtro de 'tipoMedicao' diretamente na tabela aninhada `medidores`
  if (tipoMedicao) {
    query = query.eq("medidores.tipo_medicao", tipoMedicao);
  }

  // ✅ 4. Use o método `in` para buscar os dois meses de uma vez
  //    e aplique o filtro de ano para garantir que os dados de dezembro
  //    do ano anterior sejam buscados corretamente
  query = query.in("medidores.leituras.mes", [mes, mesAnterior]);
  query = query.eq("medidores.leituras.ano", ano);

  // ✅ 5. Execute a query e trate os resultados
  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar lojas, medidores e leituras:", error.message);
    throw new Error(error.message);
  }

  return data as LojaProps[] | null;
}
