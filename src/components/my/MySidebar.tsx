import Link from "next/link";
import { getMySectionHref, MY_NAV_ITEMS } from "@/constants/my/navigation";
import type { MySection } from "@/constants/my/navigation";

export default function MySidebar({
  selectedSection,
}: {
  selectedSection: MySection;
}) {
  return (
    <div className="relative max-h-57 pr-3 after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-[linear-gradient(to_bottom,transparent_0%,var(--color-primary)_50%,transparent_100%)] after:content-['']">
      <ul className="flex flex-col gap-3">
        {MY_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={getMySectionHref(item.value)}
              scroll={false}
              aria-current={selectedSection === item.value ? "page" : undefined}
              className={`flex h-9 w-30 items-center justify-center text-[14px] font-normal ${selectedSection === item.value ? "bg-bg-green-200 text-text rounded-lg" : "text-disabled-text"}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
