"use client";
import { useEffect, useState } from "react";
import { Content } from "@/_componente/content";
import { InputDate } from "@/components/ui/inputDate";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/useAppContext";
import { useFetchLojaTabela } from "@/hook/Fetch/useFetchLojaTabela";

import { Tabela } from "./tabela";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver"; // Opcional, mas útil para compatibilidade e clareza
export default function ExportExcel() {
  const { month, year, typeMedicao, setTypeMedicao } = useAppContext();

  const { data } = useFetchLojaTabela(typeMedicao, month, year);

  const [activeLeituras, setActiveLeituras] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const activeStores = data.filter((item) => item.ativa === true);
      const vacantStores = data.filter((item) => item.ativa === false);

      const activeMetersWithReadings = activeStores.filter(
        (item) => item?.medidores?.[0].leituras[0]
      ).length;

      const vacantMetersWithReadings = vacantStores.filter(
        (item) => item?.medidores?.[0].leituras[0]
      ).length;

      setActiveLeituras(activeMetersWithReadings);
      setActiveCount(activeStores.length);
      setVacanLeitura(vacantMetersWithReadings);
      setVacantCount(vacantStores.length);
    }
  }, [data]);

  useEffect(() => {
    function getTipoMedicaoLocalStorage() {
      const tipoMedicao = localStorage.getItem("typeMedicao") as
        | "Energia"
        | "Agua"
        | "Gas";

      if (tipoMedicao) {
        setTypeMedicao(tipoMedicao);
      }
    }
    getTipoMedicaoLocalStorage();
  }, []);

  function SetMedicaoLocalStorage(value: "Energia" | "Agua" | "Gas") {
    setTypeMedicao(value);
    localStorage.setItem("typeMedicao", value);
  }

  async function handleDownloadAll() {
    if (!data || !Array.isArray(data) || data.length === 0) {
      toast.info("Nenhum dado encontrado para exportar.");
      return;
    }

    const zip = new JSZip(); // 1. Cria a instância do JSZip
    let photosCount = 0; // Contador para saber quantas fotos foram adicionadas

    // Exibe um toast de carregamento
    const loadingToastId = toast.loading(
      `Preparando ${data.length} arquivos...`
    );

    try {
      // Itera sobre as lojas e adiciona as fotos ao objeto ZIP
      for (const loja of data) {
        const fotoUrl = loja?.medidores?.[0]?.leituras?.[1]?.foto_url;

        // ✅ NOVA VERIFICAÇÃO 1: Garante que a URL exista
        if (!fotoUrl) continue;

        // ✅ NOVA VERIFICAÇÃO 2: Garante que a URL é uma string.
        // Isso resolve o erro 'Argument of type 'string | File' is not assignable...'
        if (typeof fotoUrl !== "string") continue;

        const nome = loja?.nome_loja || "Loja_Sem_Nome";
        const prefixo = loja?.prefixo_loja || "";
        const numero = loja?.numero_loja || "";

        // O nome do arquivo individual dentro do ZIP
        const fileName = `${nome}_${prefixo}_${numero}.jpg`;

        // 2. Busca o ArrayBuffer da imagem
        const response = await fetch(fotoUrl);
        const blob = await response.blob();

        // Converte o Blob para ArrayBuffer, necessário para o JSZip
        const arrayBuffer = await blob.arrayBuffer();

        // 3. Adiciona o arquivo ao ZIP
        // O primeiro argumento 'photos/' cria uma pasta dentro do ZIP!
        zip.file(`fotos/${fileName}`, arrayBuffer);
        photosCount++;
      }

      if (photosCount === 0) {
        toast.dismiss(loadingToastId);
        toast.info(
          "Nenhuma foto encontrada para download no período selecionado."
        );
        return;
      }

      // 4. Gera o arquivo ZIP
      const zipFileName = `${typeMedicao}_${month}_${year}.zip`;

      // Atualiza o toast para indicar que está gerando o ZIP
      toast.loading("Compactando e gerando arquivo ZIP...", {
        id: loadingToastId,
      });

      const content = await zip.generateAsync({ type: "blob" });

      // 5. Aciona o download do arquivo ZIP
      saveAs(content, zipFileName); // Usa a função saveAs do file-saver

      toast.dismiss(loadingToastId);
      toast.success(
        `Download do arquivo "${zipFileName}" iniciado com sucesso!`
      );
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error("Erro ao gerar ou baixar o arquivo ZIP:", error);
      toast.error("Erro ao tentar gerar o arquivo de fotos.");
    }
  }

  return (
    <Content title="Tabela de consumo ">
      <section className="items-end  mt-8 flex w-full">
        <div className="flex gap-16 items-end ">
          <InputDate />
          <div className="w-40 h-full flex items-end">
            <Select
              required
              value={typeMedicao}
              onValueChange={SetMedicaoLocalStorage}
            >
              <SelectTrigger>
                <SelectValue placeholder={"Selecione o tipo de medição"} />
              </SelectTrigger>
              <SelectContent className="flex">
                <SelectItem value="Energia">Energia</SelectItem>
                <SelectItem value="Agua">Agua</SelectItem>
                <SelectItem value="Gas">Gás</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border ml-auto mr-16">
          <Button
            variant={"outline"}
            className="px-4 border"
            onClick={handleDownloadAll}
          >
            {`Exporta fotos ( ${typeMedicao} - ${month}/${year} )`}
          </Button>
        </div>
      </section>

      <div className="w-full flex gap-12 my-3">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400 ">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <div className=" w-full h-full pr-16">
        <Tabela />
      </div>
    </Content>
  );
}
