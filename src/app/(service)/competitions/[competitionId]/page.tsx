import ProblemContent from "@/components/competition/problem/ProblemContent";

export default async function ProblemPage(
  props: PageProps<"/competitions/[competitionId]">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return <ProblemContent competitionId={competitionIdNumber} />;
}
