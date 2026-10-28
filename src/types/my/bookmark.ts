import type { CategoryType } from "@/types/shared/category";

export interface MyBookmarkItem {
  competitionId: number;
  competitionProblemId: number;
  problemId: number;
  category: CategoryType;
  title: string;
  participationDate: string;
  problemContent: string;
}

export interface MyBookmarksPage {
  content: MyBookmarkItem[];
  totalPages: number;
  totalElements: number;
}

export interface MyBookmarksResponse {
  data: MyBookmarksPage;
  message: string;
  success: boolean;
}
