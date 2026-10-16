"use client";

import { useState } from "react";
import type { AuthMember } from "@/types/oauth/oauth";
import MySidebar from "./MySidebar";
import MyDashboard from "./dashboard/MyDashboard";
import ProfileBanner from "./ProfileBanner";
import MyReport from "./report/MyReport";
import MyBookmark from "./bookmark/MyBookmark";
import MyReview from "./review/MyReview";

export default function MyContent({
  member,
  today,
}: {
  member: AuthMember | null;
  today: string;
}) {
  const [selectedSection, setSelectedSection] = useState("dashboard");

  const handleSideChange = (side: string) => {
    setSelectedSection(side);
  };

  return (
    <div className="mx-auto w-full bg-white">
      <div className="mx-auto flex max-w-5xl flex-row gap-7 pt-8 pb-20">
        <MySidebar
          selectedSection={selectedSection}
          onSideChange={handleSideChange}
        />
        <div className="flex w-full flex-col gap-6">
          <ProfileBanner member={member} today={today} />
          {selectedSection === "dashboard" && <MyDashboard today={today} />}
          {selectedSection === "bookmark" && <MyBookmark />}
          {selectedSection === "review" && <MyReview />}
          {selectedSection === "interview" && <MyReport />}
        </div>
      </div>
    </div>
  );
}
