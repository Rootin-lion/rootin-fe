export type InterviewFieldType =
  | "OPERATING_SYSTEM"
  | "NETWORK"
  | "DATABASE"
  | "INFRA_CLOUD"
  | "DATA_STRUCTURE_ALGORITHM"
  | "JAVA_SPRING";

export type InterviewModeType = "TEXT" | "VOICE";

export type MessageType = "AI" | "CLIENT";

export interface InterviewConfig {
  field: InterviewFieldType;
  questionCount: null | number;
  interviewMode: InterviewModeType;
}

export interface AnswerPayload {
  questionId: number;
  answer: string;
}
