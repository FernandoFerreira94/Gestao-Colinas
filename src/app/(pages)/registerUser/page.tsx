"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRef } from "react";

import { Content } from "@/_componente/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { UsuarioProps } from "@/types";
import { queryKeys } from "@/lib/queryKeys";
import { useSignUp } from "@/hookClientAdm/useSignUp";
import { Loader2Icon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Register() {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [funcao, setFuncao] = useState("");
  const [permissaoEnergia, setPermissaoEnergia] = useState(false);
  const [permissaoAgua, setPermissaoAgua] = useState(false);
  const [permissaoGas, setPermissaoGas] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Função para resetar todos os estados
  const resetFormFields = () => {
    setFuncao("");
    setFuncao("");
    setPermissaoEnergia(false);
    setPermissaoAgua(false);
    setPermissaoGas(false);
    setIsAdmin(false);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const { mutate, isPending } = useSignUp({
    onSuccess: () => {
      toast(`Usuario cadastrado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: queryKeys.allUsers() });
      resetFormFields();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nome_completo = formData.get("nome_completo") as string;
    const matricula = formData.get("matricula") as string;
    const cpf = formData.get("cpf") as string;

    if (!funcao) {
      toast.error("Selecione uma função!");
      return;
    }

    const userData: UsuarioProps = {
      nome_completo: nome_completo as string,
      cpf: cpf as string,
      matricula: matricula as string,
      funcao,
      is_adm: isAdmin,
      permissao_energia: permissaoEnergia,
      permissao_agua: permissaoAgua,
      permissao_gas: permissaoGas,
    };

    mutate(userData);
  };

  useEffect(() => {
    // Define todas as permissões como falso por padrão para evitar conflitos
    setPermissaoEnergia(false);
    setPermissaoAgua(false);
    setPermissaoGas(false);
    setIsAdmin(false);

    if (funcao === "Coordenador" || funcao === "M2-Supervisor") {
      setPermissaoEnergia(true);
      setPermissaoAgua(true);
      setPermissaoGas(true);
      setIsAdmin(true);
    } else if (funcao === "M7-Líder" || funcao === "M9-Eletromecânico") {
      setPermissaoEnergia(true);
      setPermissaoAgua(true);
      setPermissaoGas(true);
    } else if (funcao === "M5-Eletricista") {
      setPermissaoEnergia(true);
    } else if (funcao === "M4-Oficial Manutenção") {
      setPermissaoAgua(true);
      setPermissaoGas(true);
    }
    // Não precisa de um 'else' no final, pois os estados já foram definidos como 'false' no início do hook.
  }, [funcao]);

  return (
    <Content title="Cadastrar Usuário">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col max-w-xl gap-4 mt-8"
        ref={formRef}
      >
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="nome_completo">Nome Completo</Label>
          <Input
            placeholder="Digite o nome completo"
            id="nome_completo"
            type="text"
            name="nome_completo"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="funcao">Função</Label>
          <Select onValueChange={setFuncao} value={funcao} required>
            <SelectTrigger className="">
              <SelectValue placeholder="Selecione a função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Coordenador">Coordenador</SelectItem>
              <SelectItem value="M2-Supervisor">M2 - Supervisor</SelectItem>
              <SelectItem value="M9-Eletromecânico">
                M9 - Eletromecânico
              </SelectItem>
              <SelectItem value="M7-Líder">M7 - Líder</SelectItem>
              <SelectItem value="M6-Refrigeração">M6 - Refrigeração</SelectItem>
              <SelectItem value="M5-Eletricista">M5 - Eletricista</SelectItem>
              <SelectItem value="M4-Oficial Manutenção">
                M4 - Oficial Manutenção
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="matricula">Número de Matrícula</Label>
          <Input
            placeholder="Digite o número da matrícula"
            id="matricula"
            type="text"
            name="matricula"
            required
          />
        </div>
        <div className="grid w-full items-center gap-3">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            placeholder="Digite o CPF"
            id="cpf"
            type="text"
            name="cpf"
            required
          />
        </div>
        <Label>Permissões de Medição</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_energia"
              checked={permissaoEnergia}
              onCheckedChange={setPermissaoEnergia}
            />
            <Label htmlFor="permissao_energia">Energia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_agua"
              checked={permissaoAgua}
              onCheckedChange={setPermissaoAgua}
            />
            <Label htmlFor="permissao_agua">Água</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="permissao_gas"
              checked={permissaoGas}
              onCheckedChange={setPermissaoGas}
            />
            <Label htmlFor="permisssao_gas">Gás</Label>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Switch id="isAdmin" checked={isAdmin} onCheckedChange={setIsAdmin} />
          <Label htmlFor="isAdmin">Usuário Administrador</Label>
        </div>
        <Button type="submit" variant="default">
          {isPending ? (
            <>
              <Loader2Icon className="animate-spin" />
            </>
          ) : (
            "Cadastrar usuario"
          )}
        </Button>
      </form>
    </Content>
  );
}
