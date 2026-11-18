import { StrictMode } from "react";
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type {
  InterviewConfig,
  SessionChatMessage,
} from "@/types/interviews/interview";

const mocks = vi.hoisted(() => ({
  startCamera: vi.fn(),
  stopCamera: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  closeStartModal: vi.fn(),
  createInterview: vi.fn(),
  getQuestion: vi.fn(),
  submitAnswer: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));
vi.mock("@/components/interviews/InterviewMediaProvider", () => ({
  useInterviewMedia: () => ({
    stream: null,
    startCamera: mocks.startCamera,
    stopCamera: mocks.stopCamera,
  }),
}));
vi.mock("@/app/(service)/interviews/action", () => ({
  createInterviewAction: mocks.createInterview,
  getInterviewQuestionAction: mocks.getQuestion,
  submitInterviewAnswerAction: mocks.submitAnswer,
}));

import useInterviewStart from "@/components/interviews/useInterviewStart";
import useInterviewSessionLifecycle from "@/components/interviews/session/useInterviewSessionLifecycle";
import useInterviewCompletion from "@/components/interviews/session/useInterviewCompletion";
import useInterviewAnswer from "@/components/interviews/session/useInterviewAnswer";
import {
  createIntroMessages,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";

const config: InterviewConfig = {
  category: "NETWORK",
  questionCount: 3,
  interviewMode: "VOICE",
};
const sessionProps = {
  interviewId: 42,
  category: "네트워크",
  questionCount: 3,
};
const question: Extract<SessionChatMessage, { kind: "QUESTION" }> = {
  id: "question-7",
  kind: "QUESTION",
  question: {
    questionId: 7,
    topicId: 1,
    topicName: "TCP",
    questionOrder: 1,
    questionType: "BASIC",
    question: "TCP를 설명해주세요.",
  },
};

let mobile = false;
const viewportListeners = new Set<(event: MediaQueryListEvent) => void>();

function changeViewport(isMobile: boolean) {
  mobile = isMobile;
  for (const listener of [...viewportListeners])
    listener({ matches: isMobile } as MediaQueryListEvent);
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((accept) => {
    resolve = accept;
  });
  return { promise, resolve };
}

beforeEach(() => {
  sessionStorage.clear();
  useInterviewSessionStore.setState({ sessions: {} });
  mobile = false;
  viewportListeners.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      media,
      get matches() {
        return mobile;
      },
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => viewportListeners.add(listener),
      removeEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => viewportListeners.delete(listener),
    })),
  );
  mocks.startCamera.mockReset().mockResolvedValue(undefined);
  mocks.stopCamera.mockReset();
  mocks.push.mockReset();
  mocks.replace.mockReset();
  mocks.closeStartModal.mockReset();
  mocks.createInterview
    .mockReset()
    .mockResolvedValue({ ok: true, data: { interviewId: 42 } });
  mocks.getQuestion.mockReset();
  mocks.submitAnswer.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderStart(speechSupported = true) {
  return renderHook(() =>
    useInterviewStart({
      config,
      speechSupported,
      closeStartModal: mocks.closeStartModal,
    }),
  );
}

