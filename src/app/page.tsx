"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { SplashScreen } from "../_componente/splashScreen";
import Logo from "@/assets/Logo.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppContext } from "../context/useAppContext";
import Cookie from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { recoverRegistration } from "@/service/Login/recoverRegistration";
import { useSignIn } from "@/hook/Login/useSingIn";
import { normalizeName } from "@/variavel/normalizeName";

import { IoIosEye, IoIosEyeOff } from "react-icons/io";

export default function Login() {
  const { setToken, setUser } = useAppContext();
  const [matriculaVerufy, setMatriculaVerufy] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useSignIn({
    onSuccess: (data) => {
      if (data.session) {
        setToken(data.session.access_token);
        setUser(data.user);
        Cookie.set("auth_token", data.session.access_token, { expires: 7 });

        router.push("/medicao");
      } else {
        toast.error("Falha ao obter sessão de autenticação.");
        setToken("");
        Cookie.set("auth_token", "", { expires: 7 });
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setToken("");
      Cookie.set("auth_token", "", { expires: 7 });
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const matricula = formData.get("matricula") as string;
    const password = formData.get("password") as string;

    if (!matricula || !password) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    mutate({ matricula, password });
  }

  async function handleVerify() {
    const result = await recoverRegistration(nomeCompleto);
    if (typeof result === "object" && result?.error) {
      toast.warning(result.error);
      setMatriculaVerufy("");
      return;
    }
    if (result) {
      setMatriculaVerufy(result);
    } else {
      toast.warning("Usuário não encontrado!");
      setMatriculaVerufy("");
    }
  }

  const handleCopyMatricula = () => {
    if (typeof window !== "undefined" && matriculaVerufy) {
      navigator.clipboard
        .writeText(matriculaVerufy)
        .then(() => {
          toast.info("Matrícula copiada com sucesso!");
        })
        .catch((err) => {
          console.error("Erro ao copiar a matrícula: ", err.message);
          toast.error("Erro ao copiar a matrícula." + err.message);
        });
    }
  };

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-center bg-[#3D3C6C] relative">
      <div
        className="border w-3/12 min-w-140 h-full bg-gray-50 rounded-2xl flex flex-col items-center py-12 
        max-sm:min-w-10/12 max-sm:pb-4 max-sm:pt-0"
      >
        <div className="relative w-full h-[150px] max-sm:w-8/12 mb-4 max-sm:mb-0">
          <Image
            src={Logo}
            alt="Logo"
            priority
            fill
            style={{ objectFit: "contain" }}
            className="max-sm:w-8/12 "
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-10/12 px-2 gap-2 max-sm:w-11/12"
        >
          <Label
            htmlFor="matricula"
            className="pl-1 flex flex-col gap-1 max-sm:text-basic"
          >
            N° matrícula
            <Input
              placeholder="Digite sua matrícula"
              type="text"
              id="matricula"
              name="matricula"
              className="max-sm:text-sm"
            />
            <span className="text-gray-500 text-sm font-normal w-full text-end transition duration-300 hover:text-cyan-600 ">
              <Sheet>
                <SheetTrigger className="cursor-pointer">
                  Esqueceu sua matrícula?
                </SheetTrigger>
                <SheetContent className="w-full">
                  <SheetHeader>
                    <SheetTitle className="mt-4">
                      Digite seu nome completo
                    </SheetTitle>
                    <SheetDescription className="mt-8 flex flex-col gap-4">
                      <Label htmlFor="nome_completo" className="text-gray-50">
                        Nome completo
                      </Label>
                      <Input
                        placeholder="Digite seu nome completo"
                        type="text"
                        id="nome_completo"
                        value={nomeCompleto}
                        onChange={(e) =>
                          setNomeCompleto(normalizeName(e.target.value))
                        }
                        required
                      />
                      <Button
                        className="w-full"
                        variant={"outline"}
                        onClick={handleVerify}
                      >
                        Verificar
                      </Button>

                      {matriculaVerufy && (
                        <Label
                          htmlFor="matricula"
                          className="text-lg  flex flex-col gap-2"
                        >
                          <span className="text-basic text-yellow-500">
                            <span className="text-gray-50 mr-2">
                              {" "}
                              Nº Matricula:
                            </span>
                            {matriculaVerufy}
                          </span>
                          <Button
                            className="w-full bg-[#151526] hover:bg-[#151526]/80 "
                            variant={"default"}
                            onClick={handleCopyMatricula}
                          >
                            Copiar matricula
                          </Button>
                        </Label>
                      )}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </span>
          </Label>

          <Label
            htmlFor="password"
            className="pl-1 flex flex-col gap-1 max-sm:text-basic"
          >
            Senha
            <div className="flex items-center gap-2 relative">
              <Input
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="max-sm:text-sm"
              />
              {showPassword ? (
                <IoIosEyeOff
                  size={20}
                  className="absolute right-6 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <IoIosEye
                  size={20}
                  className="absolute right-6 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </Label>

          <Button type="submit">
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              "Acessar"
            )}
          </Button>
        </form>
      </div>

      <SplashScreen />
    </main>
  );
}
