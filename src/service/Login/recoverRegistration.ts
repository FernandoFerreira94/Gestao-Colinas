import { supabase } from "@/supabase/supabase";

export async function recoverRegistration(nome_completo: string) {
  if (!nome_completo) {
    return { error: "Por favor, preencha todos os campos." };
  }

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("matricula")
      .eq("nome_completo", nome_completo)
      .single();

    if (error) {
      return {
        error: `Nome de usuário nao encontrado`,
      };
    }

    return data ? data.matricula : null;
  } catch (erro) {
    return { error: "Erro ao buscar usuário. acionar o suporte: " + erro };
  }
}
