import Image from "next/image";
import ArrowIcon from "../../../assets/main/arrow.svg";
import { FeatureData } from "@/types/main/featureItem";

interface FeatureCardProps {
  item: FeatureData;
}

export function FeatureCard({ item }: FeatureCardProps) {
  return (
    <div
      className={`h-90 w-76 ${item.bg} flex flex-col justify-between rounded-[10px] px-8 py-8`}
    >
      <div className="flex flex-col items-center">
        <p className={`${item.textColor} text-[24px] font-bold`}>
          {item.title}
        </p>
        <p className="text-sub-text mt-5 text-center text-[16px] leading-7.5 font-medium whitespace-pre-wrap">
          매일 진행되는 CS 대회로 실력을{"\n"}증명하고 실시간 순위를 확인하세요
        </p>
        <Image
          src={item.image}
          alt={item.title}
          width={100}
          height={100}
          className="mt-7"
        />
      </div>
      <div className="flex justify-end">
        <div className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-[50%] border border-[#DAE9DD]">
          <ArrowIcon className="fill-error" />
        </div>
      </div>
    </div>
  );
}
