"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TimerIcon from "@/assets/interviews/timer.png";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";

const INTERVIEW_DURATION_MS = 30 * 60 * 1000;

export default function SessionVideo({ interviewId }: { interviewId: number }) {
  const { stream, startCamera } = useInterviewMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const hasLiveVideo =
    stream?.getVideoTracks().some((track) => track.readyState === "live") ??
    false;

  useEffect(() => {
    if (hasLiveVideo) return;

    let active = true;
    startCamera().catch(() => {
      if (active) setCameraError(true);
    });

    return () => {
      active = false;
    };
  }, [hasLiveVideo, startCamera]);

  const retryCamera = async () => {
    setCameraError(false);
    try {
      await startCamera();
    } catch {
      setCameraError(true);
    }
  };

  useEffect(() => {
    const key = `interview-deadline:${interviewId}`;
    const savedDeadline = Number(window.sessionStorage.getItem(key));
    const deadline =
      Number.isFinite(savedDeadline) && savedDeadline > 0
        ? savedDeadline
        : Date.now() + INTERVIEW_DURATION_MS;

    if (deadline !== savedDeadline) {
      window.sessionStorage.setItem(key, String(deadline));
    }

    const updateRemainingTime = () => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
      );
    };

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [interviewId]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  const time =
    remainingSeconds === null
      ? "--:--"
      : `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  return (
    <div className="flex w-full max-w-70.5 flex-col gap-4">
      <div className="flex flex-row items-center gap-5 rounded-xl bg-[#F0F0F0] px-5 py-2">
        <Image src={TimerIcon} alt="timer" className="h-9 w-9" />
        <p className="text-primary-900 text-[30px] font-bold" role="timer">
          {time}
        </p>
      </div>
      <div className="h-104 w-full rounded-xl bg-gray-400">
        {stream && hasLiveVideo ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            aria-label="내 카메라 화면"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <p>
              {cameraError
                ? "카메라 권한이나 연결 상태를 확인해주세요."
                : "카메라 연결 중..."}
            </p>
            {cameraError && (
              <button type="button" onClick={retryCamera} className="underline">
                다시 연결
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
