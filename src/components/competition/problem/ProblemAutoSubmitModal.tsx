"use client";

import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <ModalWrapper onClose={onClose}>
      <ModalWrapper.Box>
        <ModalWrapper.Title>TIME_OUT</ModalWrapper.Title>
        <ModalWrapper.Content>
          시간이 종료되어 자동 제출되었습니다.
        </ModalWrapper.Content>
      </ModalWrapper.Box>
      <ModalWrapper.Box>
        <Button isActive={true} onClick={onClose}>
          닫기
        </Button>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
