import InterviewResultFeedback from "@/components/interviews/result/InterviewResultFeedback";
import InterviewResultOverall from "@/components/interviews/result/InterviewResultOverall";

export default function InterviewResultPage() {
  return (
    <div className="mx-auto mt-10 flex w-full max-w-5xl flex-col gap-6 rounded-xl border border-[#F0F0F0] bg-white px-21 py-11">
      <div>
        <h1 className="text-gradient-primary w-fit text-[30px] font-semibold">
          AI 면접 결과
        </h1>
        <p className="text-body-3 text-text mt-3">
          운영체제 | 3문항 | 2026.05.27
        </p>
      </div>

      <InterviewResultOverall />
      <InterviewResultFeedback />
    </div>
  );
}
