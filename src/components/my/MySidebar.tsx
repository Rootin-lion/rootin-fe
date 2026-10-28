const NavItems = [
  { id: 1, title: "대시보드", value: "dashboard" },
  { id: 2, title: "북마크", value: "bookmark" },
  { id: 3, title: "오답노트", value: "review" },
  { id: 4, title: "면접 리포트", value: "interview" },
  { id: 5, title: "설정", value: "option" },
] as const;

export type MySection = (typeof NavItems)[number]["value"];

export default function MySidebar({
  selectedSection,
  onSideChange,
}: {
  selectedSection: MySection;
  onSideChange: (selectedSection: MySection) => void;
}) {
  return (
    <div className="relative max-h-57 pr-3 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-[linear-gradient(to_bottom,transparent_0%,var(--color-primary)_50%,transparent_100%)] after:content-['']">
      <ul className="flex flex-col gap-3">
        {NavItems.map((item) => (
          <li
            key={item.id}
            onClick={() => onSideChange(item.value)}
            className={`flex h-9 w-30 cursor-pointer items-center justify-center text-[14px] font-normal ${selectedSection === item.value ? "bg-bg-green-200 text-text rounded-lg" : "text-disabled-text"}`}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
