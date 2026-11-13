import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { CompetitionProblemDetail } from "@/types/competitions/competition";
import {
  addProblemBookmarkAction,
  removeProblemBookmarkAction,
} from "@/components/bookmark/action";
import ProblemCard from "@/components/competition/problem/ProblemCard";

vi.mock("@/assets/icons/shared/bookmark.svg", () => ({ default: () => null }));
vi.mock("@/components/bookmark/action", () => ({
  addProblemBookmarkAction: vi.fn(),
  removeProblemBookmarkAction: vi.fn(),
}));

const problem: CompetitionProblemDetail = {
  competitionProblemId: 101,
  problemId: 501,
  problemOrder: 2,
  problemTitle: "트랜잭션",
  problemContent: "트랜잭션의 특성으로 올바른 것은?",
  category: "DATABASE",
  options: [
    { optionId: 11, optionOrder: 1, optionContent: "원자성" },
    { optionId: 22, optionOrder: 2, optionContent: "일관성" },
    { optionId: 33, optionOrder: 3, optionContent: "지속성" },
  ],
};
const addBookmark = vi.mocked(addProblemBookmarkAction);
const removeBookmark = vi.mocked(removeProblemBookmarkAction);

beforeEach(() => {
  addBookmark.mockReset().mockResolvedValue({ ok: true, data: {} });
  removeBookmark.mockReset().mockResolvedValue({ ok: true, data: {} });
});

