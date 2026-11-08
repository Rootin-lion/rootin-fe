"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getMySectionHref } from "@/constants/my/navigation";
import type { MySection } from "@/constants/my/navigation";
import type { BookmarkCategory } from "@/constants/my/bookmark";
import type { AuthMember } from "@/types/oauth/oauth";
import MySidebar from "./MySidebar";
import MyDashboard from "./dashboard/MyDashboard";
import ProfileBanner from "./ProfileBanner";
import MyReport from "./report/MyReport";
import MyBookmark from "./bookmark/MyBookmark";
import MyReview from "./review/MyReview";
import MyOption from "./option/MyOption";

export default function MyContent({
  member,
  today,
  selectedSection,
  currentPage,
  bookmarkCategory,
}: {
  member: AuthMember | null;
  today: string;
  selectedSection: MySection;
  currentPage: number;
  bookmarkCategory: BookmarkCategory;
}) {
  const router = useRouter();
  const shouldScrollToTop = useRef(false);

  const handlePreviewSideChange = (side: MySection) => {
    shouldScrollToTop.current = true;
    router.push(getMySectionHref(side));
  };

  useEffect(() => {
    if (!shouldScrollToTop.current) return;

    shouldScrollToTop.current = false;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedSection]);

  return (
    <div className="mx-auto min-h-dvh w-full bg-white">
      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 px-4 pt-4 pb-10 md:grid-cols-[132px_minmax(0,1fr)] md:gap-x-3 md:gap-y-6 md:px-5 md:pt-6 lg:gap-x-7 lg:px-0 lg:pt-8 lg:pb-20">
        <div className="min-w-0 md:col-start-2 md:row-start-1">
          <ProfileBanner member={member} today={today} />
        </div>
        <MySidebar selectedSection={selectedSection} />
        <div className="min-w-0 md:col-start-2 md:row-start-2">
          {selectedSection === "dashboard" && (
            <MyDashboard today={today} onSideChange={handlePreviewSideChange} />
          )}
          {selectedSection === "bookmark" && (
            <MyBookmark category={bookmarkCategory} currentPage={currentPage} />
          )}
          {selectedSection === "review" && (
            <MyReview currentPage={currentPage} />
          )}
          {selectedSection === "interview" && (
            <MyReport currentPage={currentPage} />
          )}
          {selectedSection === "option" && <MyOption member={member} />}
        </div>
      </div>
    </div>
  );
}
