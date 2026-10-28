import type {
  QuestionState,
  SessionChatMessage,
} from "@/types/interviews/interview";
export type InterviewSessionSnapshot = {
  introComplete: boolean;
  interviewCompleted: boolean;
  messages: SessionChatMessage[];
};

function isSessionChatMessage(value: unknown): value is SessionChatMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Record<string, unknown>;
  if (typeof message.id !== "string") return false;

  if (message.kind === "INTRO") {
    return (
      (message.id === "intro-camera" || message.id === "intro-start") &&
      typeof message.text === "string"
    );
  }

  if (message.kind === "ANSWER") {
    return (
      typeof message.text === "string" &&
      (message.questionId === undefined ||
        typeof message.questionId === "number")
    );
  }

  if (message.kind === "FEEDBACK") {
    return typeof message.text === "string";
  }

  if (message.kind === "COMPLETION") {
    return (
      message.id === "interview-complete" && typeof message.text === "string"
    );
  }

  if (message.kind === "QUESTION") {
    const question = message.question;
    return (
      !!question &&
      typeof question === "object" &&
      typeof (question as QuestionState).questionId === "number" &&
      typeof (question as QuestionState).question === "string"
    );
  }

  return false;
}

export function restoreSessions(value: unknown) {
  const sessions: Record<number, InterviewSessionSnapshot> = {};
  if (!value || typeof value !== "object") return sessions;

  for (const [id, snapshot] of Object.entries(value)) {
    const interviewId = Number(id);
    if (!Number.isSafeInteger(interviewId) || interviewId <= 0) continue;
    if (!snapshot || typeof snapshot !== "object") continue;

    const session = snapshot as Partial<InterviewSessionSnapshot>;
    if (
      typeof session.introComplete === "boolean" &&
      Array.isArray(session.messages) &&
      session.messages.every(isSessionChatMessage)
    ) {
      sessions[interviewId] = {
        introComplete: session.introComplete,
        interviewCompleted:
          session.interviewCompleted === true ||
          session.messages.some((message) => message.kind === "COMPLETION"),
        messages: session.messages,
      };
    }
  }

  return sessions;
}
