import { no } from "zod/v4/locales";

export const formatarFracao = (
  valor: number | undefined,
  type?: string,
  nome_loja?: string,
  medicao_anterior?: number | undefined,
  medicao_atual?: number | undefined
): string => {
  const medicao_anteriorString = String(medicao_anterior);
  const medicao_atualString = String(medicao_atual);
  if (valor === undefined || valor === null) return "-";

  if (type === "Gas") {
    const valorFormatado = (valor / 10000).toFixed(2);
    return valorFormatado.replace(".", ",");
  }

  if (type === "Agua" && nome_loja === "Mc Donald's") {
    const valorFormatado = (valor / 100).toFixed(2);
    return valorFormatado.replace(".", ",");
  }
  if (type === "Agua" && nome_loja === "Teatro Colinas") {
    const valorFormatado = (valor / 1).toFixed(2);
    return valorFormatado.replace(".", ",");
  }

  if (type !== "Energia" && medicao_anteriorString.length < 6) {
    const valorFormatado = (valor / 100).toFixed(2);
    return valorFormatado.replace(".", ",");
  }

  if (type !== "Energia" && medicao_anteriorString.length > 6) {
    const valorFormatado = (valor / 10000).toFixed(2);
    return valorFormatado.replace(".", ",");
  }

  if (type === "Energia") {
    if (nome_loja === "Mc Donald's") {
      const valorFormatado = (valor / 10).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
    if (
      nome_loja === "Hotel Colinas" ||
      nome_loja === "Mc Donald's" ||
      nome_loja === "Deli" ||
      nome_loja === "Nipbr" ||
      nome_loja === "Central Agua Gelada ( Chill 01 )" ||
      nome_loja === "Central Agua Gelada ( Chill 02 )"
    ) {
      const valorFormatado = (valor / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }
    const valorFormatado = valor.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  }

  // Divide por 100 para converter, e toFixed(2) para 2 casas decimais
  const valorFormatado = (valor / 100).toFixed(2);

  // O replace substitui o ponto (.) por vírgula (,) para o padrão brasileiro
  return valorFormatado.replace(".", ",");
};
