import Image from "next/image";
import GrowthImg from "@/assets/images/my/growth.png";
import type { AuthMember } from "@/types/oauth/oauth";
import LogoutButton from "./LogoutButton";

export default function ProfileBanner({
  member,
  today,
}: {
  member: AuthMember | null;
  today: string;
}) {
  const nickname =
    typeof member?.nickname === "string" ? member.nickname.trim() : "";
  const email = typeof member?.email === "string" ? member.email.trim() : "";
  const profileImageUrl =
    typeof member?.imgUrl === "string" ? member.imgUrl.trim() : "";

  return (
    <div className="relative grid w-full max-w-216 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl bg-[radial-gradient(100%_100%_at_0%_50%,#EEF3E7_0%,#E4EFE0_50%,#DAEBD9_100%)] p-3 md:p-4 lg:flex lg:justify-between lg:px-8 lg:py-6">
      <div className="flex min-w-0 flex-row items-center gap-3 lg:max-w-[calc(100%-300px)]">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="h-12 w-12 shrink-0 rounded-full object-cover md:h-14 md:w-14 lg:h-20 lg:w-20"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#7FB25B] text-xl text-white md:h-14 md:w-14 lg:h-20 lg:w-20 lg:text-2xl"
          >
            {nickname.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-0.5 wrap-anywhere">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 lg:gap-x-3">
            <p className="text-primary-900 min-w-0 text-[14px] font-bold lg:text-[16px]">
              {nickname || email || "사용자"}
            </p>
            <LogoutButton />
          </div>
          <p className="text-sub-text text-[11px] font-normal lg:text-[12px]">
            {email || "-"}
          </p>
          <p className="text-sub-text text-[11px] font-normal lg:text-[12px]">
            {today}
          </p>
        </div>
      </div>

      <div className="col-span-2 row-start-2 text-[11px] leading-5 font-medium text-[#4D4D4D] lg:absolute lg:right-40 lg:translate-y-2 lg:rounded-[30px] lg:bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#EAF3E8_100%)] lg:px-9 lg:py-4 lg:text-[12px] lg:after:pointer-events-none lg:after:absolute lg:after:-right-8 lg:after:bottom-4 lg:after:h-10 lg:after:w-14 lg:after:bg-[#EAF3E8] lg:after:content-[''] lg:after:[clip-path:polygon(0_0,100%_75%,0_100%)]">
        작은 성장이 모여 <br className="hidden lg:block" />큰 실력이 됩니다.
      </div>
      <div className="col-start-2 row-start-1 shrink-0">
        <Image
          src={GrowthImg}
          alt=""
          className="h-12 w-12 md:h-16 md:w-16 lg:h-25 lg:w-25"
        />
      </div>
    </div>
  );
}
