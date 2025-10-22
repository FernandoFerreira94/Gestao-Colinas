export const totalGeralFormatado = (valor: number) => {
  const valorFormatado = (valor / 100).toFixed(2);

  return valorFormatado.replace(".", ",");
};
