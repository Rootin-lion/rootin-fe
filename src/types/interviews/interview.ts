import type { CategoryType } from "@/types/shared/category";

export type InterviewCategoryType = CategoryType;

export type InterviewModeType = "TEXT" | "VOICE";

export type MessageType = "QUESTION" | "ANSWER";

export interface InterviewConfig {
  category: CategoryType;
  questionCount: number | null;
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

export interface InterviewAnswerResult {
  topicCompleted: boolean;
  interviewCompleted: boolean;
  answerLevel: string;
  accuracy: number;
  feedback: string;
  nextQuestion: QuestionState | null;
}

export type SessionChatMessage =
  | {
      id: "intro-camera" | "intro-start";
      kind: "INTRO";
      text: string;
    }
  | {
      id: string;
      kind: "QUESTION";
      question: QuestionState;
    }
  | {
      id: string;
      kind: "ANSWER";
      questionId?: number;
      text: string;
    }
  | {
      id: string;
      kind: "FEEDBACK";
      text: string;
    }
  | {
      id: "interview-complete";
      kind: "COMPLETION";
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
  category: CategoryType;
  questionCount: number;
  completedAt: string;
  status: string;
  averageAccuracy: number;
  overallFeedback: string;
  strengths: InterviewReportFeedbackItem[];
  weaknesses: InterviewReportFeedbackItem[];
  questions: InterviewReportQuestion[];
}
