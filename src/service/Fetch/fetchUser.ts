import { supabase } from "@/supabase/supabase";
import { UsuarioProps } from "@/types";

export async function fetchUser(userId: string): Promise<UsuarioProps> {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      throw new Error("Usuário nao encontrado");
    }

    return data as UsuarioProps;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(`Erro ao buscar usuário: ${errorMessage}`);
  }
}
