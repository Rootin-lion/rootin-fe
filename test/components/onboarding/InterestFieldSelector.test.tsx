import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import InterestFieldSelector from "@/components/onboarding/InterestFieldSelector";

vi.mock("@/assets/icons/shared/chevron.svg", () => ({ default: () => null }));

const options = [
  { label: "데이터베이스", value: "DATABASE" },
  { label: "네트워크", value: "NETWORK" },
  { label: "운영체제", value: "OPERATING_SYSTEM" },
];

describe("관심 분야 선택 UI", () => {
  test("펼치기 버튼이 연결된 목록을 계속 제어", async () => {
    const user = userEvent.setup();
    render(
      <InterestFieldSelector value={[]} options={options} onClick={vi.fn()} />,
    );
    const toggle = screen.getByRole("button", { expanded: false });
    const listId = toggle.getAttribute("aria-controls");
    expect(listId).toBeTruthy();
    const list = document.getElementById(listId!);
    expect(list).toBeInTheDocument();
    expect(list).not.toBeVisible();

    await user.click(toggle);
    expect(list).toBeVisible();
    expect(
      within(list!).getByRole("button", { name: "데이터베이스" }),
    ).toBeInTheDocument();

    await user.click(toggle);
    expect(list).not.toBeVisible();
    expect(toggle).toHaveAttribute("aria-controls", listId);
  });

  test("여러 선택기가 서로 다른 목록에 연결", async () => {
    const user = userEvent.setup();
    render(
      <>
        <InterestFieldSelector value={[]} options={options} onClick={vi.fn()} />
        <InterestFieldSelector value={[]} options={options} onClick={vi.fn()} />
      </>,
    );
    const toggles = screen.getAllByRole("button", { expanded: false });
    const listIds = toggles.map((toggle) =>
      toggle.getAttribute("aria-controls"),
    );
    expect(listIds[0]).toBeTruthy();
    expect(listIds[1]).toBeTruthy();
    expect(listIds[0]).not.toBe(listIds[1]);

    await user.click(toggles[0]);

    expect(document.getElementById(listIds[0]!)).toBeVisible();
    expect(document.getElementById(listIds[1]!)).not.toBeVisible();
    expect(toggles[1]).toHaveAttribute("aria-expanded", "false");
  });

  test.each(["{Enter}", " "])("키보드 %s로 목록을 펼치고 접음", async (key) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InterestFieldSelector value={[]} options={options} onClick={onClick} />,
    );
    const toggle = screen.getByRole("button", { expanded: false });

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(key);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.keyboard(key);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(onClick).not.toHaveBeenCalled();
  });

  test("기본 상태는 접혀 있고 안내 문구를 표시", () => {
    render(
      <InterestFieldSelector value={[]} options={options} onClick={vi.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: "관심분야를 선택해주세요" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: "데이터베이스" }),
    ).not.toBeInTheDocument();
  });

  test("버튼으로 목록을 펼치고 다시 접음", async () => {
    const user = userEvent.setup();
    render(
      <InterestFieldSelector value={[]} options={options} onClick={vi.fn()} />,
    );
    const toggle = screen.getByRole("button", {
      name: "관심분야를 선택해주세요",
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAccessibleName("최대 3개까지 선택할 수 있어요");
    expect(
      screen.getByRole("button", { name: "데이터베이스" }),
    ).toBeInTheDocument();

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: "데이터베이스" }),
    ).not.toBeInTheDocument();
  });

  test("defaultOpen이면 처음부터 목록을 표시", () => {
    render(
      <InterestFieldSelector
        value={[]}
        options={options}
        onClick={vi.fn()}
        defaultOpen
      />,
    );

    expect(
      screen.getByRole("button", { name: "최대 3개까지 선택할 수 있어요" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button")).toHaveLength(options.length + 1);
  });

  test("선택된 분야를 전달받은 순서대로 표시", () => {
    render(
      <InterestFieldSelector
        value={["NETWORK", "DATABASE"]}
        options={options}
        onClick={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "네트워크, 데이터베이스" }),
    ).toBeInTheDocument();
  });

  test.each([
    { name: "미선택 분야", value: [] },
    { name: "이미 선택된 분야", value: ["DATABASE"] },
  ])("$name를 누르면 해당 분야 값을 전달", async ({ value }) => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <InterestFieldSelector
        value={value}
        options={options}
        onClick={onClick}
        defaultOpen
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "데이터베이스",
        pressed: value.includes("DATABASE"),
      }),
    );

    expect(onClick).toHaveBeenCalledExactlyOnceWith("DATABASE");
  });

  test("부모의 선택값 변경에 따라 선택 상태를 갱신", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <InterestFieldSelector
        value={["DATABASE"]}
        options={options}
        onClick={onClick}
        defaultOpen
      />,
    );

    expect(
      screen.getByRole("button", { name: "데이터베이스", pressed: true }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "네트워크", pressed: false }),
    ).toBeInTheDocument();

    rerender(
      <InterestFieldSelector
        value={["NETWORK"]}
        options={options}
        onClick={onClick}
        defaultOpen
      />,
    );

    expect(
      screen.getByRole("button", { name: "데이터베이스", pressed: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "네트워크", pressed: true }),
    ).toBeInTheDocument();
  });
});
