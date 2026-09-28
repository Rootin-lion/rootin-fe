import { cookies } from "next/headers";
import ProblemResultContent from "@/components/competition/result/ProblemResultContent";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import type { AuthSession } from "@/types/oauth/oauth";

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
