import Image from "next/image";
import type { ReactNode } from "react";
import SuccessCharacterImage from "@/assets/success_char.png";

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
    <div className="flex flex-1 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#f7faf5_0%,#edf7ef_50%,#eaf3e8_100%)] px-6 py-10">
      <section className="relative w-full max-w-md rounded-4xl px-8 py-10">
        <div className="relative mx-auto mb-8 flex items-center justify-center rounded-full">
          <Image
            src={SuccessCharacterImage}
            alt=""
            preload
            className="relative h-70 w-70 drop-shadow-[0_12px_24px_rgba(31,41,55,0.14)]"
          />
        </div>
        <div className="space-y-3 text-center">
          <h1 className="text-gradient-primary text-[28px] leading-10.5 font-semibold">
            {title}
          </h1>
          <p className="text-[15px] leading-5.75 font-medium text-black">
            {caption}
          </p>
          {children}
        </div>
      </section>
    </div>
  );
}
