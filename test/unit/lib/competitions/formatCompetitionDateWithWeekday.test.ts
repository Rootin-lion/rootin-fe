import { describe, expect, test } from "vitest";
import { formatCompetitionDateWithWeekday } from "@/lib/competitions/formatCompetitionDateWithWeekday";

describe("대회 날짜와 요일", () => {
  test.each([
    ["2026-11-13", "2026.11.13 (금)"],
    ["2024-02-29", "2024.02.29 (목)"],
    ["2026-11-13T10:00:00+09:00", "2026.11.13 (금)"],
  ])("날짜 %s의 한국어 요일", (value, expected) => {
    expect(formatCompetitionDateWithWeekday(value)).toBe(expected);
  });

  test("서울 기준 요일과 원본 날짜 유지", () => {
    expect(formatCompetitionDateWithWeekday("2026-11-13T23:30:00Z")).toBe(
      "2026.11.13 (토)",
    );
  });

  test.each([
    ["", ""],
    ["not-a-date", "not.a.date"],
  ])("잘못된 날짜 %j는 요일 제외", (value, expected) => {
    expect(formatCompetitionDateWithWeekday(value)).toBe(expected);
  });
});
