import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import ProblemSubmitModal from "@/components/competition/problem/ProblemSubmitModal";

describe("문제 제출 확인", () => {
  test("제출 확인과 수정 불가 안내를 표시", () => {
    render(<ProblemSubmitModal onClose={vi.fn()} onSubmit={vi.fn()} />);

    const dialog = screen.getByRole("dialog", {
      name: "정말 제출하시겠습니까?",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleDescription(
      "제출 후에는 답안을 수정할 수 없습니다.",
    );
    expect(
      screen.getByRole("heading", { name: "정말 제출하시겠습니까?" }),
    ).toBeInTheDocument();
  });

  test("취소하면 모달 닫기만 호출", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<ProblemSubmitModal onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "취소" }));

    expect(onClose).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("제출하면 제출 콜백만 호출", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(<ProblemSubmitModal onClose={onClose} onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "제출하기" }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });
});
