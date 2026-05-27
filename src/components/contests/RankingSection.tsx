import Image from "next/image";
import BoxWrapper from "../shared/BoxWrapper";
import RankingBoxWrapper from "./RankingBoxWrapper";
import CharImg from "../../assets/success_char.png";
import CrownImg from "../../assets/crown.png";

export default function RankingSection() {
  return (
    <BoxWrapper>
      <div className="flex flex-col">
        <div>
          <p className="text-text font-bold text-[20px]">CS 랭킹 TOP 3</p>
          <p className="text-[12px] font-medium text-sub-text">
            실력을 증명한 최고의 참가자들이에요!
          </p>
        </div>
        <div className="flex items-end gap-15 justify-center">
          <RankingBoxWrapper
            type="Silver"
            className="max-w-5xl relative flex items-center justify-center rounded-lg w-50 h-50 border border-[#a87d7d] bg-[#fdf9f6]"
          >
            <div>
              <Image src={CharImg} alt="char" width={38} height={40} />
            </div>
          </RankingBoxWrapper>
          <RankingBoxWrapper
            type="Gold"
            className="max-w-5xl relative flex items-center justify-center rounded-lg w-62.5 h-62.5 border border-warring bg-[#FFFCF6]"
          >
            <div className="text-text text-center gap-6 flex flex-col">
              <div className="relative">
                <Image
                  src={CrownImg}
                  width={40}
                  height={40}
                  alt="crown"
                  className="absolute -top-8 right-3"
                />
                <Image
                  src={CharImg}
                  alt="char"
                  width={65}
                  height={70}
                  className="bg-[#FFB84D30] rounded-[50px] py-1 px-2"
                />
              </div>
              <p className="text-[20px] font-semibold">안녕</p>
              <p className="text-[16px] font-semibold">1328점</p>
            </div>
          </RankingBoxWrapper>
          <RankingBoxWrapper
            type="Dong"
            className="max-w-5xl relative flex items-center justify-center rounded-lg w-50 h-50 border border-[#a87d7d] bg-[#fdf9f6]"
          >
            <div>
              <Image src={CharImg} alt="char" width={38} height={40} />
            </div>
          </RankingBoxWrapper>
        </div>
      </div>
    </BoxWrapper>
  );
}
