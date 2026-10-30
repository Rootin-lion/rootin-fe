export function isValidProfileEmail(value: unknown): value is string {
  return (
    typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}
