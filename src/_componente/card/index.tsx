//REACT
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
// SHADCN
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ButtonLoading } from "@/components/ui/buttonLoading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// HOOK
import { useAppContext } from "@/context/useAppContext";
import { useCreateLeitura } from "@/hook/Create/useCreateLeitura";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
//Action
import { formatarFracao } from "@/actives/FormatValor";
import { truncateText } from "@/actives/truncateText";
//TYPE
import type { LojaProps } from "@/types";
import { limparNumero } from "@/actives/LimpaMedicao";

import { useTheme } from "next-themes";
import Cookies from "js-cookie";

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();
const currentDate = `${currentDay}/${currentMonth}/${currentYear}`;

export function Card({ loja }: { loja: LojaProps }) {
  const {
    month,
    year,
    typeMedicao,
    localidade,
    searchQuery,
    setUser,
    setToken,
  } = useAppContext();
  const { mutate, isPending } = useCreateLeitura(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );

  const { data } = useFetchUser();
  const user = data?.user;
  const firstName = user?.nome_completo.split(" ")[0];
  const { setTheme } = useTheme();
  const router = useRouter();
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);
  const [formData, setFormData] = useState<{
    medicao_atual: number;
    detalhes_leitura: string;
    foto: File | null;
  }>({
    medicao_atual: 0,
    detalhes_leitura: "",
    foto: null,
  });
  function handleLogout() {
    setUser(null);
    Cookies.remove("auth_token");
    router.push("/");
    setToken("");
    setTheme("light");
  }

  if (!loja.medidores || loja.medidores.length === 0) {
    return <span className="text-gray-500"></span>;
  }

  if (!user) {
    handleLogout();
    return <span>Buscando...</span>;
  }

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.medicao_atual || formData.medicao_atual <= 0) {
      toast.info("Preencha a medição atual com um valor válido.");
      return;
    }
    /*
    if (!formData.foto) {
      toast.info("Insira uma foto do medidor.");
      return;
    }
*/
    if (medidor.numero_relogio === "BUSWAY") {
      setIsFormSheetOpen(false);
      setIsConfirmSheetOpen(true);
      return;
    }

    if (!user.is_adm) {
      if (formData.medicao_atual < medidor.ultima_leitura) {
        toast.warning("A medição atual deve ser maior ou igual ao anterior.");
        return;
      }
    }

    setIsFormSheetOpen(false);
    setIsConfirmSheetOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const acceptedImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!acceptedImageTypes.includes(file.type)) {
        toast.error("Selecione um arquivo de imagem (JPG, PNG, WEBP).");
        setFormData({ ...formData, foto: null });
        return;
      }

      const MAX_FILE_SIZE_MB = 20; // 5 MB
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`);
        setFormData({ ...formData, foto: null });
        return;
      }

      setFormData({ ...formData, foto: file });
    } else {
      setFormData({ ...formData, foto: null });
    }
  };

  const medidor = loja.medidores[0];
  const medidorJaLidoNoMes = medidor.leituras.some(
    (leitura) => leitura.mes === month && leitura.ano === year
  );
  const laterMonth = currentMonth - 1;

  const veryMonthfunca = () => {
    if (medidorJaLidoNoMes) return true;
    if (currentMonth === month && currentYear === year && currentDay <= 10)
      return true;
    if (user.is_adm) return false;

    if (month === laterMonth && currentYear === year && currentDay <= 10)
      return false;

    return true;
  };
  const veryMonth = veryMonthfunca();

  const textBtn = medidorJaLidoNoMes
    ? "Medição coletada"
    : currentMonth === month && currentYear === year
    ? "Medição não liberada"
    : month === laterMonth && currentYear === year && currentDay <= 10
    ? "Medição  liberada"
    : user.is_adm
    ? "Medição"
    : "Medição não liberada";

  const handleFinalSubmit = () => {
    const medicao_atual = limparNumero(formData.medicao_atual);

    const new_leitura = {
      medidor_id: medidor.id!,
      mes: month,
      ano: year,
      leitura_anterior: medidor.ultima_leitura,
      leitura_atual: medicao_atual,
      foto_url: formData.foto,

      nome_usuario: `${firstName} - ${user.funcao}`,
      detalhes_leitura: `Leitura feito por ${firstName} - ${
        user.funcao
      }  data: ${currentDate}, \n Detalhes a acrecentar: ${
        formData.detalhes_leitura || "N/A"
      }`,
      data_leitura: new Date("2025-06-01").toISOString(),
      nome_loja_leitura: loja.nome_loja,
    };

    mutate(new_leitura);

    setIsConfirmSheetOpen(false);
    setFormData({
      medicao_atual: 0,
      detalhes_leitura: "",
      foto: null,
    });
  };

  const verifiedMedidor = () => {
    if (medidor.leituras[0]?.leitura_atual) {
      return true;
    }
    return false;
  };

  const isMedidorVerified = verifiedMedidor();

  const nomePrefixo = `${loja.prefixo_loja} - ${loja.numero_loja}`;

  return (
    <div
      className={`border-l-8  ${
        isMedidorVerified ? "border-green-500" : "border-red-500"
      } flex flex-col w-100 max-sm:w-full  gap-1 justify-between py-4 max-sm:py-2 px-4 rounded-xl text-gray-900 dark:text-gray-50 mr-8 mb-8  max-sm:mr-2  max-sm:mb-4
      bg-white dark:bg-[#151526] hover:shadow-[2px_2px_10px_4px_#A7B3C3,-2px_-2px_10px_#FFFFFF] transition-shadow duration-300 shadow-xl`}
      key={loja.id}
    >
      <div className="w-full flex justify-between ">
        <span
          title={loja.nome_loja}
          className="text-lg font-semibold  max-sm:text-[16px]"
        >
          {truncateText(loja.nome_loja, 17)}
        </span>
        <div className="flex gap-2 ">
          <span className="text-lg font-semibold max-sm:text-[16px]">
            {truncateText(nomePrefixo, 17)}
          </span>
          <span
            className={`${
              loja.ativa ? "bg-green-500" : "bg-red-500"
            } rounded-full my-1.5 h-4 w-4 `}
          ></span>
        </div>
      </div>
      <div className="w-full flex justify-between max-sm:text-sm">
        <span>Nº relogio</span>
        <span>{medidor.numero_relogio}</span>
      </div>
      <div className="w-full flex justify-between max-sm:text-sm">
        <span>Localidade</span>
        <span>{medidor.localidade}</span>
      </div>
      <div className="w-full flex justify-between max-sm:text-sm">
        <span>Leitura mês anterior </span>
        <span>
          {" "}
          {medidor.leituras[0]?.leitura_anterior
            ? medidor.leituras[0]?.leitura_anterior
            : medidor.ultima_leitura}
        </span>
      </div>
      <div className="w-full flex justify-between max-sm:text-sm">
        <span>Leitura atual</span>
        <span>{medidor.leituras[0]?.leitura_atual || "--- ---"}</span>
      </div>
      <div className="w-full flex justify-between max-sm:text-sm max-sm:hidden">
        <span>Consumo</span>
        <span>
          {formatarFracao(
            medidor.leituras[0]?.consumo_mensal,
            medidor.tipo_medicao,
            loja.nome_loja,
            medidor.leituras[0]?.leitura_anterior
          )}{" "}
          {medidor.tipo_medicao === "Energia" ? "kWh" : "m3"}
        </span>
      </div>

      <div className="w-full flex justify-between gap-6 ">
        <Button variant="outline" className=" w-full max-sm:h-8">
          <Link
            href={`/loja/${loja.id}/${loja.medidores[0].id}`}
            className=" w-full h-full flex justify-center items-center"
          >
            Detalhes
          </Link>
        </Button>

        <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
          <SheetTrigger asChild>
            <Button disabled={veryMonth} className="w-full  max-sm:h-8">
              {textBtn}
            </Button>
          </SheetTrigger>

          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                Registrar medição
              </SheetTitle>

              <SheetTitle className="flex justify-between items-center mt-4">
                <span className="text-lg font-medium">
                  {loja.nome_loja} / {loja.prefixo_loja} - {loja.numero_loja}
                </span>
                <span
                  className={`${
                    loja.ativa ? "bg-green-500" : "bg-red-500"
                  } h-5 w-5 rounded-full`}
                ></span>
              </SheetTitle>
            </SheetHeader>

            {/* 🔽 Container rolável */}
            <div className="scroll-sheet flex-1 overflow-y-auto max-h-[calc(100vh-8rem)] pr-2">
              <div className="flex flex-col gap-4 mt-2 text-gray-50">
                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Complexo</span>
                  <Label>{loja.complexo}</Label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Tipo de medição</span>
                  <Label>{loja.medidores[0].tipo_medicao}</Label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Nº Relógio</span>
                  <Label>{loja.medidores[0].numero_relogio}</Label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Localização</span>
                  <Label>{loja.medidores[0].localidade}</Label>
                </div>

                {loja.medidores[0].tipo_medicao === "Energia" && (
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Quadro</span>
                    <Label>????</Label>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Última medição</span>
                  <Label
                    className={`bg-gray-900 rounded-lg py-3 px-2 dark:bg-gray-600 border 
              ${
                loja.medidores[0].numero_relogio !== "BUSWAY"
                  ? formData.medicao_atual >= medidor.ultima_leitura
                    ? "border-green-500"
                    : "border-red-500"
                  : ""
              }`}
                  >
                    {medidor.ultima_leitura}
                  </Label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Medição atual</span>
                  <Input
                    type="number"
                    required
                    placeholder="Digite a medição"
                    value={formData.medicao_atual || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medicao_atual: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <span className="font-semibold text-lg">Foto Relógio</span>
                  <Input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                    required
                  />
                </div>

                {formData.foto && (
                  <div className="w-full bg-white rounded-md flex justify-center items-center">
                    <Image
                      src={URL.createObjectURL(formData.foto)}
                      alt="Foto do relogio"
                      width={100}
                      height={100}
                      className="w-full h-20 object-contain rounded-md"
                    />
                  </div>
                )}

                <Button
                  onClick={handleNextStep}
                  className="w-full"
                  variant="outline"
                >
                  Registrar medição
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Sheet open={isConfirmSheetOpen} onOpenChange={setIsConfirmSheetOpen}>
          <SheetContent className="w-8/12 text-gray-50 ">
            <SheetHeader>
              <SheetTitle className="text-2xl font-semibold">
                Os dados estão corretos?
              </SheetTitle>
              <SheetTitle className="flex justify-between items-center mt-4 ">
                <span className="text-lg font-medium">
                  {loja.nome_loja} - {loja.numero_loja}
                </span>
                <span
                  className={`${
                    loja.ativa ? "bg-green-500" : "bg-red-500"
                  } h-5 w-5 rounded-full`}
                ></span>
              </SheetTitle>

              <SheetDescription asChild className="text-gray-50">
                <div className="flex flex-col gap-4 mt-8 h-full">
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Medição mês anterior
                    </span>
                    <Label className="bg-gray-900 rounded-lg p-2 dark:bg-gray-600">
                      {medidor.ultima_leitura}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Medição atual</span>
                    <Label className="bg-gray-900 rounded-lg p-2 dark:bg-gray-600">
                      {formData.medicao_atual}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">Gasto no mês</span>
                    <Label
                      className={`bg-gray-900 rounded-lg p-2 dark:bg-gray-600 border-2  border-slate-200 `}
                    >
                      {formData.medicao_atual - medidor.ultima_leitura}{" "}
                      {(medidor.tipo_medicao === "Energia" && "kWh") || "m3"}
                    </Label>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold text-lg">
                      Detalhe leitura
                    </span>
                    <Textarea
                      placeholder="Inseira detalhes da leitura"
                      className="text-gray-900 dark:text-gray-50 border border-gray-400 rounded-lg px-2 py-2 bg-white"
                      value={formData.detalhes_leitura || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          detalhes_leitura: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    Se sim, clique em **Registrar** para salvar os dados.
                  </div>
                  <div className="text-gray-50 flex-col flex h-full ">
                    {isPending ? (
                      <ButtonLoading />
                    ) : (
                      <Button
                        className="w-full mt-auto "
                        onClick={handleFinalSubmit}
                        variant={"outline"}
                        disabled={isPending}
                      >
                        Registrar
                      </Button>
                    )}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
