import { describe, expect, test } from "vitest";
import { formatDottedDate } from "@/lib/shared/formatDottedDate";

describe("날짜 형식 변환", () => {
  test.each([
    ["2026-11-13", "2026.11.13"],
    ["2026-11-13T09:30:00+09:00", "2026.11.13"],
    ["2026-11-13T23:30:00Z", "2026.11.13"],
    ["2026.11.13", "2026.11.13"],
    ["", ""],
  ])("날짜 %j 변환", (value, expected) => {
    expect(formatDottedDate(value)).toBe(expected);
  });
});
