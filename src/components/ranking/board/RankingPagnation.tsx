import PrevIcon from "../../../assets/ranking/prev.svg";
import NextIcon from "../../../assets/ranking/next.svg";

const PageNumberButton = ({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive?: boolean;
  onClick: (page: number) => void;
}) => {
  return (
    <div
      className={`${isActive ? "bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-[50%] text-white" : "text-text"} text-body-3 cursor-pointer`}
      onClick={() => {
        onClick(page);
      }}
    >
      {page}
    </div>
  );
};

export default function RankingPagnation({
  page,
  onClick,
}: {
  page: number;
  onClick: (page: number) => void;
}) {
  return (
    <div className="mx-auto mt-8 flex max-w-84.5 flex-row items-center justify-between gap-7">
      <div className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-[#E1E1E1]">
        <PrevIcon role="img" aria-label="이전 페이지" />
      </div>
      <div className="flex flex-row items-center justify-between gap-6">
        <PageNumberButton page={1} isActive={page === 1} onClick={onClick} />
        <PageNumberButton page={2} isActive={page === 2} onClick={onClick} />
        <PageNumberButton page={3} isActive={page === 3} onClick={onClick} />
        <PageNumberButton page={4} isActive={page === 4} onClick={onClick} />
        <PageNumberButton page={5} isActive={page === 5} onClick={onClick} />
        <div className="flex flex-row gap-2">
          <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
          <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
          <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
        </div>
        <PageNumberButton page={9} isActive={page === 9} onClick={onClick} />
      </div>
      <div className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-[#E1E1E1]">
        <NextIcon role="img" aria-label="다음 페이지" />
      </div>
    </div>
  );
}
