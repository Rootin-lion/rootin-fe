import { createElement } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { InterviewMediaProvider } from "@/components/interviews/InterviewMediaProvider";
import InterviewSessionContent from "@/components/interviews/session/InterviewSessionContent";
import { useInterviewSessionStore } from "@/stores/useInterviewSessionStore";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));
vi.mock("@/components/interviews/session/SessionChat", () => ({
  default: () => null,
}));
vi.mock("@/components/interviews/session/SessionForm", () => ({
  default: () => null,
}));
vi.mock("@/components/interviews/session/SessionTimer", () => ({
  default: () => null,
}));
vi.mock("@/components/interviews/session/useInterviewAnswer", () => ({
  default: () => ({
    answer: "",
    pendingAnswer: null,
    isTyping: false,
    isPresentingFeedback: false,
    isModalOpen: false,
  }),
}));
vi.mock("@/assets/icons/interviews/camera-off.svg", () => ({
  default: () => createElement("svg", { "data-testid": "camera-off-icon" }),
}));

const getUserMedia = vi.fn();
const stopTrack = vi.fn();
const listeners = new Set<(event: MediaQueryListEvent) => void>();
const originalMediaDevices = Object.getOwnPropertyDescriptor(
  navigator,
  "mediaDevices",
);
let isMobile = true;

function resizeViewport(width: number) {
  act(() => {
    isMobile = width < 768;
    for (const listener of [...listeners]) {
      listener({ matches: isMobile } as MediaQueryListEvent);
    }
  });
}

function renderInterview() {
  return render(
    createElement(
      InterviewMediaProvider,
      null,
      createElement(InterviewSessionContent, {
        interviewId: 2,
        profileImageUrl: null,
        category: "운영체제",
        questionCount: 1,
      }),
    ),
  );
}

beforeEach(() => {
  isMobile = true;
  listeners.clear();
  sessionStorage.clear();
  useInterviewSessionStore.setState({ sessions: {} });
  getUserMedia.mockReset();
  stopTrack.mockReset();
  const track = { readyState: "live", stop: stopTrack };
  getUserMedia.mockResolvedValue({
    getVideoTracks: () => [track],
    getTracks: () => [track],
  });
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia },
  });
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return isMobile;
    },
    addEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.add(listener),
    removeEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => listeners.delete(listener),
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  if (originalMediaDevices) {
    Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
  } else {
    Reflect.deleteProperty(navigator, "mediaDevices");
  }
});

describe("면접 화면 너비 변경과 카메라", () => {
  test("320px에서 768px로 넓히면 권한 요청 없이 꺼짐 아이콘 표시", () => {
    const view = renderInterview();
    expect(screen.queryByTestId("camera-off-icon")).not.toBeInTheDocument();

    resizeViewport(768);
    expect(screen.getByTestId("camera-off-icon")).toBeInTheDocument();
    expect(
      screen.getByText("카메라 없이 면접을 진행하고 있어요."),
    ).toBeInTheDocument();

    resizeViewport(320);
    expect(screen.queryByTestId("camera-off-icon")).not.toBeInTheDocument();
    resizeViewport(844);
    expect(screen.getByTestId("camera-off-icon")).toBeInTheDocument();

    view.unmount();
    renderInterview();
    expect(screen.getByTestId("camera-off-icon")).toBeInTheDocument();
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  test("카메라 사용 중 좁아지면 정지하고 다시 넓혀도 자동 재연결하지 않음", async () => {
    isMobile = false;
    renderInterview();
    expect(await screen.findByLabelText("내 카메라 화면")).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(1);

    resizeViewport(320);
    expect(stopTrack).toHaveBeenCalled();
    expect(screen.queryByLabelText("내 카메라 화면")).not.toBeInTheDocument();

    resizeViewport(844);
    expect(screen.getByTestId("camera-off-icon")).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(1);
  });

  test("카메라 요청 실패 시 꺼짐 아이콘과 재시도 버튼 표시", async () => {
    isMobile = false;
    getUserMedia.mockRejectedValueOnce(new Error("카메라 권한 거부"));
    renderInterview();

    expect(await screen.findByTestId("camera-off-icon")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "다시 연결" }));
    expect(await screen.findByLabelText("내 카메라 화면")).toBeInTheDocument();
    expect(getUserMedia).toHaveBeenCalledTimes(2);
  });
});
