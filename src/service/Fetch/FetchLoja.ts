import { supabase } from "@/supabase/supabase";

export async function FetchLoja(loja_id: string) {
  const { data, error } = await supabase
    .from("lojas")
    .select("*, medidores(*)")
    .eq("id", loja_id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
