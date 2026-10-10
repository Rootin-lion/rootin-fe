const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = 4;
const HALF_MONTH_DAYS = 15;
const EXTRA_WEEK_DAYS = 7;
const LEVEL_COLORS = [
  "bg-primary-100",
  "bg-primary-300",
  "bg-primary-600",
  "bg-primary-900",
];

function getActivityLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  return 3;
}

function getCalendarDays(today: string) {
  const [year, month, day] = today.split(".").map(Number);
  const end = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(end);

  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - MONTHS);
  const lastDayOfStartMonth = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0),
  ).getUTCDate();
  start.setUTCDate(Math.min(day, lastDayOfStartMonth));
  start.setUTCDate(start.getUTCDate() - HALF_MONTH_DAYS - EXTRA_WEEK_DAYS);

  const firstWeekday = start.getUTCDay();
  const lastWeekday = end.getUTCDay();
  const firstCell = new Date(start);
  firstCell.setUTCDate(firstCell.getUTCDate() - firstWeekday);
  const lastCell = new Date(end);
  lastCell.setUTCDate(lastCell.getUTCDate() + 6 - lastWeekday);

  const days: Array<string | null> = [];

  for (
    const date = new Date(firstCell);
    date <= lastCell;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    days.push(
      date < start || date > end ? null : date.toISOString().slice(0, 10),
    );
  }

  return days;
}

export default function DashboardGrass({
  today,
  activityByDate = {},
}: {
  today: string;
  activityByDate?: Record<string, number>;
}) {
  const days = getCalendarDays(today);

  return (
    <section className="border-primary-200 mt-6 h-75.5 w-full max-w-148.75 rounded-[22px] border px-5 pt-5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a]">나의 잔디</h2>
        <div className="flex items-center gap-2">
          {LEVEL_COLORS.map((color, level) => (
            <span key={level} className={`h-4 w-4 rounded-full ${color}`} />
          ))}
        </div>
      </div>

      <div className="flex gap-3 pl-1">
        <div className="text-sub-text grid shrink-0 grid-rows-7 gap-1">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="flex h-5 items-center justify-center text-sm"
            >
              {weekday}
            </span>
          ))}
        </div>
        <div className="grid w-max grid-flow-col grid-rows-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} className="h-5 w-5" />;
            }

            const count = Math.max(0, activityByDate[date] ?? 0);
            const label = `${date} · ${count}문제 풀이`;

            return (
              <time
                key={date}
                dateTime={date}
                title={label}
                className={`h-5 w-5 rounded-md ${LEVEL_COLORS[getActivityLevel(count)]}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
