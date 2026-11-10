import Image from "next/image";
import DetailImg from "@/assets/images/competitions/result/detail_img.png";
import DetailWrapper from "./DetailWrapper";

export default function DetailBanner() {
  return (
    <DetailWrapper>
      <div className="flex items-center gap-3 p-4 md:gap-5 lg:gap-8 lg:px-8">
        <Image
          src={DetailImg}
          alt=""
          width={60}
          height={69}
          className="h-auto w-10 shrink-0 md:w-15"
        />
        <div className="flex min-w-0 flex-col justify-center gap-1 md:gap-2">
          <p className="text-[14px] font-semibold break-keep text-black md:text-[16px]">
            수고하셨어요! 대회를 완료했어요.
          </p>
          <p className="text-sub-text text-[12px] font-medium break-keep whitespace-pre-wrap md:text-[13px]">
            꾸준한 도전이 실력을 키웁니다.{"\n"} 내일도 함께해요!
          </p>
        </div>
      </div>
    </DetailWrapper>
  );
}
