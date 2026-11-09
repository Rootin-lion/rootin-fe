import { isValidProfileEmail } from "@/lib/profile/isValidProfileEmail";
import { describe, expect, test } from "vitest";

describe("이메일 검증", () => {
  test("정상 이메일", () => {
    const result = isValidProfileEmail("bergi132@naver.com");

    expect(result).toBe(true);
  });

  test("@ 누락", () => {
    const result = isValidProfileEmail("ber2naver.com");

    expect(result).toBe(false);
  });

  test("빈 문자열", () => {
    const result = isValidProfileEmail("");

    expect(result).toBe(false);
  });
});
