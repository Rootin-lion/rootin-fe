import type { BookmarkCategory } from "./bookmark";

export const MY_NAV_ITEMS = [
  { id: 1, title: "대시보드", value: "dashboard" },
  { id: 2, title: "북마크", value: "bookmark" },
  { id: 3, title: "오답노트", value: "review" },
  { id: 4, title: "면접 리포트", value: "interview" },
  { id: 5, title: "설정", value: "option" },
] as const;

export type MySection = (typeof MY_NAV_ITEMS)[number]["value"];

export function isMySection(value: unknown): value is MySection {
  return (
    typeof value === "string" &&
    MY_NAV_ITEMS.some((item) => item.value === value)
  );
}

export function getMySectionHref(section: MySection) {
  if (section === "bookmark") return getMyListHref(section, 1, "all");
  if (section === "review" || section === "interview") {
    return getMyListHref(section, 1);
  }
  return `/my?section=${section}`;
}

export function getMyListHref(
  section: "bookmark" | "review" | "interview",
  page: number,
  category: BookmarkCategory = "all",
) {
  const categoryParam = section === "bookmark" ? `&category=${category}` : "";
  return `/my?section=${section}${categoryParam}&page=${page}`;
}

export function parseMyPage(value: unknown) {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}
