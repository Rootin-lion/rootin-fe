import Button from "../shared/Button";

export default function ContestResultCard() {
  return (
    <div className="border-primary flex w-full max-w-102 flex-col gap-9 rounded-lg border px-8 py-7">
      <div className="flex justify-between">
        <p className="text-text text-[16px] font-semibold">2026.05.27(수)</p>
        <p className="text-text text-[12px] font-medium">10문제 · 30분</p>
      </div>
      <div className="flex justify-between">
        <p className="text-disabled-text text-[12px] font-semibold">
          234명이 참가했어요
        </p>
        <div>
          <Button disabled={true} isActive={true}>
            결과 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
