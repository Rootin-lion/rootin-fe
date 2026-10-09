"use client";

import {
  generateInterviewReportAction,
  getInterviewQuestionAction,
  getMyInterviewReportAction,
  submitInterviewAnswerAction,
} from "@/app/(service)/interviews/action";
import { useRouter } from "next/navigation";
import { useInterviewMedia } from "@/components/interviews/InterviewMediaProvider";
import SessionChat from "@/components/interviews/session/SessionChat";
import SessionwForm from "@/components/interviews/session/SessionForm";
import SessionVideo from "@/components/interviews/session/SessionVideo";
import ErrorModal from "@/components/shared/ErrorModal";
import useErrorModal from "@/hooks/useErrorModal";
import {
  EMPTY_INTERVIEW_SESSION,
  useInterviewSessionStore,
} from "@/stores/useInterviewSessionStore";
import { SessionChatMessage } from "@/types/interviews/interview";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const subscribeToHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

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
  const router = useRouter();
  const { stopCamera } = useInterviewMedia();
  const session = useInterviewSessionStore(
    (state) => state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION,
  );
  const completeIntro = useInterviewSessionStore(
    (state) => state.completeIntro,
  );
  const ensureIntro = useInterviewSessionStore((state) => state.ensureIntro);
  const appendExchange = useInterviewSessionStore(
    (state) => state.appendExchange,
  );
  const appendAnswerResult = useInterviewSessionStore(
    (state) => state.appendAnswerResult,
  );
  const messages = session.messages;
  const isIntroComplete = session.introComplete;
  const interviewCompleted = session.interviewCompleted;
  const [restoredMessageIds] = useState(
    () =>
      new Set(
        useInterviewSessionStore
          .getState()
          .sessions[interviewId]?.messages.map((message) => message.id) ?? [],
      ),
  );
  const [answer, setAnswer] = useState<string>("");
  const [pendingAnswer, setPendingAnswer] = useState<SessionChatMessage | null>(
    null,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [isPresentingFeedback, setIsPresentingFeedback] = useState(false);
  const [completionPresented, setCompletionPresented] = useState(() =>
    Boolean(
      useInterviewSessionStore
        .getState()
        .sessions[
          interviewId
        ]?.messages.some((message) => message.kind === "COMPLETION"),
    ),
  );
  const [reportStatus, setReportStatus] = useState<
    "idle" | "generating" | "ready" | "failed"
  >("idle");
  const sessionReady = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const resumedIntro =
    restoredMessageIds.has("intro-camera") &&
    restoredMessageIds.has("intro-start");
  const displayedMessages = pendingAnswer
    ? [...messages, pendingAnswer]
    : messages;
  const requestPendingRef = useRef(false);
  const reportPendingRef = useRef(false);
  const navigationPendingRef = useRef(false);
  const { error, setErrorContext, isModalOpen, openModal, closeModal } =
    useErrorModal();

  useEffect(() => {
    if (!sessionReady) return;
    ensureIntro(interviewId, category, questionCount);
    if (resumedIntro && !isIntroComplete) completeIntro(interviewId);
  }, [
    category,
    completeIntro,
    ensureIntro,
    interviewId,
    isIntroComplete,
    questionCount,
    resumedIntro,
    sessionReady,
  ]);

  const handleIntroComplete = useCallback(() => {
    completeIntro(interviewId);
  }, [completeIntro, interviewId]);

  const handleFeedbackComplete = useCallback(() => {
    setIsPresentingFeedback(false);
  }, []);

  const handleCompletionComplete = useCallback(() => {
    setCompletionPresented(true);
  }, []);

  const generateReport = useCallback(async () => {
    if (reportPendingRef.current) return;
    reportPendingRef.current = true;
    setReportStatus("generating");

    try {
      if (
        restoredMessageIds.has("interview-complete") ||
        reportStatus === "failed"
      ) {
        const existingReport = await getMyInterviewReportAction(interviewId);
        if (existingReport.ok) {
          setReportStatus("ready");
          return;
        }
      }

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const result = await generateInterviewReportAction(interviewId);
        if (result.ok) {
          setReportStatus("ready");
          return;
        }

        if (result.error.code === "C409-6" && attempt < 3) {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 1500 * (attempt + 1));
          });
          continue;
        }

        setErrorContext(result.error);
        openModal();
        setReportStatus("failed");
        return;
      }
    } catch {
      setErrorContext({
        code: "INTERVIEW_FAILED",
        message: "면접 리포트 생성에 실패했습니다.",
      });
      openModal();
      setReportStatus("failed");
    } finally {
      reportPendingRef.current = false;
    }
  }, [
    interviewId,
    openModal,
    reportStatus,
    restoredMessageIds,
    setErrorContext,
  ]);

  useEffect(() => {
    if (
      !sessionReady ||
      !interviewCompleted ||
      !completionPresented ||
      isPresentingFeedback ||
      reportStatus !== "idle"
    )
      return;

    const timeoutId = window.setTimeout(() => {
      void generateReport();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    completionPresented,
    generateReport,
    interviewCompleted,
    isPresentingFeedback,
    reportStatus,
    sessionReady,
  ]);

  useEffect(() => {
    if (
      reportStatus === "ready" &&
      completionPresented &&
      !navigationPendingRef.current
    ) {
      navigationPendingRef.current = true;
      stopCamera();
      router.replace(`/interviews/${interviewId}/result`);
    }
  }, [completionPresented, interviewId, reportStatus, router, stopCamera]);

  // 답변 체인지
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="bg-bg-green-50 flex w-full flex-1 flex-col justify-between gap-19">
      {isModalOpen && (
        <ErrorModal
          code={error.code}
          message={error.message}
          onClose={closeModal}
        />
      )}

      <div className="mx-auto flex max-h-126 w-full max-w-5xl flex-row gap-10 pt-6">
        {sessionReady && (
          <SessionChat
            category={category}
            questionCount={questionCount}
            messages={displayedMessages}
            profileImageUrl={profileImageUrl}
            isTyping={isTyping}
            isPresentingFeedback={isPresentingFeedback}
            introComplete={isIntroComplete}
            restoredMessageIds={restoredMessageIds}
            onIntroComplete={handleIntroComplete}
            onFeedbackComplete={handleFeedbackComplete}
            onCompletionComplete={handleCompletionComplete}
          />
        )}
        <SessionVideo interviewId={interviewId} />
      </div>
      <div>
        {interviewCompleted ? (
          <div className="border-t border-t-[#E5E7EB] bg-white py-3 text-center">
            {reportStatus === "failed" ? (
              <button
                type="button"
                onClick={generateReport}
                className="underline"
              >
                리포트 생성 다시 시도
              </button>
            ) : (
              <p role="status">면접 결과를 준비하고 있습니다.</p>
            )}
          </div>
        ) : (
          <SessionwForm
            answer={answer}
            onChange={handleAnswerChange}
            onSubmit={handleSubmitClick}
            disabled={
              !sessionReady ||
              !isIntroComplete ||
              isTyping ||
              isPresentingFeedback
            }
          />
        )}
      </div>
    </div>
  );
}
