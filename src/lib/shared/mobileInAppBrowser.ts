export type MobilePlatform = "android" | "ios";

const IN_APP_BROWSER =
  /KAKAOTALK|NAVER\(|Instagram|FBAN|FBAV|FB_IAB|Line\/|DaumApps|DaumDevice|everytimeApp|MicroMessenger|GSA\//i;

export function getMobileInAppPlatform(
  userAgent: string,
  maxTouchPoints = 0,
): MobilePlatform | null {
  const isAndroid = /Android/i.test(userAgent);
  const isIOS =
    /iPhone|iPad|iPod/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && maxTouchPoints > 1);

  if (!isAndroid && !isIOS) return null;

  const isAndroidWebView = isAndroid && /;\s*wv\b/i.test(userAgent);
  if (!IN_APP_BROWSER.test(userAgent) && !isAndroidWebView) return null;

  return isAndroid ? "android" : "ios";
}

export function getChromeOpenUrl(
  href: string,
  platform: MobilePlatform,
): string {
  const url = new URL(href);
  const scheme = url.protocol.slice(0, -1);
  const destination = url.href.slice(url.protocol.length);

  if (platform === "android") {
    return `intent:${destination}#Intent;scheme=${scheme};package=com.android.chrome;end`;
  }

  return `${scheme === "https" ? "googlechromes" : "googlechrome"}:${destination}`;
}
