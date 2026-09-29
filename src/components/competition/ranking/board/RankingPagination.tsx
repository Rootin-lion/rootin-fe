import NextIcon from "@/assets/ranking/next.svg";
import PrevIcon from "@/assets/ranking/prev.svg";

const PageNumberButton = ({
  pageIndex,
  isActive,
  onClick,
}: {
  pageIndex: number;
  isActive?: boolean;
  onClick: (page: number) => void;
}) => {
  return (
    <button
      type="button"
      aria-current={isActive ? "page" : undefined}
      className={`${isActive ? "bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-[50%] text-white" : "text-text"} text-body-3 cursor-pointer`}
      onClick={() => onClick(pageIndex)}
    >
      {pageIndex + 1}
    </button>
  );
};

export default function RankingPagination({
  currentPage,
  totalPage,
  onClick,
}: {
  currentPage: number;
  totalPage: number;
  onClick: (page: number) => void;
}) {
  const visiblePageCount = 5;
  const displayTotalPage = Math.max(totalPage, 1);
  const firstPageIndex = 0;
  const lastPageIndex = displayTotalPage - 1;
  const isPastTwoThirds = currentPage + 1 > (displayTotalPage * 2) / 3;
  const showLastPage = displayTotalPage > visiblePageCount;
  const windowPageCount = showLastPage
    ? Math.min(
        isPastTwoThirds ? visiblePageCount - 1 : visiblePageCount,
        displayTotalPage - 1,
      )
    : displayTotalPage;
  const maxStartPageIndex = Math.max(0, lastPageIndex - windowPageCount);
  const movingStartPageIndex = Math.min(
    Math.max(0, currentPage - windowPageCount + 2),
    maxStartPageIndex,
  );
  const startPageIndex = isPastTwoThirds
    ? maxStartPageIndex
    : movingStartPageIndex;

  const pageIndexes = Array.from(
    { length: windowPageCount },
    (_, index) => startPageIndex + index,
  );

  const firstVisiblePageIndex = pageIndexes[0] ?? firstPageIndex;
  const lastVisiblePageIndex = pageIndexes.at(-1) ?? firstPageIndex;
  const showFirstPage =
    isPastTwoThirds && firstVisiblePageIndex > firstPageIndex;
  const showFirstEllipsis =
    showFirstPage && firstVisiblePageIndex - firstPageIndex > 1;
  const showLastEllipsis =
    !isPastTwoThirds &&
    showLastPage &&
    lastPageIndex - lastVisiblePageIndex > 1;

  return (
    <div className="mx-auto mt-8 flex max-w-84.5 flex-row items-center justify-between gap-7">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 0}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-[#E1E1E1] disabled:cursor-default disabled:opacity-40"
        onClick={() => onClick(currentPage - 1)}
      >
        <PrevIcon aria-hidden="true" />
      </button>
      <div className="flex flex-row items-center justify-between gap-6">
        {showFirstPage && (
          <PageNumberButton
            pageIndex={firstPageIndex}
            isActive={currentPage === firstPageIndex}
            onClick={onClick}
          />
        )}

        {showFirstEllipsis && (
          <div className="flex flex-row gap-2" aria-hidden="true">
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
          </div>
        )}

        {pageIndexes.map((pageIndex) => (
          <PageNumberButton
            key={pageIndex}
            pageIndex={pageIndex}
            isActive={currentPage === pageIndex}
            onClick={onClick}
          />
        ))}

        {showLastEllipsis && (
          <div className="flex flex-row gap-2" aria-hidden="true">
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
            <div className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black" />
          </div>
        )}

        {showLastPage && (
          <PageNumberButton
            pageIndex={lastPageIndex}
            isActive={currentPage === lastPageIndex}
            onClick={onClick}
          />
        )}
      </div>
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={currentPage >= lastPageIndex}
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-[#E1E1E1] disabled:cursor-default disabled:opacity-40"
        onClick={() => onClick(currentPage + 1)}
      >
        <NextIcon aria-hidden="true" />
      </button>
    </div>
  );
}
