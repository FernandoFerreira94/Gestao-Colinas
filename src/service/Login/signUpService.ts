import type { UsuarioProps } from "@/types";
import { supabase } from "@/supabase/supabase";

export async function signUp({
  nome_completo,
  cpf,
  matricula,
  is_adm,
  permissao_energia,
  permissao_agua,
  permissao_gas,
  funcao,
}: UsuarioProps) {
  const matriculaTratada = matricula.trim();
  const emailColinas = `${matriculaTratada}@colinas.com.br`;
  const passwordCpf = cpf.slice(0, 6);

  try {
    if (!nome_completo || !cpf || !matricula || !funcao) {
      throw new Error("Por favor, preencha todos os campos.");
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("usuarios")
      .select("matricula")
      .eq("matricula", matriculaTratada.toString());

    if (fetchError) {
      throw new Error(`Erro ao buscar usuário: ${fetchError.message}`);
    }

    if (existingUser && existingUser.length > 0) {
      throw new Error("Já existe um usuário cadastrado com essa matrícula.");
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: emailColinas,
        password: passwordCpf,
      });

    if (authError) {
      throw new Error(`Erro ao fazer cadastro: ${authError.message}`);
    }

    const user_id = authData.user?.id;

    // Usa o cliente recebido como parâmetro
    const { data: dbData, error: dbError } = await supabase
      .from("usuarios")
      .insert([
        {
          user_id,
          nome_completo,
          cpf,
          matricula,
          is_adm,
          permissao_energia,
          permissao_agua,
          permissao_gas,
          funcao,
        },
      ])
      .select();

    if (dbError) {
      throw new Error(`Erro ao inserir usuário: ${dbError.message}`);
    }

    return { auth: authData, usuario: dbData };
  } catch (error) {
    return {
      error: (error as Error).message,
    };
  }
}
