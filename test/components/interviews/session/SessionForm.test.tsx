import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import SessionForm from "@/components/interviews/session/SessionForm";

vi.mock("@/assets/icons/interviews/send.svg", () => ({ default: () => null }));

describe("면접 답변 입력", () => {
  test("전달받은 답변을 입력창에 표시", () => {
    render(
      <SessionForm answer="기존 답변" onChange={vi.fn()} onSubmit={vi.fn()} />,
    );

    expect(screen.getByRole("textbox", { name: "답변 입력" })).toHaveValue(
      "기존 답변",
    );
  });

  test("입력 변경을 부모 상태에 반영", async () => {
    const user = userEvent.setup();

    function AnswerForm() {
      const [answer, setAnswer] = useState("");
      return (
        <SessionForm
          answer={answer}
          onChange={(event) => setAnswer(event.target.value)}
          onSubmit={vi.fn()}
        />
      );
    }

    render(<AnswerForm />);
    const input = screen.getByRole("textbox", { name: "답변 입력" });

    await user.type(input, "프로세스는 실행 중인 프로그램입니다.");

    expect(input).toHaveValue("프로세스는 실행 중인 프로그램입니다.");
  });

  test("보내기 버튼으로 답변 제출", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <SessionForm answer="답변" onChange={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole("button", { name: "답변 보내기" }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("입력창에서 Enter로 답변 제출", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <SessionForm answer="답변" onChange={vi.fn()} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole("textbox", { name: "답변 입력" }));
    await user.keyboard("{Enter}");

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  test("비활성 상태에서는 입력과 제출을 차단", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();
    render(
      <SessionForm
        answer="기존 답변"
        onChange={onChange}
        onSubmit={onSubmit}
        disabled
      />,
    );
    const input = screen.getByRole("textbox", { name: "답변 입력" });
    const button = screen.getByRole("button", { name: "답변 보내기" });

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    await user.type(input, "새 답변{Enter}");
    await user.click(button);

    expect(input).toHaveValue("기존 답변");
    expect(onChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
