"use client";

import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";
import type { OnboardingPayload } from "@/types/auth/auth";
import { INTEREST_FIELD_OPTIONS } from "@/constants/onboarding/onboarding";
import {
  checkNicknameAction,
  completeProfileAction,
} from "@/app/onboarding/action";
import Button from "@/components/shared/Button";
import ErrorModal from "@/components/shared/ErrorModal";
import InputWrapper from "@/components/shared/InputWrapper";
import AgeGroupSelector from "@/components/profile/AgeGroupSelector";
import useErrorModal from "@/hooks/useErrorModal";
import { toggleInterestField } from "@/lib/profile/toggleInterestField";
import InterestFieldSelector from "./InterestFieldSelector";
import useSpeechInput from "@/hooks/useSpeechInput";
import SpeechInputButton from "@/components/shared/SpeechInputButton";

export default function OnboardingProfileForm({ email }: { email: string }) {
  const router = useRouter();
  // 프로필 폼 상태
  const [profileForm, setProfileForm] = useState<OnboardingPayload>({
    nickname: "",
    ageGroup: "",
    interestFields: [],
  });
  // 닉네임 검증 상태
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<
    boolean | null
  >(null);
  // 에러 모달
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  // 제출 로딩 상태
  const [isSubmitting, startSubmitTransition] = useTransition();
  // 닉네임 검증 로딩 상태
  const [, startNicknameCheckTransition] = useTransition();

  // 닉네임
  const updateNickname = useCallback((nickname: string) => {
    setProfileForm((prev) => ({ ...prev, nickname }));
    setIsNicknameAvailable(null);
  }, []);
  const nicknameSpeech = useSpeechInput({
    value: profileForm.nickname,
    onValueChange: updateNickname,
    disabled: isSubmitting || isModalOpen,
    available: !isSubmitting,
  });

  // 나이
  const handleAgeGroupToggle = (targetAge: string) => {
    setProfileForm((prev) => ({
      ...prev,
      ageGroup: prev.ageGroup === targetAge ? "" : targetAge,
    }));
  };

  // 관심분야
  const handleInterestToggle = (targetInterest: string) => {
    setProfileForm((prev) => ({
      ...prev,
      interestFields: toggleInterestField(prev.interestFields, targetInterest),
    }));
  };

  // 프로필 설정
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

  // 닉네임 검증
  useEffect(() => {
    const nickname = profileForm.nickname.trim();

    if (!nickname || nicknameSpeech.enabled) return;

    // 이전 값 보호
    let shouldIgnoreResult = false;

    const timeoutId = window.setTimeout(() => {
      startNicknameCheckTransition(async () => {
        try {
          const res = await checkNicknameAction(nickname);

          if (shouldIgnoreResult) return;

          setIsNicknameAvailable(res?.data?.available);
        } catch {
          if (shouldIgnoreResult) return;

          setIsNicknameAvailable(null);
        }
      });
    }, 300);

    return () => {
      shouldIgnoreResult = true;
      window.clearTimeout(timeoutId);
    };
  }, [profileForm.nickname, nicknameSpeech.enabled]);

  return (
    <main className="bg-primary-50 flex min-h-dvh flex-col items-center px-6 pt-6 pb-[max(24px,env(safe-area-inset-bottom))] md:justify-center md:py-12">
      {/* 에러 모달 */}
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <h1 className="typo-title-3 text-text max-md:text-[18px] md:max-lg:text-[22px]">
        프로필 설정
      </h1>

      <form
        onSubmit={handleProfileSubmit}
        className="mt-6 flex w-full max-w-108 min-w-0 flex-col gap-5 max-md:flex-1 md:mt-8 md:gap-6 max-md:[&_button]:text-[11px] md:max-lg:[&_button]:text-[13px] max-md:[&_label]:text-[11px] md:max-lg:[&_label]:text-[13px]"
      >
        <InputWrapper>
          <InputWrapper.Label>이메일</InputWrapper.Label>
          <InputWrapper.Input
            type="email"
            disabled
            readOnly
            value={email}
            placeholder="이메일을 입력해주세요."
            className="typo-body-2 bg-bg-green-100 border-[#D5D9DD] max-md:px-3 max-md:py-2.5 max-md:text-[12px] md:max-lg:text-[14px]"
          />
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <InputWrapper.Input
                type="text"
                id="nickname"
                name="nickname"
                className="typo-body-2 pr-12 max-md:py-2.5 max-md:pl-3 max-md:text-[12px] md:max-lg:text-[14px]"
                isAvailable={isNicknameAvailable}
                required
                placeholder="닉네임을 입력해주세요."
                value={profileForm.nickname}
                onChange={(event) =>
                  nicknameSpeech.changeValue(event.target.value)
                }
                onDelete={() => nicknameSpeech.changeValue("")}
                onCompositionStart={nicknameSpeech.onCompositionStart}
                onCompositionEnd={nicknameSpeech.onCompositionEnd}
              />
            </div>
            <SpeechInputButton speech={nicknameSpeech} />
          </div>
          {(nicknameSpeech.enabled || nicknameSpeech.error) && (
            <p role="status" className="text-sub-text text-xs">
              {nicknameSpeech.error ??
                (nicknameSpeech.phase === "listening"
                  ? "닉네임 입력 중 · 마이크를 끄면 중복 검사를 진행해요."
                  : "마이크 연결 중...")}
            </p>
          )}
        </InputWrapper>

        <InputWrapper>
          <InputWrapper.Label>연령대</InputWrapper.Label>
          <AgeGroupSelector
            value={profileForm.ageGroup}
            onSelect={handleAgeGroupToggle}
            variant="onboarding"
          />
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
          className="max-md:mt-auto max-md:shrink-0 md:min-h-12"
          disabled={!isSubmitEnabled || isSubmitting}
          isActive={isSubmitEnabled && !isSubmitting}
        >
          {isSubmitting ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </main>
  );
}
