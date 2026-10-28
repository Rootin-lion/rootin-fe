import type { ReactNode } from "react";
import type { BookmarksState, WrongAnswersState } from "@/types/my/dashboard";
import type { MySection } from "../MySidebar";
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
    <div className="bg-bg-green-50 w-full max-w-98.75 rounded-lg p-2.5">
      <div className="flex flex-row items-center justify-between">
        <div className={`${titleClassName} flex flex-row gap-2`}>
          {icon}
          <p className="text-[14px] font-semibold">{title}</p>
        </div>
        <button
          type="button"
          className="text-sub-text cursor-pointer text-[10px] font-medium"
          onClick={() => onSideChange(props.type)}
        >
          더보기
        </button>
      </div>
      <div className="mt-3 flex flex-col gap-3">
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
