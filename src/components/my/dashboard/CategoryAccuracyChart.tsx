"use client";

import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { CategoryAccuraciesState } from "@/types/my/dashboard";
import type { CategoryType } from "@/types/shared/category";
import { CATEGORY_LABEL } from "@/constants/shared/category";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const AXES = [
  "OPERATING_SYSTEM",
  "DATABASE",
  "NETWORK",
  "JAVA_SPRING",
  "DATA_STRUCTURE_ALGORITHM",
  "INFRA_CLOUD",
] as const satisfies readonly CategoryType[];

const CHART_LABELS: Partial<Record<CategoryType, string | string[]>> = {
  OPERATING_SYSTEM: "OS",
  DATABASE: "DB",
  JAVA_SPRING: ["자바/", "스프링"],
  DATA_STRUCTURE_ALGORITHM: ["알고리즘/", "자료구조"],
};

function themeColor(variable: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim() || fallback
  );
}

export default function CategoryAccuracyChart({
  categoryAccuracies,
}: {
  categoryAccuracies?: CategoryAccuraciesState[] | null;
}) {
  const primary = themeColor("--color-primary", "#51a05c");
  const primary100 = themeColor("--color-primary-100", "#eaf3e8");
  const primary200 = themeColor("--color-primary-200", "#daebd9");
  const subText = themeColor("--color-sub-text", "#6b7280");
  const rates = AXES.map((category) => {
    const value = categoryAccuracies?.find(
      (item) => item.category === category,
    )?.accuracyRate;
    return typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(100, value))
      : null;
  });
  const hasData = rates.some((rate) => rate !== null);

  const data = {
    labels: AXES.map(
      (category) => CHART_LABELS[category] ?? CATEGORY_LABEL[category],
    ),
    datasets: [
      {
        label: "정답률",
        data: rates.map((rate) => rate ?? 0),
        fill: true,
        backgroundColor: primary100,
        borderColor: primary,
        borderWidth: 2,
        pointBackgroundColor: primary,
        pointBorderColor: primary,
        pointRadius: 3,
        pointHoverRadius: 4,
      },
    ],
  };

  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.formattedValue}%`,
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false, stepSize: 25 },
        grid: { color: primary200 },
        angleLines: { color: primary200 },
        pointLabels: {
          color: subText,
          font: { size: 10, family: "Pretendard, sans-serif" },
          padding: 3,
        },
      },
    },
  };

  return (
    <section className="border-primary-200 w-full min-w-0 rounded-[22px] border p-3 lg:mt-6 lg:h-75.5 lg:max-w-60.25 lg:shrink-0 lg:px-4 lg:pt-5 lg:pb-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[14px] font-semibold text-[#1a1a1a]">
          분야별 정답률
        </h2>
      </div>
      <div className="relative mx-auto mt-2 h-60 w-full max-w-80">
        <Radar
          data={data}
          options={options}
          role="img"
          aria-label="분야별 정답률 레이더 차트. 정확한 수치는 다음 목록에서 확인할 수 있습니다."
        />
      </div>
      {!hasData && (
        <p className="text-sub-text mt-2 text-[11px] lg:sr-only">
          아직 분야별 학습 기록이 없습니다.
        </p>
      )}
      <dl className="text-sub-text mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] lg:sr-only">
        {AXES.map((category, index) => (
          <div
            key={category}
            className="flex min-w-0 flex-wrap justify-between gap-x-2"
          >
            <dt className="min-w-0 [overflow-wrap:anywhere]">
              {CATEGORY_LABEL[category]}
            </dt>
            <dd>{rates[index] === null ? "기록 없음" : `${rates[index]}%`}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
