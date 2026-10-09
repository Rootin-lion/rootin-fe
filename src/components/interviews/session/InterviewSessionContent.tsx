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
import { useCallback, useRef, useState } from "react";

export default function InterviewSessionContent({
  interviewId,
  profileImageUrl,
  category,
  questionCount,
}: {
  interviewId: number;
  profileImageUrl: string | null;
  category: string | null;
  questionCount: number | null;
}) {
  const [messages, setMessages] = useState<SessionChatMessage[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const requestPendingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const handleIntroComplete = useCallback(() => {
    setIsIntroComplete(true);
  }, []);

  // 답변 체인지
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  // 답변 제출
  const handleSubmitClick = async () => {
    const trimmedAnswer = answer.trim();
    if (!isIntroComplete || requestPendingRef.current || !trimmedAnswer) return;

    const currentQuestion = messages.findLast(
      (message) => message.kind === "QUESTION",
    );
    if (!currentQuestion && trimmedAnswer !== "네") return;

    const answerMessage: SessionChatMessage = currentQuestion
      ? {
          id: `answer-${currentQuestion.question.questionId}`,
          kind: "ANSWER",
          questionId: currentQuestion.question.questionId,
          text: trimmedAnswer,
        }
      : { id: "intro-answer", kind: "ANSWER", text: trimmedAnswer };

    requestPendingRef.current = true;
    setMessages((prev) => [...prev, answerMessage]);
    setAnswer("");
    setIsTyping(true);

    const restoreAnswer = () => {
      setMessages((prev) =>
        prev.filter((message) => message.id !== answerMessage.id),
      );
      setAnswer(trimmedAnswer);
    };

    try {
      let question: QuestionState;

      if (currentQuestion) {
        const res = await submitInterviewAnswerAction(interviewId, {
          questionId: currentQuestion.question.questionId,
          answer: trimmedAnswer,
        });

        if (!res.ok) {
          restoreAnswer();
          setErrorContext(res.error);
          openModal();
          return;
        }

        question = res.data.nextQuestion;
      } else {
        const res = await getInterviewQuestionAction(interviewId);

        if (!res.ok) {
          restoreAnswer();
          setErrorContext(res.error);
          openModal();
          return;
        }

        question = res.data;
      }

      setMessages((prev) => {
        const alreadyAdded = prev.some(
          (message) =>
            message.kind === "QUESTION" &&
            message.question.questionId === question.questionId,
        );

        if (alreadyAdded) return prev;

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
      restoreAnswer();
      setErrorContext({
        code: "UNKNOWN_ERROR",
        message: currentQuestion
          ? "답변 제출에 실패했습니다."
          : "질문 조회에 실패했습니다.",
      });
      openModal();
    } finally {
      requestPendingRef.current = false;
      setIsTyping(false);
    }
  };

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
        <SessionChat
          category={category}
          questionCount={questionCount}
          messages={messages}
          profileImageUrl={profileImageUrl}
          isTyping={isTyping}
          onIntroComplete={handleIntroComplete}
        />
        <SessionVideo interviewId={interviewId} />
      </div>
      <div>
        <SessionwForm
          answer={answer}
          onChange={handleAnswerChange}
          onSubmit={handleSubmitClick}
          disabled={!isIntroComplete || isTyping}
        />
      </div>
    </div>
  );
}
