"use client";
import { ReactNode, useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UsuarioProps } from "@/types";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
import { useRouter } from "next/navigation";

interface AppProviderProps {
  children: ReactNode;
}

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

export function AppProvider({ children }: AppProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [showSideBar, setShowSideBar] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<UsuarioProps | null>(null);
  const [dateFull, setDateFull] = useState<string>(currentDate);
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [typeMedicao, setTypeMedicao] = useState<"Energia" | "Agua" | "Gas">(
    "Energia"
  );
  const [localidade, setLocalidade] = useState<string>("all");
  const [firstName, setFirstName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data } = useFetchUser();
  const router = useRouter();
  useEffect(() => {
    function getUser() {
      if (!data) return router.push("/");
      if (data) {
        setUser(data.user);
        setToken(data.access_token);
      }
    }

    getUser();
  }, [data]);

  return (
    <AppContext.Provider
      value={{
        showSideBar,
        setShowSideBar,
        user,
        setUser,

        token,
        setToken,
        dateFull,
        month,
        setMonth,
        year,
        setYear,
        setDateFull,
        typeMedicao,
        setTypeMedicao,
        localidade,
        setLocalidade,
        firstName,
        setFirstName,
        searchQuery,
        setSearchQuery,
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
