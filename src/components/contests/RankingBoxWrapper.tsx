import Image from "next/image";
import Gold from "../../assets/medal_gold.png";
import Silver from "../../assets/medal_silver.png";
import Dong from "../../assets/medal_dong.png";

type RankingType = "Gold" | "Silver" | "Dong";

const medalMap = {
  Gold: { src: Gold, width: 45, height: 45 },
  Silver: { src: Silver, width: 35, height: 35 },
  Dong: { src: Dong, width: 35, height: 35 },
};

export default function RankingBoxWrapper({
  children,
  className,
  type,
}: {
  children: React.ReactNode;
  className: string;
  type: RankingType;
}) {
  return (
    <div className={className}>
      <Image
        src={medalMap[type].src}
        width={medalMap[type].width}
        height={medalMap[type].height}
        alt="medal"
        className="absolute -top-0.75 left-3"
      />
      {children}
    </div>
  );
}
