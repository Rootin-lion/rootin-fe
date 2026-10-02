import Button from "@/components/shared/Button";
import ModalWrapper from "@/components/shared/ModalWrapper";

export default function CompetitionJoinModal({
  onStart,
  onClose,
}: {
  onStart: () => void;
  onClose: () => void;
}) {
  return (
    <ModalWrapper onClose={onClose}>
      <ModalWrapper.Box>
        <ModalWrapper.Title>대회에 참여하시겠습니까?</ModalWrapper.Title>
      </ModalWrapper.Box>
      <ModalWrapper.Notice>
        <div className="text-text text-[15px] font-semibold">대회 주의사항</div>
        <ul className="text-disabled-text mt-3 list-inside list-disc text-[13px] font-medium">
          <li>정답률에 따라 포인트가 지급됩니다.</li>
          <li>제한 시간 초과 시 자동으로 제출됩니다.</li>
          <li>대회 결과는 실시간 랭킹에 반영됩니다.</li>
        </ul>
      </ModalWrapper.Notice>
      <ModalWrapper.Box>
        <div className="flex flex-row gap-6">
          <Button onClick={onClose}>취소</Button>
          <Button isActive={true} onClick={onStart}>
            시작하기
          </Button>
        </div>
      </ModalWrapper.Box>
    </ModalWrapper>
  );
}
