import DetailWrapper from "./DetailWarpper";
import StrengthIcon from "../../../assets/contests/result/strength.png";
import WeaknessIcon from "../../../assets/contests/result/weakness.png";
import CorrectIcon from "../../../assets/contests/result/correct.png";
import Image from "next/image";

interface AnalysisCardWrapperProps {
  type: "STRENGTH" | "WEAKNESS" | "CORRECT";
}

const CARD_TYPE = {
  STRENGTH: { icon: StrengthIcon, title: "강점 영역", bg: "bg-primary-100" },
  WEAKNESS: { icon: WeaknessIcon, title: "취약 영역", bg: "bg-[#F24E4E_18]" },
  CORRECT: { icon: CorrectIcon, title: "정답률", bg: "bg-primary-100" },
};

const AnalysisCardWrapper = ({ type }: AnalysisCardWrapperProps) => {
  return (
    <div className="rounded-[14px] bg-gray-50">
      <p className="text-sub-text text-[12px] font-bold">
        {CARD_TYPE[type].title}
      </p>
      <div className="mt-1 flex items-center justify-center gap-4">
        <div className={`${CARD_TYPE[type].bg} rounded-[50%] p-2`}>
          <Image src={CARD_TYPE[type].icon} alt={type} className="h-6 w-6" />
        </div>
        <p className="text-[13px] font-semibold text-[#6A6A6A]">
          네트워크, 운영체제
        </p>
      </div>
    </div>
  );
};

export default function AnalysisSection() {
  return (
    <DetailWrapper>
      <p className="text-[16px] font-semibold text-black">개인 분석</p>
      <div className="flex gap-7.5">
        <AnalysisCardWrapper type="STRENGTH" />
        <AnalysisCardWrapper type="WEAKNESS" />
        <AnalysisCardWrapper type="CORRECT" />
      </div>
    </DetailWrapper>
  );
}
