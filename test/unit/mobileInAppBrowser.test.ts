import {
  getChromeOpenUrl,
  getMobileInAppPlatform,
} from "@/lib/shared/mobileInAppBrowser";
import { describe, expect, test } from "vitest";

const androidChrome =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";
const iphoneSafari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
const desktopSafari =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

describe("모바일 인앱 브라우저 판별", () => {
  test("Android 카카오톡은 android를 반환", () => {
    const result = getMobileInAppPlatform(`${androidChrome} KAKAOTALK/11.0.0`);

    expect(result).toBe("android");
  });

  test("iPhone 카카오톡은 ios를 반환", () => {
    const result = getMobileInAppPlatform(`${iphoneSafari} KAKAOTALK/11.0.0`);

    expect(result).toBe("ios");
  });

  test("앱 이름이 없는 Android WebView도 판별", () => {
    const userAgent =
      "Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36";

    expect(getMobileInAppPlatform(userAgent)).toBe("android");
  });

  test.each([
    "NAVER(inapp; search; 2000; 12.0.0)",
    "Instagram 300.0.0.0.0",
    "FBAN/FBIOS;FBAV/400.0.0.0.0",
    "Line/14.0.0",
  ])("iPhone의 %s 인앱을 판별", (appToken) => {
    const result = getMobileInAppPlatform(`${iphoneSafari} ${appToken}`);

    expect(result).toBe("ios");
  });

  test("앱 이름의 대소문자가 달라도 판별", () => {
    const result = getMobileInAppPlatform(`${androidChrome} kakaotalk/11.0.0`);

    expect(result).toBe("android");
  });

  test("일반 Android Chrome은 null을 반환", () => {
    expect(getMobileInAppPlatform(androidChrome)).toBe(null);
  });

  test("일반 iPhone Safari는 null을 반환", () => {
    expect(getMobileInAppPlatform(iphoneSafari)).toBe(null);
  });

  test("데스크톱은 앱 이름이 있어도 null을 반환", () => {
    const result = getMobileInAppPlatform(`${desktopSafari} KAKAOTALK/11.0.0`);

    expect(result).toBe(null);
  });

  test("Macintosh UA를 쓰는 iPad 인앱은 터치 포인트로 판별", () => {
    const result = getMobileInAppPlatform(
      `${desktopSafari} KAKAOTALK/11.0.0`,
      5,
    );

    expect(result).toBe("ios");
  });

  test("iPad여도 일반 Safari이면 null을 반환", () => {
    expect(getMobileInAppPlatform(desktopSafari, 5)).toBe(null);
  });

  test("빈 UA는 null을 반환한다", () => {
    expect(getMobileInAppPlatform("")).toBe(null);
  });
});

describe("Chrome 열기 URL 생성", () => {
  test("Android HTTPS 주소를 경로와 쿼리를 유지한 Intent로 변환", () => {
    const result = getChromeOpenUrl(
      "https://example.com/my?section=bookmark&page=2",
      "android",
    );

    expect(result).toBe(
      "intent://example.com/my?section=bookmark&page=2#Intent;scheme=https;package=com.android.chrome;end",
    );
  });

  test("Android HTTP 주소의 프로토콜과 포트를 유지", () => {
    const result = getChromeOpenUrl("http://localhost:3000/login", "android");

    expect(result).toBe(
      "intent://localhost:3000/login#Intent;scheme=http;package=com.android.chrome;end",
    );
  });

  test("iOS HTTPS 주소를 경로, 쿼리, 해시를 유지한 googlechromes 링크로 변환", () => {
    const result = getChromeOpenUrl(
      "https://example.com/my?section=bookmark&page=2#saved",
      "ios",
    );

    expect(result).toBe(
      "googlechromes://example.com/my?section=bookmark&page=2#saved",
    );
  });

  test("iOS HTTP 주소는 googlechrome 링크로 변환", () => {
    const result = getChromeOpenUrl("http://localhost:3000/login", "ios");

    expect(result).toBe("googlechrome://localhost:3000/login");
  });
});
