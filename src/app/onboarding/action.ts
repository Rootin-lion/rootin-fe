"use server";

import { checkNickname, completeProfile } from "@/apis/auth";
import { OnboardingPayload } from "@/types/auth/auth";
import { isAxiosError } from "axios";

export async function completeProfileAction(payload: OnboardingPayload) {
  try {
    await completeProfile(payload);

    return { ok: true } as const;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        ok: false,
        error: {
          code: error.response?.data.errorCode ?? "UNKNOWN_ERROR",
          message:
            error.response?.data.message ??
            "프로필 저장 중 오류가 발생했습니다.",
        },
      };
    }

    return {
      ok: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: "프로필 저장 중 오류가 발생했습니다.",
      },
    };
  }
}

export async function checkNicknameAction(nickname: string) {
  const res = await checkNickname(nickname);

  return res?.data;
}
