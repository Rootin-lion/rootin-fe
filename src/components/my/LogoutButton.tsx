"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/(service)/my/action";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import { useInterviewSessionStore } from "@/stores/useInterviewSessionStore";
import { useTodayCompetitionStore } from "@/stores/useTodayCompetitionStore";

function clearClientSession() {
  useCompetitionParticipationStore.getState().clearParticipation();
  useTodayCompetitionStore.setState(useTodayCompetitionStore.getInitialState());
  useInterviewSessionStore.setState(useInterviewSessionStore.getInitialState());
  useTodayCompetitionStore.persist.clearStorage();
  useInterviewSessionStore.persist.clearStorage();

  for (const key of Object.keys(window.sessionStorage)) {
    if (
      key.startsWith("interview-camera:") ||
      key.startsWith("interview-deadline:")
    ) {
      window.sessionStorage.removeItem(key);
    }
  }
}

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="로그아웃"
      aria-busy={pending}
      className="text-error border-error/30 hover:bg-error/10 focus-visible:outline-error relative inline-flex min-h-6 cursor-pointer items-center justify-center rounded-md border px-2 text-[11px] font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 lg:text-[12px]"
    >
      <span className={pending ? "invisible" : undefined}>로그아웃</span>
      {pending && (
        <span
          aria-hidden="true"
          className="absolute size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
    </button>
  );
}

export default function LogoutButton() {
  return (
    <form action={logoutAction} onSubmit={clearClientSession}>
      <LogoutSubmitButton />
    </form>
  );
}
