import AnalysisSection from "./AnalysisSection";
import DetailBanner from "./DetailBanner";

export default function ResultDetailSide() {
  return (
    <div className="flex max-w-210.5 flex-1 flex-col gap-3">
      <DetailBanner />
      <AnalysisSection />
    </div>
  );
}
