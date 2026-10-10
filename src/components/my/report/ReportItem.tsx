import Image from "next/image";
import Link from "next/link";
import ChartIcon from "@/assets/my/report/chart.png";
import ChevronRightIcon from "@/assets/my/dashboard/chevron-right.svg";
import { CATEGORY_LABEL } from "@/constants/shared/category";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";
import type { MyReportSummary } from "@/types/my/report";

export default function ReportItem({ report }: { report: MyReportSummary }) {
  return (
    <div className="flex flex-row items-center justify-between rounded-xl border border-[#E1E1E1] py-4 pr-9 pl-5">
      <div className="flex w-full flex-row items-start gap-2">
        <div className="text-primary-900 shrink-0 rounded-xl bg-[#EEF6E8] px-2 py-1 text-[11px] font-semibold">
          {CATEGORY_LABEL[report.category]}
        </div>
        <div>
          <h3 className="text-text text-[16px] font-semibold">
            {report.title}
          </h3>
          <div className="flex flex-row items-center gap-2">
            <p className="text-caption text-text">
              {report.interviewMode === "TEXT" ? "텍스트" : "음성"} 면접 |{" "}
              {report.questionCount}문항 |{" "}
              {formatDottedDate(report.completedAt)}
            </p>
            <div className="bg-primary-100 flex flex-row items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold text-[#6C6A6A]">
              <Image src={ChartIcon} alt="" className="h-3 w-3" />
              평균 정확도 {report.averageAccuracy}%
            </div>
          </div>
          <p className="text-sub-text max-w-165 text-[12px] font-medium whitespace-pre-wrap">
            {report.overallFeedback}
          </p>
        </div>
      </div>
      <Link
        href={`/interviews/${report.interviewId}/result`}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-[#999999]"
      >
        <ChevronRightIcon className="h-4 w-2.5" />
      </Link>
    </div>
  );
}
