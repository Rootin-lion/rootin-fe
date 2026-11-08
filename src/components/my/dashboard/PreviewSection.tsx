import type { ReactNode } from "react";
import type { BookmarksState, WrongAnswersState } from "@/types/my/dashboard";
import type { MySection } from "@/constants/my/navigation";
import EmptyPreview from "./EmptyPreview";
import PreviewItem from "./PreviewItem";

type PreviewSectionProps = {
  title: string;
  icon: ReactNode;
  titleClassName: string;
  emptyMessage: string;
  onSideChange: (side: MySection) => void;
} & (
  | { type: "bookmark"; items: BookmarksState[] }
  | { type: "review"; items: WrongAnswersState[] }
);

export default function PreviewSection(props: PreviewSectionProps) {
  const { title, icon, titleClassName, emptyMessage, onSideChange } = props;

  return (
    <div className="bg-bg-green-50 w-full min-w-0 rounded-lg p-2 lg:max-w-98.75 lg:p-2.5">
      <div className="flex flex-row items-center justify-between">
        <div
          className={`${titleClassName} flex min-w-0 flex-row items-center gap-1.5 lg:gap-2`}
        >
          {icon}
          <p className="text-[12px] font-semibold lg:text-[14px]">{title}</p>
        </div>
        <button
          type="button"
          aria-label={`${title} 더보기`}
          className="text-sub-text focus-visible:outline-primary min-h-11 shrink-0 cursor-pointer rounded px-2 text-[11px] font-medium focus-visible:outline-2 lg:min-h-0 lg:px-0 lg:text-[10px]"
          onClick={() => onSideChange(props.type)}
        >
          더보기
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-2 lg:mt-3 lg:gap-3">
        {props.items.length > 0 ? (
          props.type === "bookmark" ? (
            props.items.map((item) => (
              <PreviewItem key={item.problemId} type="bookmark" item={item} />
            ))
          ) : (
            props.items.map((item) => (
              <PreviewItem
                key={item.competitionProblemId}
                type="review"
                item={item}
              />
            ))
          )
        ) : (
          <EmptyPreview message={emptyMessage} />
        )}
      </div>
    </div>
  );
}
