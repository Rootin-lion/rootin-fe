import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import InterviewCount from "@/components/interviews/InterviewCount";

describe("면접 문항 수 입력", () => {
  test("미선택 상태는 빈 입력으로 표시", () => {
    render(<InterviewCount questionCount={null} onChange={vi.fn()} />);

    expect(screen.getByRole("spinbutton", { name: "문항 개수" })).toHaveValue(
      null,
    );
  });

  test("입력창에 문항 수 안내를 연결", () => {
    render(<InterviewCount questionCount={3} onChange={vi.fn()} />);

    expect(
      screen.getByRole("spinbutton", { name: "문항 개수" }),
    ).toHaveAccessibleDescription("1 ~ 5개 선택 가능");
  });

  test("문항 개수 라벨을 클릭하면 입력창으로 포커스 이동", async () => {
    const user = userEvent.setup();
    render(<InterviewCount questionCount={3} onChange={vi.fn()} />);

    await user.click(screen.getByText("문항 개수"));

    expect(screen.getByRole("spinbutton", { name: "문항 개수" })).toHaveFocus();
  });

  test("여러 입력창의 라벨과 설명을 각각 연결", () => {
    render(
      <>
        <InterviewCount questionCount={1} onChange={vi.fn()} />
        <InterviewCount questionCount={5} onChange={vi.fn()} />
      </>,
    );

    const inputs = screen.getAllByRole("spinbutton", { name: "문항 개수" });
    expect(inputs[0].id).not.toBe(inputs[1].id);
    expect(inputs[0].getAttribute("aria-describedby")).not.toBe(
      inputs[1].getAttribute("aria-describedby"),
    );
    for (const input of inputs) {
      expect(input).toHaveAccessibleDescription("1 ~ 5개 선택 가능");
    }
  });

  test.each([1, 3, 5])("문항 수 %s를 숫자로 전달", async (count) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InterviewCount questionCount={null} onChange={onChange} />);

    await user.type(
      screen.getByRole("spinbutton", { name: "문항 개수" }),
      String(count),
    );

    expect(onChange).toHaveBeenCalledExactlyOnceWith(count);
  });

  test("입력값을 지우면 null을 전달", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InterviewCount questionCount={3} onChange={onChange} />);

    await user.clear(screen.getByRole("spinbutton", { name: "문항 개수" }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(null);
  });

  test.each(["0", "6", "-1", "1.5"])(
    "허용하지 않는 문항 수 %s는 전달하지 않음",
    (value) => {
      const onChange = vi.fn();
      render(<InterviewCount questionCount={3} onChange={onChange} />);

      // 중간 키 입력 대신 범위 밖 값과 소수가 들어온 change 이벤트를 검증한다.
      fireEvent.change(screen.getByRole("spinbutton", { name: "문항 개수" }), {
        target: { value },
      });

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByRole("spinbutton", { name: "문항 개수" })).toHaveValue(
        3,
      );
    },
  );
});
