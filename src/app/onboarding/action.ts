"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import type { OnboardingPayload } from "@/types/auth/auth";
import type { AuthSession } from "@/types/oauth/oauth";
import {
  MEMBER_SNAPSHOT_COOKIE,
  MEMBER_SNAPSHOT_COOKIE_OPTIONS,
} from "@/constants/auth/memberSnapshotCookie";
import { SESSION_TOKEN_COOKIE } from "@/constants/auth/sessionTokenCookie";
import { checkNickname, completeProfile, getProfile } from "@/apis/auth";
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";
import { isValidProfileEmail } from "@/lib/profile/isValidProfileEmail";

function toAuthSession(profile: unknown): AuthSession | null {
  if (typeof profile !== "object" || profile === null) return null;

  const member = profile as Record<string, unknown>;
  if (
    typeof member.id !== "number" ||
    !Number.isFinite(member.id) ||
    !isValidProfileEmail(member.email) ||
    typeof member.profileCompleted !== "boolean"
  ) {
    return null;
  }

  return {
    newMember: false,
    member: {
      id: member.id,
      email: member.email.trim(),
      imgUrl: typeof member.imgUrl === "string" ? member.imgUrl : null,
      nickname: typeof member.nickname === "string" ? member.nickname : null,
      ageGroup: typeof member.ageGroup === "string" ? member.ageGroup : null,
      interestFields:
        Array.isArray(member.interestFields) &&
        member.interestFields.every((field) => typeof field === "string")
          ? member.interestFields
          : [],
      profileCompleted: member.profileCompleted,
    },
  };
}

export async function recoverProfileAction() {
  const cookieStore = await cookies();
  if (!cookieStore.get(SESSION_TOKEN_COOKIE)?.value) {
    redirect("/login", RedirectType.replace);
  }

  try {
    const res = await getProfile();
    const session = toAuthSession(res.data.data);
    if (!session) {
      return actionFailure({
        code: "PROFILE_FAILED",
        message: "프로필 정보를 확인할 수 없습니다.",
      });
    }

    cookieStore.set(
      MEMBER_SNAPSHOT_COOKIE,
      JSON.stringify(session),
      MEMBER_SNAPSHOT_COOKIE_OPTIONS,
    );

    return {
      ok: true,
      data: {
        email: session.member.email,
        profileCompleted: session.member.profileCompleted,
      },
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "프로필 정보를 불러오지 못했습니다."));
  }
}

// 프로필 설정
export async function completeProfileAction(payload: OnboardingPayload) {
  try {
    await completeProfile(payload);

    const res = await getProfile();
    const updatedSession = toAuthSession(res.data.data);

    if (!updatedSession) {
      return actionFailure({
        code: "PROFILE_FAILED",
        message: "프로필 저장 중 오류가 발생했습니다.",
      });
    }

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
