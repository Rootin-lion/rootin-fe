import { parseMyPage } from "@/constants/my/navigation";
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
});
