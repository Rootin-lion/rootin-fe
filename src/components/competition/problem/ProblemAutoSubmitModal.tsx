"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";

export default function ProblemAutoSubmitModal({
  competitionId,
  onClose,
}: {
  competitionId: number;
  onClose: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    const redirectTimoutId = window.setTimeout(() => {
      router.replace(`/competitions/${competitionId}/result`);
    }, 3000);

    return () => {
      window.clearTimeout(redirectTimoutId);
    };
  }, [competitionId, router]);

  return (
    <ModalWrapper
      onClose={onClose}
      describedByContent
      className="max-md:gap-4 max-md:py-5"
    >
      <ModalWrapper.Box>
        <ModalWrapper.Title className="max-md:text-[14px]">
          TIME_OUT
        </ModalWrapper.Title>
        <ModalWrapper.Content className="max-md:text-[12px]">
          시간이 종료되어 자동 제출되었습니다.
        </ModalWrapper.Content>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <Button
          isActive={true}
          onClick={onClose}
          className="max-md:min-h-9 max-md:py-1.5 max-md:text-[12px]"
        >
          닫기
        </Button>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
