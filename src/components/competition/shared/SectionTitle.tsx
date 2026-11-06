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
        <h1 className="text-text text-[17px] font-bold md:text-[20px]">
          {title}
        </h1>
        <p className="text-sub-text text-[12px] font-medium">{content}</p>
      </div>
    </div>
  );
}
