import { InterviewConfig } from "@/types/interviews/interview";
import { apiClient } from "./client";
import { AnswerPayload } from "@/types/interviews/interview";

// 면접 진입
export const createInterview = async (payload: InterviewConfig) => {
  const res = await apiClient.post("/interviews/sessions", payload);

  return res;
};

// 면접 질문 조회
export const getInterviewQuestion = async (interviewId: number) => {
  const res = await apiClient.get(
    `/interviews/${interviewId}/questions/current`,
  );

  return res;
};

// 답변 제출 및 다음 질문 조회
export const submitInterviewAnswer = async (
  interviewId: number,
  payload: AnswerPayload,
) => {
  const res = await apiClient.post(
    `/interviews/${interviewId}/answers`,
    payload,
  );

  return res;
};

// 면접 결과 생성
export const generateInterviewReport = async (interviewId: number) => {
  const res = await apiClient.post(
    `/interviews/sessions/${interviewId}/report`,
  );

  return res;
};

// 면접 결과 조회
export const getMyInterviewReport = async (interviewId: number) => {
  const res = await apiClient.get(`/interviews/sessions/${interviewId}/report`);

  return res;
};
