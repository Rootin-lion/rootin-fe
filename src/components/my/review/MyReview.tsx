"use client";

import { useCallback } from "react";
import { getMyReviewsAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import type { ApiError } from "@/types/api/error";
import type { MyReviewsPage } from "@/types/my/review";
import useMyPagedList from "../hooks/useMyPagedList";
import ReviewItem from "./ReviewItem";
import ReviewTitle from "./ReviewTitle";

function shouldShowReviewErrorModal(error: ApiError) {
  return (
    (error.status === 404 && error.code === "C404-6") ||
    (error.status === 401 && error.code === "C401") ||
    (error.status === 500 && error.code === "C500")
  );
}

export default function MyReview() {
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();
  const handleLoadError = useCallback(
    (loadError: ApiError) => {
      if (shouldShowReviewErrorModal(loadError)) {
        setErrorContext(loadError);
        openModal();
      }
    },
    [setErrorContext, openModal],
  );
  const {
    currentPage,
    pageData: reviews,
    isLoading,
    hasLoadError,
    changePage,
  } = useMyPagedList<MyReviewsPage>(getMyReviewsAction, handleLoadError);

  return (
    <div>
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}
      <ReviewTitle totalElements={reviews?.totalElements ?? 0} />
      <div className="mt-9 flex flex-col gap-6">
        {isLoading ? (
          <p className="text-sub-text mt-12 text-center text-sm" role="status">
            오답 노트를 불러오는 중입니다.
          </p>
        ) : hasLoadError ? (
          <p className="text-sub-text text-sm">
            오답 노트를 불러오지 못했습니다.
          </p>
        ) : reviews?.content.length ? (
          reviews.content.map((review) => (
            <ReviewItem
              key={`${review.competitionId}-${review.competitionProblemId}`}
              review={review}
            />
          ))
        ) : (
          <p className="text-sub-text text-sm">아직 오답 노트가 없습니다.</p>
        )}
      </div>
      {!isLoading && !hasLoadError && (
        <BarPagination
          currentPage={currentPage}
          totalPages={reviews?.totalPages ?? 0}
          onPageChange={changePage}
          className="mt-20"
        />
      )}
    </div>
  );
}
