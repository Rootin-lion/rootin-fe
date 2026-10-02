"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type InterviewMediaContextValue = {
  stream: MediaStream | null;
  startCamera: () => Promise<void>;
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
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    if (
      streamRef.current
        ?.getVideoTracks()
        .some((track) => track.readyState === "live")
    ) {
      return;
    }

    const cameraStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    streamRef.current = cameraStream;
    setStream(cameraStream);
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

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
