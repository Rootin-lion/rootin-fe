import { StrictMode, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vitest";
import BookmarkModal from "@/components/bookmark/BookmarkModal";
import CompetitionJoinModal from "@/components/competition/CompetitionJoinModal";
import ProblemSubmitModal from "@/components/competition/problem/ProblemSubmitModal";
import ErrorModal from "@/components/shared/ErrorModal";
import ModalWrapper from "@/components/shared/ModalWrapper";

afterEach(() => vi.restoreAllMocks());

describe("공통 모달 접근성", () => {
  test("마운트 시 모달로 열고 해제 시 닫음", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const close = vi.spyOn(HTMLDialogElement.prototype, "close");
    const { unmount } = render(
      <ProblemSubmitModal onClose={vi.fn()} onSubmit={vi.fn()} />,
    );

    expect(showModal).toHaveBeenCalledOnce();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");

    unmount();

    expect(close).toHaveBeenCalledOnce();
  });

  test("설명이 있는 오류 모달은 제목과 설명을 연결", () => {
    render(
      <ErrorModal
        code="UNKNOWN_ERROR"
        message="요청을 처리하지 못했습니다."
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "UNKNOWN_ERROR" }),
    ).toHaveAccessibleDescription("요청을 처리하지 못했습니다.");
  });

  test("설명이 없는 북마크 모달은 없는 설명을 참조하지 않음", () => {
    render(<BookmarkModal onClose={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "북마크에 저장되었습니다." }),
    ).not.toHaveAttribute("aria-describedby");
  });

  test("목록 형태의 대회 주의사항은 본문 탐색을 유지", () => {
    render(<CompetitionJoinModal onClose={vi.fn()} onStart={vi.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "대회에 참여하시겠습니까?" }),
    ).not.toHaveAttribute("aria-describedby");
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  test("cancel 이벤트는 부모에 닫기를 요청하고 자동 닫힘을 막음", () => {
    const onClose = vi.fn();
    render(<ProblemSubmitModal onClose={onClose} onSubmit={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    const cancel = new Event("cancel", { cancelable: true });

    fireEvent(dialog, cancel);

    expect(cancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledOnce();
    expect(dialog).toHaveAttribute("open");
  });

  test("모달 본문 클릭은 유지하고 배경 클릭만 닫기를 요청", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ProblemSubmitModal onClose={onClose} onSubmit={vi.fn()} />);

    await user.click(
      screen.getByRole("heading", { name: "정말 제출하시겠습니까?" }),
    );
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("닫기 콜백 변경 시 다시 열지 않고 최신 콜백을 사용", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const onClose = vi.fn();
    const nextOnClose = vi.fn();
    const onSubmit = vi.fn();
    const { rerender } = render(
      <ProblemSubmitModal onClose={onClose} onSubmit={onSubmit} />,
    );

    rerender(<ProblemSubmitModal onClose={nextOnClose} onSubmit={onSubmit} />);
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { cancelable: true }),
    );

    expect(showModal).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    expect(nextOnClose).toHaveBeenCalledOnce();
  });

  test("닫힌 뒤 열기 버튼으로 포커스를 복귀", async () => {
    const user = userEvent.setup();

    function ModalExample() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            모달 열기
          </button>
          {open && (
            <ModalWrapper onClose={() => setOpen(false)}>
              <ModalWrapper.Title>포커스 복귀 확인</ModalWrapper.Title>
              <button type="button" onClick={() => setOpen(false)}>
                닫기
              </button>
            </ModalWrapper>
          )}
        </>
      );
    }

    render(<ModalExample />);
    const trigger = screen.getByRole("button", { name: "모달 열기" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "닫기" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  test("StrictMode의 재마운트에서도 제목과 설명을 유지", () => {
    render(
      <StrictMode>
        <ProblemSubmitModal onClose={vi.fn()} onSubmit={vi.fn()} />
      </StrictMode>,
    );

    const dialog = screen.getByRole("dialog", {
      name: "정말 제출하시겠습니까?",
    });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleDescription(
      "제출 후에는 답안을 수정할 수 없습니다.",
    );
  });
});
