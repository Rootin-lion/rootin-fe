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

export interface InterviewReportFeedbackItem {
  title: string;
  content: string;
}

export interface InterviewReportQuestion {
  questionId: number;
  questionOrder: number;
  topicName: string;
  question: string;
  answer: string;
  accuracy: number;
  feedback: string;
  missingKeywords: string;
}

export interface InterviewReportState {
  interviewId: number;
  category: InterviewCategoryType;
  questionCount: number;
  completedAt: string;
  status: string;
  averageAccuracy: number;
  overallFeedback: string;
  strengths: InterviewReportFeedbackItem[];
  weaknesses: InterviewReportFeedbackItem[];
  questions: InterviewReportQuestion[];
}
