import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { InterviewConfig } from "@/types/interviews/interview";
import InterviewSetup from "@/components/interviews/InterviewSetup";

const defaultConfig: InterviewConfig = {
  category: "DATABASE",
  questionCount: 3,
  interviewMode: "TEXT",
};

function renderSetup(config: InterviewConfig = defaultConfig) {
  const callbacks = {
    onCategoryChange: vi.fn(),
    onQuestionCountChange: vi.fn(),
    onInterviewModeChange: vi.fn(),
    onStart: vi.fn(),
  };
  const view = render(<InterviewSetup config={config} {...callbacks} />);
  return { ...view, ...callbacks };
}

describe("면접 설정", () => {
  test("현재 분야와 방식, 문항 수를 표시", () => {
    renderSetup();
    const topic = within(screen.getByRole("group", { name: "면접 분야" }));
    const mode = within(screen.getByRole("group", { name: "면접 방식" }));

    expect(topic.getByRole("button", { name: "데이터베이스" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(topic.getByRole("button", { name: "네트워크" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(mode.getByRole("button", { name: "텍스트" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(mode.getByRole("button", { name: "음성" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("spinbutton", { name: "문항 개수" })).toHaveValue(
      3,
    );
  });

  test.each([null, 0, 6, 1.5])(
    "문항 수가 %s이면 시작을 차단",
    async (questionCount) => {
      const user = userEvent.setup();
      const { onStart } = renderSetup({ ...defaultConfig, questionCount });
      const button = screen.getByRole("button", { name: "면접 시작하기" });

      expect(button).toBeDisabled();
      await user.click(button);

      expect(onStart).not.toHaveBeenCalled();
    },
  );

  test.each([1, 5])(
    "유효한 문항 수 %s이면 면접 시작 가능",
    async (questionCount) => {
      const user = userEvent.setup();
      const { onStart } = renderSetup({ ...defaultConfig, questionCount });
      const button = screen.getByRole("button", { name: "면접 시작하기" });

      expect(button).toBeEnabled();
      await user.click(button);

      expect(onStart).toHaveBeenCalledOnce();
    },
  );

  test("분야와 방식 변경을 해당 콜백에 전달", async () => {
    const user = userEvent.setup();
    const { onCategoryChange, onInterviewModeChange, onStart } = renderSetup();

    await user.click(
      within(screen.getByRole("group", { name: "면접 분야" })).getByRole(
        "button",
        { name: "네트워크" },
      ),
    );
    await user.click(
      within(screen.getByRole("group", { name: "면접 방식" })).getByRole(
        "button",
        { name: "음성" },
      ),
    );

    expect(onCategoryChange).toHaveBeenCalledExactlyOnceWith("NETWORK");
    expect(onInterviewModeChange).toHaveBeenCalledExactlyOnceWith("VOICE");
    expect(onStart).not.toHaveBeenCalled();
  });

  test("문항 수 입력 변경을 부모 콜백에 전달", async () => {
    const user = userEvent.setup();
    const { onQuestionCountChange } = renderSetup({
      ...defaultConfig,
      questionCount: null,
    });

    await user.type(screen.getByRole("spinbutton", { name: "문항 개수" }), "4");

    expect(onQuestionCountChange).toHaveBeenCalledExactlyOnceWith(4);
  });
});
