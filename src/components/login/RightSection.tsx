import Image from "next/image";
import LogoImg from "../../assets/logo.png";
import KakaoImg from "../../assets/login/kakao.png";
import GoogleImg from "../../assets/login/google.png";

const ButtonText = ({ text }: { text: string }) => {
  return <p className="text-[15px] font-medium">{text}</p>;
};

const KakaoButton = () => {
  return (
    <div className="flex cursor-pointer items-center gap-20 rounded-xl bg-[#FEE500] px-6 py-4">
      <Image
        src={KakaoImg}
        width={20}
        height={18}
        alt="kakako"
        loading="eager"
      />
      <ButtonText text="카카오 계정으로 시작하기" />
    </div>
  );
};

const GoogleButton = () => {
  return (
    <div className="flex cursor-pointer items-center gap-20 rounded-xl border border-[#6FB377] bg-[#ffffff] px-6 py-4">
      <Image
        src={GoogleImg}
        width={20}
        height={18}
        alt="google"
        loading="eager"
      />
      <ButtonText text="구글 계정으로 시작하기" />
    </div>
  );
};

const HighlightText = ({ children }: { children: React.ReactNode }) => {
  return <span className="text-primary-400">{children}</span>;
};

export default function RightSection() {
  return (
    <div className="bg-primary-50 flex flex-1 items-center justify-start">
      <div className="ml-26 flex flex-col items-center justify-center">
        <div className="flex flex-col gap-2">
          <Image src={LogoImg} alt="logo" width={180} height={90} />
          <p className="text-sub-text text-[14px] font-normal">
            소셜 로그인으로 빠르게 시작하세요
          </p>
        </div>
        <div className="mt-8 flex w-full max-w-95 flex-col gap-6">
          <KakaoButton />
          <GoogleButton />
        </div>
        <p className="text-sub-text mt-7 text-[14px] font-normal">
          계속 진행하면 <HighlightText>Rootin</HighlightText>의{" "}
          <HighlightText>이용약관</HighlightText>과{" "}
          <HighlightText>개인정보처리방침</HighlightText>에 동의하는 것으로
          간주됩니다.
        </p>
      </div>
    </div>
  );
}
