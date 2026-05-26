import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="bg-[#EDEFEB] py-4">
      <div className="max-w-5xl flex flex-row justify-between mx-auto items-center">
        <Image src={Logo} alt="logo" width={125} height={39} />
        <div className="flex flex-row items-center gap-20">
          <div className="flex flex-row gap-3">
            <Link href="#" className="text-[13px] font-medium text-[#5A5A5A]">
              CS 대회
            </Link>
            <Link href="#" className="text-[13px] font-medium text-[#5A5A5A]">
              AI 면접
            </Link>
            <Link href="#" className="text-[13px] font-medium text-[#5A5A5A]">
              마이 페이지
            </Link>
          </div>
          <div className="flex flex-row items-center gap-2">
            <div className="rounded-[50%] bg-[#7FB25B] w-11 h-11"></div>
            사용자
          </div>
        </div>
      </div>
    </header>
  );
}
