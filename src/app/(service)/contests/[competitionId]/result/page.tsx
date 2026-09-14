import ResultSummarySide from "@/components/contests/result/ResultSummarySide";
import ResultDetailSide from "@/components/contests/result/ResultDetailSide";

export default function ContestResultPage() {
  return (
    <div className="bg-primary-50 min-h-dvh w-full">
      <div className="mt-9 flex justify-center gap-5">
        <ResultSummarySide />
        <ResultDetailSide />
      </div>
    </div>
  );
}
