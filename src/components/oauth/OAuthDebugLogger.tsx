"use client";

import { useEffect } from "react";
import {
  OAUTH_DEBUG_STORAGE_KEY,
  OAuthBrowserLogEntry,
} from "@/constants/oauth/debug";

export default function OAuthDebugLogger() {
  useEffect(() => {
    const storedLogs = sessionStorage.getItem(OAUTH_DEBUG_STORAGE_KEY);

    if (!storedLogs) return;

    sessionStorage.removeItem(OAUTH_DEBUG_STORAGE_KEY);

    try {
      const logs = JSON.parse(storedLogs) as OAuthBrowserLogEntry[];

      logs.forEach(({ level, label, data }) => {
        console[level](label, data);
      });
    } catch (error) {
      console.error("[OAuth][디버그 로그 읽기 실패]", error);
    }
  }, []);

  return null;
}
