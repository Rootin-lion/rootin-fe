import Image from "next/image";
import GrowthImg from "@/assets/my/growth.png";
import type { AuthMember } from "@/types/oauth/oauth";

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
    <div className="relative flex w-full max-w-213 flex-row justify-between rounded-xl bg-[radial-gradient(100%_100%_at_0%_50%,#EEF3E7_0%,#E4EFE0_50%,#DAEBD9_100%)] px-8 py-6">
      <div className="flex flex-row items-center gap-3">
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="h-20 w-20 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#7FB25B] text-2xl text-white"
          >
            {nickname.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-primary-900 text-[16px] font-bold">
            {nickname || email || "사용자"}
          </p>
          <p className="text-sub-text text-[12px] font-normal">
            {email || "-"}
          </p>
          <p className="text-sub-text text-[12px] font-normal">{today}</p>
        </div>
      </div>

      <div className="-after:right-8 absolute right-40 rounded-[30px] bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#EAF3E8_100%)] px-9 py-4 text-[12px] leading-5 font-medium whitespace-pre-wrap text-[#4D4D4D] after:pointer-events-none after:absolute after:bottom-4 after:h-10 after:w-14 after:bg-[#EAF3E8] after:content-[''] after:[clip-path:polygon(0_0,100%_75%,0_100%)]">
        작은 성장이 모여{"\n"} 큰 실력이 됩니다.
      </div>
      <div>
        <Image src={GrowthImg} alt="" className="h-25 w-25" />
      </div>
    </div>
  );
}
