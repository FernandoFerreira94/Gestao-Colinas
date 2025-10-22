export function limparNumero(input: number | string): number {
  // Converte para string
  const str = input.toString();

  // Remove tudo que não seja dígito (0-9)
  const apenasDigitos = str.replace(/\D/g, "");

  // Converte de volta para número
  return Number(apenasDigitos);
}
