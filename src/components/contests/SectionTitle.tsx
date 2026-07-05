export default function SectionTitle({
  title,
  content,
  isRanking,
}: {
  title: string;
  content: string;
  isRanking?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-text font-bold text-[20px]">{title}</p>
        <p className="text-[12px] font-medium text-sub-text">{content}</p>
      </div>
      {isRanking && (
        <p className="text-sub-text text-[12px] font-medium">
          종료된 대회 더 보기 →
        </p>
      )}
    </div>
  );
}
