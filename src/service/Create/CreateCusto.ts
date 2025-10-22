import { supabase } from "@/supabase/supabase";
import { CustoProps } from "@/types";

export async function CreateCusto(newCusto: CustoProps) {
  const { data, error } = await supabase
    .from("custo_rateio")
    .insert(newCusto)
    .select("*")
    .single();

  if (error) {
    throw new Error("Erro ao inserir o custo: " + error.message);
  }

  return data;
}
