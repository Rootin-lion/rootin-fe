import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  restoreSessions,
  type InterviewSessionSnapshot,
} from "./interviewSessionPersistence";
import type {
  InterviewAnswerResult,
  QuestionState,
  SessionChatMessage,
} from "@/types/interviews/interview";

export const EMPTY_INTERVIEW_SESSION: InterviewSessionSnapshot = {
  introComplete: false,
  interviewCompleted: false,
  messages: [],
};

export const INTERVIEW_COMPLETION_MESSAGE =
  "이상으로 모든 면접 질문이 종료되었습니다.\n답변 내용을 바탕으로 면접 결과가 분석될 예정입니다.\n면접은 잠시 후 자동으로 종료되오니 결과가 생성될 때까지 잠시만 기다려주세요.";

export function createIntroMessages(
  category: string | null,
  questionCount: number | null,
): Extract<SessionChatMessage, { kind: "INTRO" }>[] {
  return [
    {
      id: "intro-camera",
      kind: "INTRO",
      text: "안녕하세요. 면접을 시작하기 전에 먼저 카메라를 켜고 본인의\n화면이 잘 나오는지 확인해주세요.",
    },
    {
      id: "intro-start",
      kind: "INTRO",
      text: `그럼 지금부터 ${category || "-"} 분야 면접을 시작하겠습니다.\n총 ${questionCount || 0}개의 질문이 진행되며, 답변에 따라 꼬리 질문이 추가될 수 있습니다.\n준비되셨다면 ‘네’라고 말씀해주세요.`,
    },
  ];
}

type InterviewSessionStore = {
  sessions: Record<number, InterviewSessionSnapshot>;
  ensureIntro: (
    interviewId: number,
    category: string | null,
    questionCount: number | null,
  ) => void;
  completeIntro: (interviewId: number) => void;
  appendExchange: (
    interviewId: number,
    answer: SessionChatMessage,
    question: QuestionState,
  ) => void;
  appendAnswerResult: (
    interviewId: number,
    answer: Extract<SessionChatMessage, { kind: "ANSWER" }>,
    result: InterviewAnswerResult,
  ) => void;
  clearSession: (interviewId: number) => void;
};

export const useInterviewSessionStore = create<InterviewSessionStore>()(
  persist(
    (set) => ({
      sessions: {},

      ensureIntro: (interviewId, category, questionCount) =>
        set((state) => {
          const session =
            state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION;
          if (
            session.messages.some(
              (message) =>
                message.kind === "INTRO" && message.id === "intro-camera",
            ) &&
            session.messages.some(
              (message) =>
                message.kind === "INTRO" && message.id === "intro-start",
            )
          ) {
            return state;
          }

          const intros = createIntroMessages(category, questionCount);
          return {
            sessions: {
              ...state.sessions,
              [interviewId]: {
                ...session,
                messages: [
                  ...intros.filter(
                    (intro) =>
                      !session.messages.some(
                        (message) => message.id === intro.id,
                      ),
                  ),
                  ...session.messages,
                ],
              },
            },
          };
        }),

      completeIntro: (interviewId) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [interviewId]: {
              ...(state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION),
              introComplete: true,
            },
          },
        })),

      appendExchange: (interviewId, answer, question) =>
        set((state) => {
          const session =
            state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION;
          if (
            session.messages.some(
              (message) =>
                message.kind === "QUESTION" &&
                message.question.questionId === question.questionId,
            )
          ) {
            return state;
          }

          return {
            sessions: {
              ...state.sessions,
              [interviewId]: {
                introComplete: true,
                interviewCompleted: false,
                messages: [
                  ...session.messages,
                  answer,
                  {
                    id: `question-${question.questionId}`,
                    kind: "QUESTION",
                    question,
                  },
                ],
              },
            },
          };
        }),

      appendAnswerResult: (interviewId, answer, result) =>
        set((state) => {
          const session =
            state.sessions[interviewId] ?? EMPTY_INTERVIEW_SESSION;
          if (
            session.interviewCompleted ||
            session.messages.some((message) => message.id === answer.id)
          ) {
            return state;
          }

          const feedback = result.feedback.trim();
          const nextMessages: SessionChatMessage[] = [
            ...session.messages,
            answer,
          ];

          if (feedback) {
            nextMessages.push({
              id: `feedback-${answer.questionId}`,
              kind: "FEEDBACK",
              text: feedback,
            });
          }

          if (result.interviewCompleted) {
            nextMessages.push({
              id: "interview-complete",
              kind: "COMPLETION",
              text: INTERVIEW_COMPLETION_MESSAGE,
            });
          } else if (result.nextQuestion) {
            nextMessages.push({
              id: `question-${result.nextQuestion.questionId}`,
              kind: "QUESTION",
              question: result.nextQuestion,
            });
          }

          return {
            sessions: {
              ...state.sessions,
              [interviewId]: {
                introComplete: true,
                interviewCompleted: result.interviewCompleted,
                messages: nextMessages,
              },
            },
          };
        }),

      clearSession: (interviewId) =>
        set((state) => {
          const sessions = { ...state.sessions };
          delete sessions[interviewId];
          return { sessions };
        }),
    }),
    {
      name: "interview-sessions",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ sessions: state.sessions }),
      merge: (persisted, current) => {
        const saved = persisted as { sessions?: unknown } | null;
        return {
          ...current,
          sessions: restoreSessions(saved?.sessions),
        };
      },
    },
  ),
);
