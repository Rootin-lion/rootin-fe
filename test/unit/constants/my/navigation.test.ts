import {
  getMyListHref,
  getMySectionHref,
  isMySection,
  parseMyPage,
} from "@/constants/my/navigation";
import { describe, expect, test } from "vitest";

describe("마이페이지 페이지네이션", () => {
  test("양의 정수", () => {
    const result = parseMyPage("3");

    expect(result).toBe(3);
  });

  test("음의 정수", () => {
    const result = parseMyPage("-3");

    expect(result).toBe(1);
  });

  test("0", () => {
    const result = parseMyPage("0");

    expect(result).toBe(1);
  });

  test("소수", () => {
    const result = parseMyPage("2.1");

    expect(result).toBe(1);
  });

  test.each([undefined, null, 3, "", "01", " 3 ", "3abc", "9007199254740992"])(
    "잘못된 페이지 %j는 기본값 처리",
    (value) => {
      expect(parseMyPage(value)).toBe(1);
    },
  );

  test("안전한 정수 최댓값", () => {
    expect(parseMyPage("9007199254740991")).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe("마이페이지 메뉴 검증", () => {
  test.each(["dashboard", "bookmark", "review", "interview", "option"])(
    "정상 메뉴 %s",
    (section) => {
      expect(isMySection(section)).toBe(true);
    },
  );

  test.each([undefined, null, 1, "", "unknown", "BOOKMARK"])(
    "잘못된 메뉴 %j",
    (section) => {
      expect(isMySection(section)).toBe(false);
    },
  );
});

describe("마이페이지 메뉴 주소", () => {
  test.each([
    ["dashboard", "/my?section=dashboard"],
    ["option", "/my?section=option"],
    ["bookmark", "/my?section=bookmark&category=all&page=1"],
    ["review", "/my?section=review&page=1"],
    ["interview", "/my?section=interview&page=1"],
  ] as const)("%s 메뉴 주소 생성", (section, expected) => {
    expect(getMySectionHref(section)).toBe(expected);
  });
});

describe("마이페이지 목록 주소", () => {
  test("북마크 기본 카테고리와 페이지", () => {
    expect(getMyListHref("bookmark", 3)).toBe(
      "/my?section=bookmark&category=all&page=3",
    );
  });

  test("북마크 선택 카테고리", () => {
    expect(getMyListHref("bookmark", 2, "DATABASE")).toBe(
      "/my?section=bookmark&category=DATABASE&page=2",
    );
  });

  test.each(["review", "interview"] as const)(
    "%s 목록은 카테고리 제외",
    (section) => {
      expect(getMyListHref(section, 4, "DATABASE")).toBe(
        `/my?section=${section}&page=4`,
      );
    },
  );
});
