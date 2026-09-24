"use client";

import Image from "next/image";
import LogoImg from "@/assets/logo.png";
import KakaoImg from "@/assets/login/kakao.png";
import GoogleImg from "@/assets/login/google.png";

const KakaoLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-20 rounded-xl bg-[#FEE500] px-6 py-4"
      onClick={onClick}
    >
      <Image src={KakaoImg} width={20} height={20} alt="" loading="eager" />
      <span className="text-[15px] font-medium">카카오 계정으로 시작하기</span>
    </button>
  );
};

const GoogleLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-20 rounded-xl border border-[#6FB377] bg-white px-6 py-4"
      onClick={onClick}
    >
      <Image src={GoogleImg} width={20} height={20} alt="" loading="eager" />
      <span className="text-[15px] font-medium">구글 계정으로 시작하기</span>
    </button>
  );
};

const LoginAgreementHighlight = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span className="text-primary-400">{children}</span>;
};

export default function SocialLoginSection() {
  return (
    <section className="bg-primary-50 flex flex-1 items-center justify-start">
      <div className="ml-26 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
          <Image src={LogoImg} alt="ROOTIN" width={180} height={57} />
          <p className="text-sub-text mt-6 text-[14px] font-normal">
            소셜 로그인으로 빠르게 시작하세요
          </p>
        </div>
        <div className="mt-8 flex w-full max-w-95 flex-col gap-6">
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
        <p className="text-sub-text mt-7 text-[12px] font-normal">
          계속 진행하면
          <LoginAgreementHighlight>Rootin</LoginAgreementHighlight>의
          <LoginAgreementHighlight>이용약관</LoginAgreementHighlight>과
          <LoginAgreementHighlight>개인정보처리방침</LoginAgreementHighlight>에
          동의하는 것으로 간주됩니다.
        </p>
      </div>
    </section>
  );
}
