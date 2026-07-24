import Header from "@/components/shared/Header";
import Banner from "@/components/contests/banner/Banner";
import RankingSectipn from "@/components/contests/RankingSection";
import PastContestsSection from "@/components/contests/PastContestsSection";
import WaringBanner from "@/components/contests/WaringBanner";
import ContestCtaBanner from "@/components/contests/ContestCtaBanner";

export default function ContestPage() {
  return (
    <>
      <Header />
      <div className="bg-bg-green-50 flex w-full flex-col gap-6 pb-140">
        <Banner />
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <RankingSectipn />
          <PastContestsSection />
          <WaringBanner />
        </div>
        <ContestCtaBanner />
      </div>
    </>
  );
}
