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
  const weekCount = days.length / 7;
  const hasActivity = days.some(
    (date) => date && (activityByDate[date] ?? 0) > 0,
  );
  const levelLabels = ["0문제", "1~2문제", "3~4문제", "5문제 이상"];

  return (
    <section className="border-primary-200 w-full min-w-0 rounded-[22px] border p-3 lg:mt-6 lg:h-75.5 lg:max-w-148.75 lg:px-5 lg:pt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:mb-6">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a]">나의 잔디</h2>
        <div
          className="flex flex-wrap items-center gap-2"
          aria-label="풀이 수 범례"
        >
          {LEVEL_COLORS.map((color, level) => (
            <span
              key={level}
              className="text-sub-text flex items-center gap-1 text-[10px]"
              title={levelLabels[level]}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full lg:h-4 lg:w-4 ${color}`}
              />
              <span className="lg:sr-only">{levelLabels[level]}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-[12px_minmax(0,1fr)] gap-x-1.5 lg:gap-x-3 lg:pl-1">
        <div className="text-sub-text grid grid-rows-7 gap-0.5 lg:gap-1">
          {WEEKDAYS.map((weekday) => (
            <span
              key={weekday}
              className="flex min-h-0 items-center justify-center text-[10px] leading-none lg:text-sm"
            >
              {weekday}
            </span>
          ))}
        </div>
        <div
          className="grid w-full grid-flow-col grid-rows-7 gap-0.5 lg:gap-1"
          style={{
            gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))`,
            maxWidth: `${weekCount * 20 + (weekCount - 1) * 4}px`,
          }}
        >
          {days.map((date, index) => {
            if (!date) {
              return (
                <span
                  key={`empty-${index}`}
                  className="aspect-square w-full max-w-5"
                />
              );
            }

            const count = Math.max(0, activityByDate[date] ?? 0);
            const label = `${date} · ${count}문제 풀이`;

            return (
              <time
                key={date}
                dateTime={date}
                title={label}
                className={`aspect-square w-full max-w-5 rounded-[2px] lg:rounded-md ${LEVEL_COLORS[getActivityLevel(count)]}`}
              >
                <span className="sr-only">{label}</span>
              </time>
            );
          })}
        </div>
      </div>
      {!hasActivity && (
        <p className="text-sub-text mt-3 text-[11px]">
          아직 학습 기록이 없습니다.
        </p>
      )}
    </section>
  );
}
