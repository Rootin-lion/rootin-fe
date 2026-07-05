import Image from "next/image";
import LogoImg from "../../assets/logo.png";

export default function Header() {
  return (
    <div className="bg-bg-ivory flex w-full items-center justify-center">
      <div className="flex w-full max-w-5xl items-center justify-between py-4">
        <div className="flex gap-31">
          <Image
            src={LogoImg}
            alt="logo"
            className="h-auto w-45"
            loading="eager"
          />
          <div className="text-sub-text flex items-center gap-19">
            <p>CS 대회</p>
            <p>모의 면접</p>
            <p>마이페이지</p>
          </div>
        </div>
        <div className="h-10 w-10 rounded-[50%] bg-green-300"></div>
      </div>
    </div>
  );
}
