import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import SessionTimer from "@/components/interviews/session/SessionTimer";

// Next의 정적 이미지 import 메타데이터를 제공한다. Vite 기본 import는 URL 문자열이다.
vi.mock("@/assets/icons/shared/timer.png", () => ({
  default: { src: "/timer.png", width: 36, height: 36 },
}));

const now = new Date("2026-11-14T00:00:00.000Z");
const deadlineKey = "interview-deadline:101";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.useRealTimers();
  window.sessionStorage.clear();
});

describe("면접 남은 시간", () => {
  test("새 면접은 30분으로 시작하고 마감 시각을 저장", () => {
    render(<SessionTimer interviewId={101} />);

    expect(
      screen.getByRole("timer", { name: "면접 남은 시간" }),
    ).toHaveTextContent("30:00");
    expect(window.sessionStorage.getItem(deadlineKey)).toBe(
      String(now.getTime() + 30 * 60 * 1000),
    );
  });

  test("1초가 지나면 남은 시간을 감소", () => {
    render(<SessionTimer interviewId={101} />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole("timer")).toHaveTextContent("29:59");
  });

  test("저장된 마감 시각으로 복원하고 기존 값을 유지", () => {
    const deadline = String(now.getTime() + 61_000);
    window.sessionStorage.setItem(deadlineKey, deadline);
    render(<SessionTimer interviewId={101} />);
    expect(screen.getByRole("timer")).toHaveTextContent("01:01");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole("timer")).toHaveTextContent("01:00");
    expect(window.sessionStorage.getItem(deadlineKey)).toBe(deadline);
  });

  test("다시 마운트해도 남은 시간을 30분으로 초기화하지 않음", () => {
    const { unmount } = render(<SessionTimer interviewId={101} />);
    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    render(<SessionTimer interviewId={101} />);

    expect(screen.getByRole("timer")).toHaveTextContent("29:55");
  });

  test("남은 초를 올림하고 만료 후에는 0초로 유지", () => {
    window.sessionStorage.setItem(deadlineKey, String(now.getTime() + 1500));
    render(<SessionTimer interviewId={101} />);
    expect(screen.getByRole("timer")).toHaveTextContent("00:02");

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("00:01");

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
  });

  test("이미 만료된 마감 시각은 새 면접으로 취급하지 않음", () => {
    const deadline = String(now.getTime() - 1000);
    window.sessionStorage.setItem(deadlineKey, deadline);
    render(<SessionTimer interviewId={101} />);

    expect(screen.getByRole("timer")).toHaveTextContent("00:00");
    expect(window.sessionStorage.getItem(deadlineKey)).toBe(deadline);
  });

  test.each(["잘못된 값", "0", "-1", "Infinity"])(
    "유효하지 않은 저장값 %s는 새 마감 시각으로 대체",
    (value) => {
      window.sessionStorage.setItem(deadlineKey, value);
      render(<SessionTimer interviewId={101} />);

      expect(screen.getByRole("timer")).toHaveTextContent("30:00");
      expect(window.sessionStorage.getItem(deadlineKey)).toBe(
        String(now.getTime() + 30 * 60 * 1000),
      );
    },
  );

  test("면접 ID 변경 시 해당 시간을 복원하고 이전 interval을 정리", () => {
    const setInterval = vi.spyOn(window, "setInterval");
    const clearInterval = vi.spyOn(window, "clearInterval");
    window.sessionStorage.setItem(
      "interview-deadline:202",
      String(now.getTime() + 90_000),
    );
    const { rerender, unmount } = render(<SessionTimer interviewId={101} />);
    const firstInterval = setInterval.mock.results[0].value;

    rerender(<SessionTimer interviewId={202} />);

    expect(screen.getByRole("timer")).toHaveTextContent("01:30");
    expect(clearInterval).toHaveBeenCalledWith(firstInterval);
    expect(setInterval).toHaveBeenCalledTimes(2);
    const nextInterval = setInterval.mock.results[1].value;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole("timer")).toHaveTextContent("01:29");

    unmount();
    expect(clearInterval).toHaveBeenCalledWith(nextInterval);
  });
});
