export const formatarMedicao = (medicao: number) => {
  if (medicao === undefined || medicao === null || isNaN(Number(medicao))) {
    return;
  }
  return medicao.toLocaleString("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
};