describe("면접 시작 흐름", () => {
  test("장치 연결을 기다린 뒤 한 번 생성하고 설정을 저장해 이동", async () => {
    const media = deferred<void>();
    mocks.startCamera.mockReturnValue(media.promise);
    const { result } = renderStart();
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleStart();
    });
    expect(result.current.isStarting).toBe(true);
    expect(mocks.startCamera).toHaveBeenCalledWith(true);
    expect(mocks.createInterview).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.handleStart();
    });
    expect(mocks.startCamera).toHaveBeenCalledOnce();
    await act(async () => {
      media.resolve();
      await pending;
    });
    expect(mocks.createInterview).toHaveBeenCalledExactlyOnceWith(config);
    expect(sessionStorage.getItem("interview-camera:42")).toBe("enabled");
    expect(mocks.push).toHaveBeenCalledWith(
      "/interviews/42?category=NETWORK&questionCount=3&interviewMode=VOICE",
    );
  });

  test("모바일에서는 장치를 요청하지 않고 텍스트 면접으로 시작", async () => {
    mobile = true;
    const { result } = renderStart();
    await act(async () => {
      await result.current.handleStart();
    });
    expect(mocks.startCamera).not.toHaveBeenCalled();
    expect(mocks.createInterview).toHaveBeenCalledWith({
      ...config,
      interviewMode: "TEXT",
    });
    expect(sessionStorage.getItem("interview-camera:42")).toBe("disabled");
    expect(mocks.push).toHaveBeenCalledWith(
      expect.stringContaining("interviewMode=TEXT"),
    );
  });

  test("음성 인식 미지원 시 마이크 없이 텍스트 면접으로 시작", async () => {
    const { result } = renderStart(false);
    await act(async () => {
      await result.current.handleStart();
    });
    expect(mocks.startCamera).toHaveBeenCalledWith(false);
    expect(mocks.createInterview).toHaveBeenCalledWith({
      ...config,
      interviewMode: "TEXT",
    });
  });

  test("장치 연결 실패는 시작 모달 안에 표시하고 면접을 생성하지 않음", async () => {
    mocks.startCamera.mockRejectedValue(new Error("permission denied"));
    const { result } = renderStart();
    await act(async () => {
      await result.current.handleStart();
    });
    expect(result.current.cameraError).toContain("권한");
    expect(result.current.isStarting).toBe(false);
    expect(result.current.isErrorModalOpen).toBe(false);
    expect(mocks.closeStartModal).not.toHaveBeenCalled();
    expect(mocks.createInterview).not.toHaveBeenCalled();
  });

  test.each(["응답 실패", "요청 예외"])(
    "생성 %s 시 장치를 정리하고 오류 모달 표시",
    async (failure) => {
      if (failure === "응답 실패")
        mocks.createInterview.mockResolvedValue({
          ok: false,
          error: { code: "CREATE_FAILED", message: "생성 실패" },
        });
      else mocks.createInterview.mockRejectedValue(new Error("offline"));
      const { result } = renderStart();
      await act(async () => {
        await result.current.handleStart();
      });
      expect(result.current.isStarting).toBe(false);
      expect(result.current.cameraError).toBeNull();
      expect(result.current.isErrorModalOpen).toBe(true);
      expect(result.current.error.code).toBe(
        failure === "응답 실패" ? "CREATE_FAILED" : "UNKNOWN_ERROR",
      );
      expect(mocks.stopCamera).toHaveBeenCalledOnce();
      expect(mocks.closeStartModal).toHaveBeenCalledOnce();
      expect(mocks.push).not.toHaveBeenCalled();
      expect(sessionStorage.getItem("interview-camera:42")).toBeNull();
    },
  );

  test("생성 대기 중 모바일을 거치면 큰 화면으로 돌아와도 카메라 비활성화 유지", async () => {
    const creation = deferred<{ ok: true; data: { interviewId: number } }>();
    mocks.createInterview.mockReturnValue(creation.promise);
    const { result, unmount } = renderStart();
    let pending!: Promise<void>;
    await act(async () => {
      pending = result.current.handleStart();
    });
    act(() => {
      changeViewport(true);
      changeViewport(false);
    });
    await act(async () => {
      creation.resolve({ ok: true, data: { interviewId: 42 } });
      await pending;
    });
    expect(sessionStorage.getItem("interview-camera:42")).toBe("disabled");
    unmount();
    expect(viewportListeners.size).toBe(0);
  });
});

