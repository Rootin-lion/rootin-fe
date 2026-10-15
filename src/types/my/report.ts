import type { InterviewModeType } from "@/types/interviews/interview";
import type { CategoryType } from "@/types/shared/category";

export interface MyReportSummary {
  reportId: number;
  interviewId: number;
  category: CategoryType;
  title: string;
  interviewMode: InterviewModeType;
  questionCount: number;
  completedAt: string;
  averageAccuracy: number;
  overallFeedback: string;
}

export interface MyReportsPage {
  content: MyReportSummary[];
  totalPages: number;
  totalElements: number;
}
