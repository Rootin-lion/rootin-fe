import { Metadata } from "next";
import { cookies } from "next/headers";
import type { AuthSession } from "@/types/oauth/oauth";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import ProblemResultContent from "@/components/competition/result/ProblemResultContent";

export const metadata: Metadata = {
  title: "CS 대회 결과 | ROOTIN",
  description: "CS 대회 점수와 문제별 결과를 확인하세요.",
  robots: { index: false },
};

export default async function ProblemResultPage(
  props: PageProps<"/competitions/[competitionId]/result">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);
  const rawMemberSnapshot = (await cookies()).get(
    MEMBER_SNAPSHOT_COOKIE,
  )?.value;
  let profileImageUrl: string | null = null;

  if (rawMemberSnapshot) {
    try {
      const { member } = JSON.parse(rawMemberSnapshot) as AuthSession;
      const imgUrl = member?.imgUrl?.trim();

      profileImageUrl = imgUrl || null;
    } catch {
      profileImageUrl = null;
    }
  }

  return (
    <div className="bg-primary-50 min-h-dvh w-full">
      <div className="mt-9 flex justify-center gap-5">
        <ProblemResultContent
          competitionId={competitionIdNumber}
          profileImageUrl={profileImageUrl}
        />
      </div>
    </div>
  );
}
