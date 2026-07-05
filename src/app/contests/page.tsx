import Header from "@/components/shared/Header";
import Banner from "@/components/contests/Banner";
import RankingSectipn from "@/components/contests/RankingSection";
import PastContestsSection from "@/components/contests/PastContestsSection";
import WaringBanner from "@/components/contests/WaringBanner";

export default function ContestPage() {
  return (
    <>
      <Header />
      <Banner />
      <div className="bg-bg-green-50 w-full pt-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
          <RankingSectipn />
          <PastContestsSection />
          <WaringBanner />
        </div>
      </div>
    </>
  );
}
