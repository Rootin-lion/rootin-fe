import "server-only";

import axios from "axios";
import { cookies } from "next/headers";

const BaseUrl = process.env.NEXT_API_BASE_URL;

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

apiClient.interceptors.request.use(async (config) => {
  const sessionToken = (await cookies()).get("sessionToken")?.value;

  if (!sessionToken) {
    throw new Error("로그인 세션이 없습니다.");
  }

  let accessToken: unknown;

  try {
    accessToken = JSON.parse(sessionToken).accessToken;
  } catch {
    throw new Error("로그인 세션이 올바르지 않습니다.");
  }

  if (typeof accessToken !== "string" || !accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  config.headers.set("Authorization", `Bearer ${accessToken}`);
  return config;
});
