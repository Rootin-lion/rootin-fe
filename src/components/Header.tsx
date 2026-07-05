import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="bg-bg-ivory py-4">
      <div className="mx-auto flex max-w-5xl flex-row items-center justify-between">
        <div className="flex flex-row gap-30">
          <Image src={Logo} alt="logo" width={125} height={39} />
          <div className="flex flex-row items-center gap-18">
            <Link href="#" className="text-sub-text text-[15px] font-medium">
              CS 대회
            </Link>
            <Link href="#" className="text-sub-text text-[15px] font-medium">
              AI 면접
            </Link>
            <Link href="#" className="text-sub-text text-[15px] font-medium">
              마이 페이지
            </Link>
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[50%] bg-[#7FB25B] text-white">
          U
        </div>
      </div>
    </header>
  );
}
