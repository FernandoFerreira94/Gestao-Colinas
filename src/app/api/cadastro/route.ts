import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// A URL do projeto é pública, pode ser acessada do frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "As variáveis de ambiente do Supabase não estão configuradas corretamente."
  );
}

// Inicializa o cliente Supabase com a chave de service_role para operações de admin
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// Esta função deve ser exportada e ter o nome do método HTTP (POST)
export async function POST(req: NextRequest) {
  try {
    // No App Router, o corpo da requisição é obtido com await req.json()
    const {
      nome_completo,
      cpf,
      matricula,
      is_adm,
      permissao_energia,
      permissao_agua,
      permissao_gas,
      funcao,
    } = await req.json();

    // 1. Validar se os campos obrigatórios estão presentes
    if (!nome_completo || !cpf || !matricula || !funcao) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios." },
        { status: 400 }
      );
    }

    // Tratamento da matrícula e email
    const matriculaTratada = matricula.trim();
    const emailColinas = `${matriculaTratada}@colinas.com.br`;
    const passwordCpf = cpf.slice(0, 6);

    // 2. Verificar se a matrícula já existe no banco de dados
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from("usuarios")
      .select("matricula")
      .eq("matricula", matriculaTratada);

    if (fetchError) {
      console.error("Erro na busca por matrícula:", fetchError.message);
      return NextResponse.json(
        { error: "Erro interno do servidor." },
        { status: 500 }
      );
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: "Já existe um usuário cadastrado com essa matrícula." },
        { status: 409 }
      );
    }

    // 3. Criar o usuário no sistema de autenticação do Supabase (supabase.auth)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: emailColinas,
        password: passwordCpf,
        email_confirm: true,
        user_metadata: {
          funcao,
          nome_completo,
        },
      });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // user_id retornado após a criação do usuário
    const user_id = authData.user?.id;
    if (!user_id) {
      return NextResponse.json(
        { error: "Erro ao obter o user_id após o cadastro." },
        { status: 500 }
      );
    }

    // 4. Inserir o novo registro na sua tabela 'usuarios'
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("usuarios")
      .insert([
        {
          user_id,
          nome_completo,
          cpf,
          matricula: matriculaTratada,
          is_adm,
          permissao_energia,
          permissao_agua,
          permissao_gas,
          funcao,
        },
      ])
      .select();

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(user_id);
      console.error("Erro na inserção do usuário no banco:", dbError.message);
      return NextResponse.json(
        {
          error: "Erro ao inserir usuário no banco de dados. Tente novamente.",
        },
        { status: 500 }
      );
    }

    // 5. Sucesso!
    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso!",
        user: dbData[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no servidor:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
