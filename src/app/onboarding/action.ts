"use server";

import { cookies } from "next/headers";
import type { OnboardingPayload } from "@/types/auth/auth";
import type { AuthSession } from "@/types/oauth/oauth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import { checkNickname, completeProfile, getProfile } from "@/apis/auth";
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";

// 프로필 설정
export async function completeProfileAction(payload: OnboardingPayload) {
  try {
    await completeProfile(payload);

    const res = await getProfile();
    const profile = res.data.data;

    if (!profile) {
      return actionFailure({
        code: "PROFILE_FAILED",
        message: "프로필 저장 중 오류가 발생했습니다.",
      });
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
        profileCompleted: profile.profileCompleted,
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
    return actionFailure(
      apiError(error, "프로필 저장 중 오류가 발생했습니다."),
    );
  }
}

// 닉네임 중복 검사
export async function checkNicknameAction(nickname: string) {
  const res = await checkNickname(nickname);

  return res?.data;
}
