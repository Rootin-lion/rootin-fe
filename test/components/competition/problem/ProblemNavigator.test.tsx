import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { CompetitionProblemSummary } from "@/types/competitions/competition";
import ProblemNavigator from "@/components/competition/problem/ProblemNavigator";

const problems: CompetitionProblemSummary[] = [
  { competitionProblemId: 101, problemOrder: 1 },
  { competitionProblemId: 305, problemOrder: 2 },
  { competitionProblemId: 900, problemOrder: 3 },
];

describe("문제 목록 탐색", () => {
  test("문제별 현재 위치와 풀이 상태를 표시", () => {
    render(
      <ProblemNavigator
        problemNavigationItems={problems}
        currentProblemId={305}
        answeredProblemIds={new Set([101])}
        onSelectProblem={vi.fn()}
      />,
    );

    expect(screen.getAllByRole("button")).toHaveLength(3);
    expect(
      screen.getByRole("button", { name: "1번 문제, 풀이 완료" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("button", { name: "2번 문제, 현재, 미풀이" }),
    ).toHaveAttribute("aria-current", "step");
    expect(
      screen.getByRole("button", { name: "3번 문제, 미풀이" }),
    ).not.toHaveAttribute("aria-current");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  test("현재 문제도 풀이 완료 상태를 함께 표시", () => {
    render(
      <ProblemNavigator
        problemNavigationItems={problems}
        currentProblemId={305}
        answeredProblemIds={new Set([305])}
        onSelectProblem={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "2번 문제, 현재, 풀이 완료" }),
    ).toHaveAttribute("aria-current", "step");
  });

  test("문제 번호 대신 클릭한 문제 ID를 전달", async () => {
    const user = userEvent.setup();
    const onSelectProblem = vi.fn();
    render(
      <ProblemNavigator
        problemNavigationItems={problems}
        currentProblemId={101}
        answeredProblemIds={new Set()}
        onSelectProblem={onSelectProblem}
      />,
    );

    await user.click(screen.getByRole("button", { name: "2번 문제, 미풀이" }));

    expect(onSelectProblem).toHaveBeenCalledExactlyOnceWith(305);
  });

  test("현재 문제와 답변 목록 변경을 반영", () => {
    const onSelectProblem = vi.fn();
    const { rerender } = render(
      <ProblemNavigator
        problemNavigationItems={problems}
        currentProblemId={101}
        answeredProblemIds={new Set()}
        onSelectProblem={onSelectProblem}
      />,
    );

    rerender(
      <ProblemNavigator
        problemNavigationItems={problems}
        currentProblemId={900}
        answeredProblemIds={new Set([101, 305])}
        onSelectProblem={onSelectProblem}
      />,
    );

    expect(
      screen.getByRole("button", { current: "step" }),
    ).toHaveAccessibleName("3번 문제, 현재, 미풀이");
    expect(
      screen.getByRole("button", { name: "1번 문제, 풀이 완료" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      screen.getByRole("button", { name: "2번 문제, 풀이 완료" }),
    ).toBeInTheDocument();
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  test("문제가 없으면 이동 버튼과 현재 문제를 표시하지 않음", () => {
    render(
      <ProblemNavigator
        problemNavigationItems={[]}
        answeredProblemIds={new Set()}
        onSelectProblem={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("- / 0")).toBeInTheDocument();
  });
});
