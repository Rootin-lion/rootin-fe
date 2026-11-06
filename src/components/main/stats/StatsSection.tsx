import SectionWrapper from "@/components/main/SectionWrapper";
import AnimatedNumber from "./AnimatedNumber";

interface StatItem {
  id: number;
  title: string;
  value: string;
}

const STATS_DATA: StatItem[] = [
  { id: 1, title: "참가자 수", value: "3,320+" },
  { id: 2, title: "진행된 대회", value: "8,350+" },
  { id: 3, title: "면접 참여", value: "1,024+" },
  { id: 4, title: "사용자 만족도", value: "98%" },
];

function StatCard({ item }: { item: StatItem }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 text-center max-md:py-2">
      <p className="typo-subtitle text-text max-md:text-[13px]">{item.title}</p>
      <p className="text-gradient-primary text-[24px] font-extrabold max-md:text-[26px] max-md:leading-tight max-md:font-bold max-md:tracking-tight max-md:tabular-nums lg:text-[30px]">
        <AnimatedNumber value={item.value} />
      </p>
    </div>
  );
}

export function StatsSection() {
  return (
    <SectionWrapper variant={"ivory"} className="max-md:px-0">
      <div className="relative flex w-full max-w-360 flex-col items-center overflow-hidden px-0 py-2 max-md:px-5 lg:px-6 lg:pt-24 lg:pb-20">
        <div className="pointer-events-none absolute top-32 left-1/2 h-full w-[180%] -translate-x-1/2 rounded-[50%] bg-[linear-gradient(180deg,#EAF3E8_0%,#FCFDF9_70%)] max-md:opacity-50 md:h-230 md:w-400 md:bg-[linear-gradient(180deg,#EAF3E8_0%,#FCFDF9_25.48%)] lg:top-56" />

        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <h2 className="typo-title-2 text-text max-md:text-[22px]">
            함께 만들어가는 성장의 결과
          </h2>
          <p className="text-disabled-text text-[13px] leading-relaxed font-medium max-md:break-keep md:text-[16px] lg:text-[24px]">
            <span className="text-primary-900">ROOTIN</span>과 함께한 개발자들의
            놀라운 기록을 확인해보세요.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid w-full max-w-180 grid-cols-2 gap-x-4 gap-y-8 max-md:gap-y-5 max-md:px-3 max-md:py-5 md:gap-x-12 lg:mt-24 lg:gap-x-32 lg:gap-y-24">
          {STATS_DATA.map((stat) => (
            <StatCard key={stat.id} item={stat} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
