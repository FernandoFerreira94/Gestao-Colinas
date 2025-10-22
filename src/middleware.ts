import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  // Lista de rotas públicas
  const publicPaths = ["/"];

  // Verifica se a rota atual é uma rota pública
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Se o token existe E a rota for pública, redireciona para a página principal
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/medicao", request.url));
  }

  // Se o token não existe E a rota não for pública, redireciona para o login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se o token existe E a rota não for pública (ou o token não existe e a rota é pública), permite a passagem
  return NextResponse.next();
}

// Configura quais rotas o middleware deve monitorar
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
