"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import {
  canRequestMedia,
  subscribeToMediaViewport,
} from "@/lib/shared/mediaPolicy";
import type {
  BrowserSpeechRecognition,
  SpeechPhase,
  SpeechResults,
} from "@/types/shared/speech";

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as Window & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

type SpeechOwner = {
  id: string;
  audioTrack?: MediaStreamTrack;
  onRunStart: () => void;
  onResult: (results: SpeechResults) => void;
};

type SpeechState = {
  ownerId: string | null;
  enabled: boolean;
  phase: SpeechPhase;
  error: string | null;
};

const INITIAL_STATE: SpeechState = {
  ownerId: null,
  enabled: false,
  phase: "idle",
  error: null,
};

type SpeechContextValue = SpeechState & {
  supported: boolean;
  start: (owner: SpeechOwner) => void;
  stop: (ownerId?: string) => void;
};

type ActiveSession = {
  owner: SpeechOwner;
  recognition: BrowserSpeechRecognition | null;
  retryTimer: ReturnType<typeof setTimeout> | null;
  failures: number;
};

const SpeechContext = createContext<SpeechContextValue | null>(null);
const subscribeToSupport = () => () => {};
const getSupportSnapshot = () => Boolean(getSpeechRecognitionConstructor());
const getServerSupport = () => false;

function dispose(session: ActiveSession) {
  if (session.retryTimer !== null) clearTimeout(session.retryTimer);
  const recognition = session.recognition;
  if (!recognition) return;
  recognition.onstart = null;
  recognition.onresult = null;
  recognition.onerror = null;
  recognition.onend = null;
  try {
    recognition.abort();
  } catch {
    // An already-ended browser session has no resources left to release.
  }
}

export function SpeechRecognitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeRef = useRef<ActiveSession | null>(null);
  const [state, setState] = useState<SpeechState>(INITIAL_STATE);
  const supported = useSyncExternalStore(
    subscribeToSupport,
    getSupportSnapshot,
    getServerSupport,
  );

  const stop = useCallback((ownerId?: string) => {
    const active = activeRef.current;
    if (ownerId && active?.owner.id !== ownerId) {
      if (!active)
        setState((previous) =>
          previous.ownerId === ownerId ? INITIAL_STATE : previous,
        );
      return;
    }
    activeRef.current = null;
    if (active) dispose(active);
    setState(INITIAL_STATE);
  }, []);

  const start = useCallback(
    (owner: SpeechOwner) => {
      if (!canRequestMedia()) return;
      if (activeRef.current?.owner.id === owner.id) return;
      const Constructor = getSpeechRecognitionConstructor();
      if (!Constructor) return;
      stop();
      const session: ActiveSession = {
        owner,
        recognition: null,
        retryTimer: null,
        failures: 0,
      };
      activeRef.current = session;

      const fail = (message: string) => {
        if (activeRef.current !== session) return;
        activeRef.current = null;
        dispose(session);
        setState({
          ownerId: owner.id,
          enabled: false,
          phase: "error",
          error: message,
        });
      };

      const connect = () => {
        if (activeRef.current !== session || !canRequestMedia()) return;
        let recognition: BrowserSpeechRecognition;
        try {
          recognition = new Constructor();
        } catch {
          fail("이 브라우저에서는 음성 인식을 시작할 수 없어요.");
          return;
        }
        session.recognition = recognition;
        recognition.lang = "ko-KR";
        recognition.continuous = true;
        recognition.interimResults = true;
        let startedAt = Date.now();
        owner.onRunStart();
        setState({
          ownerId: owner.id,
          enabled: true,
          phase: session.failures ? "reconnecting" : "starting",
          error: null,
        });
        recognition.onstart = () => {
          if (
            activeRef.current !== session ||
            session.recognition !== recognition
          )
            return;
          if (!canRequestMedia()) {
            stop(owner.id);
            return;
          }
          startedAt = Date.now();
          setState({
            ownerId: owner.id,
            enabled: true,
            phase: "listening",
            error: null,
          });
        };
        recognition.onresult = (event) => {
          if (
            activeRef.current !== session ||
            session.recognition !== recognition ||
            !canRequestMedia()
          )
            return;
          owner.onResult(event.results);
        };
        recognition.onerror = (event) => {
          if (
            activeRef.current !== session ||
            session.recognition !== recognition
          )
            return;
          if (event.error === "no-speech" || event.error === "network") return;
          fail(
            event.error === "not-allowed" ||
              event.error === "service-not-allowed"
              ? "브라우저의 마이크 권한을 확인해 주세요."
              : event.error === "language-not-supported"
                ? "이 브라우저에서는 한국어 음성 인식을 사용할 수 없어요."
                : "음성 인식에 연결하지 못했어요. 권한과 연결 상태를 확인해 주세요.",
          );
        };
        recognition.onend = () => {
          if (
            activeRef.current !== session ||
            session.recognition !== recognition
          )
            return;
          session.recognition = null;
          if (!canRequestMedia()) {
            stop(owner.id);
            return;
          }
          if (Date.now() - startedAt >= 5000) session.failures = 0;
          session.failures += 1;
          if (session.failures > 3) {
            fail("음성 인식 연결이 끊겼어요. 연결 상태를 확인해 주세요.");
            return;
          }
          setState((previous) => ({ ...previous, phase: "reconnecting" }));
          session.retryTimer = setTimeout(connect, 300 * session.failures);
        };
        try {
          if (owner.audioTrack) {
            try {
              recognition.start(owner.audioTrack);
            } catch (error) {
              if (
                error instanceof TypeError ||
                (error instanceof DOMException &&
                  error.name === "NotSupportedError")
              )
                recognition.start();
              else throw error;
            }
          } else {
            recognition.start();
          }
        } catch {
          fail("마이크를 시작하지 못했어요. 권한과 연결 상태를 확인해 주세요.");
        }
      };
      connect();
    },
    [stop],
  );

  useEffect(() => {
    const checkViewport = () => {
      if (!canRequestMedia()) stop();
    };
    const unsubscribe = subscribeToMediaViewport(checkViewport);
    const onPageHide = () => stop();
    window.addEventListener("pagehide", onPageHide);
    return () => {
      unsubscribe();
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [stop]);

  useEffect(() => {
    return () => stop();
  }, [pathname, stop]);

  const value = useMemo(
    () => ({ ...state, supported, start, stop }),
    [state, supported, start, stop],
  );
  return (
    <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>
  );
}

export function useSpeechRecognition() {
  const context = useContext(SpeechContext);
  if (!context) throw new Error("SpeechRecognitionProvider가 필요합니다.");
  return context;
}
