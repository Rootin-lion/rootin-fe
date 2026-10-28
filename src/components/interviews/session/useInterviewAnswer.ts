"use client";

import { useCallback, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { SessionChatMessage } from "@/types/interviews/interview";
import {
  getInterviewQuestionAction,
  submitInterviewAnswerAction,
} from "@/app/(service)/interviews/action";
import useErrorModal from "@/hooks/useErrorModal";
import { useInterviewSessionStore } from "@/stores/useInterviewSessionStore";

export default function useInterviewAnswer({
  interviewId,
  sessionReady,
  isIntroComplete,
  interviewCompleted,
  messages,
}: {
  interviewId: number;
  sessionReady: boolean;
  isIntroComplete: boolean;
  interviewCompleted: boolean;
  messages: SessionChatMessage[];
}) {
  const appendExchange = useInterviewSessionStore(
    (state) => state.appendExchange,
  );
  const appendAnswerResult = useInterviewSessionStore(
    (state) => state.appendAnswerResult,
  );
  const [answer, setAnswer] = useState("");
  const [pendingAnswer, setPendingAnswer] = useState<SessionChatMessage | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPresentingFeedback, setIsPresentingFeedback] = useState(false);
  const requestPendingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const handleFeedbackComplete = useCallback(() => {
    setIsPresentingFeedback(false);
  }, []);

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  // 답변 제출
  const handleSubmitClick = async () => {
    const trimmedAnswer = answer.trim();
    if (
      !sessionReady ||
      !isIntroComplete ||
      interviewCompleted ||
      isPresentingFeedback ||
      requestPendingRef.current ||
      !trimmedAnswer
    )
      return;

    const currentQuestion = messages.findLast(
      (message) => message.kind === "QUESTION",
    );
    if (!currentQuestion && trimmedAnswer !== "네") return;

    const answerMessage: Extract<SessionChatMessage, { kind: "ANSWER" }> =
      currentQuestion
        ? {
            id: `answer-${currentQuestion.question.questionId}`,
            kind: "ANSWER",
            questionId: currentQuestion.question.questionId,
            text: trimmedAnswer,
          }
        : { id: "intro-answer", kind: "ANSWER", text: trimmedAnswer };

    requestPendingRef.current = true;
    setPendingAnswer(answerMessage);
    setAnswer("");
    setIsTyping(true);

    const restoreAnswer = () => {
      setPendingAnswer(null);
      setAnswer(trimmedAnswer);
    };

    try {
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

        setIsPresentingFeedback(Boolean(res.data.feedback.trim()));
        appendAnswerResult(interviewId, answerMessage, res.data);
      } else {
        const res = await getInterviewQuestionAction(interviewId);

        if (!res.ok) {
          restoreAnswer();
          setErrorContext(res.error);
          openModal();
          return;
        }

        appendExchange(interviewId, answerMessage, res.data);
      }

      setPendingAnswer(null);
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

  return {
    answer,
    pendingAnswer,
    isTyping,
    isPresentingFeedback,
    handleAnswerChange,
    handleSubmitClick,
    handleFeedbackComplete,
    error,
    isModalOpen,
    closeModal,
  };
}
