import QuestionContent from "@/components/contests/solve/QuestionContent";

export default async function ContestSolvePage(
  props: PageProps<"/contests/[competitionId]">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return <QuestionContent competitionId={competitionIdNumber} />;
}
