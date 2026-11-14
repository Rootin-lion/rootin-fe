"use client";

import { useSyncExternalStore } from "react";
import {
  getMediaViewport,
  subscribeToMediaViewport,
  type MediaViewport,
} from "@/lib/shared/mediaPolicy";

const getServerSnapshot = (): MediaViewport => "unknown";

export default function useMediaAvailability() {
  const viewport = useSyncExternalStore(
    subscribeToMediaViewport,
    getMediaViewport,
    getServerSnapshot,
  );
  return {
    viewport,
    isReady: viewport !== "unknown",
    isMobile: viewport === "mobile",
    canUseMedia: viewport === "tabletUp",
  };
}
