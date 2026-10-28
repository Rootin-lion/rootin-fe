"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
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
    if (!file || !["image/jpeg", "image/png"].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;

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
    <section className="w-full max-w-213 rounded-xl border border-[#E1E1E1] px-6 py-9 sm:px-17.5">
      <h2 className="text-text text-[18px] font-semibold">프로필 설정</h2>

      <div className="mx-auto mt-13 w-full max-w-190 sm:pl-8">
        <div className="flex flex-wrap items-center gap-8">
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
            <label className="absolute right-2 bottom-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#E1E1E1] bg-white">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="m5 16 10-10 3 3L8 19H5v-3Z" fill="#4D4D4D" />
                <path d="m14 7 3-3 3 3-3 3" fill="#4D4D4D" />
              </svg>
            </label>
          </div>

          <label
            htmlFor="option-profile-image"
            className="flex h-17 w-50 cursor-pointer items-center justify-center gap-5 rounded-lg border border-dashed border-[#A7A7A7] bg-[#F5F5F5]"
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
          </label>
          <input
            id="option-profile-image"
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="sr-only"
          />
        </div>

        <div className="mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="option-email"
              className="text-[15px] font-medium text-[#1A1A1A]"
            >
              이메일
            </label>
            <input
              id="option-email"
              type="email"
              value={member?.email ?? ""}
              disabled
              className="h-12 w-full rounded-lg border border-[#D5D9DD] bg-[#F2F3F5] px-4 text-[14px] text-[#888F9C]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="option-nickname"
              className="text-[15px] font-medium text-[#1A1A1A]"
            >
              닉네임
            </label>
            <input
              id="option-nickname"
              type="text"
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              className={`outline-primary-300 h-12 w-full rounded-lg border bg-white px-4 text-[14px] text-[#1A1A1A] ${isCurrentNickname ? "border-primary" : "border-[#D5D9DD]"}`}
            />
            {isCurrentNickname && (
              <p className="text-primary flex items-center gap-1 text-[12px]">
                <span
                  aria-hidden="true"
                  className="bg-primary flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] text-white"
                >
                  ✓
                </span>
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-3 text-[15px] font-medium text-[#1A1A1A]">
              연령대
            </legend>
            <AgeGroupSelector
              value={ageGroup}
              onSelect={setAgeGroup}
              variant="settings"
            />
          </fieldset>

          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-medium text-[#1A1A1A]">
              관심 분야
            </span>
            <div className="relative">
              <button
                type="button"
                aria-expanded={isInterestOpen}
                aria-controls="option-interest-list"
                onClick={() => setIsInterestOpen((open) => !open)}
                className="flex h-12 w-full cursor-pointer items-center justify-between rounded-lg border border-[#D5D9DD] bg-white px-4 text-left text-[14px] text-[#1A1A1A]"
              >
                <span>{selectedInterests || "관심 분야를 선택해주세요"}</span>
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
                  className="absolute z-10 mt-1 flex w-full flex-wrap gap-2 rounded-lg border border-[#D5D9DD] bg-white p-3 shadow-sm"
                >
                  {INTEREST_FIELD_OPTIONS.map((option) => {
                    const selected = interestFields.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggleInterest(option.value)}
                        className={`cursor-pointer rounded-md border px-3 py-1.5 text-[14px] ${selected ? "border-primary text-primary" : "border-[#D5D9DD] text-[#1A1A1A]"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-22 flex justify-center sm:mt-23">
          <button
            type="button"
            className="bg-primary h-12 w-full max-w-122 cursor-pointer rounded-xl text-[14px] font-medium text-white"
          >
            저장하기
          </button>
        </div>
      </div>
    </section>
  );
}
