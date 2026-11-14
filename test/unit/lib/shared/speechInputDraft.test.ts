import { describe, expect, test } from "vitest";
import { SpeechInputDraft } from "@/lib/shared/speechInputDraft";
import type { SpeechResults } from "@/types/shared/speech";

const results = (...values: string[]): SpeechResults =>
  values.map((transcript) => ({ isFinal: false, 0: { transcript } }));

describe("실시간 음성 입력 초안", () => {
  test("중간 문장을 수정할 때 이전 결과를 중복 추가하지 않음", () => {
    const draft = new SpeechInputDraft("기존 답변");
    draft.receive(results("프로세스"));
    expect(draft.receive(results("프로세스는 실행 중인 프로그램입니다."))).toBe(
      "기존 답변 프로세스는 실행 중인 프로그램입니다.",
    );
  });

  test("제출 즉시 비운 입력창이 이전 문장의 늦은 결과로 다시 채워지지 않음", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("첫 번째 답변"));
    const submitted = draft.value;
    draft.replace("");
    expect(submitted).toBe("첫 번째 답변");
    expect(draft.value).toBe("");
    expect(draft.receive(results("첫 번째 답변입니다."))).toBeNull();
    expect(draft.value).toBe("");
    expect(draft.receive(results("첫 번째 답변입니다.", "다음 답변"))).toBe(
      "다음 답변",
    );
  });

  test("제출 대기 중 받은 음성은 다음 답변에 섞이지 않음", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("제출할 답변"));
    draft.replace("");
    draft.setAccepting(false);
    draft.receive(results("제출할 답변", "대기 중 혼잣말"));
    draft.setAccepting(true);
    expect(
      draft.receive(results("제출할 답변", "대기 중 혼잣말입니다.")),
    ).toBeNull();
    expect(
      draft.receive(results("제출할 답변", "대기 중 혼잣말입니다.", "새 답변")),
    ).toBe("새 답변");
  });

  test("브라우저가 중간 결과 목록을 줄여도 제출한 문장을 다시 넣지 않음", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("이미 제출한 문장"));
    draft.replace("");
    draft.receive(results());
    expect(draft.receive(results("이미 제출한 문장입니다."))).toBeNull();
    expect(draft.value).toBe("");
  });

  test("실패한 답변을 복원하면 새 음성만 그 뒤에 추가함", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("저장할 답변"));
    draft.replace("");
    draft.setAccepting(false);
    draft.replace("저장할 답변");
    draft.setAccepting(true);
    expect(draft.receive(results("저장할 답변", "보충 설명"))).toBe(
      "저장할 답변 보충 설명",
    );
  });

  test("직접 편집한 값이 이전 인식 결과로 덮어써지지 않음", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("잘못 인식"));
    draft.replace("직접 고친 문장");
    expect(draft.receive(results("잘못 인식한 문장"))).toBeNull();
    expect(draft.receive(results("잘못 인식한 문장", "새로 말한 내용"))).toBe(
      "직접 고친 문장 새로 말한 내용",
    );
  });

  test("브라우저 재연결 후 결과 인덱스가 초기화되어도 기존 내용 유지", () => {
    const draft = new SpeechInputDraft();
    draft.receive(results("연결 전 문장"));
    draft.beginRun();
    expect(draft.receive(results("다시 말한 문장"))).toBe(
      "연결 전 문장 다시 말한 문장",
    );
  });
});
