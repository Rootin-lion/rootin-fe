"use client";

import { useEffect, useRef, useState } from "react";
import type { AuthMember } from "@/types/oauth/oauth";
import MySidebar from "./MySidebar";
import type { MySection } from "./MySidebar";
import MyDashboard from "./dashboard/MyDashboard";
import ProfileBanner from "./ProfileBanner";
import MyReport from "./report/MyReport";
import MyBookmark from "./bookmark/MyBookmark";
import MyReview from "./review/MyReview";
import MyOption from "./option/MyOption";

export default function MyContent({
  member,
  today,
  initialSection = "dashboard",
}: {
  member: AuthMember | null;
  today: string;
  initialSection?: MySection;
}) {
  const [selectedSection, setSelectedSection] =
    useState<MySection>(initialSection);
  const shouldScrollToTop = useRef(false);

  const handleSideChange = (side: MySection) => {
    setSelectedSection(side);
  };

  const handlePreviewSideChange = (side: MySection) => {
    shouldScrollToTop.current = true;
    setSelectedSection(side);
  };

  useEffect(() => {
    if (!shouldScrollToTop.current) return;

    shouldScrollToTop.current = false;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [selectedSection]);

  return (
    <div className="mx-auto min-h-dvh w-full bg-white">
      <div className="mx-auto flex max-w-5xl flex-row gap-7 pt-8 pb-20">
        <MySidebar
          selectedSection={selectedSection}
          onSideChange={handleSideChange}
        />
        <div className="flex w-full flex-col gap-6">
          <ProfileBanner member={member} today={today} />
          {selectedSection === "dashboard" && (
            <MyDashboard today={today} onSideChange={handlePreviewSideChange} />
          )}
          {selectedSection === "bookmark" && <MyBookmark />}
          {selectedSection === "review" && <MyReview />}
          {selectedSection === "interview" && <MyReport />}
          {selectedSection === "option" && <MyOption member={member} />}
        </div>
      </div>
    </div>
  );
}
