import { describe, expect, test } from "vitest";
import { toggleInterestField } from "@/lib/profile/toggleInterestField";

describe("관심 분야 선택", () => {
  test("선택하지 않은 분야를 추가", () => {
    const result = toggleInterestField([], "DATABASE");

    expect(result).toEqual(["DATABASE"]);
  });

  test("이미 선택한 분야를 해제", () => {
    const result = toggleInterestField(["DATABASE", "NETWORK"], "DATABASE");

    expect(result).toEqual(["NETWORK"]);
  });

  test("최대 3개까지만 선택", () => {
    const selected = ["DATABASE", "NETWORK", "JAVA_SPRING"];

    const result = toggleInterestField(selected, "OPERATING_SYSTEM");

    expect(result).toEqual(selected);
  });

  test("기존 배열을 직접 변경하지 않는다", () => {
    const selected = ["DATABASE"];

    toggleInterestField(selected, "NETWORK");

    expect(selected).toEqual(["DATABASE"]);
  });
});
