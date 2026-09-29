export type CompetitionStatuType = "BEFORE_START" | "IN_PROGRESS" | "CLOSED";

export type ProblemStatus = "CORRECT" | "WRONG" | "UNANSWERED";

export type PanelType = "solve" | "result";
export interface TodayCompetitionState {
  competitionId: number;
  competitionDate: string;
  startAt: string;
  endAt: string;
  status: CompetitionStatuType;
  remainingSeconds: number;
}

export interface RankingState {
  rank: number;
  memberId: number;
  nickname: string;
  imgUrl: null | string;
  score: number;
  submittedAt: string;
}

export interface ContestResultsState {
  competitionId: number;
  competitionDate: string;
  problemCount: number;
  timeLimitMinutes: number;
  participantCount: number;
  viewable: boolean;
}

export interface CompetitionProblemSummary {
  competitionProblemId: number;
  problemOrder: number;
}

export interface CompetitionProblemOption {
  optionId: number;
  optionContent: string;
  optionOrder: number;
}

export interface CompetitionProblemDetail {
  competitionProblemId: number;
  problemId: number;
  problemOrder: number;
  problemTitle: string;
  problemContent: string;
  category: string;
  options: CompetitionProblemOption[];
}

export interface CompetitionAnsweredProblem {
  competitionProblemId: number;
  selectedOptionId: number;
}

export interface CompetitionProgressState {
  participantId: number;
  startedAt: string;
  expiresAt: string;
  submitted: boolean;
  answeredProblems: CompetitionAnsweredProblem[];
}

export interface ProblemResult {
  problemOrder: number;
  competitionProblemId: number;
  status: ProblemStatus;
  score: number;
}

export interface CompetitionResultState {
  competitionDate: string;
  score: number;
  totalScore: number;
  correctCount: number;
  totalCount: number;
  solvingTimeSeconds: number;
  problemResults: ProblemResult[];
  strongCategories: string[];
  weakCategories: string[];
}
