import { MOBILE_MEDIA_QUERY } from "@/lib/shared/mediaPolicy";

export const MOBILE_INTERVIEW_QUERY = MOBILE_MEDIA_QUERY;

export const getInterviewCameraKey = (interviewId: number) =>
  `interview-camera:${interviewId}`;

export function canUseInterviewCamera(interviewId: number) {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia(MOBILE_INTERVIEW_QUERY).matches &&
    window.sessionStorage.getItem(getInterviewCameraKey(interviewId)) !==
      "disabled"
  );
}
