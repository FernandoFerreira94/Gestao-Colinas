import { ChartContainer } from "@/components/ui/chart";
import { CustomTooltip, chartConfig } from "../grafico/CustomTooltip";
import { ChartDataItem } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
} from "recharts";

// Representa cada leitura individual
interface LeituraProps {
  id?: string;
  nome_loja_leitura: string;
  mes: number;
  ano: number;
  consumo_mensal: number;
  detalhes_leitura?: string;
}

// Representa o medidor, que contém várias leituras
interface MedidorComLeitura {
  id?: string;
  tipo_medicao: string;
  localidade: string;
  numero_relogio: string;
  ultima_leitura: number;
  detalhes: string;
  data_instalacao: string;
  leituras: LeituraProps[];
}

// Representa a loja com múltiplos medidores

// 🔹 NOVA INTERFACE para o componente de gráfico
export interface LojaComLeiturasCombinadas {
  id?: string;
  nome_loja: string;
  medidor: MedidorComLeitura;
  leituras: LeituraProps[];
}

export function Chart({ data }: { data: LojaComLeiturasCombinadas }) {
  let chartData: ChartDataItem[] = [];
  if (data && data.medidor.leituras) {
    const sortedLeituras = [...data.medidor.leituras].sort((a, b) => {
      const dateA = new Date(a.ano, a.mes - 1, 1);
      const dateB = new Date(b.ano, b.mes - 1, 1);
      return dateA.getTime() - dateB.getTime();
    });

    const lastSixLeituras = sortedLeituras.slice(-6);
    chartData = lastSixLeituras.map((leitura) => ({
      nome_loja: leitura.nome_loja_leitura,
      month: `${leitura.mes}/${leitura.ano}`,
      consumo: leitura.consumo_mensal,
      detalhes: leitura.detalhes_leitura || "Nenhum detalhe disponível",
    }));
  }
  return (
    <section className="w-full  border mt-18 py-8  bg-white dark:bg-[#151526] rounded-xl">
      <ChartContainer config={chartConfig} className="min-h-[500px] w-full ">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine
            tickMargin={10}
            axisLine
            tickFormatter={(value, index) => {
              const loja = chartData[index]?.nome_loja;
              return `${value} - ${loja}`;
            }}
          />
          <YAxis dataKey="consumo" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="consumo"
            fill="var(--color-consumo)"
            radius={4}
            barSize={100}
          >
            <LabelList dataKey="consumo" position="top" />
          </Bar>
        </BarChart>
      </ChartContainer>
    </section>
  );
}
