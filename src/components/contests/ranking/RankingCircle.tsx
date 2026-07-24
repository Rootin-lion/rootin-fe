import Image from "next/image";
import CharImg from "../../../assets/success_char.png";
import CrownImg from "../../../assets/crown.png";

type RankingType = "Gold" | "Silver" | "Dong";

interface RankingCircleProps {
  type: RankingType;
}

const rankingCircleType = {
  Gold: {
    circleStyle:
      "w-41 h-41 bg-[linear-gradient(180deg,#F7F3EE_0%,#FAE3BF_100%)]",
    width: 113,
    heigth: 118,
    number: 1,
    numberStyle: "w-8 h-8 bg-[#FFB84D] text-[16px] font-bold",
  },
  Silver: {
    circleStyle:
      "w-34 h-34 bg-[linear-gradient(180deg,#EAEAEA_0%,#9CA3AF_100%)]",
    width: 98,
    heigth: 103,
    number: 2,
    numberStyle: "w-6 h-6 bg-sub-text text-[14px] font-semibold",
  },
  Dong: {
    circleStyle:
      "w-34 h-34 bg-[linear-gradient(180.14deg,#EBE8E8_0.12%,#A87D7D_130.54%)]",
    width: 98,
    heigth: 103,
    number: 3,
    numberStyle: "w-6 h-6 bg-[#A87D7D] text-[14px] font-semibold",
  },
};

export default function RankingCircle({ type }: RankingCircleProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[50%] ${rankingCircleType[type].circleStyle} `}
    >
      {type === "Gold" && (
        <Image
          src={CrownImg}
          width={40}
          height={40}
          alt="crown"
          className="absolute -top-5"
        />
      )}
      <Image
        src={CharImg}
        alt="char"
        width={rankingCircleType[type].width}
        height={rankingCircleType[type].heigth}
        className="rounded-[50%] px-2 py-1"
      />
      <div
        className={`text-bg-ivory absolute -bottom-3 flex ${rankingCircleType[type].numberStyle} items-center justify-center rounded-[50%]`}
      >
        {rankingCircleType[type].number}
      </div>
    </div>
  );
}
