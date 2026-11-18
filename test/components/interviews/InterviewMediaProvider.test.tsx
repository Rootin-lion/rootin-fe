import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.unmock("@/components/interviews/InterviewMediaProvider");

import {
  InterviewMediaProvider,
  useInterviewMedia,
} from "@/components/interviews/InterviewMediaProvider";
import useMediaAvailability from "@/hooks/useMediaAvailability";

let width = 768;
const listeners = new Set<() => void>();
const getUserMedia = vi.fn();
const stopTrack = vi.fn();
const track = { readyState: "live", stop: stopTrack };
const stream = {
  getTracks: () => [track],
  getVideoTracks: () => [track],
  getAudioTracks: () => [],
} as unknown as MediaStream;

function resize(nextWidth: number) {
  width = nextWidth;
  for (const listener of [...listeners]) listener();
}

beforeEach(() => {
  width = 768;
  listeners.clear();
  stopTrack.mockReset();
  getUserMedia.mockReset().mockResolvedValue(stream);
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      media,
      get matches() {
        return width < 768;
      },
      addEventListener: (_type: string, callback: () => void) =>
        listeners.add(callback),
      removeEventListener: (_type: string, callback: () => void) =>
        listeners.delete(callback),
    })),
  );
  vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function renderMedia() {
  return renderHook(
    () => ({
      media: useInterviewMedia(),
      availability: useMediaAvailability(),
    }),
    { wrapper: InterviewMediaProvider },
  );
}

describe("공통 화면 크기 정책과 면접 장치", () => {
  test("767px에서는 화면과 Provider 모두 장치 사용 차단", async () => {
    width = 767;
    const { result } = renderMedia();
    expect(result.current.availability.isMobile).toBe(true);
    expect(result.current.availability.canUseMedia).toBe(false);
    await act(async () => {
      await result.current.media.startCamera(true);
    });
    expect(getUserMedia).not.toHaveBeenCalled();
  });

  test("768px에서는 장치 사용 가능하며 모바일 전환 시 스트림 해제", async () => {
    const { result, unmount } = renderMedia();
    expect(result.current.availability.canUseMedia).toBe(true);
    await act(async () => {
      await result.current.media.startCamera(true);
    });
    expect(getUserMedia).toHaveBeenCalledExactlyOnceWith({
      video: true,
      audio: true,
    });
    expect(result.current.media.stream).toBe(stream);

    act(() => {
      resize(767);
    });
    expect(result.current.availability.isMobile).toBe(true);
    expect(result.current.media.stream).toBeNull();
    expect(stopTrack).toHaveBeenCalledOnce();
    act(() => {
      resize(768);
    });
    expect(result.current.availability.canUseMedia).toBe(true);
    expect(result.current.media.stream).toBeNull();
    expect(getUserMedia).toHaveBeenCalledOnce();
    unmount();
    expect(listeners.size).toBe(0);
  });

  test("연결 대기 중 모바일을 거치면 늦게 도착한 스트림 폐기", async () => {
    let resolve!: (stream: MediaStream) => void;
    getUserMedia.mockReturnValue(
      new Promise<MediaStream>((accept) => {
        resolve = accept;
      }),
    );
    const { result } = renderMedia();
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.media.startCamera();
    });
    act(() => {
      resize(767);
      resize(768);
    });
    await act(async () => {
      resolve(stream);
      await pending;
    });
    expect(result.current.media.stream).toBeNull();
    expect(stopTrack).toHaveBeenCalledOnce();
  });

  test("matchMedia가 없을 때도 공통 resize 구독으로 모바일 전환 감지", async () => {
    vi.stubGlobal("matchMedia", undefined);
    vi.stubGlobal("innerWidth", 768);
    const { result, unmount } = renderMedia();
    await act(async () => {
      await result.current.media.startCamera();
    });
    expect(result.current.media.stream).toBe(stream);
    act(() => {
      vi.stubGlobal("innerWidth", 767);
      window.dispatchEvent(new Event("resize"));
    });
    expect(result.current.availability.isMobile).toBe(true);
    expect(result.current.media.stream).toBeNull();
    expect(stopTrack).toHaveBeenCalledOnce();
    unmount();
  });
});
