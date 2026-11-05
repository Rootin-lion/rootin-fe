"use client";

import Image from "next/image";
import GoogleIcon from "@/assets/login/google.png";
import KakaoIcon from "@/assets/login/kakao.png";
import LogoImg from "@/assets/logo.png";

const KakaoLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="focus-visible:outline-primary-900 grid min-h-12 w-full cursor-pointer grid-cols-[20px_1fr_20px] items-center gap-2 rounded-xl bg-[#FEE500] px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 md:px-6 md:py-4"
      onClick={onClick}
    >
      <Image src={KakaoIcon} width={20} height={20} alt="" loading="eager" />
      <span className="text-[14px] font-medium md:text-[15px]">
        카카오 계정으로 시작하기
      </span>
    </button>
  );
};

const GoogleLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="focus-visible:outline-primary-900 grid min-h-12 w-full cursor-pointer grid-cols-[20px_1fr_20px] items-center gap-2 rounded-xl border border-[#6FB377] bg-white px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 md:px-6 md:py-4"
      onClick={onClick}
    >
      <Image src={GoogleIcon} width={20} height={20} alt="" loading="eager" />
      <span className="text-[14px] font-medium md:text-[15px]">
        구글 계정으로 시작하기
      </span>
    </button>
  );
};

const LoginNoticeHighlight = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-primary-400">{children}</span>;
};

export default function SocialLoginSection() {
  return (
    <section className="bg-primary-50 flex min-w-0 flex-1 items-center justify-center px-6 py-10 md:justify-start md:py-12 lg:px-10 xl:pl-26">
      <div className="flex w-full max-w-120 flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
          <Image src={LogoImg} alt="ROOTIN" width={180} height={57} />
          <p className="text-sub-text mt-6 text-[14px] font-normal">
            소셜 로그인으로 빠르게 시작하세요
          </p>
        </div>
        <div className="mt-8 flex w-full max-w-80 flex-col gap-3 md:max-w-95 md:gap-6">
          <KakaoLoginButton
            onClick={() => {
              window.location.assign("/oauth/kakao");
            }}
          />
          <GoogleLoginButton
            onClick={() => {
              window.location.assign("/oauth/google");
            }}
          />
        </div>
        <p className="text-sub-text mt-7 text-center text-[12px] leading-relaxed font-normal break-keep">
          계속 진행하면 <LoginNoticeHighlight>Rootin</LoginNoticeHighlight>의{" "}
          <LoginNoticeHighlight>이용약관</LoginNoticeHighlight>과{" "}
          <LoginNoticeHighlight>개인정보처리방침</LoginNoticeHighlight>에
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </section>
  );
}
