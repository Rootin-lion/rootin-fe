import { SectionWrapper } from "../SectionWrapper";
import { AnimatedNumber } from "./AnimatedNumber";

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

const gradientTextStyle = {
  background: "linear-gradient(90deg, #36723E 30%, #1F2937 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
} as const;

function StatCard({ item }: { item: StatItem }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="typo-subtitle text-text">{item.title}</p>
      <p className="text-[30px] font-extrabold" style={gradientTextStyle}>
        <AnimatedNumber value={item.value} />
      </p>
    </div>
  );
}

export function StatusSection() {
  return (
    <SectionWrapper variant={"ivory"}>
      <div className="relative flex h-full w-full max-w-360 flex-col items-center overflow-hidden px-6 pt-24">
        <div className="pointer-events-none absolute top-56 left-1/2 h-230 w-400 -translate-x-1/2 rounded-[50%] bg-[linear-gradient(180deg,#EAF3E8_0%,#FCFDF9_25.48%)]" />

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <p className="typo-title-2 text-text">함께 만들어가는 성장의 결과</p>
          <p className="text-disabled-text text-[24px] font-medium">
            <span className="text-primary-900">ROOTIN</span>과 함께한 개발자들의
            놀라운 기록을 확인해보세요.
          </p>
        </div>

        <div className="relative z-10 mt-24 grid w-full max-w-180 grid-cols-2 gap-x-32 gap-y-24">
          {STATS_DATA.map((stat) => (
            <StatCard key={stat.id} item={stat} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
