import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthSession } from "@/types/oauth/oauth";
import { MEMBER_SNAPSHOT_COOKIE } from "@/constants/auth/memberSnapshotCookie";
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

  const rawSession = (await cookies()).get(MEMBER_SNAPSHOT_COOKIE)?.value;
  let member: AuthSession["member"] | null = null;

  if (rawSession) {
    try {
      member = (JSON.parse(rawSession) as AuthSession).member ?? null;
    } catch {
      member = null;
    }
  }

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
