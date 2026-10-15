import { Metadata } from "next";
import { cookies } from "next/headers";
import type { AuthSession } from "@/types/oauth/oauth";
import type { InterviewCategoryType } from "@/types/interviews/interview";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import { INTERVIEW_CATEGORY_LABEL } from "@/constants/interviews/category";
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
  const raw = (await cookies()).get(MEMBER_SNAPSHOT_COOKIE)?.value;
  let profileImageUrl: string | null = null;

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

  if (raw) {
    try {
      profileImageUrl =
        (JSON.parse(raw) as AuthSession).member?.imgUrl?.trim() || null;
    } catch {
      profileImageUrl = null;
    }
  }

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
