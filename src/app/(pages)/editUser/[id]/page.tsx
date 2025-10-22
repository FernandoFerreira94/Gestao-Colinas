"use client";
import React, { use, useState, useEffect } from "react";

import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useFetchUserEdit } from "@/hook/Fetch/useFetchUserEdit";
import type { UsuarioProps } from "@/types";
import { queryKeys } from "@/lib/queryKeys";
import { useEditUser } from "@/hookClientAdm/useEditUser";
import { Content } from "@/_componente/content";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hookClientAdm/useDeleteUser";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DetalhesProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditUser({ params }: DetalhesProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { data, isLoading, error } = useFetchUserEdit(id);
  const [isEdit, setIsEdit] = useState(true);
  const [funcao, setFuncao] = useState("");
  const [isPermissao, setIsPermissao] = useState({
    energia: false,
    agua: false,
    gas: false,
  });
  const [isAdm, setIsAdm] = useState(false);
  const [nome_completo, setNomeCompleto] = useState("");
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");

  const { mutate, isPending } = useEditUser({
    onSuccess: () => {
      setIsEdit(true);
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsers() });
      toast("Usuário editado com sucesso!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao editar usuário.");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userData: UsuarioProps = {
      nome_completo: nome_completo,
      matricula: matricula,
      cpf: cpf,
      funcao: funcao as string,
      permissao_energia: isPermissao.energia as boolean,
      permissao_agua: isPermissao.agua as boolean,
      permissao_gas: isPermissao.gas as boolean,
      is_adm: isAdm as boolean,
    };

    const userId = id;

    mutate({ userData, userId });
  }

  useEffect(() => {
    if (data) {
      setIsPermissao({
        energia: data.permissao_energia,
        agua: data.permissao_agua,
        gas: data.permissao_gas,
      });

      setIsAdm(data.is_adm);
      setNomeCompleto(data?.nome_completo);
      setMatricula(data?.matricula);
      setCpf(data?.cpf);
    }
    if (data?.funcao) {
      setFuncao(data.funcao);
    }
  }, [data]);

  const queryClient = useQueryClient();
  const { mutate: deleteUser, isPending: isDeletePending } = useDeleteUser({
    onSuccess: () => {
      toast(`Usua ${data?.nome_completo} deletado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsers() });
      router.push("/medicao");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao deletar usuário.");
    },
  });

  function handleDelete() {
    const userId = data?.user_id;

    if (!userId) {
      // Isso deve ser uma string com o ID de autenticação do Supabase
      toast.error("ID de usuário para exclusão não encontrado.");
      return;
    }

    deleteUser(userId);
  }

  return (
    <Content title={`Editar Usuário `}>
      {isLoading && <Skeleton className="h-180 w-10/12 mt-8" />}
      {error && <p>Ops error ao busca os dados. Acione o suporte</p>}
      {data && (
        <section className=" flex max-w-xl flex-col">
          <div className="flex items-center space-x-2 mt-8">
            <Switch
              id="is_edit"
              checked={!isEdit}
              onCheckedChange={() => setIsEdit(!isEdit)}
            />
            <Label htmlFor="permisssao_gas">Modo editar</Label>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-8 w-full"
          >
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="nome_completo">Nome Completo</Label>
              <Input
                placeholder={data?.nome_completo}
                id="nome_completo"
                type="text"
                onChange={(e) => setNomeCompleto(e.target.value)}
                disabled={isEdit}
                value={nome_completo}
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="funcao">Função</Label>

              <Select
                defaultValue={data?.funcao}
                onValueChange={setFuncao}
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Coordenador">Coordenador</SelectItem>
                  <SelectItem value="M2-Supervisor">M2 - Supervisor</SelectItem>
                  <SelectItem value="M9-Eletromecânico">
                    M9 - Eletromecânico
                  </SelectItem>
                  <SelectItem value="M7-Líder">M7 - Líder</SelectItem>
                  <SelectItem value="M5-Eletricista">
                    M5 - Eletricista
                  </SelectItem>
                  <SelectItem value="M4-Serviços Gerais">
                    M4 - Serviços Gerais
                  </SelectItem>
                  <SelectItem value="Bombeiro">Bombeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="matricula">Número de Matrícula</Label>
              <Input
                placeholder="Digite o número da matrícula"
                id="matricula"
                type="text"
                onChange={(e) => setMatricula(e.target.value)}
                value={matricula}
                disabled={isEdit}
              />
            </div>
            <div className="grid w-full items-center gap-3">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                placeholder="Digite o CPF"
                id="cpf"
                type="text"
                onChange={(e) => setCpf(e.target.value)}
                value={cpf}
                disabled={isEdit}
              />
            </div>
            <Label>Permissões de Medição</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="permissao_energia"
                  checked={isPermissao.energia}
                  onCheckedChange={(e) =>
                    setIsPermissao({ ...isPermissao, energia: e })
                  }
                  disabled={isEdit}
                />
                <Label htmlFor="permissao_energia">Energia</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="permissao_agua"
                  checked={isPermissao.agua}
                  onCheckedChange={(e) =>
                    setIsPermissao({ ...isPermissao, agua: e })
                  }
                  disabled={isEdit}
                />
                <Label htmlFor="permissao_agua">Água</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="permissao_gas"
                  checked={isPermissao.gas}
                  onCheckedChange={(e) =>
                    setIsPermissao({ ...isPermissao, gas: e })
                  }
                  disabled={isEdit}
                />
                <Label htmlFor="permisssao_gas">Gás</Label>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="isAdmin"
                checked={isAdm}
                onCheckedChange={setIsAdm}
                disabled={isEdit}
              />
              <Label htmlFor="isAdmin">Usuário Administrador</Label>
            </div>

            <Button type="submit" disabled={isEdit} className="w-full mt-4">
              {isPending ? (
                <>
                  <Loader2Icon className="animate-spin " />
                </>
              ) : (
                " Editar usuario "
              )}
            </Button>
          </form>

          <Button
            className="w-full text-gray-50 mt-4"
            variant={"destructive"}
            disabled={isEdit}
            onClick={handleDelete}
          >
            {isDeletePending ? (
              <>
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              "Excluir usuario"
            )}
          </Button>
        </section>
      )}
    </Content>
  );
}
