export default function InterviewResultOverall() {
  const accuracy = 80;

  return (
    <div className="bg-primary-50 flex w-full max-w-214 flex-row gap-4 rounded-lg py-4">
      <div className="text-text flex flex-col items-center pr-5 pl-9 font-medium">
        <h3 className="text-[16px]">평균 정확도</h3>
        <p className="mt-2 text-[14px]">{accuracy}%</p>
        <div
          role="progressbar"
          aria-label="평균 정확도"
          aria-valuenow={accuracy}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-4 w-51.75 overflow-hidden rounded-full bg-[#E5E7EB]"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#6FB377_0%,#69AC70_50%,#36723E_100%)]"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      <div className="border-disabled-text h-25.75 w-0 border"></div>

      <div className="flex flex-col gap-2">
        <h3 className="text-primary-900 text-[16px] font-semibold">
          주요 피드백
        </h3>
        <ul className="text-text list-inside list-disc pl-1 text-[12px] font-normal">
          <li>
            전반적으로 핵심 CS 개념에 대한 이해도가 높으며 주요 용어를 적절히
            활용하였습니다.
          </li>
          <li>
            TCP 연결 과정과 데이터베이스 인덱스 구조에 대한 설명은 논리적이고
            정확했습니다.
          </li>
          <li>
            다만 프로세스와 스레드의 차이 설명에서 컨텍스트 스위칭 비용과 메모리
            구조에 대한 보충 설명이 필요합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
