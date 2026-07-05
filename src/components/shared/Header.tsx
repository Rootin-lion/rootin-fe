import Image from "next/image";
import Link from "next/link";
import LogoImg from "../../assets/logo.png";

export default function Header() {
  return (
    <div className="bg-bg-ivory flex w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between py-4">
        <div className="flex gap-31">
          <Image
            src={LogoImg}
            alt="logo"
            width={120}
            height={40}
            className="cursor-pointer"
            loading="eager"
          />
          <div className="text-sub-text flex items-center gap-19 text-[16px]">
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
        <div className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-[50%] bg-[#7FB25B] text-white">
          U
        </div>
      </div>
    </div>
  );
}
