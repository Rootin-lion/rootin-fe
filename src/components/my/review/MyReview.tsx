"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import ChevronIcon from "@/assets/icon/shared/chevron.svg";
import { getMyReviewsAction } from "@/app/(service)/my/action";
import BarPagination from "@/components/shared/BarPagination";
import ErrorModal from "@/components/shared/ErrorModal";
import { getMyListHref } from "@/constants/my/navigation";
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

export default function MyReview({ currentPage }: { currentPage: number }) {
  const router = useRouter();
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
    pageData: reviews,
    isLoading,
    hasLoadError,
  } = useMyPagedList<MyReviewsPage>(
    getMyReviewsAction,
    currentPage,
    handleLoadError,
  );

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
      <div className="mt-4 flex flex-col gap-2 md:mt-9 md:gap-6">
        {isLoading ? (
          <p
            className="text-sub-text mt-6 text-center text-[12px] md:mt-12 md:text-sm"
            role="status"
          >
            오답 노트를 불러오는 중입니다.
          </p>
        ) : hasLoadError ? (
          <p className="text-sub-text text-[12px] md:text-sm">
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
          <p className="text-sub-text text-[12px] md:text-sm">
            아직 오답 노트가 없습니다.
          </p>
        )}
      </div>
      {!isLoading && !hasLoadError && (
        <>
          {(reviews?.totalPages ?? 0) > 1 && (
            <nav
              aria-label="오답 노트 페이지 이동"
              className="mt-6 flex items-center justify-between gap-2 md:hidden"
            >
              <button
                type="button"
                aria-label="이전 페이지"
                disabled={currentPage <= 1}
                onClick={() =>
                  router.push(getMyListHref("review", currentPage - 1), {
                    scroll: false,
                  })
                }
                className="text-primary-900 focus-visible:outline-primary flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] focus-visible:outline-2 enabled:cursor-pointer disabled:opacity-40"
              >
                <ChevronIcon
                  aria-hidden="true"
                  className="h-3 w-1.5 rotate-180"
                />
                이전
              </button>
              <p
                className="text-sub-text text-[12px] whitespace-nowrap tabular-nums"
                aria-live="polite"
              >
                <span className="text-primary-900 font-semibold">
                  {currentPage}
                </span>{" "}
                / {reviews?.totalPages ?? 0}
              </p>
              <button
                type="button"
                aria-label="다음 페이지"
                disabled={currentPage >= (reviews?.totalPages ?? 0)}
                onClick={() =>
                  router.push(getMyListHref("review", currentPage + 1), {
                    scroll: false,
                  })
                }
                className="text-primary-900 focus-visible:outline-primary flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] focus-visible:outline-2 enabled:cursor-pointer disabled:opacity-40"
              >
                다음
                <ChevronIcon aria-hidden="true" className="h-3 w-1.5" />
              </button>
            </nav>
          )}
          <div className="hidden md:block">
            <BarPagination
              currentPage={currentPage}
              totalPages={reviews?.totalPages ?? 0}
              onPageChange={(page) =>
                router.push(getMyListHref("review", page), { scroll: false })
              }
              className="mt-20"
            />
          </div>
        </>
      )}
    </div>
  );
}
