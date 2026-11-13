import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import ProblemButtonBox from "@/components/competition/problem/ProblemButtonBox";

describe("문제 이동과 제출 버튼", () => {
  test.each([
    { name: "첫 문제", isFirst: true, isLast: false, buttons: ["다음 문제"] },
    {
      name: "중간 문제",
      isFirst: false,
      isLast: false,
      buttons: ["이전 문제", "다음 문제"],
    },
    {
      name: "마지막 문제",
      isFirst: false,
      isLast: true,
      buttons: ["이전 문제", "제출하기"],
    },
    { name: "문제가 하나", isFirst: true, isLast: true, buttons: ["제출하기"] },
  ])("$name일 때 필요한 버튼만 표시", ({ isFirst, isLast, buttons }) => {
    render(<ProblemButtonBox isFirst={isFirst} isLast={isLast} />);

    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(buttons);
  });

  test("이전과 다음 버튼은 각각의 이동 콜백만 호출", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();
    const onSubmit = vi.fn();
    render(
      <ProblemButtonBox
        isFirst={false}
        isLast={false}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "이전 문제" }));
    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onNext).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrevious).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("마지막 문제의 제출 버튼은 제출 콜백만 호출", async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onSubmit = vi.fn();
    render(
      <ProblemButtonBox
        isFirst={false}
        isLast
        onNext={onNext}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "제출하기" }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onNext).not.toHaveBeenCalled();
  });
});