describe("면접 세션 복원과 종료", () => {
  test("새 세션은 안내를 준비하고 표시 완료 전까지 입력 대기", () => {
    const { result } = renderHook(() =>
      useInterviewSessionLifecycle(sessionProps),
    );
    expect(result.current.sessionReady).toBe(true);
    expect(result.current.messages.map((message) => message.id)).toEqual([
      "intro-camera",
      "intro-start",
    ]);
    expect(result.current.isIntroComplete).toBe(false);
    expect(result.current.restoredMessageIds.size).toBe(0);
    act(() => {
      result.current.handleIntroComplete();
    });
    expect(result.current.isIntroComplete).toBe(true);
  });

  test("기존 안내는 재생하지 않고 새 메시지는 복원 목록에 추가하지 않음", () => {
    useInterviewSessionStore.setState({
      sessions: {
        42: {
          introComplete: false,
          interviewCompleted: false,
          messages: createIntroMessages("네트워크", 3),
        },
      },
    });
    const { result } = renderHook(() =>
      useInterviewSessionLifecycle(sessionProps),
    );
    const restoredIds = result.current.restoredMessageIds;
    expect(result.current.isIntroComplete).toBe(true);
    expect([...restoredIds]).toEqual(["intro-camera", "intro-start"]);
    act(() => {
      useInterviewSessionStore
        .getState()
        .appendExchange(
          42,
          { id: "intro-answer", kind: "ANSWER", text: "네" },
          question.question,
        );
    });
    expect(result.current.restoredMessageIds).toBe(restoredIds);
    expect(restoredIds.has(question.id)).toBe(false);
  });

  test("모바일 전환은 카메라를 끄고 큰 화면 복귀 후에도 비활성화 유지", () => {
    const { result, unmount } = renderHook(() =>
      useInterviewSessionLifecycle(sessionProps),
    );
    expect(result.current.cameraEnabled).toBe(true);
    act(() => {
      changeViewport(true);
    });
    expect(result.current.isMobile).toBe(true);
    expect(result.current.cameraEnabled).toBe(false);
    expect(sessionStorage.getItem("interview-camera:42")).toBe("disabled");
    expect(mocks.stopCamera).toHaveBeenCalledOnce();
    act(() => {
      changeViewport(false);
    });
    expect(result.current.cameraEnabled).toBe(false);
    unmount();
    expect(viewportListeners.size).toBe(0);
  });

  test("저장된 카메라 비활성화 설정을 복원", () => {
    sessionStorage.setItem("interview-camera:42", "disabled");
    const { result } = renderHook(() =>
      useInterviewSessionLifecycle(sessionProps),
    );
    expect(result.current.cameraEnabled).toBe(false);
  });

  test("마지막 답변의 피드백과 종료 메시지를 모두 표시한 뒤 한 번만 이동", async () => {
    useInterviewSessionStore.setState({
      sessions: {
        42: {
          introComplete: true,
          interviewCompleted: false,
          messages: [...createIntroMessages("네트워크", 3), question],
        },
      },
    });
    mocks.submitAnswer.mockResolvedValue({
      ok: true,
      data: {
        topicCompleted: true,
        interviewCompleted: true,
        answerLevel: "GOOD",
        accuracy: 90,
        feedback: "잘 설명했습니다.",
        nextQuestion: null,
      },
    });
    const { result, rerender } = renderHook(() => {
      const lifecycle = useInterviewSessionLifecycle(sessionProps);
      const answer = useInterviewAnswer({
        interviewId: 42,
        sessionReady: lifecycle.sessionReady,
        isIntroComplete: lifecycle.isIntroComplete,
        interviewCompleted: lifecycle.interviewCompleted,
        messages: lifecycle.messages,
      });
      const completion = useInterviewCompletion({
        interviewId: 42,
        sessionReady: lifecycle.sessionReady,
        interviewCompleted: lifecycle.interviewCompleted,
        isPresentingFeedback: answer.isPresentingFeedback,
      });
      return { lifecycle, answer, completion };
    });
    await act(async () => {
      await result.current.answer.handleSubmitClick("답변입니다.");
    });
    expect(
      result.current.lifecycle.messages
        .slice(-3)
        .map((message) => message.kind),
    ).toEqual(["ANSWER", "FEEDBACK", "COMPLETION"]);
    expect(result.current.answer.isPresentingFeedback).toBe(true);
    expect(mocks.replace).not.toHaveBeenCalled();
    act(() => {
      result.current.completion.handleCompletionComplete();
    });
    expect(mocks.replace).not.toHaveBeenCalled();
    act(() => {
      result.current.answer.handleFeedbackComplete();
    });
    expect(mocks.stopCamera).toHaveBeenCalledOnce();
    expect(mocks.replace).toHaveBeenCalledExactlyOnceWith(
      "/transition?flow=interview-report&interviewId=42",
    );
    rerender();
    act(() => {
      result.current.completion.handleCompletionComplete();
    });
    expect(mocks.replace).toHaveBeenCalledOnce();
  });

  test("완료된 세션 복원은 StrictMode에서도 중복 이동하지 않음", () => {
    useInterviewSessionStore.setState({
      sessions: {
        42: {
          introComplete: true,
          interviewCompleted: true,
          messages: [
            ...createIntroMessages("네트워크", 3),
            { id: "interview-complete", kind: "COMPLETION", text: "면접 종료" },
          ],
        },
      },
    });
    renderHook(
      () =>
        useInterviewCompletion({
          interviewId: 42,
          sessionReady: true,
          interviewCompleted: true,
          isPresentingFeedback: false,
        }),
      { wrapper: ({ children }) => <StrictMode>{children}</StrictMode> },
    );
    expect(mocks.replace).toHaveBeenCalledExactlyOnceWith(
      "/transition?flow=interview-report&interviewId=42",
    );
    expect(mocks.stopCamera).toHaveBeenCalledOnce();
  });
});