describe("문제 카드 선택과 북마크", () => {
  test("풀이 모드에서 문제와 선택지를 표시하고 선택지 ID를 전달", async () => {
    const user = userEvent.setup();
    const onSelectOption = vi.fn();
    render(
      <ProblemCard
        variant="solve"
        currentProblem={problem}
        selectedOptionId={11}
        onSelectOption={onSelectOption}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /^2\./,
      }),
    ).toHaveTextContent(problem.problemContent);
    const options = within(screen.getByRole("radiogroup"));
    expect(options.getAllByRole("radio")).toHaveLength(3);
    const selected = options.getByRole("radio", {
      name: "원자성",
      checked: true,
    });
    expect(selected).toBeDisabled();
    await user.click(selected);
    expect(onSelectOption).not.toHaveBeenCalled();

    await user.click(
      options.getByRole("radio", { name: "일관성", checked: false }),
    );

    expect(onSelectOption).toHaveBeenCalledExactlyOnceWith(22);
  });

  test("부모의 선택 변경을 반영해 현재 선택지만 체크", () => {
    const onSelectOption = vi.fn();
    const { rerender } = render(
      <ProblemCard
        variant="solve"
        currentProblem={problem}
        selectedOptionId={11}
        onSelectOption={onSelectOption}
      />,
    );

    rerender(
      <ProblemCard
        variant="solve"
        currentProblem={problem}
        selectedOptionId={22}
        onSelectOption={onSelectOption}
      />,
    );

    expect(screen.getByRole("radio", { checked: true })).toHaveAccessibleName(
      "일관성",
    );
    expect(screen.getByRole("radio", { name: "원자성" })).toBeEnabled();
    expect(screen.getByRole("radio", { name: "일관성" })).toBeDisabled();
  });

  test("북마크 모드는 카테고리와 Q 제목을 표시하고 0부터 시작하는 인덱스를 전달", async () => {
    const user = userEvent.setup();
    const onSelectOption = vi.fn();
    const onSelectOptionIndex = vi.fn();
    render(
      <ProblemCard
        variant="bookmark"
        currentProblem={problem}
        selectedOptionIndex={0}
        onSelectOption={onSelectOption}
        onSelectOptionIndex={onSelectOptionIndex}
      />,
    );

    expect(screen.getByText("데이터베이스")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /^Q\./,
      }),
    ).toHaveTextContent(problem.problemContent);
    expect(screen.getByRole("radio", { checked: true })).toHaveAccessibleName(
      "원자성",
    );

    await user.click(screen.getByRole("radio", { name: "일관성" }));

    expect(onSelectOptionIndex).toHaveBeenCalledExactlyOnceWith(1);
    expect(onSelectOption).not.toHaveBeenCalled();
  });

  test("선택 콜백이 없는 결과는 선택지를 수정할 수 없음", () => {
    render(
      <ProblemCard
        variant="result"
        currentProblem={problem}
        selectedOptionId={22}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /^2\./,
      }),
    ).toHaveTextContent(problem.problemContent);
    expect(screen.getByRole("radio", { checked: true })).toHaveAccessibleName(
      "일관성",
    );
    for (const option of screen.getAllByRole("radio")) {
      expect(option).toBeDisabled();
    }
  });

  test("북마크 버튼은 표시 옵션을 켰을 때만 제공", () => {
    const { rerender } = render(
      <ProblemCard variant="result" currentProblem={problem} />,
    );
    expect(
      screen.queryByRole("button", { name: "북마크 저장" }),
    ).not.toBeInTheDocument();

    rerender(
      <ProblemCard variant="result" currentProblem={problem} showBookmark />,
    );

    expect(
      screen.getByRole("button", { name: "북마크 저장", pressed: false }),
    ).toBeInTheDocument();
    expect(addBookmark).not.toHaveBeenCalled();
    expect(removeBookmark).not.toHaveBeenCalled();
  });

  test("저장과 해제가 성공한 뒤 버튼 상태를 갱신", async () => {
    const user = userEvent.setup();
    render(
      <ProblemCard variant="result" currentProblem={problem} showBookmark />,
    );

    await user.click(screen.getByRole("button", { name: "북마크 저장" }));

    expect(addBookmark).toHaveBeenCalledExactlyOnceWith(501);
    expect(
      await screen.findByRole("button", { name: "북마크 해제", pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("dialog", { name: "북마크에 저장되었습니다." }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "확인" }));
    await user.click(screen.getByRole("button", { name: "북마크 해제" }));

    expect(removeBookmark).toHaveBeenCalledExactlyOnceWith(501);
    expect(
      await screen.findByRole("button", {
        name: "북마크 저장",
        pressed: false,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test.each([
    { name: "저장 실패 응답", bookmarked: false, rejects: false },
    { name: "저장 예외", bookmarked: false, rejects: true },
    { name: "해제 실패 응답", bookmarked: true, rejects: false },
    { name: "해제 예외", bookmarked: true, rejects: true },
  ])(
    "$name이면 기존 상태를 유지하고 오류를 표시",
    async ({ bookmarked, rejects }) => {
      const user = userEvent.setup();
      const action = bookmarked ? removeBookmark : addBookmark;
      const label = bookmarked ? "북마크 해제" : "북마크 저장";
      const message = bookmarked
        ? "북마크 해제에 실패했습니다."
        : "북마크 저장에 실패했습니다.";
      if (rejects) action.mockRejectedValueOnce(new Error("network error"));
      else
        action.mockResolvedValueOnce({
          ok: false,
          error: { code: "BOOKMARK_FAILED", message },
        });
      const currentProblem = { ...problem, bookmarked };
      render(
        <ProblemCard
          variant="result"
          currentProblem={currentProblem}
          showBookmark
        />,
      );

      await user.click(screen.getByRole("button", { name: label }));

      const dialog = await screen.findByRole("dialog", {
        name: rejects ? "UNKNOWN_ERROR" : "BOOKMARK_FAILED",
      });
      expect(dialog).toHaveAccessibleDescription(message);
      expect(action).toHaveBeenCalledExactlyOnceWith(501);
      expect(
        screen.getByRole("button", { name: label, pressed: bookmarked }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("dialog", { name: "북마크에 저장되었습니다." }),
      ).not.toBeInTheDocument();

      await user.click(within(dialog).getByRole("button", { name: "닫기" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: label, pressed: bookmarked }),
      ).toBeInTheDocument();
    },
  );

  test("문제를 전환해도 각 문제의 북마크 상태를 구분해 유지", async () => {
    const user = userEvent.setup();
    const nextProblem = {
      ...problem,
      competitionProblemId: 202,
      problemId: 702,
      problemOrder: 3,
    };
    const { rerender } = render(
      <ProblemCard variant="result" currentProblem={problem} showBookmark />,
    );

    await user.click(screen.getByRole("button", { name: "북마크 저장" }));
    await screen.findByRole("dialog", { name: "북마크에 저장되었습니다." });
    await user.click(screen.getByRole("button", { name: "확인" }));

    rerender(
      <ProblemCard
        variant="result"
        currentProblem={nextProblem}
        showBookmark
      />,
    );
    expect(
      screen.getByRole("button", { name: "북마크 저장", pressed: false }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "북마크 저장" }));
    await screen.findByRole("dialog", { name: "북마크에 저장되었습니다." });
    await user.click(screen.getByRole("button", { name: "확인" }));

    rerender(
      <ProblemCard variant="result" currentProblem={problem} showBookmark />,
    );
    await user.click(
      screen.getByRole("button", { name: "북마크 해제", pressed: true }),
    );
    await screen.findByRole("button", { name: "북마크 저장", pressed: false });

    rerender(
      <ProblemCard
        variant="result"
        currentProblem={nextProblem}
        showBookmark
      />,
    );
    expect(
      screen.getByRole("button", { name: "북마크 해제", pressed: true }),
    ).toBeInTheDocument();
    expect(addBookmark.mock.calls).toEqual([[501], [702]]);
    expect(removeBookmark).toHaveBeenCalledExactlyOnceWith(501);
  });
});
