"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/(service)/my/action";
import { useCompetitionParticipationStore } from "@/stores/useCompetitionParticipationStore";
import { useInterviewSessionStore } from "@/stores/useInterviewSessionStore";
import { useTodayCompetitionStore } from "@/stores/useTodayCompetitionStore";
import { useSpeechRecognition } from "@/components/shared/SpeechRecognitionProvider";

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

type LogoutButtonVariant = "banner" | "tab";

function LogoutSubmitButton({ variant }: { variant: LogoutButtonVariant }) {
  const { pending } = useFormStatus();
  const showSpinner = variant === "banner" && pending;

  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="로그아웃"
      aria-busy={pending}
      className={`relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60 ${variant === "tab" ? "text-error focus-visible:outline-error h-9 min-h-9 w-30 rounded-lg text-[14px] font-normal" : "text-error border-error/30 hover:bg-error/10 focus-visible:outline-error min-h-6 rounded-md border px-2 text-[10px] font-medium md:text-[11px] lg:text-[12px]"}`}
    >
      <span className={showSpinner ? "invisible" : undefined}>로그아웃</span>
      {showSpinner && (
        <span
          aria-hidden="true"
          className="absolute size-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
    </button>
  );
}

export default function LogoutButton({
  variant = "banner",
}: {
  variant?: LogoutButtonVariant;
}) {
  const { stop } = useSpeechRecognition();
  return (
    <form
      action={logoutAction}
      onSubmit={() => {
        stop();
        clearClientSession();
      }}
    >
      <LogoutSubmitButton variant={variant} />
    </form>
  );
}
