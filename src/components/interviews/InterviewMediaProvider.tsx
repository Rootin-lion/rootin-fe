"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { MOBILE_INTERVIEW_QUERY } from "@/lib/interviews/cameraPolicy";

type InterviewMediaContextValue = {
  stream: MediaStream | null;
  startCamera: (withMicrophone?: boolean) => Promise<void>;
  stopCamera: () => void;
};

const InterviewMediaContext = createContext<InterviewMediaContextValue | null>(
  null,
);

export function InterviewMediaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const streamRef = useRef<MediaStream | null>(null);
  const pendingStartRef = useRef<Promise<void> | null>(null);
  const mountedRef = useRef(true);
  const cameraRequestIdRef = useRef(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async (withMicrophone = false) => {
    if (window.matchMedia(MOBILE_INTERVIEW_QUERY).matches) return;
    if (
      streamRef.current
        ?.getVideoTracks()
        .some((track) => track.readyState === "live") &&
      (!withMicrophone ||
        streamRef.current
          ?.getAudioTracks()
          .some((track) => track.readyState === "live"))
    ) {
      return;
    }

    if (pendingStartRef.current) return pendingStartRef.current;

    const requestId = ++cameraRequestIdRef.current;
    const pendingStart = navigator.mediaDevices
      .getUserMedia({ video: true, audio: withMicrophone })
      .then((cameraStream) => {
        if (
          !mountedRef.current ||
          requestId !== cameraRequestIdRef.current ||
          window.matchMedia(MOBILE_INTERVIEW_QUERY).matches
        ) {
          cameraStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = cameraStream;
        setStream(cameraStream);
      });

    pendingStartRef.current = pendingStart;
    try {
      await pendingStart;
    } finally {
      if (pendingStartRef.current === pendingStart) {
        pendingStartRef.current = null;
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    cameraRequestIdRef.current += 1;
    pendingStartRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const mobileQuery = window.matchMedia(MOBILE_INTERVIEW_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (event.matches) stopCamera();
    };
    mobileQuery.addEventListener("change", handleViewportChange);
    return () => {
      mountedRef.current = false;
      cameraRequestIdRef.current += 1;
      pendingStartRef.current = null;
      mobileQuery.removeEventListener("change", handleViewportChange);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [stopCamera]);

  return (
    <InterviewMediaContext.Provider value={{ stream, startCamera, stopCamera }}>
      {children}
    </InterviewMediaContext.Provider>
  );
}

export function useInterviewMedia() {
  const context = useContext(InterviewMediaContext);
  if (!context) {
    throw new Error("InterviewMediaProvider가 필요합니다.");
  }
  return context;
}
