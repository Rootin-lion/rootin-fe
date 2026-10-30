import { redirect } from "next/navigation";
import { getMemberSnapshot } from "@/lib/auth/getMemberSnapshot";
import { isBookmarkCategory } from "@/constants/my/bookmark";
import type { BookmarkCategory } from "@/constants/my/bookmark";
import {
  getMyListHref,
  getMySectionHref,
  isMySection,
  parseMyPage,
} from "@/constants/my/navigation";
import MyContent from "@/components/my/MyContent";

export default async function MyPage(props: PageProps<"/my">) {
  const { section, category, page } = await props.searchParams;
  if (!isMySection(section)) {
    redirect(getMySectionHref("dashboard"));
  }

  const currentPage = parseMyPage(page);
  let bookmarkCategory: BookmarkCategory = "all";

  if (section === "bookmark") {
    bookmarkCategory = isBookmarkCategory(category) ? category : "all";
    if (category !== bookmarkCategory || page !== String(currentPage)) {
      redirect(getMyListHref(section, currentPage, bookmarkCategory));
    }
  } else if (section === "review" || section === "interview") {
    if (page !== String(currentPage)) {
      redirect(getMyListHref(section, currentPage));
    }
  }

  const member = await getMemberSnapshot();

  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replaceAll("-", ".");

  return (
    <MyContent
      member={member}
      today={today}
      selectedSection={section}
      currentPage={currentPage}
      bookmarkCategory={bookmarkCategory}
    />
  );
}
