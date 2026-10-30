import { Metadata } from "next";
import type { InterviewCategoryType } from "@/types/interviews/interview";
import { INTERVIEW_CATEGORY_LABEL } from "@/constants/interviews/category";
import { getMemberSnapshot } from "@/lib/auth/getMemberSnapshot";
import InterviewSessionContent from "@/components/interviews/session/InterviewSessionContent";

export const metadata: Metadata = {
  title: "AI 모의 면접 진행 | ROOTIN",
  description: "AI 면접관의 질문에 답하며 실전 면접을 연습하세요.",
};

export default async function InterviewSessionPage(
  props: PageProps<"/interviews/[interviewId]">,
) {
  const { interviewId } = await props.params;
  const { category, questionCount } = await props.searchParams;
  const interviewIdNumber = Number(interviewId);
  const member = await getMemberSnapshot();
  const profileImageUrl = member?.imgUrl?.trim() || null;

  const selectedCategory =
    typeof category === "string" &&
    Object.hasOwn(INTERVIEW_CATEGORY_LABEL, category)
      ? (category as InterviewCategoryType)
      : null;
  const categoryLabel = selectedCategory
    ? INTERVIEW_CATEGORY_LABEL[selectedCategory]
    : null;

  const count = typeof questionCount === "string" ? Number(questionCount) : NaN;
  const selectedQuestionCount =
    Number.isInteger(count) && count >= 1 && count <= 5 ? count : null;

  return (
    <InterviewSessionContent
      key={interviewId}
      interviewId={interviewIdNumber}
      profileImageUrl={profileImageUrl}
      category={categoryLabel}
      questionCount={selectedQuestionCount}
    />
  );
}
