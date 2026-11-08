"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  getChromeOpenUrl,
  getMobileInAppPlatform,
} from "@/lib/shared/mobileInAppBrowser";
import PrimaryDarkButton from "./PrimaryDarkButton";

const subscribe = () => () => {};
const getServerSnapshot = () => null;
const getChromeUrlSnapshot = () => {
  const platform = getMobileInAppPlatform(
    navigator.userAgent,
    navigator.maxTouchPoints,
  );
  return platform ? getChromeOpenUrl(window.location.href, platform) : null;
};

export default function MobileInAppBrowserGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const chromeUrl = useSyncExternalStore(
    subscribe,
    getChromeUrlSnapshot,
    getServerSnapshot,
  );
  const attemptedUrlRef = useRef<string | null>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!chromeUrl || attemptedUrlRef.current === chromeUrl) return;
    attemptedUrlRef.current = chromeUrl;

    // Some in-app browsers require a tap; keep the manual link available.
    try {
      window.location.href = chromeUrl;
    } catch {
      // The guidance below remains available when the app blocks navigation.
    }
  }, [chromeUrl]);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage("주소를 복사했어요. Chrome 주소창에 붙여 넣어 주세요.");
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      setCopyMessage("아래 주소를 길게 눌러 복사해 주세요.");
    }
  };

  if (!chromeUrl) return children;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8">
      <section
        aria-labelledby="in-app-browser-title"
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-sm"
      >
        <p className="text-primary-900 mb-4 text-sm font-bold">ROOTIN</p>
        <h1 id="in-app-browser-title" className="text-xl font-semibold">
          Chrome에서 열어 주세요
        </h1>
        <p className="text-sub-text mt-3 text-sm leading-relaxed break-keep">
          인앱 브라우저에서는 로그인이 제한될 수 있어요.
          <br />
          자동으로 이동하지 않으면 아래 버튼을 눌러 주세요.
        </p>
        <a
          href={chromeUrl}
          className="bg-primary-900 mt-6 flex min-h-11 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Chrome으로 열기
        </a>
        <PrimaryDarkButton
          className="mt-3 min-h-11 px-4 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={copyAddress}
        >
          주소 복사
        </PrimaryDarkButton>
        <p className="text-sub-text mt-4 text-xs leading-relaxed break-keep">
          열리지 않으면 Chrome 설치 여부를 확인하거나, 앱 메뉴에서 외부
          브라우저로 열어 주세요. 로그인은 열린 브라우저에서 다시 진행해 주세요.
        </p>
        <label className="text-sub-text mt-4 block text-left text-xs">
          현재 페이지 주소
          <input
            ref={addressRef}
            readOnly
            value={window.location.href}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-gray-200 px-3 text-base text-black"
          />
        </label>
        <p
          role="status"
          className="text-primary-900 mt-3 text-xs leading-relaxed"
        >
          {copyMessage}
        </p>
      </section>
    </main>
  );
}
