export type CompetitiionStausType = "BEFORE_START" | "IN_PROGRESS" | "CLOSED";

export interface TodayCompetitionState {
  competitionId: number;
  competitionDate: string;
  startAt: string;
  endAt: string;
  status: CompetitiionStausType;
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
