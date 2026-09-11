import Image from "next/image";
import CharImg from "../../../assets/contests/result/char.png";
import ScoreSection from "./ScoreSection";
import RankSection from "./RankSection";

const Button = () => {
  return (
    <button className="bg-primary-900 mt-4 w-full cursor-pointer rounded-lg py-2 text-center text-[12px] font-semibold text-white">
      랭킹 보기
    </button>
  );
};

export default function ResultSummarySide() {
  return (
    <div className="flex min-w-37 flex-col items-center rounded-lg bg-white px-5 py-7">
      <div className="border-primary-300 flex h-20 w-20 flex-col items-center justify-center rounded-[50%] border">
        <Image src={CharImg} alt="char" width={73} height={80} />
      </div>
      <p className="mt-4 text-[15px] font-semibold">CS 대회 결과</p>
      <p className="mt-2 text-[12px] font-medium">2026.06.24 (수)</p>
      <ScoreSection />
      <RankSection />
      <Button />
    </div>
  );
}
