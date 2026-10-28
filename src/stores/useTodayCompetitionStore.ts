import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { TodayCompetitionState } from "@/types/competitions/competition";

type TodayCompetitionSnapshot = Pick<
  TodayCompetitionState,
  "competitionId" | "competitionDate"
>;

interface TodayCompetitionStore {
  todayCompetition: TodayCompetitionSnapshot | null;
  saveTodayCompetition: (competition: TodayCompetitionSnapshot) => void;
  clearTodayCompetition: () => void;
}

export const useTodayCompetitionStore = create<TodayCompetitionStore>()(
  persist(
    (set) => ({
      todayCompetition: null,
      saveTodayCompetition: (todayCompetition) => set({ todayCompetition }),
      clearTodayCompetition: () => set({ todayCompetition: null }),
    }),
    {
      name: "today-competition",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ todayCompetition: state.todayCompetition }),
    },
  ),
);
