"use client";
import { useState, useEffect } from "react";

import { Content } from "@/_componente/content";
import { DateTipoMedicao } from "@/_componente/dateTipoMedicao";
import { useAppContext } from "@/context/useAppContext";
import { Card } from "@/_componente/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Importe o componente Button do shadcn/ui
import { useFetchLojas } from "@/hook/Fetch/useFetchLojas";
import type { LojaProps } from "@/types";
import {useWindowWidth} from "@/actives/windowWidth"


export default function Dashboard() {
  const { month, year, typeMedicao, localidade, searchQuery } = useAppContext();
  const { data, isLoading, error, isError } = useFetchLojas(
    typeMedicao,
    month,
    year,
    localidade,
    searchQuery
  );


  const [filteredLojas, setFilteredLojas] = useState<LojaProps[]>([]);
  const [sortedLojas, setSortedLojas] = useState<LojaProps[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [vacantCount, setVacantCount] = useState(0);
  const [activeLeituras, setActiveLeituras] = useState(0);
  const [vacanLeitura, setVacanLeitura] = useState(0);
  const width = useWindowWidth()
const ITEMS_PER_PAGE = width && width < 748 ? 8 : 40
  // NOVO: Estado para controlar a quantidade de lojas visíveis
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // NOVO: useEffect para resetar a contagem de visíveis quando os filtros mudam
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [typeMedicao, month, year, localidade, searchQuery]);

  // useEffect 1: Filtra as lojas por data e tipo de medição
  useEffect(() => {
    if (data) {
      const selectedDate = new Date(year, month - 1, 1);

      const filtered = data.filter((loja) => {
        const relevantMedidor = loja.medidores.find(
          (medidor) => medidor.tipo_medicao === typeMedicao
        );

        if (!relevantMedidor || !relevantMedidor.data_instalacao) {
          return false;
        }

        const medidorCreationDate = new Date(relevantMedidor.data_instalacao);
        return (
          medidorCreationDate.getFullYear() < selectedDate.getFullYear() ||
          (medidorCreationDate.getFullYear() === selectedDate.getFullYear() &&
            medidorCreationDate.getMonth() <= selectedDate.getMonth())
        );
      });

      setFilteredLojas(filtered);
    }
  }, [data, typeMedicao, month, year]);

  // useEffect 2: Ordena, conta e atualiza os estados com base nas lojas filtradas
  useEffect(() => {
    if (filteredLojas.length > 0) {
      const tempLojas = [...filteredLojas];

      const activeStores = tempLojas.filter((loja) => loja.ativa === true);
      const vacantStores = tempLojas.filter((loja) => loja.ativa === false);

      const activeLojasComLeitura = activeStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );
      const vacantLojasComLeitura = vacantStores.filter(
        (loja) => loja.medidores[0]?.leituras.length > 0
      );

      setActiveLeituras(activeLojasComLeitura.length);
      setVacanLeitura(vacantLojasComLeitura.length);

      setActiveCount(activeStores.length);
      setVacantCount(vacantStores.length);

      const orderedLojas = tempLojas.sort((a, b) => {
        const aHasReading = a.medidores[0]?.leituras.length > 0;
        const bHasReading = b.medidores[0]?.leituras.length > 0;

        if (aHasReading !== bHasReading) {
          return aHasReading ? 1 : -1;
        }

        if (a.prefixo_loja > b.prefixo_loja) return 1;
        if (a.prefixo_loja < b.prefixo_loja) return -1;

        return Number(a.numero_loja) - Number(b.numero_loja);
      });

      setSortedLojas(orderedLojas);
    } else {
      // Limpa os estados se não houver dados filtrados
      setSortedLojas([]);
      setActiveLeituras(0);
      setVacanLeitura(0);
      setActiveCount(0);
      setVacantCount(0);
    }
  }, [filteredLojas]);

  // Função para carregar mais lojas
  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + ITEMS_PER_PAGE);
  };

  return (
    <Content title="Painel medição">
      <section className="w-full flex ">
        <DateTipoMedicao />
      </section>
      <div className="max-sm:text-[16px] mt-4 py-4 text-lg flex gap-4 font-semibold w-full justify-start pr-9 max-sm:p-0 max-sm:justify-center">
        <span className="text-green-500">
          Ativos ( {activeLeituras} / {activeCount} )
        </span>
        <span className="text-red-400">
          Vagos ( {vacanLeitura} / {vacantCount} )
        </span>
      </div>
      <section className="w-full flex flex-wrap mt-4">
      {isLoading && (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <Skeleton
        key={index}
        className="w-75 h-45 mr-8 mb-8 max-sm:w-full max-sm:mr-2 max-sm:mb-4"
      />
    ))}
  </>
)}
        {
          <>
            {sortedLojas.slice(0, visibleCount).map((loja) => {
              if (!loja.id) {
                return null;
              }
              return <Card key={loja.id} loja={loja} />;
            })}

            {visibleCount < sortedLojas.length && (
              <div className="w-full flex justify-center mt-8 mb-8 max-sm:m-0">
                <Button
                  onClick={handleLoadMore}
                  variant={"ghost"}
                  className="w-1/5"
                >
                  Ver Mais
                </Button>
              </div>
            )}
          </>
        }
        {isError && (
          <p className="w-full text-center font-semibold text-xl">
            Nenhuma loja encontrada.
          </p>
        )}
      </section>
    </Content>
  );
}
