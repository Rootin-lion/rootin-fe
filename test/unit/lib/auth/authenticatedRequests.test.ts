import { beforeEach, describe, expect, test, vi } from "vitest";
import { AxiosError, type InternalAxiosRequestConfig } from "axios";

const mocks = vi.hoisted(() => ({
  values: new Map<string, string>(),
  setCookie: vi.fn(),
  deleteCookie: vi.fn(),
  redirect: vi.fn(),
  redirectSignal: new Error("NEXT_REDIRECT"),
  frameworkSignal: new Error("NEXT_FRAMEWORK_SIGNAL"),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => {
      const value = mocks.values.get(name);
      return value === undefined ? undefined : { value };
    },
    set: mocks.setCookie,
    delete: mocks.deleteCookie,
  }),
}));
vi.mock("next/navigation", () => ({
  RedirectType: { replace: "replace" },
  redirect: mocks.redirect,
  unstable_rethrow: (error: unknown) => {
    if (error === mocks.redirectSignal || error === mocks.frameworkSignal)
      throw error;
  },
}));

import { apiClient, apiPublic } from "@/apis/client";
import { SessionExpiredError } from "@/lib/auth/SessionExpiredError";
import { SESSION_TOKEN_COOKIE_OPTIONS } from "@/constants/auth/sessionTokenCookie";
import { MEMBER_SNAPSHOT_COOKIE_OPTIONS } from "@/constants/auth/memberSnapshotCookie";
import { executeNestedDataAction } from "@/lib/shared/executeDataAction";
import { getMyBookmarksAction } from "@/app/(service)/my/action";
import {
  generateInterviewReportAction,
  submitInterviewAnswerAction,
} from "@/app/(service)/interviews/action";
import {
  checkNicknameAction,
  completeProfileAction,
  recoverProfileAction,
} from "@/app/onboarding/action";
import { GET } from "@/app/api/competitions/[competitionId]/problems/[competitionProblemId]/route";

function response(
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
  headers = {},
) {
  return { config, data, status, statusText: String(status), headers };
}

function rejectResponse(
  config: InternalAxiosRequestConfig,
  status: number,
): never {
  throw new AxiosError(
    "API error",
    "ERR_BAD_RESPONSE",
    config,
    undefined,
    response(
      config,
      { error: { code: "API_ERROR", message: "API 실패" } },
      status,
    ),
  );
}

const authenticatedAdapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
  response(config, { data: { value: "ok" } }),
);
const publicAdapter = vi.fn(async (config: InternalAxiosRequestConfig) =>
  response(config, { data: { accessToken: "new-access" } }, 200, {
    "set-cookie": ["refreshToken=new-refresh; Path=/; HttpOnly"],
  }),
);

beforeEach(() => {
  mocks.values.clear();
  mocks.values.set(
    "sessionToken",
    JSON.stringify({ accessToken: "old-access", refreshToken: "old-refresh" }),
  );
  mocks.values.set("memberSnapshot", "cached-profile");
  mocks.setCookie
    .mockReset()
    .mockImplementation((name: string, value: string) => {
      mocks.values.set(name, value);
    });
  mocks.deleteCookie.mockReset().mockImplementation((name: string) => {
    mocks.values.delete(name);
  });
  mocks.redirect.mockReset().mockImplementation(() => {
    throw mocks.redirectSignal;
  });
  authenticatedAdapter
    .mockReset()
    .mockImplementation(async (config) =>
      response(config, { data: { value: "ok" } }),
    );
  publicAdapter.mockReset().mockImplementation(async (config) =>
    response(config, { data: { accessToken: "new-access" } }, 200, {
      "set-cookie": ["refreshToken=new-refresh; Path=/; HttpOnly"],
    }),
  );
  apiClient.defaults.adapter = authenticatedAdapter;
  apiPublic.defaults.adapter = publicAdapter;
});

function expireSession() {
  authenticatedAdapter.mockImplementation(async (config) =>
    rejectResponse(config, 401),
  );
  publicAdapter.mockRejectedValue(new Error("refresh rejected"));
}

