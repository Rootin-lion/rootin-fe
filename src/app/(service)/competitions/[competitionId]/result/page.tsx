import ResultSummarySide from "@/components/competition/result/ResultSummarySide";
import ResultDetailSide from "@/components/competition/result/ResultDetailSide";

export default async function ProblemResultPage(
  props: PageProps<"/competitions/[competitionId]/result">,
) {
  const { competitionId } = await props.params;
  const competitionIdNumber = Number(competitionId);

  return (
    <div className="bg-primary-50 min-h-dvh w-full">
      <div className="mt-9 flex justify-center gap-5">
        <ResultSummarySide />
        <ResultDetailSide />
      </div>
    </div>
  );
}
