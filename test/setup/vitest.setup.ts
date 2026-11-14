import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jsdom은 네이티브 dialog API를 구현하지 않는다. DOM의 열림 상태만 대체하고,
// 포커스 제한·배경 inert·Escape의 cancel 발생은 실제 브라우저에서 검증한다.
Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: {
    configurable: true,
    writable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    },
  },
  close: {
    configurable: true,
    writable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute("open");
    },
  },
});

afterEach(() => {
  cleanup();
});
