import SectionTitle from "./SectionTitle";
import SelectedNumber from "./SelectedNumber";
import UpIcon from "../../../assets/contests/result/up.png";
import Image from "next/image";
// import DownIcon from "../../../assets/contests/result/down.png";

export default function RankSection() {
  return (
    <section className="mt-8 w-full">
      <SectionTitle>내 순위</SectionTitle>
      <div className="flex items-end justify-between">
        <SelectedNumber>13위</SelectedNumber>
        <div className="mb-2 flex h-3.75 w-7.5 items-center justify-center gap-1 rounded-[10px] bg-[#F0F0F0] text-[8px] font-semibold">
          <Image src={UpIcon} alt="up" className="h-1.5 w-1.5" />5
        </div>
      </div>
    </section>
  );
}
