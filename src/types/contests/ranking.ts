export type RankingPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RankingViewState {
  period: RankingPeriod;
  page: number;
}
