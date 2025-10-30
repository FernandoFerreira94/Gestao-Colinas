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

  return (
    <Content title="Tabela de consumo ">
      <section className="items-end  mt-8 flex w-full">
        <div className="flex gap-16 items-end ">
          <InputDate />
          <div className="w-40 h-full flex items-end">
            <Select required value={typeMedicao} onValueChange={setTypeMedicao}>
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
