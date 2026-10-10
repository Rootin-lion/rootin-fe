import { notFound } from "next/navigation";
import type { Metadata } from "next";
import InterviewReportLoading from "@/components/interviews/result/InterviewReportLoading";

export const metadata: Metadata = {
  title: "면접 결과 생성 중 | ROOTIN",
  description: "면접 답변을 분석하고 결과를 준비하고 있습니다.",
  robots: { index: false },
};

export default async function TransitionPage(props: PageProps<"/transition">) {
  const { flow, interviewId } = await props.searchParams;
  const id = typeof interviewId === "string" ? Number(interviewId) : NaN;

  if (flow !== "interview-report" || !Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return <InterviewReportLoading key={id} interviewId={id} />;
}
