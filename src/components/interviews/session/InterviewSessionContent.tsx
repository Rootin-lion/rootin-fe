"use client";

import {
  getInterviewQuestionAction,
  submitInterviewAnswerAction,
} from "@/app/(service)/interviews/action";
import SessionChat from "@/components/interviews/session/SessionChat";
import SessionwForm from "@/components/interviews/session/SessionForm";
import SessionVideo from "@/components/interviews/session/SessionVideo";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import {
  QuestionState,
  SessionChatMessage,
} from "@/types/interviews/interview";
import { useEffect, useState } from "react";

export default function InterviewSessionContent({
  interviewId,
}: {
  interviewId: number;
}) {
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  // 답변 체인지
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  // 답변 제출
  const handleSubmitClick = async () => {
    const currentQuestion = messages.findLast(
      (message) => message.kind === "QUESTION",
    );
    const trimmedAnswer = answer.trim();

    if (
      !currentQuestion ||
      currentQuestion.kind !== "QUESTION" ||
      !trimmedAnswer
    ) {
      return;
    }

    try {
      const res = await submitInterviewAnswerAction(interviewId, {
        questionId: currentQuestion.question.questionId,
        answer: trimmedAnswer,
      });

      if (!res.ok) {
        setErrorContext(res.error);
        openModal();

        return;
      }

      const questionId = currentQuestion?.question.questionId;

      setMessages((prev) => [
        ...prev,
        {
          id: `question-${questionId}`,
          kind: "ANSWER",
          questionId,
          text: trimmedAnswer,
        },
      ]);
      setAnswer("");

      const question: QuestionState = res.data.nextQuestion;

      setMessages((prev) => {
        const alredayAdded = prev.some(
          (message) =>
            message.kind === "QUESTION" &&
            message.question.questionId === question.questionId,
        );

        if (alredayAdded) return prev;

        return [
          ...prev,
          {
            id: `question-${question.questionId}`,
            kind: "QUESTION",
            question,
          },
        ];
      });
    } catch {
      setErrorContext({
        code: "UNKOWN_ERROR",
        message: "답변 제출에 실패했습니다.",
      });
      openModal();
    }
  };
  // 질문 조회 및 배열 삽입
  useEffect(() => {
    let active = true;

    const getQuestion = async () => {
      try {
        const res = await getInterviewQuestionAction(interviewId);

        if (!active) return;

        if (!res.ok) {
          setErrorContext(res.error);
          openModal();

          return;
        }

        const question: QuestionState = res.data;

        setMessages((prev) => {
          const alredayAdded = prev.some(
            (message) =>
              message.kind === "QUESTION" &&
              message.question.questionId === question.questionId,
          );

          if (alredayAdded) return prev;

          return [
            ...prev,
            {
              id: `question-${question.questionId}`,
              kind: "QUESTION",
              question,
            },
          ];
        });
      } catch {
        if (!active) return;

        setErrorContext({
          code: "UNKNOWN_ERROR",
          message: "질문 조회에 실패했습니다.",
        });
        openModal();
      }
    };

    void getQuestion();

    return () => {
      active = false;
    };
  }, [interviewId, setErrorContext, openModal]);

  return (
    <div className="bg-bg-green-50 flex w-full flex-1 flex-col justify-between gap-11">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="mx-auto flex max-h-126 w-full max-w-5xl flex-row gap-10 pt-6">
        <SessionChat messages={messages} />
        <SessionVideo />
      </div>
      <div>
        <SessionwForm
          answer={answer}
          onChange={handleAnswerChange}
          onSubmit={handleSubmitClick}
        />
      </div>
    </div>
  );
}
