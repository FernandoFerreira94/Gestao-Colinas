// app/api/usuarios/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { UsuarioProps } from "@repo/utils";

// Suas chaves de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "As variáveis de ambiente do Supabase não estão configuradas corretamente."
  );
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// =========================================================================
// FUNÇÃO PUT: EDITAR USUÁRIO (Dados e Opcionalmente Email/Senha)
// =========================================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;
  const body: Partial<UsuarioProps> = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "O ID do usuário não foi fornecido." },
      { status: 400 }
    );
  }

  let emailColinas: string | undefined = undefined;
  let passwordCpf: string | undefined = undefined;

  if (body.matricula) {
    const matriculaTratada = body.matricula.trim();
    if (matriculaTratada) {
      emailColinas = `${matriculaTratada}@colinas.com.br`;
    }
  }

  if (body.cpf) {
    if (body.cpf.length >= 6) {
      passwordCpf = body.cpf.slice(0, 6);
    } else {
      // ⭐️ CORREÇÃO 1: PARE A EXECUÇÃO E RETORNE UM ERRO
      console.warn("CPF fornecido é muito curto para gerar a senha.");
      return NextResponse.json(
        {
          error:
            "O CPF deve ter pelo menos 6 dígitos para a atualização de senha.",
        },
        { status: 400 }
      );
    }
  }

  // Verifica se há alguma atualização para fazer (DB ou Auth)
  if (Object.keys(body).length === 0 && !emailColinas && !passwordCpf) {
    return NextResponse.json(
      { error: "Nenhum dado fornecido para atualização." },
      { status: 400 }
    );
  }

  try {
    // 2. Atualiza dados de AUTENTICAÇÃO
    if (emailColinas || passwordCpf) {
      const authUpdates: { email?: string; password?: string } = {};

      // Apenas adiciona ao objeto de atualização se o valor foi definido
      if (emailColinas) authUpdates.email = emailColinas;
      if (passwordCpf) authUpdates.password = passwordCpf;

      // Garante que pelo menos um campo de autenticação será atualizado
      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } =
          await supabaseAdmin.auth.admin.updateUserById(userId, authUpdates);

        if (authError) {
          console.error("Erro ao atualizar autenticação:", authError.message);
          // Retornar 409 (Conflict) se for erro de email já em uso, senão 500
          const status = authError.message.includes("already exists")
            ? 409
            : 500;
          return NextResponse.json(
            {
              error: `Erro ao atualizar o email/senha do usuário: ${authError.message}`,
            },
            { status: status }
          );
        }
      }
    }

    if (Object.keys(body).length > 0) {
      const { error: dbError } = await supabaseAdmin
        .from("usuarios")
        .update(body)
        .eq("user_id", userId);

      if (dbError) {
        console.error("Erro ao atualizar tabela 'usuarios':", dbError.message);
        return NextResponse.json(
          { error: "Erro ao atualizar os dados na tabela do banco de dados." },
          { status: 500 }
        );
      }
    }

    // Sucesso!
    return NextResponse.json(
      { message: "Usuário atualizado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado no servidor." },
      { status: 500 }
    );
  }
}

// =========================================================================
// FUNÇÃO DELETE: DELETAR USUÁRIO (mantida)
// =========================================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "O ID do usuário não foi fornecido." },
      { status: 400 }
    );
  }

  try {
    // 1. Deleta o usuário do sistema de AUTENTICAÇÃO do Supabase
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("Erro ao deletar usuário do auth:", authError.message);
      return NextResponse.json(
        { error: "Erro ao deletar o usuário do sistema de autenticação." },
        { status: 500 }
      );
    }

    // 2. Deleta o registro do usuário na sua tabela 'usuarios'
    const { error: dbError } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("user_id", userId);

    if (dbError) {
      console.error(
        "Erro ao deletar usuário da tabela 'usuarios':",
        dbError.message
      );
      return NextResponse.json(
        { error: "Erro ao deletar o usuário da tabela do banco de dados." },
        { status: 500 }
      );
    }

    // Sucesso!
    return NextResponse.json(
      { message: "Usuário deletado com sucesso." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro inesperado no servidor:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro inesperado no servidor." },
      { status: 500 }
    );
  }
}
