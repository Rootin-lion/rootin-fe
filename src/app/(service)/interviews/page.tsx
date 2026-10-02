import type { Metadata } from "next";
import InterviewContent from "@/components/interviews/InterviewContent";

export const metadata: Metadata = {
  title: "AI 모의 면접 | ROOTIN",
  description: "면접 분야와 방식을 선택하고 AI 모의 면접을 시작하세요.",
};

export default function InterviewPage() {
  return <InterviewContent />;
}
