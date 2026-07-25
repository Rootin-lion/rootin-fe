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
        <p className="text-text text-[20px] font-bold">{title}</p>
        <p className="text-sub-text text-[12px] font-medium">{content}</p>
      </div>
      {isRanking && (
        <p className="text-primary-900 cursor-pointer text-[14px] font-bold">
          종료된 대회 더 보기 →
        </p>
      )}
    </div>
  );
}
