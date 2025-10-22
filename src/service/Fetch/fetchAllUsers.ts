import { supabase } from "@/supabase/supabase";
import { UsuarioProps } from "@/types";

export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.from("usuarios").select("*");

    if (error) {
      throw new Error("Erro ao buscar usuários");
    }
    return data as UsuarioProps[];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage); // <-- lance o erro aqui
  }
}
