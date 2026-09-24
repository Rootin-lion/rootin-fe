"use server";

import { checkNickname, completeProfile, getProfile } from "@/apis/auth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import { OnboardingPayload } from "@/types/auth/auth";
import { AuthSession } from "@/types/oauth/oauth";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";

// 프로필 설정
export async function completeProfileAction(payload: OnboardingPayload) {
  try {
    await completeProfile(payload);

    const res = await getProfile();
    const profile = res.data.data;

    if (!profile) {
      return {
        ok: false,
        error: {
          code: "PROFILE_FAILED",
          message: "프로필 정보를 불러오지 못했습니다.",
        },
      } as const;
    }

    const updatedSession: AuthSession = {
      newMember: false,
      member: {
        id: profile.id,
        email: profile.email,
        imgUrl: profile.imgUrl ?? null,
        nickname: profile.nickname ?? null,
        ageGroup: profile.ageGroup ?? null,
        interestFields: profile.interestFields ?? [],
      },
    };

    const cookieStore = await cookies();

    cookieStore.set(
      MEMBER_SNAPSHOT_COOKIE,
      JSON.stringify(updatedSession),
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );

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

// 닉네임 중복 검사
export async function checkNicknameAction(nickname: string) {
  const res = await checkNickname(nickname);

  return res?.data;
}
