import ReviewIcon from "@/assets/icons/my/dashboard/review.svg";
import type { WrongAnswersState } from "@/types/my/dashboard";
import type { MySection } from "@/constants/my/navigation";
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
      icon={<ReviewIcon className="h-4 w-4 shrink-0 lg:h-6 lg:w-6" />}
      titleClassName="text-error"
      emptyMessage="오답 노트가 없습니다."
      items={reviews}
      onSideChange={onSideChange}
    />
  );
}
