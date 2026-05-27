import Banner from "@/components/contests/Banner";
import Header from "@/components/Header";
import RankingSectipn from "@/components/contests/RankingSection";

export default function ContestPage() {
  return (
    <>
      <Header />
      <Banner />
      <div className="flex flex-col gap-5">
        <RankingSectipn />
      </div>
    </>
  );
}
