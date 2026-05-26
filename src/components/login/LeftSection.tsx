import Image from "next/image";
import LoginImg from "../../assets/login.png";

export default function LeftSection() {
  return (
    <div className="bg-green-50 flex-1 flex flex-col items-end justify-center">
      <div className="w-180 pl-10">
        <div className="text-[40px] font-bold text-left whitespace-pre-wrap">
          CS 실력 성장의 시작, {"\n"}
          <span className="text-[#36723E]">ROOTIN</span>과 함께하세요
        </div>
        <Image
          src={LoginImg}
          width={530}
          height={430}
          alt="login"
          className="mt-12"
        />
      </div>
    </div>
  );
}
