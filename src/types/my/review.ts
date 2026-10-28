import type { CategoryType } from "@/types/shared/category";

export interface MyReviewItem {
  competitionId: number;
  competitionProblemId: number;
  category: CategoryType;
  title: string;
  participationDate: string;
  problemContent: string;
  myAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface MyReviewsPage {
  content: MyReviewItem[];
  totalPages: number;
  totalElements: number;
}
