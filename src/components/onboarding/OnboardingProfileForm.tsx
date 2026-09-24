"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import InputWrapper from "@/components/shared/InputWrapper";
import Button from "@/components/shared/Button";
import InterestFieldSelector from "./InterestFieldSelector";
import { OnboardingPayload } from "@/types/auth/auth";
import {
  checkNicknameAction,
  completeProfileAction,
} from "@/app/onboarding/action";
import ErrorModal from "../shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import { INTEREST_FIELD_OPTIONS } from "@/constants/onboarding/onboarding";

export default function OnboardingProfileForm({ email }: { email: string }) {
  const router = useRouter();
  const [profileForm, setProfileForm] = useState<OnboardingPayload>({
    nickname: "",
    ageGroup: "",
    interestFields: [],
  });
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [, startNicknameCheckTransition] = useTransition();

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;

    setProfileForm((prev) => ({ ...prev, nickname }));

    setIsNicknameAvailable(null);
  };

  const handleAgeGroupToggle = (targetAge: string) => {
    setProfileForm((prev) => ({
      ...prev,
      ageGroup: prev.ageGroup === targetAge ? "" : targetAge,
    }));
  };

  const handleInterestToggle = (targetInterest: string) => {
    if (
      profileForm.interestFields.length >= 3 &&
      !profileForm.interestFields.includes(targetInterest)
    )
      return;

    setProfileForm((prev) => ({
      ...prev,
      interestFields: prev.interestFields.includes(targetInterest)
        ? prev.interestFields.filter(
            (interestFields) => interestFields !== targetInterest,
          )
        : [...prev.interestFields, targetInterest],
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSubmitEnabled || isSubmitting) return;

    startSubmitTransition(async () => {
      try {
        const res = await completeProfileAction(profileForm);

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();
          return;
        }

        router.replace("/onboarding/success");
      } catch {
        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "프로필 저장 중 오류가 발생했습니다.",
        });
        openModal();
      }
    });
  };

  const isSubmitEnabled =
    profileForm.nickname.trim() !== "" &&
    profileForm.ageGroup !== "" &&
    profileForm.interestFields.length > 0 &&
    isNicknameAvailable === true;

  // 닉네임 검증 로직
  useEffect(() => {
    const nickname = profileForm.nickname.trim();

    if (!nickname) return;

    // 이전 값 보호
    let shouldIgnoreResult = false;

    const timeoutId = window.setTimeout(() => {
      startNicknameCheckTransition(async () => {
        try {
          const res = await checkNicknameAction(nickname);
          console.log(res.data);

          if (shouldIgnoreResult) return;

          setIsNicknameAvailable(res?.data?.available);
        } catch (error) {
          if (shouldIgnoreResult) return;

          console.log(error);
          setIsNicknameAvailable(null);
        }
      });
    }, 300);

    return () => {
      shouldIgnoreResult = true;
      window.clearTimeout(timeoutId);
    };
  }, [profileForm.nickname]);

  return (
    <main className="bg-primary-50 flex min-h-dvh flex-col items-center justify-center">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <h1 className="text-text text-[28px] font-bold">프로필 설정</h1>

      <form
        onSubmit={handleProfileSubmit}
        className="mt-8 flex w-full max-w-108 flex-col gap-6"
      >
        <InputWrapper>
          <InputWrapper.Label>이메일</InputWrapper.Label>
          <InputWrapper.Input
            type="email"
            disabled
            readOnly
            value={email}
            placeholder="이메일을 입력해주세요."
            className="bg-bg-green-100 border-[#D5D9DD]"
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
          <InputWrapper.Input
            type="text"
            id="nickname"
            name="nickname"
            isAvailable={isNicknameAvailable}
            required
            placeholder="닉네임을 입력해주세요."
            value={profileForm.nickname}
            onChange={handleNicknameChange}
            onDelete={() => {
              setProfileForm((prev) => ({ ...prev, nickname: "" }));
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>연령대</InputWrapper.Label>
          <div className="flex justify-center gap-2">
            <Button
              isActive={profileForm.ageGroup === "TEENS"}
              aria-pressed={profileForm.ageGroup === "TEENS"}
              onClick={() => handleAgeGroupToggle("TEENS")}
            >
              10대
            </Button>
            <Button
              isActive={profileForm.ageGroup === "TWENTIES"}
              aria-pressed={profileForm.ageGroup === "TWENTIES"}
              onClick={() => handleAgeGroupToggle("TWENTIES")}
            >
              20대
            </Button>
            <Button
              isActive={profileForm.ageGroup === "THIRTIES"}
              aria-pressed={profileForm.ageGroup === "THIRTIES"}
              onClick={() => handleAgeGroupToggle("THIRTIES")}
            >
              30대
            </Button>
            <Button
              isActive={profileForm.ageGroup === "FOURTIES"}
              aria-pressed={profileForm.ageGroup === "FOURTIES"}
              onClick={() => handleAgeGroupToggle("FOURTIES")}
            >
              40대
            </Button>
          </div>
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>관심분야</InputWrapper.Label>
          <InterestFieldSelector
            value={profileForm.interestFields}
            options={INTEREST_FIELD_OPTIONS}
            onClick={handleInterestToggle}
          />
        </InputWrapper>

        <Button
          type="submit"
          disabled={!isSubmitEnabled || isSubmitting}
          isActive={isSubmitEnabled && !isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </main>
  );
}
