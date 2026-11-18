import { canRequestMedia } from "@/lib/shared/mediaPolicy";

export const getInterviewCameraKey = (interviewId: number) =>
  `interview-camera:${interviewId}`;

export function canUseInterviewCamera(interviewId: number) {
  return (
    canRequestMedia() &&
    window.sessionStorage.getItem(getInterviewCameraKey(interviewId)) !==
      "disabled"
  );
}
