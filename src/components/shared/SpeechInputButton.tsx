import type { SpeechInputControl } from "@/hooks/useSpeechInput";

export default function SpeechInputButton({
  speech,
}: {
  speech: SpeechInputControl;
}) {
  const label = speech.enabled ? "마이크 끄기" : "마이크 켜기";
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={speech.enabled}
      disabled={speech.disabled}
      title={speech.isAvailable ? label : "태블릿부터 가능해요."}
      onClick={speech.toggle}
      className={`focus-visible:outline-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-full border focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-40 ${speech.enabled ? "border-primary bg-primary text-white" : "border-primary-300 text-primary bg-white"}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" />
        {speech.enabled && (
          <circle cx="20" cy="4" r="2" fill="currentColor" stroke="none" />
        )}
      </svg>
    </button>
  );
}
