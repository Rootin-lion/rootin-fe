import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import BarPagination from "@/components/shared/BarPagination";

describe("페이지 이동", () => {
  test("전체 페이지 수만큼 이름이 있는 버튼을 표시", () => {
    render(
      <BarPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("navigation", { name: "페이지 이동" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
    for (const page of [1, 2, 3]) {
      expect(
        screen.getByRole("button", { name: `${page}페이지` }),
      ).toBeInTheDocument();
    }
  });

  test("현재 페이지가 바뀌면 해당 버튼에만 현재 상태를 표시", () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <BarPagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    expect(
      screen.getByRole("button", { current: "page" }),
    ).toHaveAccessibleName("1페이지");

    rerender(
      <BarPagination
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    expect(
      screen.getByRole("button", { current: "page" }),
    ).toHaveAccessibleName("2페이지");
    expect(screen.getByRole("button", { name: "1페이지" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  test("클릭한 페이지 번호를 1부터 전달", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <BarPagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "3페이지" }));

    expect(onPageChange).toHaveBeenCalledExactlyOnceWith(3);
  });

  test.each([0, -1])(
    "전체 페이지가 %s이면 페이지 이동을 숨김",
    (totalPages) => {
      render(
        <BarPagination
          currentPage={1}
          totalPages={totalPages}
          onPageChange={vi.fn()}
        />,
      );

      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    },
  );
});
