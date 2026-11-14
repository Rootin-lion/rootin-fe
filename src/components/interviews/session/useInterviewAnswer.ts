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
  const answerRef = useRef("");
  const [pendingAnswer, setPendingAnswer] = useState<SessionChatMessage | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPresentingFeedback, setIsPresentingFeedback] = useState(false);
  const requestPendingRef = useRef(false);
  const feedbackPendingRef = useRef(false);
  const errorPendingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  const handleFeedbackComplete = useCallback(() => {
    feedbackPendingRef.current = false;
    setIsPresentingFeedback(false);
  }, []);

  const updateAnswer = useCallback((value: string) => {
    answerRef.current = value;
    setAnswer(value);
  }, []);

  const canAcceptAnswer = useCallback(
    () =>
      sessionReady &&
      isIntroComplete &&
      !interviewCompleted &&
      !requestPendingRef.current &&
      !feedbackPendingRef.current &&
      !errorPendingRef.current,
    [sessionReady, isIntroComplete, interviewCompleted],
  );

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateAnswer(e.target.value);
  };

  // 답변 제출
  const handleSubmitClick = async (
    value = answerRef.current,
    onAccepted?: () => void,
  ) => {
    const trimmedAnswer = value.trim();
    if (!canAcceptAnswer() || !trimmedAnswer) return;

    const currentQuestion = messages.findLast(
      (message) => message.kind === "QUESTION",
    );
    if (
      !currentQuestion &&
      trimmedAnswer.replace(/[.!?。！？]+$/u, "").trim() !== "네"
    )
      return;

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
    updateAnswer("");
    onAccepted?.();
    setIsTyping(true);

    const restoreAnswer = () => {
      errorPendingRef.current = true;
      setPendingAnswer(null);
      updateAnswer(trimmedAnswer);
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

        feedbackPendingRef.current = Boolean(res.data.feedback.trim());
        setIsPresentingFeedback(feedbackPendingRef.current);
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
    updateAnswer,
    canAcceptAnswer,
    pendingAnswer,
    isTyping,
    isPresentingFeedback,
    handleAnswerChange,
    handleSubmitClick,
    handleFeedbackComplete,
    error,
    isModalOpen,
    closeModal: () => {
      errorPendingRef.current = false;
      closeModal();
    },
  };
}
