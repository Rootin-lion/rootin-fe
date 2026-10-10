import type { CategoryType } from "@/types/shared/category";

export interface DailyActivitiesState {
  date: string;
  totalCount: number;
}

export interface CategoryAccuraciesState {
  category: CategoryType;
  accuracyRate: number;
}

export interface BookmarksState {
  problemId: number;
  category: string;
  title: string;
}

export interface WrongAnswersState {
  competitionId: number;
  competitionProblemId: number;
  category: string;
  title: string;
}

export interface DashboardData {
  totalSolvedCounts: number;
  accuracyRate: number;
  points: number;
  streakDays: number;
  dailyActivities: DailyActivitiesState[];
  categoryAccuracies: CategoryAccuraciesState[];
  bookmarks: BookmarksState[];
  wrongAnswers: WrongAnswersState[];
}
