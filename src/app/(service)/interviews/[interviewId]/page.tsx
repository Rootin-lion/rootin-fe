import { Metadata } from "next";
import InterviewSessionContent from "@/components/interviews/session/InterviewSessionContent";

export const metadata: Metadata = {
  title: "AI 모의 면접 진행 | ROOTIN",
  description: "AI 면접관의 질문에 답하며 실전 면접을 연습하세요.",
};

export default async function InterviewSessionPage(
  props: PageProps<"/interviews/[interviewId]">,
) {
  const { interviewId } = await props.params;
  const interviewIdNumber = Number(interviewId);

  return <InterviewSessionContent interviewId={interviewIdNumber} />;
}
