import InterviewMessage from "./InterviewMessage";

export default function InterviewChat() {
  return (
    <div className="interview-scrollbar flex w-full max-w-167 flex-col gap-4 overflow-y-auto pr-10">
      <InterviewMessage
        type="AI"
        isTyping={true}
        text="그럼 지금부터 네트워크 분야 면접을 시작하겠습니다. 총 3개의 질문이 진행되며, 답변에 따라 꼬리 질문이 추가될 수 있습니다. 준비되셨다면 ‘네’라고 말씀해주세요."
      />
      <InterviewMessage
        type="AI"
        text="그럼 지금부터 네트워크 분야 면접을 시작하겠습니다. 총 3개의 질문이 진행되며, 답변에 따라 꼬리 질문이 추가될 수 있습니다. 준비되셨다면 ‘네’라고 말씀해주세요."
      />
      <InterviewMessage
        type="CLIENT"
        text="그럼 지금부터 네트워크 분야 면접을 시작하겠습니다. 총 3개의 질문이 진행되며, 답변에 따라 꼬리 질문이 추가될 수 있습니다. 준비되셨다면 ‘네’라고 말씀해주세요."
      />
    </div>
  );
}
