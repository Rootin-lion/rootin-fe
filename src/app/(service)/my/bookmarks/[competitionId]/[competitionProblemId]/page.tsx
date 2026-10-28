import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookmarkProblemContent from "@/components/my/bookmark/BookmarkProblemContent";

export const metadata: Metadata = {
  title: "북마크한 CS 대회 문제 | ROOTIN",
  description: "북마크한 CS 대회 문제를 확인하세요.",
  robots: { index: false },
};

export default async function BookmarkProblemPage(
  props: PageProps<"/my/bookmarks/[competitionId]/[competitionProblemId]">,
) {
  const { competitionId, competitionProblemId } = await props.params;
  const competitionIdNumber = Number(competitionId);
  const competitionProblemIdNumber = Number(competitionProblemId);

  if (
    !Number.isSafeInteger(competitionIdNumber) ||
    competitionIdNumber <= 0 ||
    !Number.isSafeInteger(competitionProblemIdNumber) ||
    competitionProblemIdNumber <= 0
  ) {
    notFound();
  }

  return (
    <BookmarkProblemContent
      competitionId={competitionIdNumber}
      competitionProblemId={competitionProblemIdNumber}
    />
  );
}
