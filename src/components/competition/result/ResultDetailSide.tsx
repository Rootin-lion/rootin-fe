import { CompetitionResultState } from "@/types/competitions/competition";
import AnalysisSection from "./AnalysisSection";
import DetailBanner from "./DetailBanner";
import ResultSection from "./ResultSection";

export default function ResultDetailSide({
  competitionId,
  competitionResult,
}: {
  competitionId: number;
  competitionResult: CompetitionResultState;
}) {
  return (
    <div className="flex max-w-210.5 flex-1 flex-col gap-3">
      <DetailBanner />
      <ResultSection
        competitionId={competitionId}
        competitionResult={competitionResult}
      />
      <AnalysisSection
        strongCategories={competitionResult.strongCategories}
        weakCategories={competitionResult.weakCategories}
      />
    </div>
  );
}
