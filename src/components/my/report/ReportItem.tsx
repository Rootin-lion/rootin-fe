import Image from "next/image";
import Link from "next/link";
import ChevronIcon from "@/assets/icons/shared/chevron.svg";
import ChartIcon from "@/assets/icons/my/report/chart.png";
import type { MyReportSummary } from "@/types/my/report";
import { CATEGORY_LABEL } from "@/constants/shared/category";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";

export default function ReportItem({ report }: { report: MyReportSummary }) {
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5 rounded-xl border border-[#E1E1E1] bg-white p-2.5 md:grid-cols-[auto_minmax(0,1fr)_32px] md:gap-0 md:py-4 md:pr-9 md:pl-5">
      <div className="text-primary-900 col-start-1 row-start-1 justify-self-start rounded-xl bg-[#EEF6E8] px-2 py-1 text-[10px] font-semibold md:mr-2 md:self-start md:text-[11px]">
        {CATEGORY_LABEL[report.category]}
      </div>
      <div className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
        <h3 className="text-text text-[13px] font-semibold [overflow-wrap:anywhere] md:text-[16px]">
          {report.title}
        </h3>
        <div className="mt-1 flex flex-col items-start gap-1 md:mt-0 md:flex-row md:flex-wrap md:items-center md:gap-2">
          <p className="md:text-caption text-text text-[11px] [overflow-wrap:anywhere]">
            {report.interviewMode === "TEXT" ? "텍스트" : "음성"} 면접 |{" "}
            {report.questionCount}문항 | {formatDottedDate(report.completedAt)}
          </p>
          <div className="bg-primary-100 flex items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold text-[#6C6A6A]">
            <Image src={ChartIcon} alt="" className="size-3 shrink-0" />
            평균 정확도 {report.averageAccuracy}%
          </div>
        </div>
        <p className="text-sub-text mt-1 max-w-165 text-[11px] leading-relaxed font-medium [overflow-wrap:anywhere] whitespace-pre-wrap md:mt-0 md:text-[12px] md:leading-normal">
          {report.overallFeedback}
        </p>
      </div>
      <Link
        href={`/interviews/${report.interviewId}/result`}
        aria-label={`${report.title} 리포트 보기`}
        className="text-primary-900 focus-visible:outline-primary col-start-2 row-start-1 flex min-h-7 items-center justify-center rounded-lg px-1 text-[11px] font-medium focus-visible:outline-2 md:col-start-3 md:size-8 md:min-h-0 md:px-0 md:text-[#999999]"
      >
        <span className="md:hidden">자세히 보기</span>
        <ChevronIcon
          aria-hidden="true"
          strokeWidth={2.5}
          className="hidden h-4 w-2.5 md:block"
        />
      </Link>
    </div>
  );
}
