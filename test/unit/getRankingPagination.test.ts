import { getRankingPagination } from "@/components/competition/ranking/board/getRankingPagination";
import { describe, expect, test } from "vitest";

describe("랭킹 페이지네이션", () => {
  test.each([0, 1])("totalPage =  %i", (totalPage) => {
    const result = getRankingPagination(0, totalPage);

    expect(result).toEqual({
      pageIndexes: [0],
      firstPageIndex: 0,
      lastPageIndex: 0,
      showFirstPage: false,
      showLastPage: false,
      showFirstEllipsis: false,
      showLastEllipsis: false,
    });
  });

  test("currentPage = 2 , totalPage = 5", () => {
    const result = getRankingPagination(2, 5);

    expect(result).toEqual({
      pageIndexes: [0, 1, 2, 3, 4],
      firstPageIndex: 0,
      lastPageIndex: 4,
      showFirstPage: false,
      showLastPage: false,
      showFirstEllipsis: false,
      showLastEllipsis: false,
    });
  });

  test("currentPage = 0, totalPage = 6", () => {
    const result = getRankingPagination(0, 6);

    expect(result).toEqual({
      pageIndexes: [0, 1, 2, 3, 4],
      firstPageIndex: 0,
      lastPageIndex: 5,
      showFirstPage: false,
      showLastPage: true,
      showFirstEllipsis: false,
      showLastEllipsis: false,
    });
  });

  test("currentPage = 5, totalPage = 6", () => {
    const result = getRankingPagination(5, 6);

    expect(result).toEqual({
      pageIndexes: [1, 2, 3, 4],
      firstPageIndex: 0,
      lastPageIndex: 5,
      showFirstPage: true,
      showLastPage: true,
      showFirstEllipsis: false,
      showLastEllipsis: false,
    });
  });

  test("currentPage = 0, totalPage = 10", () => {
    const result = getRankingPagination(0, 10);

    expect(result).toEqual({
      pageIndexes: [0, 1, 2, 3, 4],
      firstPageIndex: 0,
      lastPageIndex: 9,
      showFirstPage: false,
      showLastPage: true,
      showFirstEllipsis: false,
      showLastEllipsis: true,
    });
  });

  test("currentPage = 4, totalPage = 10", () => {
    const result = getRankingPagination(4, 10);

    expect(result).toEqual({
      pageIndexes: [1, 2, 3, 4, 5],
      firstPageIndex: 0,
      lastPageIndex: 9,
      showFirstPage: false,
      showLastPage: true,
      showFirstEllipsis: false,
      showLastEllipsis: true,
    });
  });

  test.each([5, 6, 9])("currentPage = 5/6/9, totalPage = 10", (currentPage) => {
    const result = getRankingPagination(currentPage, 10);

    expect(result).toEqual({
      pageIndexes: [5, 6, 7, 8],
      firstPageIndex: 0,
      lastPageIndex: 9,
      showFirstPage: true,
      showLastPage: true,
      showFirstEllipsis: true,
      showLastEllipsis: false,
    });
  });
});
