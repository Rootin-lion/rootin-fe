import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import { getRankingPagination } from "./getRankingPagination";

const navigationButtonClass =
  "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[5px] border border-[#E1E1E1] disabled:cursor-default disabled:opacity-40";
const activePageClass =
  "bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-[50%] text-white";

const PageEllipsis = () => (
  <div className="flex flex-row gap-2" aria-hidden="true">
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className="h-0.5 w-0.5 shrink-0 rounded-[50%] bg-black"
      />
    ))}
  </div>
);

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
      className={`${isActive ? activePageClass : "text-text"} text-body-3 cursor-pointer`}
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
  const {
    pageIndexes,
    firstPageIndex,
    lastPageIndex,
    showFirstPage,
    showLastPage,
    showFirstEllipsis,
    showLastEllipsis,
  } = getRankingPagination(currentPage, totalPage);

  return (
    <div className="mx-auto mt-8 flex max-w-84.5 flex-row items-center justify-between gap-7">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={currentPage === 0}
        className={navigationButtonClass}
        onClick={() => onClick(currentPage - 1)}
      >
        <ChevronIcon
          strokeWidth={1}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          className="h-3.5 w-2.5 rotate-180 text-[#9CA3AF]"
        />
      </button>
      <div className="flex flex-row items-center justify-between gap-6">
        {showFirstPage && (
          <PageNumberButton
            pageIndex={firstPageIndex}
            isActive={currentPage === firstPageIndex}
            onClick={onClick}
          />
        )}

        {showFirstEllipsis && <PageEllipsis />}

        {pageIndexes.map((pageIndex) => (
          <PageNumberButton
            key={pageIndex}
            pageIndex={pageIndex}
            isActive={currentPage === pageIndex}
            onClick={onClick}
          />
        ))}

        {showLastEllipsis && <PageEllipsis />}

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
        className={navigationButtonClass}
        onClick={() => onClick(currentPage + 1)}
      >
        <ChevronIcon
          strokeWidth={1}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          className="h-3.5 w-2.5 text-black"
        />
      </button>
    </div>
  );
}
