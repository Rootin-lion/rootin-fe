"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoImg from "@/assets/logo.png";

const NavItems = [
  { id: 1, content: "CS 대회", to: "/contests" },
  { id: 2, content: "AI 면접", to: "/interviews" },
  { id: 3, content: "마이 페이지", to: "/#" },
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

export default function Header() {
  return (
    <header className="bg-bg-ivory flex w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between py-4">
        <div className="flex gap-31">
          <Link href="/">
            <Image
              src={LogoImg}
              alt=""
              width={100}
              height={38}
              className="cursor-pointer"
              loading="eager"
            />
          </Link>
          <div className="text-sub-text flex items-center gap-19 text-[16px]">
            {NavItems.map((item) => (
              <NavItem key={item.id} content={item.content} to={item.to} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-body-2 text-text">안녕안녕 님</p>
          <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[50%] bg-[#7FB25B] text-white">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
