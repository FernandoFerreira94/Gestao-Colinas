export function valorTotalPagarTaxa(valorTotal: number) {
  const valor = valorTotal * 1.05;
  const valorFormatado = valor.toFixed(2);
  return valorFormatado.replace(".", ",");
}
