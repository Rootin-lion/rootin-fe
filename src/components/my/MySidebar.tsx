import Link from "next/link";
import { getMySectionHref, MY_NAV_ITEMS } from "@/constants/my/navigation";
import type { MySection } from "@/constants/my/navigation";

export default function MySidebar({
  selectedSection,
}: {
  selectedSection: MySection;
}) {
  return (
    <nav
      aria-label="마이페이지 메뉴"
      className="border-primary-200 relative min-w-0 border-b pb-2 md:col-start-1 md:row-span-2 md:row-start-1 md:max-h-57 md:border-b-0 md:pr-3 md:pb-0 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px md:after:bg-[linear-gradient(to_bottom,transparent_0%,var(--color-primary)_50%,transparent_100%)] md:after:content-['']"
    >
      <ul className="flex w-full flex-wrap justify-start gap-1 md:flex-col md:gap-3">
        {MY_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={getMySectionHref(item.value)}
              scroll={false}
              aria-current={selectedSection === item.value ? "page" : undefined}
              className={`focus-visible:outline-primary flex min-h-8 items-center justify-center rounded-lg px-1.5 text-[11px] font-normal whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 md:h-9 md:min-h-9 md:w-30 md:px-0 md:text-[14px] ${selectedSection === item.value ? "bg-bg-green-200 text-text" : "text-disabled-text"}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
