import { describe, expect, test } from "vitest";
import { restoreSessions } from "@/stores/interviewSessionPersistence";
import type { SessionChatMessage } from "@/types/interviews/interview";

const messages: SessionChatMessage[] = [
  { id: "intro-camera", kind: "INTRO", text: "카메라를 확인해주세요." },
  { id: "intro-start", kind: "INTRO", text: "면접을 시작합니다." },
  { id: "intro-answer", kind: "ANSWER", text: "네" },
  {
    id: "question-10",
    kind: "QUESTION",
    question: {
      questionId: 10,
      topicId: 1,
      topicName: "데이터베이스",
      questionOrder: 1,
      questionType: "BASIC",
      question: "트랜잭션이란 무엇인가요?",
    },
  },
  {
    id: "answer-10",
    kind: "ANSWER",
    questionId: 10,
    text: "작업의 단위입니다.",
  },
  { id: "feedback-10", kind: "FEEDBACK", text: "좋습니다." },
];

const activeSession = {
  introComplete: true,
  interviewCompleted: false,
  messages,
};

describe("면접 세션 복원", () => {
  test("여러 면접의 대화 복원", () => {
    const pendingSession = {
      introComplete: false,
      interviewCompleted: false,
      messages: [],
    };

    expect(restoreSessions({ 1: activeSession, 2: pendingSession })).toEqual({
      1: activeSession,
      2: pendingSession,
    });
  });

  test.each([undefined, null, "invalid", 1, false])(
    "잘못된 저장값 %j는 빈 목록 처리",
    (value) => {
      expect(restoreSessions(value)).toEqual({});
    },
  );

  test.each(["0", "-1", "1.5", "invalid", "9007199254740992"])(
    "잘못된 면접 ID %s 제외",
    (id) => {
      expect(
        restoreSessions({ [id]: activeSession, 2: activeSession }),
      ).toEqual({
        2: activeSession,
      });
    },
  );

  test.each([
    null,
    "invalid",
    {},
    { introComplete: "true", messages: [] },
    { introComplete: true, messages: null },
    { introComplete: true, messages: {} },
  ])("잘못된 세션 구조 %j 제외", (snapshot) => {
    expect(restoreSessions({ 1: snapshot, 2: activeSession })).toEqual({
      2: activeSession,
    });
  });

  test.each([
    null,
    "invalid",
    { kind: "ANSWER", text: "답변" },
    { id: "unknown", kind: "UNKNOWN", text: "메시지" },
    { id: "unknown", kind: "INTRO", text: "안내" },
    { id: "intro-camera", kind: "INTRO", text: 1 },
    { id: "answer-10", kind: "ANSWER", text: 1 },
    { id: "answer-10", kind: "ANSWER", text: "답변", questionId: "10" },
    { id: "feedback-10", kind: "FEEDBACK", text: null },
    { id: "unknown", kind: "COMPLETION", text: "종료" },
    { id: "interview-complete", kind: "COMPLETION", text: null },
    { id: "question-10", kind: "QUESTION", question: null },
    {
      id: "question-10",
      kind: "QUESTION",
      question: { questionId: "10", question: "질문" },
    },
    {
      id: "question-10",
      kind: "QUESTION",
      question: { questionId: 10, question: 1 },
    },
  ])("잘못된 메시지 %j가 있는 세션 제외", (message) => {
    expect(
      restoreSessions({
        1: { ...activeSession, messages: [...messages, message] },
        2: activeSession,
      }),
    ).toEqual({ 2: activeSession });
  });

  test("종료 플래그 없는 구버전 세션 복원", () => {
    expect(restoreSessions({ 1: { introComplete: true, messages } })).toEqual({
      1: activeSession,
    });
  });

  test("종료 메시지 없이 종료 플래그 유지", () => {
    const completedSession = { ...activeSession, interviewCompleted: true };

    expect(restoreSessions({ 1: completedSession })).toEqual({
      1: completedSession,
    });
  });

  test.each([undefined, false])(
    "종료 플래그 %j와 종료 메시지로 종료 상태 복원",
    (interviewCompleted) => {
      const completedMessages: SessionChatMessage[] = [
        ...messages,
        { id: "interview-complete", kind: "COMPLETION", text: "면접 종료" },
      ];

      expect(
        restoreSessions({
          1: {
            introComplete: true,
            interviewCompleted,
            messages: completedMessages,
          },
        }),
      ).toEqual({
        1: {
          introComplete: true,
          interviewCompleted: true,
          messages: completedMessages,
        },
      });
    },
  );
});
