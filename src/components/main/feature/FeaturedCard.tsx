import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/assets/icons/main/arrow.svg";
import type { FeatureData } from "@/types/main/featureItem";

interface FeatureCardProps {
  item: FeatureData;
}

export function FeatureCard({ item }: FeatureCardProps) {
  return (
    <div
      className={`min-h-32 w-full md:min-h-80 lg:h-90 ${item.bg} flex flex-col justify-between rounded-[10px] p-4 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(31,41,55,0.12)] lg:p-8`}
    >
      <div className="relative flex flex-col items-start pr-20 md:items-center md:pr-0">
        <h2
          className={`${item.textColor} text-[16px] font-bold md:text-center md:text-[18px] lg:text-[24px]`}
        >
          {item.title}
        </h2>
        <p className="text-sub-text mt-2 text-left text-[12px] leading-relaxed font-medium whitespace-pre-wrap md:text-center lg:mt-5 lg:text-[16px] lg:leading-7.5">
          매일 진행되는 CS 대회로 실력을{"\n"}증명하고 실시간 순위를 확인하세요
        </p>
        <Image
          src={item.image}
          alt={item.title}
          className="absolute top-1/2 right-0 h-auto w-16 -translate-y-1/2 md:static md:mt-5 md:h-20 md:w-auto md:translate-y-0 lg:mt-7 lg:h-25"
        />
      </div>
      <div className="flex justify-end">
        <Link
          href="#"
          className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-[50%] border border-[#DAE9DD]"
        >
          <ArrowIcon className="fill-primary-900" />
        </Link>
      </div>
    </div>
  );
}
