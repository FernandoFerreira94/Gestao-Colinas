// app/api/usuarios/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { UsuarioProps } from "@/types";

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
  context: { params: Promise<{ id: string }> } // ✅ Ajuste aqui também
) {
  const { id: userId } = (await context.params) as { id: string };

  const body: Partial<UsuarioProps> = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "O ID do usuário não foi fornecido." },
      { status: 400 }
    );
  }

  let emailColinas: string | undefined;
  let passwordCpf: string | undefined;

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
      return NextResponse.json(
        {
          error:
            "O CPF deve ter pelo menos 6 dígitos para a atualização de senha.",
        },
        { status: 400 }
      );
    }
  }

  if (Object.keys(body).length === 0 && !emailColinas && !passwordCpf) {
    return NextResponse.json(
      { error: "Nenhum dado fornecido para atualização." },
      { status: 400 }
    );
  }

  try {
    // Atualiza dados de AUTENTICAÇÃO
    if (emailColinas || passwordCpf) {
      const authUpdates: { email?: string; password?: string } = {};
      if (emailColinas) authUpdates.email = emailColinas;
      if (passwordCpf) authUpdates.password = passwordCpf;

      if (Object.keys(authUpdates).length > 0) {
        const { error: authError } =
          await supabaseAdmin.auth.admin.updateUserById(userId, authUpdates);

        if (authError) {
          const status = authError.message.includes("already exists")
            ? 409
            : 500;
          return NextResponse.json(
            { error: `Erro ao atualizar email/senha: ${authError.message}` },
            { status }
          );
        }
      }
    }

    // Atualiza dados da tabela 'usuarios'
    if (Object.keys(body).length > 0) {
      const { error: dbError } = await supabaseAdmin
        .from("usuarios")
        .update(body)
        .eq("user_id", userId);

      if (dbError) {
        return NextResponse.json(
          { error: "Erro ao atualizar os dados no banco de dados." },
          { status: 500 }
        );
      }
    }

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
// FUNÇÃO DELETE: DELETAR USUÁRIO
// =========================================================================
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Ajuste aqui também
) {
  const { id: userId } = (await context.params) as { id: string };

  if (!userId) {
    return NextResponse.json(
      { error: "O ID do usuário não foi fornecido." },
      { status: 400 }
    );
  }

  try {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    );
    if (authError) {
      return NextResponse.json(
        { error: "Erro ao deletar o usuário do sistema de autenticação." },
        { status: 500 }
      );
    }

    const { error: dbError } = await supabaseAdmin
      .from("usuarios")
      .delete()
      .eq("user_id", userId);

    if (dbError) {
      return NextResponse.json(
        { error: "Erro ao deletar o usuário da tabela do banco de dados." },
        { status: 500 }
      );
    }

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
