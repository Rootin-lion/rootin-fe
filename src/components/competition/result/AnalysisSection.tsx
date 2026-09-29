import Image from "next/image";
import StrengthIcon from "@/assets/competitions/result/strength.png";
import WeaknessIcon from "@/assets/competitions/result/weakness.png";
import CorrectIcon from "@/assets/competitions/result/correct.png";
import DetailWrapper from "./DetailWrapper";

type CardType = "STRENGTH" | "WEAKNESS" | "CORRECT";

interface AnalysisCardWrapperProps {
  type: CardType;
  items?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  NETWORK: "네트워크",
  DATABASE: "데이터베이스",
  INFRA_CLOUD: "인프라",
  DATA_STRUCTURE_ALGORITHM: "자료구조/알고리즘",
  JAVA_SPRING: "자바/스프링",
  OPERATING_SYSTEM: "운영체제",
};

const CARD_TYPE = {
  STRENGTH: { icon: StrengthIcon, title: "강점 영역", bg: "bg-primary-100" },
  WEAKNESS: { icon: WeaknessIcon, title: "취약 영역", bg: "bg-[#F24E4E18]" },
  CORRECT: { icon: CorrectIcon, title: "정답률", bg: "bg-primary-100" },
};

const AnalysisCardWrapper = ({
  type,
  items = [],
}: AnalysisCardWrapperProps) => {
  const itemLabels = items.map((item) => CATEGORY_LABELS[item] ?? item);

  return (
    <div className="w-55.5 rounded-[14px] bg-green-50 px-4 pt-3 pb-4">
      <p className="text-sub-text text-[12px] font-bold">
        {CARD_TYPE[type].title}
      </p>
      <div className="mt-1 flex items-center justify-start gap-4">
        <div
          className={`${CARD_TYPE[type].bg} flex h-10 w-10 shrink-0 items-center justify-center rounded-[50%]`}
        >
          <Image src={CARD_TYPE[type].icon} alt={type} className="h-6 w-6" />
        </div>
        <p className="text-[13px] font-semibold text-[#6A6A6A]">
          {type === "CORRECT"
            ? "80% (상위 20%)"
            : itemLabels.length > 0
              ? itemLabels.join(", ")
              : "-"}
        </p>
      </div>
    </div>
  );
};

export default function AnalysisSection({
  strongCategories,
  weakCategories,
}: {
  strongCategories: string[];
  weakCategories: string[];
}) {
  return (
    <DetailWrapper>
      <p className="pt-4 pl-8 text-[16px] font-semibold text-black">
        개인 분석
      </p>
      <div className="flex justify-center gap-7.5 py-4">
        <AnalysisCardWrapper type="STRENGTH" items={strongCategories} />
        <AnalysisCardWrapper type="WEAKNESS" items={weakCategories} />
        <AnalysisCardWrapper type="CORRECT" />
      </div>
    </DetailWrapper>
  );
}
