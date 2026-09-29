import "server-only";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import {
  SESSION_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE_OPTIONS,
} from "@/constants/auth/sessionTokenCookie";

const BaseUrl = process.env.NEXT_API_BASE_URL;

interface SessionToken {
  accessToken: string;
  refreshToken: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const parseSessionToken = (value: string | undefined): SessionToken | null => {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("accessToken" in parsed) ||
      !("refreshToken" in parsed) ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      !parsed.accessToken ||
      !parsed.refreshToken
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
    };
  } catch {
    return null;
  }
};

const getRefreshToken = (setCookie: string | string[] | undefined) => {
  const responseCookies = Array.isArray(setCookie)
    ? setCookie
    : setCookie
      ? [setCookie]
      : [];
  const refreshCookie = responseCookies.find((cookie) =>
    cookie.startsWith("refreshToken="),
  );

  return refreshCookie?.split(";", 1)[0].slice("refreshToken=".length);
};

export const apiPublic = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClient = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 재발급
export const reissueToken = (refreshToken: string) =>
  apiPublic.post("/auth/reissue", undefined, {
    headers: {
      Cookie: `refreshToken=${refreshToken}`,
    },
  });

// 헤더 액세스 토큰
apiClient.interceptors.request.use(async (config) => {
  const rawSessionToken = (await cookies()).get(SESSION_TOKEN_COOKIE)?.value;
  const sessionToken = parseSessionToken(rawSessionToken);

  if (!rawSessionToken) {
    throw new Error("로그인 세션이 없습니다.");
  }

  if (!sessionToken) {
    throw new Error("로그인 세션이 올바르지 않습니다.");
  }

  config.headers.set("Authorization", `Bearer ${sessionToken.accessToken}`);
  return config;
});

// 응답 재발급 토큰
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

    const cookieStore = await cookies();
    const sessionToken = parseSessionToken(
      cookieStore.get(SESSION_TOKEN_COOKIE)?.value,
    );

    if (!sessionToken) {
      return Promise.reject(error);
    }

    try {
      const reissueResponse = await reissueToken(sessionToken.refreshToken);
      const accessToken: unknown = reissueResponse.data?.data?.accessToken;

      if (typeof accessToken !== "string" || !accessToken) {
        throw new Error("토큰 재발급 응답이 올바르지 않습니다.");
      }

      const refreshToken =
        getRefreshToken(reissueResponse.headers["set-cookie"]) ??
        sessionToken.refreshToken;

      cookieStore.set(
        SESSION_TOKEN_COOKIE,
        JSON.stringify({ accessToken, refreshToken }),
        SESSION_TOKEN_COOKIE_OPTIONS,
      );

      originalRequest.headers.set("Authorization", `Bearer ${accessToken}`);

      return apiClient.request(originalRequest);
    } catch (reissueError) {
      cookieStore.delete(SESSION_TOKEN_COOKIE);
      return Promise.reject(reissueError);
    }
  },
);
