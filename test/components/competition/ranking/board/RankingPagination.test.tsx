import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import RankingPagination from "@/components/competition/ranking/board/RankingPagination";

vi.mock("@/assets/icons/shared/chevron.svg", () => ({ default: () => null }));

describe("랭킹 페이지 이동 UI", () => {
  test.each([
    {
      name: "첫 페이지",
      currentPage: 0,
      totalPage: 5,
      previousDisabled: true,
      nextDisabled: false,
    },
    {
      name: "마지막 페이지",
      currentPage: 4,
      totalPage: 5,
      previousDisabled: false,
      nextDisabled: true,
    },
    {
      name: "페이지 하나",
      currentPage: 0,
      totalPage: 1,
      previousDisabled: true,
      nextDisabled: true,
    },
  ])(
    "$name의 이동 버튼 제한",
    async ({ currentPage, totalPage, previousDisabled, nextDisabled }) => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <RankingPagination
          currentPage={currentPage}
          totalPage={totalPage}
          onClick={onClick}
        />,
      );
      const previous = screen.getByRole("button", { name: "이전 페이지" });
      const next = screen.getByRole("button", { name: "다음 페이지" });

      expect(previous).toHaveProperty("disabled", previousDisabled);
      expect(next).toHaveProperty("disabled", nextDisabled);
      if (previousDisabled) await user.click(previous);
      if (nextDisabled) await user.click(next);
      expect(onClick).not.toHaveBeenCalled();
    },
  );

  test("이전과 다음 클릭은 0부터 시작하는 인덱스를 전달", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RankingPagination currentPage={3} totalPage={10} onClick={onClick} />,
    );

    await user.click(screen.getByRole("button", { name: "이전 페이지" }));
    await user.click(screen.getByRole("button", { name: "다음 페이지" }));

    expect(onClick.mock.calls).toEqual([[2], [4]]);
  });

  test("화면의 페이지 번호를 클릭하면 인덱스로 변환해 전달", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RankingPagination currentPage={0} totalPage={10} onClick={onClick} />,
    );

    await user.click(screen.getByRole("button", { name: "10" }));

    expect(onClick).toHaveBeenCalledExactlyOnceWith(9);
  });

  test("부모의 페이지 변경을 현재 표시와 번호에 반영", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <RankingPagination currentPage={0} totalPage={10} onClick={onClick} />,
    );
    expect(
      screen.getByRole("button", { current: "page" }),
    ).toHaveAccessibleName("1");

    rerender(
      <RankingPagination currentPage={9} totalPage={10} onClick={onClick} />,
    );

    expect(
      screen.getByRole("button", { current: "page" }),
    ).toHaveAccessibleName("10");
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByText("10 / 10")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "다음 페이지" })).toBeDisabled();
  });
});
