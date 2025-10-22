// @repo/utils/index.ts (ou onde quer que calculoValorPagar esteja)
export function calculoValorPagar(
  consumo: number | null | undefined,
  custoRateio: number | null | undefined
): number {
  const _consumo = Number(consumo) || 0; // Garante que é um número, com fallback para 0
  const _custoRateio = Number(custoRateio) || 0; // Garante que é um número, com fallback para 0

  if (_custoRateio === 0) {
    // Se o custo for 0, o valor a pagar é 0.
    return 0;
  }

  const consumoPagar = _consumo * _custoRateio;
  return parseFloat(consumoPagar.toFixed(2)); // Retorna o número diretamente
}
