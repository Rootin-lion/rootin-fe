import Image from "next/image";
import SuccessCharacterImage from "@/assets/success_char.png";
import type { ReactNode } from "react";

export default function TransitionScreen({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f7faf5_0%,#edf7ef_50%,#eaf3e8_100%)] px-4 py-6 md:px-6 md:py-10">
      <section className="relative w-full max-w-md rounded-4xl px-2 py-4 md:px-8 md:py-10">
        <div className="relative mx-auto mb-8 flex items-center justify-center rounded-full">
          <Image
            src={SuccessCharacterImage}
            alt=""
            preload
            className="relative h-auto w-48 max-w-full drop-shadow-[0_12px_24px_rgba(31,41,55,0.14)] md:w-70"
          />
        </div>
        <div className="space-y-3 text-center">
          <h1 className="text-gradient-primary text-[24px] leading-snug font-semibold md:text-[28px] md:leading-10.5">
            {title}
          </h1>
          <p className="text-xs leading-5 font-medium break-keep text-black md:text-[15px] md:leading-5.75">
            {caption}
          </p>
          {children}
        </div>
      </section>
    </div>
  );
}
