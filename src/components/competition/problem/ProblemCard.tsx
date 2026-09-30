"use client";

import { useState } from "react";
import type {
  CompetitionProblemDetail,
  CompetitionProblemOption,
  PanelType,
} from "@/types/competitions/competition";
import {
  addProblemBookmarkAction,
  removeProblemBookmarkAction,
} from "@/components/bookmark/action";
import BookmarkAction from "@/components/bookmark/BookmarkAction";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";

const ProblemOption = ({
  option,
  selected,
  onSelect,
}: {
  option: CompetitionProblemOption;
  selected: boolean;
  onSelect?: () => void;
}) => {
  const isDisabled = !onSelect || selected;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={isDisabled}
      onClick={onSelect}
      className={`border-primary-200 flex h-15 w-full items-center gap-5 rounded-lg border pl-5 text-left ${selected ? "bg-primary-100 border-primary border" : "bg-white"} text-black ${isDisabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {selected ? (
        <div className="border-primary shrink-0 rounded-[50%] border p-0.5">
          <div className="bg-primary h-2.5 w-2.5 shrink-0 rounded-[50%]" />
        </div>
      ) : (
        <span
          className={`h-3.5 w-3.5 rounded-full border ${selected ? "border-white bg-white" : "border-primary-200"}`}
        />
      )}
      <p className="text-[15px] font-medium">{option.optionContent}</p>
    </button>
  );
};

export default function ProblemCard({
  variant,
  currentProblem,
  showBookmark = false,
  selectedOptionId,
  onSelectOption,
}: {
  variant: PanelType;
  currentProblem?: CompetitionProblemDetail;
  showBookmark?: boolean;
  selectedOptionId?: number;
  onSelectOption?: (selectedOptionId: number) => void;
}) {
  const [bookmarkedByProblemId, setBookmarkedByProblemId] = useState<
    Record<number, boolean>
  >({});
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const problemId = currentProblem?.problemId;
  const isBookmarked =
    problemId !== undefined && (bookmarkedByProblemId[problemId] ?? false);

  // 북마크 설정
  const addBookmark = async () => {
    if (!currentProblem) return false;

    try {
      const res = await addProblemBookmarkAction(currentProblem.problemId);

      if (!res.ok) {
        setErrorContext(res.error);
        openModal();

        return false;
      }
      setBookmarkedByProblemId((prev) => ({
        ...prev,
        [currentProblem.problemId]: true,
      }));

      return true;
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "북마크 저장에 실패했습니다.",
      });
      openModal();

      return false;
    }
  };

  // 북마크 해제
  const removeBookmark = async () => {
    if (!currentProblem) return;

    try {
      const res = await removeProblemBookmarkAction(currentProblem.problemId);

      if (!res.ok) {
        setErrorContext(res.error);
        openModal();

        return;
      }

      setBookmarkedByProblemId((prev) => ({
        ...prev,
        [currentProblem.problemId]: false,
      }));
    } catch {
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: "북마크 해제에 실패했습니다.",
      });
      openModal();
    }
  };

  // 북마크 액션
  const handleBookmarkClick = async (): Promise<boolean> => {
    if (isBookmarked) {
      await removeBookmark();
      return false;
    }

    return await addBookmark();
  };

  return (
    <div>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-[18px] font-semibold text-black">
          {variant === "result" && currentProblem?.problemOrder}.{" "}
          {currentProblem?.problemContent}
        </h1>
        {showBookmark && (
          <BookmarkAction
            isBookmarked={isBookmarked}
            onClick={handleBookmarkClick}
          />
        )}
      </div>
      <div
        className="mt-7.5 flex flex-col gap-4"
        role="radiogroup"
        aria-label="답안 선택"
      >
        {currentProblem?.options.map((option) => (
          <ProblemOption
            key={option.optionId}
            option={option}
            selected={option.optionId === selectedOptionId}
            onSelect={
              onSelectOption ? () => onSelectOption(option.optionId) : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
