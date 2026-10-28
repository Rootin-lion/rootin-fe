export function getRankingPagination(currentPage: number, totalPage: number) {
  const visiblePageCount = 5;
  const displayTotalPage = Math.max(totalPage, 1);
  const firstPageIndex = 0;
  const lastPageIndex = displayTotalPage - 1;
  const showLastPage = displayTotalPage > visiblePageCount;
  const isNearEnd =
    showLastPage && currentPage >= lastPageIndex - visiblePageCount + 1;
  const windowPageCount = showLastPage
    ? Math.min(
        isNearEnd ? visiblePageCount - 1 : visiblePageCount,
        displayTotalPage - 1,
      )
    : displayTotalPage;
  const maxStartPageIndex = Math.max(0, lastPageIndex - windowPageCount);
  const movingStartPageIndex = Math.min(
    Math.max(0, currentPage - windowPageCount + 2),
    maxStartPageIndex,
  );
  const startPageIndex = isNearEnd ? maxStartPageIndex : movingStartPageIndex;
  const pageIndexes = Array.from(
    { length: windowPageCount },
    (_, index) => startPageIndex + index,
  );
  const firstVisiblePageIndex = pageIndexes[0] ?? firstPageIndex;
  const lastVisiblePageIndex = pageIndexes.at(-1) ?? firstPageIndex;
  const showFirstPage = isNearEnd && firstVisiblePageIndex > firstPageIndex;

  return {
    pageIndexes,
    firstPageIndex,
    lastPageIndex,
    showFirstPage,
    showLastPage,
    showFirstEllipsis:
      showFirstPage && firstVisiblePageIndex - firstPageIndex > 1,
    showLastEllipsis:
      !isNearEnd && showLastPage && lastPageIndex - lastVisiblePageIndex > 1,
  };
}
