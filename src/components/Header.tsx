import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="bg-bg-ivory py-4">
      <div className="max-w-5xl flex flex-row justify-between mx-auto items-center">
        <div className="flex flex-row gap-30">
          <Image src={Logo} alt="logo" width={125} height={39} />
          <div className="flex flex-row gap-18 items-center">
            <Link href="#" className="text-[15px] font-medium text-sub-text">
              CS 대회
            </Link>
            <Link href="#" className="text-[15px] font-medium text-sub-text">
              AI 면접
            </Link>
            <Link href="#" className="text-[15px] font-medium text-sub-text">
              마이 페이지
            </Link>
          </div>
        </div>
        <div className="rounded-[50%] bg-[#7FB25B] w-11 h-11 flex items-center justify-center text-white">
          U
        </div>
      </div>
    </header>
  );
}
