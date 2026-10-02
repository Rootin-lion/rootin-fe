"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import TimerIcon from "@/assets/interviews/timer.png";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";

export default function SessionVideo() {
  const { stream } = useInterviewMedia();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="flex w-full max-w-70.5 flex-col gap-4">
      <div className="flex flex-row items-center gap-5 rounded-xl bg-[#F0F0F0] px-5 py-2">
        <Image src={TimerIcon} alt="timer" className="h-9 w-9" />
        <p className="text-primary-900 text-[30px] font-bold">14:30</p>
      </div>
      <div className="h-104 w-full rounded-xl bg-gray-400">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="내 카메라 화면"
            className="h-full w-full object-cover"
          />
        ) : (
          <p>카메라 연결이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
