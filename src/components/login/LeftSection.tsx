import Image from "next/image";
import LoginImg from "../../assets/login.png";

export default function LeftSection() {
  return (
    <div className="flex flex-1 flex-col items-end justify-center bg-[#EEF3E7]">
      <div className="mr-26 flex flex-col items-center justify-center">
        <div className="w-132.5 text-left text-[40px] font-bold whitespace-pre-wrap">
          CS 실력 성장의 시작, {"\n"}
          <span className="text-[#36723E]">ROOTIN</span>과 함께하세요
        </div>
        <Image
          src={LoginImg}
          width={530}
          height={430}
          alt="login"
          className="mt-12"
          loading="eager"
        />
      </div>
    </div>
  );
}