describe("인증 요청과 재발급", () => {
  test("정상 요청은 기존 토큰을 보내고 쿠키를 변경하지 않음", async () => {
    await apiClient.get("/protected");
    expect(
      authenticatedAdapter.mock.calls[0][0].headers.get("Authorization"),
    ).toBe("Bearer old-access");
    expect(publicAdapter).not.toHaveBeenCalled();
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  test("401이면 refresh 쿠키로 재발급하고 새 토큰으로 원래 요청을 한 번 재시도", async () => {
    const sentHeaders: unknown[] = [];
    authenticatedAdapter.mockImplementation(async (config) => {
      sentHeaders.push(config.headers.get("Authorization"));
      if (sentHeaders.length === 1) return rejectResponse(config, 401);
      return response(config, { saved: true });
    });
    await apiClient.patch("/answers", { selectedOptionId: 7 });

    expect(sentHeaders).toEqual(["Bearer old-access", "Bearer new-access"]);
    expect(publicAdapter).toHaveBeenCalledTimes(1);
    const refreshRequest = publicAdapter.mock.calls[0][0];
    expect(refreshRequest.url).toBe("/auth/reissue");
    expect(refreshRequest.headers.get("Cookie")).toBe(
      "refreshToken=old-refresh",
    );
    const retriedRequest = authenticatedAdapter.mock.calls[1][0];
    expect(retriedRequest.url).toBe("/answers");
    expect(retriedRequest.method).toBe("patch");
    expect(JSON.parse(retriedRequest.data)).toEqual({ selectedOptionId: 7 });
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "sessionToken",
      JSON.stringify({
        accessToken: "new-access",
        refreshToken: "new-refresh",
      }),
      SESSION_TOKEN_COOKIE_OPTIONS,
    );
    expect(mocks.setCookie).toHaveBeenCalledWith(
      "memberSnapshot",
      "cached-profile",
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );
  });

  test("refresh token 교체가 없으면 기존 값을 유지하고 없는 프로필 캐시는 만들지 않음", async () => {
    mocks.values.delete("memberSnapshot");
    publicAdapter.mockImplementation(async (config) =>
      response(config, { data: { accessToken: "new-access" } }),
    );
    authenticatedAdapter.mockImplementationOnce(async (config) =>
      rejectResponse(config, 401),
    );
    await apiClient.get("/protected");
    expect(JSON.parse(mocks.values.get("sessionToken")!)).toEqual({
      accessToken: "new-access",
      refreshToken: "old-refresh",
    });
    expect(mocks.setCookie).toHaveBeenCalledTimes(1);
  });

  test("재시도도 401이면 다시 재발급하지 않음", async () => {
    authenticatedAdapter.mockImplementation(async (config) =>
      rejectResponse(config, 401),
    );
    await expect(apiClient.get("/protected")).rejects.toBeInstanceOf(
      AxiosError,
    );
    expect(authenticatedAdapter).toHaveBeenCalledTimes(2);
    expect(publicAdapter).toHaveBeenCalledTimes(1);
    expect(mocks.deleteCookie).not.toHaveBeenCalled();
  });

  test("403은 재발급 없이 원래 오류를 전달", async () => {
    authenticatedAdapter.mockImplementation(async (config) =>
      rejectResponse(config, 403),
    );
    await expect(apiClient.get("/protected")).rejects.toBeInstanceOf(
      AxiosError,
    );
    expect(publicAdapter).not.toHaveBeenCalled();
  });

  test.each([undefined, "", 123])(
    "잘못된 새 access token %j는 전용 만료 오류로 전달",
    async (accessToken) => {
      authenticatedAdapter.mockImplementation(async (config) =>
        rejectResponse(config, 401),
      );
      publicAdapter.mockImplementation(async (config) =>
        response(config, { data: { accessToken } }),
      );
      await expect(apiClient.get("/protected")).rejects.toBeInstanceOf(
        SessionExpiredError,
      );
      expect(mocks.deleteCookie).not.toHaveBeenCalled();
      expect(mocks.redirect).not.toHaveBeenCalled();
    },
  );

  test.each([undefined, "invalid-json", '{"accessToken":"only-access"}'])(
    "잘못된 기존 세션 %j는 요청 전에 차단",
    async (value) => {
      if (value === undefined) mocks.values.delete("sessionToken");
      else mocks.values.set("sessionToken", value);
      await expect(apiClient.get("/protected")).rejects.toThrow("로그인 세션");
      expect(authenticatedAdapter).not.toHaveBeenCalled();
      expect(publicAdapter).not.toHaveBeenCalled();
    },
  );

  test("재발급 중 Next.js 제어 오류를 만료 오류로 바꾸지 않음", async () => {
    authenticatedAdapter.mockImplementation(async (config) =>
      rejectResponse(config, 401),
    );
    publicAdapter.mockRejectedValue(mocks.frameworkSignal);
    await expect(apiClient.get("/protected")).rejects.toBe(
      mocks.frameworkSignal,
    );
  });
});

describe("호출 경계의 인증 실패 처리", () => {
  const actions = [
    [
      "공통 Action",
      () =>
        executeNestedDataAction(() => apiClient.get("/protected"), {
          code: "FAILED",
          message: "조회 실패",
        }),
    ],
    ["북마크 조회", () => getMyBookmarksAction(1)],
    [
      "면접 답변",
      () => submitInterviewAnswerAction(1, { questionId: 2, answer: "답변" }),
    ],
    ["면접 리포트", () => generateInterviewReportAction(1)],
    ["프로필 복원", () => recoverProfileAction()],
    [
      "프로필 저장",
      () =>
        completeProfileAction({
          nickname: "닉네임",
          ageGroup: "TWENTIES",
          interestFields: ["NETWORK"],
        }),
    ],
    ["닉네임 검사", () => checkNicknameAction("닉네임")],
  ] as const;

  test.each(actions)(
    "%s는 재발급 실패 시 두 쿠키를 삭제하고 로그인으로 이동",
    async (_name, action) => {
      expireSession();
      await expect(action()).rejects.toBe(mocks.redirectSignal);
      expect(mocks.deleteCookie.mock.calls).toEqual([
        ["sessionToken"],
        ["memberSnapshot"],
      ]);
      expect(mocks.redirect).toHaveBeenCalledWith("/login", "replace");
    },
  );

  test("일반 API 오류는 기존 Action 실패 형태로 반환", async () => {
    authenticatedAdapter.mockImplementation(async (config) =>
      rejectResponse(config, 403),
    );
    await expect(
      executeNestedDataAction(() => apiClient.get("/protected"), {
        code: "FAILED",
        message: "조회 실패",
      }),
    ).resolves.toEqual({
      ok: false,
      error: { code: "API_ERROR", message: "API 실패", status: 403 },
    });
    expect(mocks.deleteCookie).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  test("Action에서 Next.js 제어 오류를 일반 실패로 바꾸지 않음", async () => {
    await expect(
      executeNestedDataAction(
        async () => {
          throw mocks.frameworkSignal;
        },
        { code: "FAILED", message: "조회 실패" },
      ),
    ).rejects.toBe(mocks.frameworkSignal);
  });

  test("문제 GET은 재발급 실패 시 로그인 리다이렉트 대신 401 JSON 반환", async () => {
    expireSession();
    const result = await GET(
      new Request("http://localhost/api/competitions/1/problems/2"),
      {
        params: Promise.resolve({
          competitionId: "1",
          competitionProblemId: "2",
        }),
      },
    );
    expect(result.status).toBe(401);
    expect(result.headers.get("Content-Type")).toContain("application/json");
    expect(result.headers.get("Cache-Control")).toBe("private, no-store");
    expect(await result.json()).toEqual({
      ok: false,
      error: {
        code: "UNAUTHENTICATED",
        message: "로그인이 필요합니다.",
        status: 401,
      },
    });
    expect(mocks.deleteCookie.mock.calls).toEqual([
      ["sessionToken"],
      ["memberSnapshot"],
    ]);
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});
