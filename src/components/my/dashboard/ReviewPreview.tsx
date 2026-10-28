import ReviewIcon from "@/assets/review.svg";
import type { WrongAnswersState } from "@/types/my/dashboard";
import type { MySection } from "../MySidebar";
import PreviewSection from "./PreviewSection";

export default function ReviewPreview({
  reviews,
  onSideChange,
}: {
  reviews: WrongAnswersState[];
  onSideChange: (side: MySection) => void;
}) {
  return (
    <PreviewSection
      type="review"
      title="오답노트"
      icon={<ReviewIcon className="h-6 w-6 shrink-0" />}
      titleClassName="text-error"
      emptyMessage="오답 노트가 없습니다."
      items={reviews}
      onSideChange={onSideChange}
    />
  );
}
