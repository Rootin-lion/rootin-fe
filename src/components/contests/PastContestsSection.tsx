import BoxWrapper from "../shared/BoxWrapper";
import ContestResultCard from "./ContestResultCard";
import SectionTitle from "./SectionTitle";

const Bar = ({ isActive }: { isActive?: boolean }) => {
  const wdtStyle = isActive ? "w-8" : "w-5";
  const bgStyle = isActive ? "bg-primary" : "bg-[#D9D9D9]";
  return (
    <div
      className={`h-2 w-5 rounded-lg ${wdtStyle} ${bgStyle} cursor-pointer`}
    />
  );
};

export default function PastContestsSection() {
  return (
    <BoxWrapper>
      <div className="flex flex-col px-6">
        <SectionTitle
          title="종료된 대회"
          content="이전 대회의 결과를 확인해보세요."
          isRanking={true}
        />
        <div className="mt-7 flex w-full justify-center">
          <div className="grid w-full max-w-210 grid-cols-2 justify-items-center gap-6">
            <ContestResultCard isDisabled={false} />
            <ContestResultCard isDisabled={true} />
            <ContestResultCard isDisabled={false} />
            <ContestResultCard isDisabled={false} />
          </div>
        </div>
        <div className="mt-9 flex justify-center gap-2">
          <Bar isActive={true} />
          <Bar />
          <Bar />
          <Bar />
        </div>
      </div>
    </BoxWrapper>
  );
}
