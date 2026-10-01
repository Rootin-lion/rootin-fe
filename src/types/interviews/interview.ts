export type InterviewCategoryType =
  | "OPERATING_SYSTEM"
  | "NETWORK"
  | "DATABASE"
  | "INFRA_CLOUD"
  | "DATA_STRUCTURE_ALGORITHM"
  | "JAVA_SPRING";

export type InterviewModeType = "TEXT" | "VOICE";

export type MessageType = "QUESTION" | "ANSWER";

export interface InterviewConfig {
  category: InterviewCategoryType;
  questionCount: null | number;
  interviewMode: InterviewModeType;
}

export interface AnswerPayload {
  questionId: number;
  answer: string;
}

export interface QuestionState {
  questionId: number;
  topicId: number;
  topicName: string;
  questionOrder: number;
  questionType: string;
  question: string;
}

export type SessionChatMessage =
  | {
      id: string;
      kind: "QUESTION";
      question: QuestionState;
    }
  | {
      id: string;
      kind: "ANSWER";
      questionId: number;
      text: string;
    };
