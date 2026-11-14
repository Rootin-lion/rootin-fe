"use client";

import { useEffect, useRef, useState } from "react";
import CameraOffIcon from "@/assets/icons/interviews/camera-off.svg";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import { MOBILE_INTERVIEW_QUERY } from "@/lib/interviews/cameraPolicy";

export default function SessionVideo({
  cameraEnabled,
  withMicrophone = false,
}: {
  cameraEnabled: boolean;
  withMicrophone?: boolean;
}) {
  const { stream, startCamera } = useInterviewMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const hasLiveVideo =
    cameraEnabled &&
    (stream?.getVideoTracks().some((track) => track.readyState === "live") ??
      false);
  const cameraUnavailable = !cameraEnabled || cameraError;

  useEffect(() => {
    if (
      !cameraEnabled ||
      hasLiveVideo ||
      window.matchMedia(MOBILE_INTERVIEW_QUERY).matches
    )
      return;

    let active = true;
    startCamera(withMicrophone).catch(() => {
      if (active) setCameraError(true);
    });

    return () => {
      active = false;
    };
  }, [cameraEnabled, hasLiveVideo, startCamera, withMicrophone]);

  const retryCamera = async () => {
    if (!cameraEnabled || window.matchMedia(MOBILE_INTERVIEW_QUERY).matches)
      return;
    setCameraError(false);
    try {
      await startCamera(withMicrophone);
    } catch {
      setCameraError(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!cameraEnabled || !video || !stream) return;

    video.srcObject = stream;

    return () => {
      video.srcObject = null;
    };
  }, [cameraEnabled, stream]);

  return (
    <div
      className={`h-104 w-full overflow-hidden rounded-xl md:h-auto md:max-h-104 md:min-h-0 md:flex-1 lg:h-104 lg:flex-none ${cameraUnavailable && !hasLiveVideo ? "bg-gray-100" : "bg-gray-400"}`}
    >
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
          {cameraUnavailable && (
            <div
              aria-hidden="true"
              className="mb-1 flex size-24 items-center justify-center rounded-full border border-gray-300 bg-gray-200 text-gray-500"
            >
              <CameraOffIcon className="size-12" />
            </div>
          )}
          <p
            className={
              cameraUnavailable
                ? "text-[13px] leading-5 text-gray-600"
                : undefined
            }
          >
            {!cameraEnabled
              ? "카메라 없이 면접을 진행하고 있어요."
              : cameraError
                ? "카메라 권한이나 연결 상태를 확인해주세요."
                : "카메라 연결 중..."}
          </p>
          {cameraEnabled && cameraError && (
            <button
              type="button"
              onClick={retryCamera}
              className="min-h-9 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 text-[12px] font-medium text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
            >
              다시 연결
            </button>
          )}
        </div>
      )}
    </div>
  );
}
