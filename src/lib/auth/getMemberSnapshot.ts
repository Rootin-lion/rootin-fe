import { cookies } from "next/headers";
import "server-only";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
import { isValidProfileEmail } from "@/lib/profile/isValidProfileEmail";
import type { AuthMember } from "@/types/oauth/oauth";

export async function getMemberSnapshot(): Promise<AuthMember | null> {
  const raw = (await cookies()).get(MEMBER_SNAPSHOT_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("member" in parsed)
    ) {
      return null;
    }

    const member = parsed.member;
    if (typeof member !== "object" || member === null) return null;

    if (
      !("id" in member) ||
      typeof member.id !== "number" ||
      !Number.isFinite(member.id) ||
      !("email" in member) ||
      !isValidProfileEmail(member.email) ||
      !("profileCompleted" in member) ||
      typeof member.profileCompleted !== "boolean"
    ) {
      return null;
    }

    return {
      id: member.id,
      email: member.email.trim(),
      profileCompleted: member.profileCompleted,
      imgUrl:
        "imgUrl" in member && typeof member.imgUrl === "string"
          ? member.imgUrl
          : null,
      nickname:
        "nickname" in member && typeof member.nickname === "string"
          ? member.nickname
          : null,
      ageGroup:
        "ageGroup" in member && typeof member.ageGroup === "string"
          ? member.ageGroup
          : null,
      interestFields:
        "interestFields" in member &&
        Array.isArray(member.interestFields) &&
        member.interestFields.every((field) => typeof field === "string")
          ? member.interestFields
          : [],
    };
  } catch {
    return null;
  }
}
