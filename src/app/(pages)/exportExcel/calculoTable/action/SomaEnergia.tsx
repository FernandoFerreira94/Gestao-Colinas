type Loja = {
  prefixo_loja: string;
  nome_loja: string;
  medidores: {
    leituras: {
      consumo_mensal: number;
    }[];
  }[];
};

// Função que calcula a soma de consumo das lojas
export function calcularSomaEnergia(lojas: Loja[] | null | undefined) {
  // 🔹 lista de prefixos ou lojas que serão somadas separadamente
  if (!lojas || lojas.length === 0) {
    return {
      totalEspacoRelogio: 0,
      totalArCondicionado: 0,
      totalGeral: 0,
    };
  }

  const grupoSeparado = [
    "Central Agua Gelada ( Chill 01 )",
    "Central Agua Gelada ( Chill 02 )",
    "Central Agua Gelada ( Bomba )",
    "Casa Máquinas",
    "Cag Nova ( Piso Tecnico )",
  ];

  // Inicializa os totais
  let totalEspacoRelogio = 0;
  let totalArCondicionado = 0;

  lojas?.forEach((loja) => {
    const consumoRef = loja.medidores[0]?.leituras[1]?.consumo_mensal || 0;

    if (grupoSeparado.includes(loja.nome_loja)) {
      // vai pro grupo separado
      totalArCondicionado += consumoRef;
    } else {
      // vai pro grupo principal
      totalEspacoRelogio += consumoRef;
    }
  });

  const totalGeral = totalEspacoRelogio + totalArCondicionado;

  const totalAreaComum =
    totalGeral - (totalEspacoRelogio + totalArCondicionado);

  return {
    totalEspacoRelogio,
    totalArCondicionado,
    totalAreaComum,
    totalGeral,
  };
}
