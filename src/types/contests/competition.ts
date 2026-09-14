export type CompetitionStatus = "BEFORE_START" | "IN_PROGRESS" | "CLOSED";

export interface TodayCompetitionState {
  competitionId: number;
  competitionDate: string;
  startAt: string;
  endAt: string;
  status: CompetitionStatus;
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
