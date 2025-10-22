export function getPercentualClass(percentual: number): string {
  if (percentual > 20 || percentual === 0) {
    return "text-red-600 bg-red-200/40 dark:text-red-200 dark:bg-red-600/40";
  } else if (percentual < -20) {
    return "text-yellow-600 bg-yellow-200/40 dark:text-yellow-200 dark:bg-yellow-600/40";
  } else {
    return "text-green-600 bg-green-200/40 dark:text-green-200 dark:bg-green-600/40";
  }
}
