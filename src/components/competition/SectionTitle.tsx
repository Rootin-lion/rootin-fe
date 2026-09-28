export default function SectionTitle({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="flex justify-between">
      <div>
        <h1 className="text-text text-[20px] font-bold">{title}</h1>
        <p className="text-sub-text text-[12px] font-medium">{content}</p>
      </div>
    </div>
  );
}
