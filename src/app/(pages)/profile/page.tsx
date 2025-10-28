"use client";
import { Content } from "@/_componente/content";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { data, isLoading } = useFetchUser();

  return (
    <Content title="Perfil">
      {isLoading && (
        <section className="flex flex-col gap-10 w-2/5 mt-4 max-sm:w-12/12 max-sm:gap-4">
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
          <Skeleton className="w-full h-18" />
        </section>
      )}
      {data && (
        <section className="flex flex-col gap-4 w-2/5 mt-4 max-sm:w-full max-sm:pr-2">
          <Paragrafo titulo="Nome" text={data?.user?.nome_completo || ""} />

          <Paragrafo titulo="Função" text={data?.user?.funcao || ""} />

          <Paragrafo titulo="Matricula" text={data?.user?.matricula || ""} />

          <Paragrafo titulo="Cpf" text={data?.user?.cpf || ""} />

          <h3 className="font-semibold text-md">Mediçãoes autorizadas:</h3>
          <div className="flex items-center gap-4 bg-white py-4 px-2 rounded-lg border border-gray-400 dark:bg-[#151526] dark:text-gray-50">
            <div className="flex items-center space-x-2 ">
              <Switch
                id="permissao_energia"
                checked={data?.user?.permissao_energia}
              />
              <Label htmlFor="permissao_energia">Energia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="permissao_agua"
                checked={data?.user?.permissao_agua}
              />
              <Label htmlFor="permissao_agua">Água</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="permissao_gas" checked={data?.user?.permissao_gas} />
              <Label htmlFor="permisssao_gas">Gás</Label>
            </div>
          </div>
          <h3 className="font-semibold text-md">Administrador</h3>
          <div className="flex items-center space-x-2  bg-white py-4 px-2 rounded-lg border border-gray-400 dark:bg-[#151526] dark:text-gray-50">
            <Switch id="isAdmin" checked={data?.user?.is_adm} />
            <Label htmlFor="isAdmin">Usuário Administrador</Label>
          </div>
        </section>
      )}
    </Content>
  );
}

function Paragrafo({ text, titulo }: { text: string; titulo: string }) {
  return (
    <div className="flex flex-col gap-2 ">
      <h3 className="font-semibold text-md">{titulo}:</h3>
      <p className="py-3 border border-gray-400 rounded-lg px-2 bg-white text-gray-900  dark:bg-[#151526] dark:text-gray-50 text-sm">
        {text}
      </p>
    </div>
  );
}
