// Capitaliza as palavras de uma string
export function capitalizeWords({ str }: { str: string }): string {
  if (!str) return "";

  const wordsToExclude = [
    "de",
    "da",
    "e",
    "do",
    "dos",
    "das",
    "a",
    "o",
    "em",
    "para",
  ];

  return str
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index > 0 && wordsToExclude.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
