import Link from "next/link";
import { getMySectionHref, MY_NAV_ITEMS } from "@/constants/my/navigation";
import type { MySection } from "@/constants/my/navigation";
import LogoutButton from "./LogoutButton";

export default function MySidebar({
  selectedSection,
}: {
  selectedSection: MySection;
}) {
  return (
    <nav
      aria-label="마이페이지 메뉴"
      className="border-primary-200 min-w-0 border-b pb-2 md:col-start-1 md:row-span-2 md:row-start-1 md:self-start md:border-b-0 md:pb-0"
    >
      <ul className="relative flex w-full flex-wrap justify-start gap-1 md:flex-col md:gap-3 md:pr-3 md:after:absolute md:after:inset-y-0 md:after:right-0 md:after:w-px md:after:bg-[linear-gradient(to_bottom,transparent_0%,var(--color-primary)_50%,transparent_100%)] md:after:content-['']">
        {MY_NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={getMySectionHref(item.value)}
              scroll={false}
              aria-current={selectedSection === item.value ? "page" : undefined}
              className={`focus-visible:outline-primary flex min-h-8 items-center justify-center rounded-lg px-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 md:h-9 md:min-h-9 md:w-30 md:px-0 ${selectedSection === item.value ? "text-text md:bg-bg-green-200 text-[12px] font-semibold md:text-[14px] md:font-normal" : "text-disabled-text text-[11px] font-normal md:text-[14px]"}`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-3 hidden md:block">
        <LogoutButton variant="tab" />
      </div>
    </nav>
  );
}
