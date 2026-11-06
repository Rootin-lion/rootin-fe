"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import CharImg from "@/assets/success_char.png";
import LogoImg from "@/assets/logo.png";
import type { AuthMember } from "@/types/oauth/oauth";

const NavItems = [
  { id: 1, content: "CS 대회", to: "/competitions" },
  { id: 2, content: "AI 면접", to: "/interviews" },
  { id: 3, content: "마이 페이지", to: "/my" },
];

const NavItem = ({ content, to }: { content: string; to: string }) => {
  const pathname = usePathname();
  const isActive = pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link
      href={to}
      aria-current={
        isActive ? (pathname === to ? "page" : "location") : undefined
      }
      className={`text-[15px] ${isActive ? "text-primary-900 font-bold" : "text-sub-text font-medium"}`}
    >
      {content}
    </Link>
  );
};

export default function Header({ member }: { member: AuthMember | null }) {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const isOpen = openPath === pathname;
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const nickname =
    typeof member?.nickname === "string" ? member.nickname.trim() : "";
  const profileImg =
    typeof member?.imgUrl === "string" ? member.imgUrl.trim() : "";
  const email = typeof member?.email === "string" ? member.email.trim() : "";

  return (
    <header
      className="bg-bg-ivory relative z-30 flex w-full flex-col items-center px-5 lg:px-6"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setOpenPath(null);
          menuButtonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setOpenPath(null);
      }}
    >
      <div className="flex min-h-14 w-full max-w-5xl items-center justify-between gap-4 py-1 lg:py-4">
        <div className="flex items-center gap-10 xl:gap-31">
          <Link
            href="/"
            aria-label="ROOTIN 홈"
            onClick={() => setOpenPath(null)}
          >
            <Image
              src={LogoImg}
              alt=""
              width={100}
              height={38}
              className="cursor-pointer"
              loading="eager"
            />
          </Link>
          <nav
            aria-label="주 메뉴"
            className="text-sub-text hidden items-center gap-10 text-[16px] lg:flex xl:gap-19"
          >
            {NavItems.map((item) => (
              <NavItem key={item.id} content={item.content} to={item.to} />
            ))}
          </nav>
        </div>
        <div className="hidden min-w-0 items-center justify-center gap-4 lg:flex">
          <p className="text-body-2 text-text max-w-40 truncate">
            {`${nickname || email || "사용자"}님`}
          </p>
          {profileImg ? (
            <Image
              src={profileImg}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="bg-primary-200 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full"
            >
              <Image src={CharImg} alt="" className="h-9 w-9 object-contain" />
            </div>
          )}
        </div>
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setOpenPath(isOpen ? null : pathname)}
          className="text-primary-900 flex h-11 w-11 items-center justify-center rounded-lg focus-visible:outline-2 lg:hidden"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d={isOpen ? "M6 6l12 12M18 6L6 18" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <button
          type="button"
          aria-label="메뉴 닫기"
          tabIndex={-1}
          onClick={() => setOpenPath(null)}
          className="fixed inset-0 top-14 -z-10 bg-black/10 lg:hidden"
        />
      )}
      <nav
        id="mobile-navigation"
        aria-label="모바일 주 메뉴"
        hidden={!isOpen}
        className="bg-bg-ivory border-primary-100 absolute top-full right-0 left-0 border-t px-5 py-3 shadow-sm lg:hidden"
        onClick={() => setOpenPath(null)}
      >
        {NavItems.map((item) => (
          <div
            key={item.id}
            className="[&_a]:flex [&_a]:min-h-12 [&_a]:items-center"
          >
            <NavItem content={item.content} to={item.to} />
          </div>
        ))}
      </nav>
    </header>
  );
}
