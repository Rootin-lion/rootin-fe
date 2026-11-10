import Image from "next/image";
import UpIcon from "@/assets/icons/competitions/result/rank-up.png";
import DownIcon from "@/assets/icons/competitions/result/rank-down.png";
import SectionTitle from "./SectionTitle";
import SelectedNumber from "./SelectedNumber";
import { CompetitionResultState } from "@/types/competitions/competition";

export default function RankSection({
  competitionResult,
}: {
  competitionResult: CompetitionResultState;
}) {
  const rankChange = competitionResult.rankChange;

  return (
    <section className="col-start-2 row-start-1 w-full min-w-0 md:mt-8">
      <SectionTitle>내 순위</SectionTitle>
      <div className="flex flex-wrap items-end justify-between gap-x-1">
        <SelectedNumber>{competitionResult.myRank}위</SelectedNumber>
        {rankChange !== null && (
          <div className="mb-2 flex h-3.75 w-7.5 items-center justify-center gap-1 rounded-[10px] bg-[#F0F0F0] text-[8px] font-semibold">
            <Image
              src={rankChange > 0 ? UpIcon : DownIcon}
              alt={rankChange > 0 ? "up" : "down"}
              className="h-1.5 w-1.5"
            />
            {rankChange}
          </div>
        )}
      </div>
    </section>
  );
}
