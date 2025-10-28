"use client";

import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import React, { useState, useEffect } from "react";
import { Content } from "@/_componente/content";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFetchLojaSingle } from "@/hook/Fetch/useFetchLojaSingle";
import { DetalhesProps, LeituraProps } from "@/types";
import { useFetchUser } from "@/hook/Fetch/useFetchUser";
import { formatarMedicao } from "@/actives/FormatMedicao";
import { useEditLeituraMedidor } from "@/hook/Update/useEditLeituraMedidor";
import { Input } from "@/components/ui/input";
import { Localidade } from "@/_componente/dateTipoMedicao/localidade";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { useAppContext } from "@/context/useAppContext";
import { toast } from "sonner";
import Image from "next/image";
import { PrefixoLoja } from "../../component/prefixoLoja";
import { Chart } from "../../component/Chart";
import { IoCloudDownloadOutline, IoBackspaceOutline } from "react-icons/io5";
import { limparNumero } from "@/actives/LimpaMedicao";

export default function InfoLoja({ params }: DetalhesProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { id, medidorId } = resolvedParams;
  const { month, year } = useAppContext();
  const [edit, setEdit] = useState(false);
  const [numero_relogio, setNumero_relogio] = useState("");
  const [quadroDistribuicao, setQuadroDistribuicao] = useState("");
  const [localidade, setLocalidade] = useState("");
  const [leitura_atual, setLeitura_atual] = useState("");
  const [detalheLeitura, setDetalheLeitura] = useState("");
  const [ativa, setAtiva] = useState(false);
  const [nome_loja, setNome_loja] = useState("");
  const [numero_loja, setNumero_loja] = useState("");
  const [detalheMedidor, setDetalheMedidor] = useState("");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data, isLoading, error } = useFetchLojaSingle(id, medidorId);
  const [prefixo, setPrefixo] = useState(data?.loja?.prefixo_loja || "");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate, isPending } = useEditLeituraMedidor({
    onSuccess: () => {
      toast(
        `Loja ${data?.loja?.nome_loja} - ${data?.loja?.prefixo_loja}-${data?.loja?.numero_loja} editada com sucesso!`
      );
      router.push("/medicao");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { data: userData } = useFetchUser();
  const is_admin = userData?.user?.is_adm;

  const leituraFiltradaMonth = data?.medidor?.leituras?.filter(
    (leitura: LeituraProps) => leitura.mes === month && leitura.ano === year
  );

  useEffect(() => {
    if (data) {
      setNumero_relogio(data.medidor?.numero_relogio);
      setLeitura_atual(
        leituraFiltradaMonth[0]?.leitura_atual || data.medidor.ultima_leitura
      );

      setDetalheLeitura(
        leituraFiltradaMonth[0]?.detalhes_leitura || "Sem detalhe"
      );
      setAtiva(data.loja.ativa);
      setQuadroDistribuicao(data?.medidor?.quadro_distribuicao || "");
      setDetalheMedidor(data?.medidor?.detalhes || "Sem detalhes");

      setNome_loja(data?.loja?.nome_loja || "");
      setNumero_loja(data?.loja?.numero_loja || "");
      setPrefixo(data?.loja?.prefixo_loja || "");
    }
  }, [data]);

  useEffect(() => {
    if (data?.medidor.localidade || data?.loja.prefixo_loja) {
      setLocalidade(data.medidor.localidade);

      setPrefixo(data.loja.prefixo_loja);
      setTimeout(() => {
        setLocalidade(data.medidor.localidade);

        setPrefixo(data.loja.prefixo_loja);
      }, 500);
    }
  }, [data?.medidor.localidade, data?.loja.prefixo_loja]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const medicao_atual = limparNumero(leitura_atual);
    // Dados que sempre são enviados
    const dataMedidor = {
      numero_relogio,
      localidade,
      quadro_distribuicao: quadroDistribuicao,
      ultima_leitura: medicao_atual,
      detalhes: detalheMedidor,
    };

    const dataLoja = {
      nome_loja,
      numero_loja: numero_loja,
      prefixo_loja: prefixo,
      ativa,
    };
    // ✅ CORREÇÃO: Use a lógica de if/else para chamar a mutação

    const dataLeitura = {
      leitura_atual: medicao_atual,
      detalhes_leitura: detalheLeitura,
      foto_url: newPhoto,
      nome_loja_leitura: data?.loja?.nome_loja,
      medidor_id: data?.medidor?.id,
    };

    mutate({
      medidor_id: data?.medidor?.id,
      ultima_leitura: Number(leitura_atual),
      loja_id,
      dataMedidor,
      dataLoja,
      leitura_id,
      dataLeitura,
    });
  }

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
        setNewPhoto(null);
        setPreviewUrl(null);
        return;
      }

      const MAX_FILE_SIZE_MB = 20;
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`A imagem deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`);
        setNewPhoto(null);
        setPreviewUrl(null);
        return;
      }

      setNewPhoto(file);
      setPreviewUrl(URL.createObjectURL(file)); // ← cria URL temporária
    } else {
      setNewPhoto(null);
      setPreviewUrl(null);
    }
  };

  if (isLoading || error || !data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }
  if (!data) {
    return (
      <Content title={` `}>
        <Skeleton className="h-10 w-60" />
      </Content>
    );
  }

  const leitura_id = leituraFiltradaMonth[0]?.id;
  const loja_id = data?.loja?.id;

  const handleDownload = (imageUrl: string) => {
    if (!imageUrl) return;

    // Usa o Fetch API para obter o blob da imagem
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Cria um URL temporário para o blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Define o nome do arquivo, usando um valor padrão
        const fileName = `foto_leitura_${data?.loja?.prefixo_loja}_${data?.loja?.numero_loja}_${month}_${year}.jpg`;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();

        // Limpa o URL temporário
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Erro ao tentar baixar a imagem:", error);
        toast.error("Erro ao baixar a imagem. Tente novamente.");
      });
  };

  return (
    <Content
      title={`${data.loja.nome_loja} - ${data.loja.prefixo_loja} ${data.loja.numero_loja}  ${month}/${year}`}
    >
      <main className="flex  items-start pt-8 max-sm:pt-4 gap-32 w-11/12 max-sm:flex-col max-sm:w-full">
        <section className="w-full ">
          <div className="flex items-center  space-x-2 ">
            {is_admin && (
              <>
                <Switch
                  id="ativa"
                  onCheckedChange={() => setEdit(!edit)}
                  checked={!edit}
                />
                <Label htmlFor="edit">Modo editar</Label>
              </>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 mt-8 max-sm:mt-4 max-sm:pr-4"
          >
            <div className="flex flex-col gap-2">
              <Label>Complexo</Label>
              <Select required value={data.loja.complexo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shopping Colinas">
                    Shopping Colinas
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ativa"
                checked={ativa}
                onCheckedChange={setAtiva}
                disabled={edit}
              />
              {ativa ? (
                <Label htmlFor="ativa">Esta loja esta ativa</Label>
              ) : (
                <Label htmlFor="ativa">Esta loja esta desativada</Label>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label>Nome da loja</Label>
              <Input
                disabled={edit}
                value={nome_loja}
                onChange={(e) => setNome_loja(e.target.value)}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
              />
            </div>
            <PrefixoLoja
              edit={edit}
              prefixo={prefixo}
              setPrefixo={setPrefixo}
            />

            <div className="flex flex-col gap-2">
              <Label>Numero loja</Label>
              <Input
                disabled={edit}
                type="text"
                value={numero_loja}
                onChange={(e) => setNumero_loja(e.target.value)}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Tipo de Medicao</Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {data.medidor.tipo_medicao}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Numero do relogio</Label>
              <Input
                disabled={edit}
                value={numero_relogio}
                onChange={(e) => setNumero_relogio(e.target.value)}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>localidade relogio</Label>
              <Localidade
                key={data.medidor.localidade}
                setValue={(value) => setLocalidade(value)}
                value={localidade}
                disabled={edit}
              />
            </div>
            {data.medidor.tipo_medicao === "Energia" && (
              <div className="flex flex-col gap-2">
                <Label>Quadro distribuição</Label>
                <Input
                  disabled={edit}
                  value={quadroDistribuicao}
                  onChange={(e) => setQuadroDistribuicao(e.target.value)}
                  placeholder="Quadro Distribuição"
                  className={`border-3 ${
                    edit
                      ? "border-transparent "
                      : "border-gray-700 dark:border-gray-300 "
                  }`}
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>
                {data.medidor.numero_relogio !== "BUSWAY"
                  ? "Leitura mês anterior"
                  : "Consumo mês anterior"}
              </Label>
              <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                {leituraFiltradaMonth[0]?.leitura_anterior ||
                  data?.medidor?.ultima_leitura}
              </span>{" "}
            </div>
            <div className="flex flex-col gap-2">
              <Label>
                {data.medidor.numero_relogio !== "BUSWAY"
                  ? "Leitura mês atual"
                  : "Consumo mês atual"}
              </Label>
              <Input
                disabled={edit}
                value={leitura_atual}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
                placeholder={
                  formatarMedicao(leituraFiltradaMonth[0]?.leitura_atual) ||
                  "Sem leitura"
                }
                onChange={(e) => setLeitura_atual(e.target.value)}
                type="text"
                step="0.01"
              />
            </div>
            {data.medidor.numero_relogio !== "BUSWAY" && (
              <div className="flex flex-col gap-2">
                <Label>Consumo</Label>
                <span className="dark:bg-[#151526] border py-2 px-4 rounded-md bg-white">
                  {formatarMedicao(leituraFiltradaMonth[0]?.consumo_mensal) ||
                    "0"}{" "}
                  {data?.medidor?.tipo_medicao === "Energia" ? "kWh" : "M3"}
                </span>{" "}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label>Foto do relogio</Label>
              <div className="flex items-center  gap-12">
                {leituraFiltradaMonth[0]?.foto_url || previewUrl ? (
                  <div
                    // ⭐️ Adiciona o clique para abrir o modal
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer flex  items-center gap-12 "
                  >
                    <Image
                      src={previewUrl || leituraFiltradaMonth[0]?.foto_url}
                      alt="Foto do relogio"
                      width={400}
                      height={400}
                      className="rounded-md"
                    />
                    {leituraFiltradaMonth[0]?.foto_url && (
                      <div className="flex flex-col items-center  text-gray-400  hover:scale-105 transition duration-500 cursor-pointer  ">
                        <IoCloudDownloadOutline
                          onClick={() =>
                            handleDownload(
                              previewUrl || leituraFiltradaMonth[0]?.foto_url
                            )
                          }
                          size={30}
                          className=""
                        />{" "}
                        <span>Donwload</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg, image/png, image/webp"
                    onChange={handleFileChange}
                    disabled={edit}
                  />
                )}
                {/* Input File permanece aqui */}
                {!edit && <></>}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Detalhe do medidor</Label>
              <Textarea
                disabled={edit}
                value={detalheMedidor}
                onChange={(e) => setDetalheMedidor(e.target.value)}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Detalhe da leitura</Label>
              <Textarea
                disabled={edit}
                value={detalheLeitura}
                onChange={(e) => setDetalheLeitura(e.target.value)}
                className={`border-3 ${
                  edit
                    ? "border-transparent "
                    : "border-gray-700 dark:border-gray-300 "
                }`}
              />
            </div>
            {!edit && (
              <Button
                type="submit"
                variant={"default"}
                disabled={edit}
                className="w-full mt-4 h-10"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            )}
          </form>
        </section>
        <div className="max-sm:hidden">
          <Chart data={data} />
        </div>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm "
          onClick={() => setIsModalOpen(false)} // Fecha ao clicar fora da imagem
        >
          <div
            className=" p-4 bg-transparent max-w-7xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // Impede que o clique dentro feche o modal
          >
            {/* Botões Superiores */}
            <div className="absolute top-8 right-8 p-4 flex gap-8 z-10 items-center">
              {/* Botão de Fechar/Voltar */}

              <IoBackspaceOutline
                onClick={() => setIsModalOpen(false)}
                size={35}
                className=" text-4xl hover:scale-110 transition duration-500 cursor-pointer text-red-400"
              />
              {leituraFiltradaMonth[0]?.foto_url && (
                <IoCloudDownloadOutline
                  onClick={() =>
                    handleDownload(
                      previewUrl || leituraFiltradaMonth[0]?.foto_url
                    )
                  }
                  size={30}
                  color="white"
                  className=" text-4xl hover:scale-110 transition duration-500 cursor-pointer "
                />
              )}
            </div>

            {/* Imagem Centralizada */}
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <Image
                src={previewUrl || leituraFiltradaMonth[0]?.foto_url}
                alt="Visualização Ampliada do Relógio"
                layout="contain" // Tenta conter a imagem sem cortar
                objectFit="contain"
                width={1000} // Valores altos para visualização
                height={1000}
                className="max-w-full max-h-[80vh] rounded-md shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </Content>
  );
}
