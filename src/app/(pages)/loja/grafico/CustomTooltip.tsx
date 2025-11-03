import { TooltipPayload } from "@/types";
import { ChartConfig } from "@/components/ui/chart";

export const CustomTooltip = ({ active, payload, label }: TooltipPayload) => {
  if (active && payload && payload.length) {
    // ✅ CORREÇÃO: Acessa o seu objeto de dados aninhado
    const data = payload[0].payload;
    return (
      <div className="bg-[#151526] border border-gray-700 p-3  rounded shadow-lg text-sm text-gray-200">
        <p className="font-semibold">{`Mês: ${label}`}</p>
        <p className="font-bold text-lg text-blue-400">{`Consumo: ${data.consumo}`}</p>
        <p className="text-gray-400 mt-2">Detalhes : {data.detalhes}</p>
      </div>
    );
  }
  return null;
};

export const chartConfig = {
  consumo: {
    label: "Consumo Mensal",
    color: "#3D3C6C",
  },
} satisfies ChartConfig;
