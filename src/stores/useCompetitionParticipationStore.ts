import { create } from "zustand";

interface CompetitionParticipation {
  participantId: number;
  startedAt: string;
  expiresAt: string;
}

interface CompetitionParticipationStore {
  participation: CompetitionParticipation | null;
  setParticipation: (participation: CompetitionParticipation) => void;
  clearParticipation: () => void;
}

export const useCompetitionParticipationStore =
  create<CompetitionParticipationStore>((set) => ({
    participation: null,

    setParticipation: (participation) => {
      set({ participation });
    },

    clearParticipation: () => {
      set({ participation: null });
    },
  }));
