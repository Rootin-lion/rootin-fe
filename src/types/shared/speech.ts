export interface SpeechResult {
  readonly isFinal: boolean;
  readonly [index: number]: { transcript: string };
}

export type SpeechResults = ArrayLike<SpeechResult>;

export interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: { results: SpeechResults }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: (audioTrack?: MediaStreamTrack) => void;
  abort: () => void;
}

export type SpeechPhase =
  | "idle"
  | "starting"
  | "listening"
  | "reconnecting"
  | "error";
