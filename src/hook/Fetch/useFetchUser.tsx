import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { supabase } from "@/supabase/supabase";
import { fetchUser } from "@/service/Fetch/fetchUser";
import type { UsuarioProps } from "@/types";
import { redirect } from "next/navigation";
type UserWithSession = {
  user: UsuarioProps | null;
  access_token: string;
} | null;

const getUserData = async (): Promise<UserWithSession> => {
  const storedToken = Cookies.get("auth_token");

  if (!storedToken) {
    return redirect("/");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return redirect("/");

  const userData = await fetchUser(session.user.id as string);

  return {
    user: userData,
    access_token: session.access_token,
  };
};

export function useFetchUser() {
  return useQuery<UserWithSession>({
    queryKey: ["user"],
    queryFn: getUserData,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
