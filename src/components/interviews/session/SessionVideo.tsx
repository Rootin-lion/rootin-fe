"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import { MOBILE_INTERVIEW_QUERY } from "@/lib/interviews/cameraPolicy";

export default function SessionVideo() {
  const { stream, startCamera } = useInterviewMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const hasLiveVideo =
    stream?.getVideoTracks().some((track) => track.readyState === "live") ??
    false;

  useEffect(() => {
    if (hasLiveVideo || window.matchMedia(MOBILE_INTERVIEW_QUERY).matches)
      return;

    let active = true;
    startCamera().catch(() => {
      if (active) setCameraError(true);
    });

    return () => {
      active = false;
    };
  }, [hasLiveVideo, startCamera]);

  const retryCamera = async () => {
    if (window.matchMedia(MOBILE_INTERVIEW_QUERY).matches) return;
    setCameraError(false);
    try {
      await startCamera();
    } catch {
      setCameraError(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) return;

    video.srcObject = stream;

    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  return (
    <div className="h-104 w-full overflow-hidden rounded-xl bg-gray-400">
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
  );
}
