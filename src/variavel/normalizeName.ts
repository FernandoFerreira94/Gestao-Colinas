export const normalizeName = (name: string): string => {
  if (!name) return "";

  const wordsToExclude = ["de", "da", "do", "dos", "das"];

  // Converte a string para minúsculas e divide em palavras
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (wordsToExclude.includes(word)) {
        return word;
      }
      // Caso contrário, retorna a primeira letra maiúscula e o resto da palavra
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" "); // Junta as palavras novamente em uma string
};
