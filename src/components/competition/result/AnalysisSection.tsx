import Image from "next/image";
import CorrectIcon from "@/assets/icons/competitions/result/correct.png";
import StrengthIcon from "@/assets/icons/competitions/result/strength.png";
import WeaknessIcon from "@/assets/icons/competitions/result/weakness.png";
import DetailWrapper from "./DetailWrapper";

type CardType = "STRENGTH" | "WEAKNESS" | "CORRECT";

interface AnalysisCardWrapperProps {
  type: CardType;
  items?: string[];
  accuracy?: number;
  topPercent?: number;
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
  accuracy,
  topPercent,
}: AnalysisCardWrapperProps) => {
  const itemLabels = items.map((item) => CATEGORY_LABELS[item] ?? item);

  return (
    <div className="min-w-0 flex-1 rounded-[14px] bg-green-50 p-3 lg:px-4 lg:pt-3 lg:pb-4">
      <p className="text-sub-text text-[12px] font-bold">
        {CARD_TYPE[type].title}
      </p>
      <div className="mt-1 flex items-center justify-start gap-3 md:flex-col md:items-start lg:flex-row lg:items-center lg:gap-4">
        <div
          className={`${CARD_TYPE[type].bg} flex h-8 w-8 shrink-0 items-center justify-center rounded-full lg:h-10 lg:w-10`}
        >
          <Image
            src={CARD_TYPE[type].icon}
            alt=""
            className="h-5 w-5 lg:h-6 lg:w-6"
          />
        </div>
        <p className="min-w-0 text-[12px] font-semibold [overflow-wrap:anywhere] text-[#6A6A6A] lg:text-[13px]">
          {type === "CORRECT"
            ? `${accuracy}% (상위 ${topPercent}%)`
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
  accuracy,
  topPercent,
}: {
  strongCategories: string[];
  weakCategories: string[];
  accuracy: number;
  topPercent: number;
}) {
  return (
    <DetailWrapper>
      <h2 className="px-4 pt-4 text-[14px] font-semibold text-black lg:px-8 lg:text-[16px]">
        개인 분석
      </h2>
      <div className="flex flex-col gap-3 p-4 md:flex-row lg:gap-7.5 lg:px-8">
        <AnalysisCardWrapper type="STRENGTH" items={strongCategories} />
        <AnalysisCardWrapper type="WEAKNESS" items={weakCategories} />
        <AnalysisCardWrapper
          type="CORRECT"
          accuracy={accuracy}
          topPercent={topPercent}
        />
      </div>
    </DetailWrapper>
  );
}
