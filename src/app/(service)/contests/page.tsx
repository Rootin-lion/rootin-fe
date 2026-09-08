import RankingSection from "@/components/contests/RankingSection";
import PastContestsSection from "@/components/contests/PastContestsSection";
import WarningBanner from "@/components/contests/WarningBanner";
import ContestCtaBanner from "@/components/contests/ContestCtaBanner";
import Banner from "@/components/contests/Banner";
// import ModalWrapper from "@/components/shared/ModalWrapper";
// import Button from "@/components/shared/Button";

export default function ContestPage() {
  return (
    <div className="bg-bg-green-50 flex w-full flex-col gap-6">
      {/* <ModalWrapper>
            <ModalWrapper.Box>
              <ModalWrapper.Title>대회에 참여하시겠습니까?</ModalWrapper.Title>
            </ModalWrapper.Box>
            <ModalWrapper.Notice>
              <div className="text-text text-[15px] font-semibold">
                대회 주의사항
              </div>
              <ul className="text-disabled-text mt-3 list-inside list-disc text-[13px] font-medium">
                <li>정답률에 따라 포인트가 지급됩니다.</li>
                <li>정답률에 따라 포인트가 지급됩니다.</li>
                <li>정답률에 따라 포인트가 지급됩니다.</li>
              </ul>
            </ModalWrapper.Notice>
            <ModalWrapper.Box>
              <div className="flex flex-row gap-6">
                <Button>취소</Button>
                <Button isActive={true}>시작하기</Button>
              </div>
            </ModalWrapper.Box>
        </ModalWrapper> */}
      <Banner />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <RankingSection />
        <PastContestsSection />
        <WarningBanner />
      </div>
      <ContestCtaBanner />
    </div>
  );
}
