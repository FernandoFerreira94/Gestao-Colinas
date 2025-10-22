export function formatFracao(valor: number, type: string, nome_loja: string) {
  if (type === "Gas") {
    const valorFormatado = (valor / 10000).toFixed(2);
    return valorFormatado.replace(".", ",");
  }
  if (
    (type === "Energia" && nome_loja === "Central Agua Gelada ( Chill 01 )") ||
    nome_loja === "Central Agua Gelada ( Chill 02 )" ||
    nome_loja === "Hotel Colinas"
  ) {
    const valorFormatado = (valor / 100).toFixed(2);
    return valorFormatado.replace(".", ",");
  }
  const valorFormatado = (valor / 1).toFixed(2);
  return valorFormatado.replace(".", ",");
}
