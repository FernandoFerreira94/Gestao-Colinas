import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchLojaTabela } from "@/hook/Fetch/useFetchLojaTabela";
import { truncateText } from "@/actives/truncateText";
import { calcularDiferencaPercentualConsumo } from "../calculoTable/action/DiferencaPercentualConsumo";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAppContext } from "@/context/useAppContext";
import Link from "next/link";

export function Tabela() {
  const { month, year, typeMedicao } = useAppContext();
  const { data } = useFetchLojaTabela(typeMedicao, month, year);

  return (
    <ScrollArea className="w-full rounded-md border whitespace-nowrap">
      <Table className=" bg-white dark:bg-[#2B2B41] text-lg relative">
        <TableHeader>
          <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] text-base">
            <TableHead className=" border-x-2 border-gray-100 " rowSpan={2}>
              EUC
            </TableHead>
            <TableHead
              className="text-center border-x-2 border-gray-100 "
              rowSpan={2}
            >
              Nome fantasia
            </TableHead>
            <TableHead
              className=" border-x-2 border-gray-100 px-10 text-center"
              rowSpan={2}
            >
              Relógio
            </TableHead>

            <TableHead
              colSpan={2}
              className="text-center border-x-2 border-gray-100 px-20"
            >
              Leitura Relógio
            </TableHead>
            {typeMedicao === "Agua" && (
              <TableHead
                colSpan={3}
                className="text-center border-x-2 border-gray-100 px-20"
              >
                Consumo Esgoto
              </TableHead>
            )}
            <TableHead
              colSpan={3}
              className="text-center border-x-2 border-gray-100 px-20"
            >
              Consumo {typeMedicao === "Agua" && "Agua"}
              {typeMedicao === "Energia" && "Energia"}
              {typeMedicao === "Gas" && "Gas"}
            </TableHead>
          </TableRow>

          <TableRow className="bg-[#3D3C6C] dark:bg-[#151526] hover:bg-[#3D3C6C] ">
            <TableHead className="border-x-2 px-12 border-gray-100 text-center">
              mês ref
            </TableHead>
            <TableHead className="border-x-2 px-6 border-gray-100 text-center">
              mês anterior
            </TableHead>
            {typeMedicao === "Agua" && (
              <>
                <TableHead className="px-8 border-x-2 border-gray-100">
                  {" "}
                  mês ref
                </TableHead>
                <TableHead className="px-8 border-x-2 border-gray-100">
                  {" "}
                  mês anterior
                </TableHead>
                <TableHead className="text-center border-x-2 border-gray-100 w-30">
                  %Var
                </TableHead>
              </>
            )}
            <TableHead className="px-8 border-x-2 border-gray-100">
              {" "}
              mês ref
            </TableHead>
            <TableHead className="px-8 border-x-2 border-gray-100">
              {" "}
              mês anterior
            </TableHead>
            <TableHead className="text-center border-x-2 border-gray-100 w-30">
              %Var
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data
              .sort((a, b) => {
                const customOrder = [
                  "AE",
                  "TR",
                  "D",
                  "NS",
                  "NT",
                  "QBT",
                  "QS",
                  "QT",
                  "CE",
                  "QVB",
                  "EST",
                  "CAG",
                  "AT",
                  " ",
                  "",
                ];

                const aPrefix = a.prefixo_loja || "";
                const bPrefix = b.prefixo_loja || "";

                const aIndex = customOrder.indexOf(aPrefix);
                const bIndex = customOrder.indexOf(bPrefix);

                // Ordena pelo prefixo primeiro
                if (aIndex !== bIndex) return aIndex - bIndex;

                // Extrai apenas a parte numérica do numero_loja
                const aNum = parseInt(
                  a.numero_loja?.match(/\d+/)?.[0] || "0",
                  10
                );
                const bNum = parseInt(
                  b.numero_loja?.match(/\d+/)?.[0] || "0",
                  10
                );

                return aNum - bNum;
              })
              .map((item) => {
                const porcentagem = calcularDiferencaPercentualConsumo(
                  item.medidores[0]?.leituras[0]?.consumo_mensal || 0,
                  item.medidores[0]?.leituras[1]?.consumo_mensal || 0
                );

                const stylePorcentagem = () => {
                  if (porcentagem > 20 || porcentagem < -20) {
                    return "bg-red-200/30 border border-b-red-500";
                  } else if (porcentagem <= 20 && porcentagem >= 0) {
                    return "bg-green-200/30 border border-b-green-500";
                  } else if (porcentagem >= -20) {
                    return "bg-yellow-200/30 border border-b-yellow-500 ";
                  }
                };

                console.log(stylePorcentagem);
                return (
                  <TableRow
                    title={`${item.nome_loja} - ${item.prefixo_loja}-${item.numero_loja}`}
                    key={item.id}
                    className={`${
                      !item.ativa && "bg-red-200/30 border border-b-red-500"
                    } text-center hover:bg-gray-500/40 text-base`}
                  >
                    <TableCell className="font-semibold text-start w-20">
                      {item.prefixo_loja} - {item.numero_loja}
                    </TableCell>
                    <TableCell className="text-start relative">
                      <Link
                        title={
                          item.medidores[0]?.leituras[0]?.detalhes_leitura || ""
                        }
                        href={`/loja/${item.id}/${item.medidores?.[0].id}`}
                        className="hover:text-blue-500 w-full"
                      >
                        {truncateText(item.nome_loja, 18)}
                      </Link>
                    </TableCell>

                    <TableCell className=" text-center ">
                      {item.medidores[0].numero_relogio}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {item.medidores[0]?.leituras[1]?.leitura_atual || "-- --"}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {item.medidores[0]?.leituras[1]?.leitura_anterior ||
                        "-- --"}
                    </TableCell>
                    {typeMedicao === "Agua" && (
                      <>
                        <TableCell className="font-semibold">
                          {" "}
                          {item.medidores[0]?.leituras[1]?.consumo_mensal ||
                            "-- --"}
                        </TableCell>
                        {/* CONSUMO MÊS REF (Valor do Consumo MENSAL do MÊS DE REFERÊNCIA) */}
                        <TableCell>
                          {item.medidores[0]?.leituras[0]?.consumo_mensal ||
                            "-- --"}
                        </TableCell>
                        <TableCell
                          className={`${stylePorcentagem()} font-semibold`}
                        >
                          {porcentagem}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="font-semibold">
                      {" "}
                      {item.medidores[0]?.leituras[1]?.consumo_mensal ||
                        "-- --"}
                    </TableCell>
                    {/* CONSUMO MÊS REF (Valor do Consumo MENSAL do MÊS DE REFERÊNCIA) */}
                    <TableCell>
                      {item.medidores[0]?.leituras[0]?.consumo_mensal ||
                        "-- --"}
                    </TableCell>
                    <TableCell
                      className={`${stylePorcentagem()} font-semibold`}
                    >
                      {porcentagem}%
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
