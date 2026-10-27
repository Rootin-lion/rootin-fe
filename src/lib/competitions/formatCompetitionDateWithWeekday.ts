import { formatDottedDate } from "@/lib/shared/formatDottedDate";

export function formatCompetitionDateWithWeekday(date: string) {
  const dottedDate = formatDottedDate(date);
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return dottedDate;

  const weekday = parsedDate.toLocaleDateString("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  });

  return `${dottedDate} (${weekday})`;
}
