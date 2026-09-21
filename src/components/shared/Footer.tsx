import Image from "next/image";
import Link from "next/link";
import LogoImg from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-bg-ivory">
      <div className="w-full px-6 pt-12 pb-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="mx-auto w-full max-w-5xl">
            <Link
              href="/"
              aria-label="ROOTIN 홈으로 이동"
              className="focus-visible:outline-primary-900 inline-block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <Image src={LogoImg} alt="ROOTIN" width={118} height={38} />
            </Link>
            <p className="text-sub-text mt-4 text-sm leading-6">
              CS 학습과 모의 면접으로 매일의 성장을 이어가세요.
            </p>
          </div>
        </div>

        <div className="border-primary-200 text-disabled-text mx-auto mt-12 w-full max-w-5xl border-t pt-5 text-xs">
          © ROOTIN. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
