"use server";

import {
  createInterview,
  generateInterviewReport,
  getInterviewQuestion,
  getMyInterviewReport,
  submitInterviewAnswer,
} from "@/apis/interview";
import { actionFailure } from "@/lib/shared/actionFailure";
import { apiError } from "@/lib/shared/apiError";
import { InterviewConfig, AnswerPayload } from "@/types/interviews/interview";

// 면접 진입
export async function createInterviewAction(payload: InterviewConfig) {
  try {
    const res = await createInterview(payload);
    const data = res.data.data;

    if (!data) {
      return actionFailure({
        code: "INTERVIEW_FAILED",
        message: "면접 생성에 실패했습니다.",
      });
    }

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "면접 생성에 실패했습니다."));
  }
}

// 면접 질문 조회
export async function getInterviewQuestionAction(interviewId: number) {
  try {
    const res = await getInterviewQuestion(interviewId);
    const data = res.data.data;

    if (!data)
      return actionFailure({
        code: "INTERVIEW_FAILED",
        message: "질문 조회에 실패했습니다.",
      });

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "질문 조회에 실패했습니다."));
  }
}

// 답변 제출 및 다음 질문 조회
export async function submitInterviewAnswerAction(
  interviewId: number,
  payload: AnswerPayload,
) {
  try {
    const res = await submitInterviewAnswer(interviewId, payload);
    const data = res.data.data;

    if (!data)
      return actionFailure({
        code: "INTERVIEW_FAILED",
        message: "답변 제출에 실패했습니다.",
      });

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "답변 제출에 실패했습니다."));
  }
}

// 면접 결과 생성
export async function generateInterviewReportAction(interviewId: number) {
  try {
    const res = await generateInterviewReport(interviewId);
    const data = res.data.data;

    if (!data)
      return actionFailure({
        code: "INTERVIEW_FAILED",
        message: "면접 리포트 생성에 실패했습니다.",
      });

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "면접 리포트 생성에 실패했습니다."));
  }
}

// 면접 결과 조회
export async function getMyInterviewReportAction(interviewId: number) {
  try {
    const res = await getMyInterviewReport(interviewId);
    const data = res.data.data;

    if (!data)
      return actionFailure({
        code: "INTERVIEW_FAILED",
        message: "면접 리포트 조회에 실패했습니다.",
      });

    return {
      ok: true,
      data,
    } as const;
  } catch (error) {
    return actionFailure(apiError(error, "면접 리포트 조회에 실패했습니다."));
  }
}
