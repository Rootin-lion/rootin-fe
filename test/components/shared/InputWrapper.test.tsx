import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import InputWrapper from "@/components/shared/InputWrapper";

describe("공통 입력 필드", () => {
  test("라벨과 입력 속성, 전달받은 값을 표시", async () => {
    const user = userEvent.setup();
    render(
      <InputWrapper>
        <InputWrapper.Label htmlFor="nickname">닉네임</InputWrapper.Label>
        <InputWrapper.Input
          id="nickname"
          name="nickname"
          placeholder="닉네임을 입력해주세요."
          value="루틴"
          onChange={vi.fn()}
          required
        />
      </InputWrapper>,
    );
    const input = screen.getByRole("textbox", { name: "닉네임" });

    expect(input).toHaveValue("루틴");
    expect(input).toHaveAttribute("name", "nickname");
    expect(input).toHaveAttribute("placeholder", "닉네임을 입력해주세요.");
    expect(input).toBeRequired();
    await user.click(screen.getByText("닉네임"));
    expect(input).toHaveFocus();
  });

  test("입력 변경과 삭제를 부모 상태에 반영", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    function NicknameInput() {
      const [value, setValue] = useState("");
      return (
        <InputWrapper.Input
          aria-label="닉네임"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onDelete={() => {
            onDelete();
            setValue("");
          }}
        />
      );
    }

    render(<NicknameInput />);
    const input = screen.getByRole("textbox", { name: "닉네임" });
    expect(
      screen.queryByRole("button", { name: "입력값 지우기" }),
    ).not.toBeInTheDocument();

    await user.type(input, "새 닉네임");
    expect(input).toHaveValue("새 닉네임");

    await user.click(screen.getByRole("button", { name: "입력값 지우기" }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(input).toHaveValue("");
    expect(
      screen.queryByRole("button", { name: "입력값 지우기" }),
    ).not.toBeInTheDocument();
  });

  test.each([
    {
      isAvailable: true,
      message: "사용 가능한 닉네임입니다.",
      other: "이미 등록된 닉네임입니다.",
    },
    {
      isAvailable: false,
      message: "이미 등록된 닉네임입니다.",
      other: "사용 가능한 닉네임입니다.",
    },
  ])(
    "닉네임 검사 결과 $isAvailable에 맞는 안내만 표시",
    ({ isAvailable, message, other }) => {
      render(
        <InputWrapper.Input
          aria-label="닉네임"
          value="루틴"
          onChange={vi.fn()}
          isAvailable={isAvailable}
        />,
      );

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.queryByText(other)).not.toBeInTheDocument();
    },
  );

  test.each([null, undefined])(
    "검사 결과가 %s이면 사용 가능 여부를 안내하지 않음",
    (isAvailable) => {
      render(
        <InputWrapper.Input
          aria-label="닉네임"
          value="루틴"
          onChange={vi.fn()}
          isAvailable={isAvailable}
        />,
      );

      expect(
        screen.queryByText("사용 가능한 닉네임입니다."),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("이미 등록된 닉네임입니다."),
      ).not.toBeInTheDocument();
    },
  );

  test("부모의 검사 결과 변경을 반영", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <InputWrapper.Input
        aria-label="닉네임"
        value="루틴"
        onChange={onChange}
        isAvailable
      />,
    );

    rerender(
      <InputWrapper.Input
        aria-label="닉네임"
        value="루틴"
        onChange={onChange}
        isAvailable={false}
      />,
    );

    expect(screen.getByText("이미 등록된 닉네임입니다.")).toBeInTheDocument();
    expect(
      screen.queryByText("사용 가능한 닉네임입니다."),
    ).not.toBeInTheDocument();
  });

  test("빈 입력은 삭제 버튼과 검사 안내를 숨김", () => {
    render(
      <InputWrapper.Input
        aria-label="닉네임"
        value=""
        onChange={vi.fn()}
        isAvailable
      />,
    );

    expect(
      screen.queryByRole("button", { name: "입력값 지우기" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("사용 가능한 닉네임입니다."),
    ).not.toBeInTheDocument();
  });

  test("비활성 입력은 수정과 삭제를 막고 검사 안내를 숨김", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onDelete = vi.fn();
    render(
      <InputWrapper.Input
        aria-label="닉네임"
        value="기존 닉네임"
        onChange={onChange}
        onDelete={onDelete}
        isAvailable
        disabled
      />,
    );
    const input = screen.getByRole("textbox", { name: "닉네임" });

    expect(input).toBeDisabled();
    await user.type(input, "추가");

    expect(input).toHaveValue("기존 닉네임");
    expect(onChange).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "입력값 지우기" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("사용 가능한 닉네임입니다."),
    ).not.toBeInTheDocument();
  });
});
