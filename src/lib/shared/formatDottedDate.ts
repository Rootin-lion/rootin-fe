export function formatDottedDate(date: string) {
  return date.slice(0, 10).replaceAll("-", ".");
}
