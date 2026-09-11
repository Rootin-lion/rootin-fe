import DetailWrapper from "./DetailWrapper";
import DetailImg from "../../../assets/contests/result/detail_img.png";
import Image from "next/image";

export default function DetailBanner() {
  return (
    <DetailWrapper>
      <div className="flex items-center px-8 py-4">
        <Image src={DetailImg} alt="detail_img" width={60} height={69} />
        <div className="ml-8 flex flex-col justify-center gap-2">
          <p className="text-[16px] font-semibold text-black">
            수고하셨어요! 대회를 완료했어요.
          </p>
          <p className="text-[13px] font-medium text-[#6B7280]">
            꾸준한 도전이 실력을 키웁니다. 내일도 함께해요!
          </p>
        </div>
      </div>
    </DetailWrapper>
  );
}
