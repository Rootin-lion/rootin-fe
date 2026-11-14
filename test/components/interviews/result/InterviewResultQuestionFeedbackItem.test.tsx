import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import type { InterviewReportQuestion } from "@/types/interviews/interview";
import InterviewResultQuestionFeedbackItem from "@/components/interviews/result/InterviewResultQuestionFeedbackItem";

vi.mock("@/assets/icons/shared/chevron.svg", () => ({ default: () => null }));

const question: InterviewReportQuestion = {
  questionId: 101,
  questionOrder: 1,
  topicName: "프로세스와 스레드",
  questionType: "BASIC",
  question: "프로세스와 스레드는 어떻게 다른가요?",
  answer: "프로세스는 독립된 주소 공간을 갖습니다.",
  accuracy: 80,
  feedback: "공유 자원의 차이를 추가로 설명해주세요.",
  missingKeywords: "동기화, 없음, , 주소 공간",
};
const followUp: InterviewReportQuestion = {
  questionId: 202,
  questionOrder: 2,
  topicName: "프로세스와 스레드",
  questionType: "FOLLOW_UP",
  question: "공유 자원의 동기화는 왜 필요한가요?",
  answer: "경쟁 상태를 방지하기 위해 필요합니다.",
  accuracy: 90,
  feedback: "동기화 목적을 잘 설명했습니다.",
  missingKeywords: "없음",
};

describe("면접 질문별 피드백 펼침", () => {
  test("처음에는 질문만 표시하고 상세 답변을 숨김", () => {
    render(
      <InterviewResultQuestionFeedbackItem
        question={question}
        followUpQuestions={[followUp]}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /프로세스와 스레드는 어떻게 다른가요/,
      }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(question.answer)).not.toBeInTheDocument();
    expect(screen.queryByText(followUp.question)).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  test("펼치면 본 질문과 꼬리질문의 답변·피드백·정확도를 표시", async () => {
    const user = userEvent.setup();
    render(
      <InterviewResultQuestionFeedbackItem
        question={question}
        followUpQuestions={[followUp]}
      />,
    );
    const toggle = screen.getByRole("button", { expanded: false });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    for (const item of [question, followUp]) {
      expect(screen.getByText(item.answer)).toBeInTheDocument();
      expect(screen.getByText(item.feedback)).toBeInTheDocument();
      expect(
        screen.getByRole("progressbar", {
          name: `${item.questionOrder}번 질문 정확도`,
        }),
      ).toHaveAttribute("aria-valuenow", String(item.accuracy));
    }
    expect(screen.getByText(followUp.question)).toBeInTheDocument();
    expect(screen.getByText("꼬리질문")).toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(question.answer)).not.toBeInTheDocument();
    expect(screen.queryByText(followUp.question)).not.toBeInTheDocument();
  });

  test.each(["{Enter}", " "])("키보드 %s로 펼치고 접음", async (key) => {
    const user = userEvent.setup();
    render(
      <InterviewResultQuestionFeedbackItem
        question={question}
        followUpQuestions={[]}
      />,
    );
    const toggle = screen.getByRole("button", { expanded: false });

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(key);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(key);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("추천 개념의 공백과 빈 항목·없음을 제외하고 표시", async () => {
    const user = userEvent.setup();
    render(
      <InterviewResultQuestionFeedbackItem
        question={question}
        followUpQuestions={[]}
      />,
    );

    await user.click(screen.getByRole("button", { expanded: false }));

    expect(
      screen.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual(["동기화", "주소 공간"]);
    expect(screen.queryByText("꼬리질문")).not.toBeInTheDocument();
  });

  test("추천 개념과 꼬리질문이 없으면 대체 안내를 표시", async () => {
    const user = userEvent.setup();
    render(
      <InterviewResultQuestionFeedbackItem
        question={{ ...question, missingKeywords: "없음, , " }}
        followUpQuestions={[]}
      />,
    );

    await user.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByText("없음")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.queryByText("꼬리질문")).not.toBeInTheDocument();
  });
});
