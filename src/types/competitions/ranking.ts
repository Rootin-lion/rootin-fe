export type RankingPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RankingViewState {
  period: RankingPeriod;
  page: number;
}

export interface RankingFocusTarget {
  memberId: number;
  requestId: number;
}
