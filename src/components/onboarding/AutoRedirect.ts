"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
