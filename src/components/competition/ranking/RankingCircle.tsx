import Image from "next/image";
import CrownImg from "@/assets/crown.png";
import CharImg from "@/assets/success_char.png";

type RankingType = "Gold" | "Silver" | "Dong";

interface RankingCircleProps {
  type: RankingType;
  img: string | null;
}

const rankingCircleType = {
  Gold: {
    circleStyle:
      "w-20 h-20 md:w-32 md:h-32 lg:w-41 lg:h-41 bg-[linear-gradient(180deg,#F7F3EE_0%,#FAE3BF_100%)]",
    width: 113,
    heigth: 118,
    number: 1,
    numberStyle: "w-6 h-6 lg:w-8 lg:h-8 bg-[#FFB84D] text-[16px] font-bold",
  },
  Silver: {
    circleStyle:
      "w-16 h-16 md:w-28 md:h-28 lg:w-34 lg:h-34 bg-[linear-gradient(180deg,#EAEAEA_0%,#9CA3AF_100%)]",
    width: 98,
    heigth: 103,
    number: 2,
    numberStyle: "w-6 h-6 bg-sub-text text-[14px] font-semibold",
  },
  Dong: {
    circleStyle:
      "w-16 h-16 md:w-28 md:h-28 lg:w-34 lg:h-34 bg-[linear-gradient(180.14deg,#EBE8E8_0.12%,#A87D7D_130.54%)]",
    width: 98,
    heigth: 103,
    number: 3,
    numberStyle: "w-6 h-6 bg-[#A87D7D] text-[14px] font-semibold",
  },
};

export default function RankingCircle({ type, img }: RankingCircleProps) {
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
          className="absolute -top-4 h-auto w-7 lg:-top-5 lg:w-10"
        />
      )}
      <Image
        src={img ? img : CharImg}
        alt="char"
        width={rankingCircleType[type].width}
        height={rankingCircleType[type].heigth}
        className="h-auto max-h-full w-3/4 rounded-[50%] object-contain px-2 py-1 lg:w-auto"
      />
      <div
        className={`text-bg-ivory absolute -bottom-3 flex ${rankingCircleType[type].numberStyle} items-center justify-center rounded-[50%]`}
      >
        {rankingCircleType[type].number}
      </div>
    </div>
  );
}
