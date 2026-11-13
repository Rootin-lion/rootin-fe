import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import BookmarkAction from "@/components/bookmark/BookmarkAction";

vi.mock("@/assets/icons/shared/bookmark.svg", () => ({ default: () => null }));

describe("북마크 버튼과 저장 안내", () => {
  test("부모의 북마크 상태에 따라 이름과 선택 상태를 갱신", () => {
    const onClick = vi.fn().mockResolvedValue(false);
    const { rerender } = render(
      <BookmarkAction isBookmarked={false} onClick={onClick} />,
    );
    expect(
      screen.getByRole("button", { name: "북마크 저장", pressed: false }),
    ).toBeInTheDocument();

    rerender(<BookmarkAction isBookmarked onClick={onClick} />);

    expect(
      screen.getByRole("button", { name: "북마크 해제", pressed: true }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("저장 응답을 기다린 뒤 성공한 경우에 안내 표시", async () => {
    const user = userEvent.setup();
    let resolveResult!: (added: boolean) => void;
    const result = new Promise<boolean>((resolve) => {
      resolveResult = resolve;
    });
    const onClick = vi.fn(() => result);
    render(<BookmarkAction isBookmarked={false} onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "북마크 저장" }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await act(async () => {
      resolveResult(true);
    });

    expect(
      screen.getByRole("dialog", { name: "북마크에 저장되었습니다." }),
    ).toBeInTheDocument();
  });

  test.each([false, true])(
    "현재 북마크 상태가 %s여도 false 응답이면 저장 안내를 표시하지 않음",
    async (isBookmarked) => {
      const user = userEvent.setup();
      const onClick = vi.fn().mockResolvedValue(false);
      render(<BookmarkAction isBookmarked={isBookmarked} onClick={onClick} />);

      await user.click(
        screen.getByRole("button", {
          name: isBookmarked ? "북마크 해제" : "북마크 저장",
        }),
      );

      expect(onClick).toHaveBeenCalledOnce();
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  test("확인 버튼으로 저장 안내를 닫고 추가 요청을 보내지 않음", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn().mockResolvedValue(true);
    render(<BookmarkAction isBookmarked={false} onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "북마크 저장" }));
    await screen.findByRole("dialog", { name: "북마크에 저장되었습니다." });
    await user.click(screen.getByRole("button", { name: "확인" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
