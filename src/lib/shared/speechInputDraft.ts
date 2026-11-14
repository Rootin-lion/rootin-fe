import type { SpeechResults } from "@/types/shared/speech";

type DraftResult = { generation: number; text: string };

// Recognition results are cumulative. Keep old indexes as tombstones when a
// draft is submitted so their later final results cannot refill the input.
export class SpeechInputDraft {
  private base: string;
  private current: string;
  private generation = 0;
  private accepting = true;
  private results = new Map<number, DraftResult>();

  constructor(value = "") {
    this.base = value;
    this.current = value;
  }

  get value() {
    return this.current;
  }

  replace(value: string) {
    this.generation += 1;
    this.base = value;
    this.current = value;
  }

  setAccepting(accepting: boolean) {
    if (this.accepting !== accepting) this.replace(this.current);
    this.accepting = accepting;
  }

  beginRun() {
    this.replace(this.current);
    this.results.clear();
  }

  receive(results: SpeechResults): string | null {
    for (let index = 0; index < results.length; index += 1) {
      const previous = this.results.get(index);
      this.results.set(index, {
        generation:
          previous?.generation ?? (this.accepting ? this.generation : -1),
        text: results[index][0]?.transcript ?? "",
      });
    }
    for (const index of this.results.keys()) {
      if (
        index >= results.length &&
        this.results.get(index)?.generation === this.generation
      )
        this.results.delete(index);
    }
    if (!this.accepting) return null;

    const spoken = [...this.results.values()]
      .filter((result) => result.generation === this.generation)
      .map((result) => result.text.trim())
      .filter(Boolean)
      .join(" ");
    const next = spoken
      ? `${this.base}${this.base && !/\s$/.test(this.base) ? " " : ""}${spoken}`
      : this.base;
    if (next === this.current) return null;
    this.current = next;
    return next;
  }
}
