"use client";

import { useCallback, useId, useLayoutEffect, useRef } from "react";
import { useSpeechRecognition } from "@/components/shared/SpeechRecognitionProvider";
import useMediaAvailability from "@/hooks/useMediaAvailability";
import { canRequestMedia } from "@/lib/shared/mediaPolicy";
import { SpeechInputDraft } from "@/lib/shared/speechInputDraft";

export default function useSpeechInput({
  value,
  onValueChange,
  disabled = false,
  available = true,
  draftKey = "",
  canAcceptTranscript,
  autoStart = false,
  audioTrack,
}: {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  available?: boolean;
  draftKey?: string | number;
  canAcceptTranscript?: () => boolean;
  autoStart?: boolean;
  audioTrack?: MediaStreamTrack;
}) {
  const id = useId();
  const speech = useSpeechRecognition();
  const { canUseMedia } = useMediaAvailability();
  const draftRef = useRef<SpeechInputDraft | null>(null);
  const composingRef = useRef(false);
  const latestRef = useRef({
    value,
    onValueChange,
    disabled,
    canAcceptTranscript,
  });
  const owned = speech.ownerId === id;
  const enabled = owned && speech.enabled;
  const isAvailable = available && canUseMedia && speech.supported;
  const { start, stop } = speech;

  const getDraft = useCallback(() => {
    draftRef.current ??= new SpeechInputDraft(latestRef.current.value);
    return draftRef.current;
  }, []);

  const accepting = useCallback(
    () =>
      !composingRef.current &&
      !latestRef.current.disabled &&
      (latestRef.current.canAcceptTranscript?.() ?? true),
    [],
  );

  useLayoutEffect(() => {
    latestRef.current = { value, onValueChange, disabled, canAcceptTranscript };
    const draft = getDraft();
    if (draft.value !== value) draft.replace(value);
    draft.setAccepting(accepting());
  }, [
    value,
    onValueChange,
    disabled,
    canAcceptTranscript,
    getDraft,
    accepting,
  ]);

  useLayoutEffect(() => {
    getDraft().replace(latestRef.current.value);
  }, [draftKey, getDraft]);

  useLayoutEffect(() => {
    if (!available) stop(id);
    return () => stop(id);
  }, [available, id, stop]);

  const resetDraft = useCallback(
    (nextValue: string) => getDraft().replace(nextValue),
    [getDraft],
  );
  const changeValue = useCallback(
    (nextValue: string) => {
      getDraft().replace(nextValue);
      latestRef.current.onValueChange(nextValue);
    },
    [getDraft],
  );

  const startInput = useCallback(() => {
    if (!isAvailable || !canRequestMedia()) return;
    const draft = getDraft();
    draft.replace(latestRef.current.value);
    start({
      id,
      audioTrack,
      onRunStart: () => getDraft().beginRun(),
      onResult: (results) => {
        const current = getDraft();
        current.setAccepting(accepting());
        const next = current.receive(results);
        if (next !== null) latestRef.current.onValueChange(next);
      },
    });
  }, [id, audioTrack, isAvailable, accepting, getDraft, start]);

  useLayoutEffect(() => {
    if (autoStart && isAvailable) startInput();
  }, [autoStart, isAvailable, startInput]);

  const toggle = useCallback(() => {
    if (enabled) stop(id);
    else if (accepting()) startInput();
  }, [enabled, stop, id, accepting, startInput]);

  return {
    enabled,
    isAvailable,
    disabled: !isAvailable || (disabled && !enabled),
    phase: owned ? speech.phase : ("idle" as const),
    error: owned ? speech.error : null,
    toggle,
    stop: () => stop(id),
    snapshot: () => getDraft().value,
    resetDraft,
    changeValue,
    onCompositionStart: () => {
      composingRef.current = true;
      getDraft().setAccepting(false);
    },
    onCompositionEnd: () => {
      composingRef.current = false;
      getDraft().setAccepting(accepting());
    },
  };
}

export type SpeechInputControl = ReturnType<typeof useSpeechInput>;
