import type { Metadata } from "next";
import InterviewResultContent from "@/components/interviews/result/InterviewResultContent";

export const metadata: Metadata = {
  title: "AI 면접 결과 | ROOTIN",
  description: "AI 면접 결과와 피드백을 확인하세요.",
  robots: { index: false },
};

export default async function InterviewResultPage(
  props: PageProps<"/interviews/[interviewId]/result">,
) {
  const { interviewId } = await props.params;
  const interviewIdNumber = Number(interviewId);

  return <InterviewResultContent interviewId={interviewIdNumber} />;
}
