import "server-only";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { SESSION_TOKEN_COOKIE } from "@/constants/auth/sessionTokenCookie";
import { parseSessionToken } from "@/lib/auth/sessionToken";
import {
  getSessionToken,
  renewSessionCookies,
} from "@/lib/auth/sessionCookies";
import { SessionExpiredError } from "@/lib/auth/SessionExpiredError";
import { reissueSessionToken } from "./reissueToken";

export { apiPublic } from "./publicClient";
export { reissueToken } from "./reissueToken";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const rawSessionToken = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value;
  const sessionToken = parseSessionToken(rawSessionToken);
  if (!rawSessionToken) throw new Error("로그인 세션이 없습니다.");
  if (!sessionToken) throw new Error("로그인 세션이 올바르지 않습니다.");

  config.headers.set("Authorization", `Bearer ${sessionToken.accessToken}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const sessionToken = await getSessionToken();
    if (!sessionToken) return Promise.reject(error);

    let accessToken: string;
    try {
      const renewedSession = await reissueSessionToken(sessionToken);
      await renewSessionCookies(renewedSession);
      accessToken = renewedSession.accessToken;
    } catch (cause) {
      unstable_rethrow(cause);
      throw new SessionExpiredError();
    }

    originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);
    return apiClient.request(originalRequest);
  },
);
