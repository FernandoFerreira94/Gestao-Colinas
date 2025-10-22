export function calcularDiferencaPercentualConsumo(
  consumoAtual: number ,
  consumoAnterior: number
): number {
  if (consumoAnterior + consumoAtual === 0) {
    return 0; // caso ambos sejam zero
  }

  if (consumoAnterior === 0) {
    return 100; // caso só o anterior seja zero
  }

  const percentual = (consumoAtual / consumoAnterior - 1) * 100;
  return parseFloat(percentual.toFixed(2));
}
