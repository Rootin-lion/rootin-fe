"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { recoverProfileAction } from "@/app/onboarding/action";
import OnboardingProfileForm from "./OnboardingProfileForm";

export default function OnboardingProfileRecovery() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestRef = useRef<ReturnType<typeof recoverProfileAction> | null>(
    null,
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    startTransition(async () => {
      try {
        requestRef.current ??= recoverProfileAction();
        const result = await requestRef.current;
        if (!active) return;

        if (!result.ok) {
          setError(result.error.message);
          return;
        }

        if (result.data.profileCompleted) {
          router.replace("/");
          return;
        }

        setEmail(result.data.email);
      } catch {
        if (active) setError("프로필 정보를 불러오지 못했습니다.");
      }
    });

    return () => {
      active = false;
    };
  }, [attempt, router, startTransition]);

  if (email) return <OnboardingProfileForm email={email} />;

  return (
    <main className="bg-primary-50 flex min-h-dvh flex-col items-center justify-center gap-4">
      {error ? (
        <>
          <p className="text-text text-sm" role="alert">
            {error}
          </p>
          <button
            type="button"
            className="bg-primary rounded-lg px-5 py-2 text-sm text-white"
            onClick={() => {
              requestRef.current = null;
              setError(null);
              setAttempt((current) => current + 1);
            }}
          >
            다시 시도
          </button>
        </>
      ) : (
        <p className="text-text text-sm" role="status">
          프로필 정보를 확인하는 중입니다.
        </p>
      )}
    </main>
  );
}
