export const MOBILE_MEDIA_QUERY = "(width < 768px)";

export type MediaViewport = "unknown" | "mobile" | "tabletUp";

export function getMediaViewport(): MediaViewport {
  if (typeof window === "undefined") return "unknown";
  const mobile = window.matchMedia
    ? window.matchMedia(MOBILE_MEDIA_QUERY).matches
    : window.innerWidth < 768;
  return mobile ? "mobile" : "tabletUp";
}

export const canRequestMedia = () => getMediaViewport() === "tabletUp";

export function subscribeToMediaViewport(callback: () => void) {
  if (!window.matchMedia) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }
  const query = window.matchMedia(MOBILE_MEDIA_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
