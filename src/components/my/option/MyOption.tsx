"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import CharImg from "@/assets/competitions/result/char.png";
import { INTEREST_FIELD_OPTIONS } from "@/constants/onboarding/onboarding";
import AgeGroupSelector from "@/components/profile/AgeGroupSelector";
import { toggleInterestField } from "@/lib/profile/toggleInterestField";
import type { AuthMember } from "@/types/oauth/oauth";

export default function MyOption({ member }: { member: AuthMember | null }) {
  const [nickname, setNickname] = useState(member?.nickname ?? "");
  const [ageGroup, setAgeGroup] = useState(member?.ageGroup ?? "");
  const [interestFields, setInterestFields] = useState(
    member?.interestFields ?? [],
  );
  const [isInterestOpen, setIsInterestOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isCurrentNickname = Boolean(nickname && nickname === member?.nickname);
  const selectedInterests = interestFields
    .map(
      (value) =>
        INTEREST_FIELD_OPTIONS.find((option) => option.value === value)
          ?.label ?? value,
    )
    .join(", ");

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setImageError("JPG 또는 PNG 파일을 선택해주세요.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("사진은 5MB 이하로 선택해주세요.");
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const toggleInterest = (value: string) => {
    setInterestFields((current) => toggleInterestField(current, value));
  };

  return (
    <section className="w-full max-w-213 rounded-xl border border-[#E1E1E1] px-3 py-4 md:px-6 md:py-6 lg:px-17.5 lg:py-9">
      <h2 className="text-text text-[14px] font-semibold md:text-[16px] lg:text-[18px]">
        프로필 설정
      </h2>

      <div className="mx-auto mt-4 w-full max-w-190 min-w-0 md:mt-7 lg:mt-13 lg:pl-8">
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap md:gap-5 lg:justify-start lg:gap-8">
          <div className="relative h-34 w-34 shrink-0 rounded-full bg-[#EAF3E8]">
            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full">
              <Image
                src={previewImage || member?.imgUrl || CharImg}
                alt="프로필 이미지"
                width={136}
                height={136}
                unoptimized={Boolean(previewImage || member?.imgUrl)}
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              aria-label="프로필 사진 변경"
              onClick={() => imageInputRef.current?.click()}
              className="focus-visible:outline-primary absolute right-0 -bottom-2 flex size-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-[#E1E1E1] bg-white">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path d="m5 16 10-10 3 3L8 19H5v-3Z" fill="#4D4D4D" />
                  <path d="m14 7 3-3 3 3-3 3" fill="#4D4D4D" />
                </svg>
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="focus-visible:outline-primary flex h-17 w-50 max-w-full cursor-pointer items-center justify-center gap-5 rounded-lg border border-dashed border-[#A7A7A7] bg-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="text-primary h-6 w-6"
            >
              <path d="M5 3h12l3 3v15H5V3Z" fill="currentColor" />
              <path
                d="m9 12 3-3 3 3m-3-3v8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="flex flex-col gap-1">
              <span className="text-primary text-[14px] font-medium">
                사진 업로드
              </span>
              <span className="text-disabled-text text-[11px]">
                JPG, PNG 최대 5MB
              </span>
            </span>
          </button>
          <input
            ref={imageInputRef}
            id="option-profile-image"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            tabIndex={-1}
            aria-label="프로필 사진 파일"
            aria-describedby={imageError ? "option-image-error" : undefined}
            className="sr-only"
          />
        </div>
        {imageError && (
          <p
            id="option-image-error"
            role="alert"
            className="text-error mt-2 text-center text-[11px] lg:text-left lg:text-[12px]"
          >
            {imageError}
          </p>
        )}

        <div className="mt-5 flex flex-col gap-5 md:mt-8 md:gap-6 lg:mt-10 lg:gap-8">
          <div className="flex min-w-0 flex-col gap-1.5 md:gap-2">
            <label
              htmlFor="option-email"
              className="text-[11px] font-medium text-[#1A1A1A] md:text-[14px] lg:text-[15px]"
            >
              이메일
            </label>
            <input
              id="option-email"
              type="email"
              value={member?.email ?? ""}
              disabled
              className="h-11 w-full min-w-0 rounded-lg border border-[#D5D9DD] bg-[#F2F3F5] px-3 text-[12px] text-[#888F9C] md:h-12 md:px-4 md:text-[14px]"
            />
          </div>

          <div className="flex min-w-0 flex-col gap-1.5 md:gap-2">
            <label
              htmlFor="option-nickname"
              className="text-[11px] font-medium text-[#1A1A1A] md:text-[14px] lg:text-[15px]"
            >
              닉네임
            </label>
            <input
              id="option-nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className={`outline-primary-300 h-11 w-full min-w-0 rounded-lg border bg-white px-3 text-[12px] text-[#1A1A1A] md:h-12 md:px-4 md:text-[14px] ${isCurrentNickname ? "border-primary" : "border-[#D5D9DD]"}`}
            />
            {isCurrentNickname && (
              <p className="text-primary flex items-center gap-1 text-[10px] md:text-[12px]">
                <span
                  aria-hidden="true"
                  className="bg-primary flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[10px] text-white"
                >
                  ✓
                </span>
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-[12px] font-medium text-[#1A1A1A] md:mb-3 md:text-[14px] lg:text-[15px]">
              연령대
            </legend>
            <AgeGroupSelector
              value={ageGroup}
              onSelect={setAgeGroup}
              variant="settings"
            />
          </fieldset>

          <div className="flex min-w-0 flex-col gap-1.5 md:gap-2">
            <span
              id="option-interest-label"
              className="text-[12px] font-medium text-[#1A1A1A] md:text-[14px] lg:text-[15px]"
            >
              관심 분야
            </span>
            <div className="relative">
              <button
                type="button"
                aria-expanded={isInterestOpen}
                aria-controls="option-interest-list"
                aria-labelledby="option-interest-label option-interest-value"
                aria-describedby="option-interest-hint"
                onClick={() => setIsInterestOpen((open) => !open)}
                className="focus-visible:outline-primary flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-[#D5D9DD] bg-white px-3 py-2 text-left text-[12px] text-[#1A1A1A] focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-12 md:px-4 md:text-[14px] lg:h-12 lg:py-0"
              >
                <span
                  id="option-interest-value"
                  className="min-w-0 wrap-anywhere"
                >
                  {selectedInterests || "관심 분야를 선택해주세요"}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`h-5 w-5 shrink-0 text-[#999] transition-transform ${isInterestOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <path
                    d="m5 9 7 7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isInterestOpen && (
                <div
                  id="option-interest-list"
                  className="z-10 mt-2 flex w-full flex-wrap gap-1.5 rounded-lg border border-[#D5D9DD] bg-white p-2 shadow-sm md:gap-2 md:p-3 lg:absolute lg:mt-1"
                >
                  {INTEREST_FIELD_OPTIONS.map((option) => {
                    const selected = interestFields.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(option.value)}
                        className={`focus-visible:outline-primary min-h-9 max-w-full cursor-pointer rounded-md border px-2.5 py-1.5 text-[11px] wrap-anywhere focus-visible:outline-2 focus-visible:outline-offset-2 md:min-h-10 md:px-3 md:text-[14px] lg:min-h-0 ${selected ? "border-primary text-primary" : "border-[#D5D9DD] text-[#1A1A1A]"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p
              id="option-interest-hint"
              className="text-disabled-text text-[11px] md:text-[12px]"
            >
              최대 3개까지 선택할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center md:mt-6 lg:mt-23">
          <button
            type="button"
            className="focus-visible:outline-primary bg-primary h-10 w-full max-w-122 cursor-pointer rounded-lg text-[12px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 md:h-12 md:rounded-xl md:text-[14px]"
          >
            저장하기
          </button>
        </div>
      </div>
    </section>
  );
}
