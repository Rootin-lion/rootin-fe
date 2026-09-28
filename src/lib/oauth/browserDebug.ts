import "server-only";

import { NextResponse } from "next/server";
import {
  OAUTH_DEBUG_STORAGE_KEY,
  OAuthBrowserLogEntry,
} from "@/constants/oauth/debug";

const serializeForInlineScript = (value: unknown) =>
  JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");

export const createOAuthBrowserResponse = ({
  logs,
  redirectTo,
  status = redirectTo ? 200 : 500,
}: {
  logs: OAuthBrowserLogEntry[];
  redirectTo?: string | URL;
  status?: number;
}) => {
  const serializedLogs = serializeForInlineScript(logs);
  const serializedStorageKey = serializeForInlineScript(
    OAUTH_DEBUG_STORAGE_KEY,
  );
  const serializedRedirectTo = redirectTo
    ? serializeForInlineScript(redirectTo.toString())
    : null;

  const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <title>OAuth 디버그</title>
  </head>
  <body>
    <p>${redirectTo ? "로그인 페이지로 이동 중입니다." : "OAuth 요청을 처리하지 못했습니다."}</p>
    <script>
      (() => {
        const logs = ${serializedLogs};
        const storageKey = ${serializedStorageKey};

        try {
          const savedLogs = JSON.parse(sessionStorage.getItem(storageKey) || "[]");
          sessionStorage.setItem(storageKey, JSON.stringify([...savedLogs, ...logs]));
        } catch (error) {
          console.error("[OAuth][디버그 로그 저장 실패]", error);
        }

        ${
          serializedRedirectTo
            ? `window.location.replace(${serializedRedirectTo});`
            : `logs.forEach(({ level, label, data }) => console[level](label, data));`
        }
      })();
    </script>
  </body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
};
