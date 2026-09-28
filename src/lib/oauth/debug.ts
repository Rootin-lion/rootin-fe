import "server-only";

const SENSITIVE_KEYS = new Set([
  "authorization",
  "code",
  "state",
  "clientsecret",
]);

const isSensitiveKey = (key: string) => {
  const normalizedKey = key.replaceAll(/[-_]/g, "").toLowerCase();

  return (
    SENSITIVE_KEYS.has(normalizedKey) ||
    normalizedKey.endsWith("token") ||
    normalizedKey.includes("cookie")
  );
};

export const maskOAuthSecret = (value: unknown) => {
  if (value === null || value === undefined || value === "") return value;
  if (typeof value !== "string") return "[REDACTED]";

  return `[REDACTED:${value.length}]`;
};

export const sanitizeOAuthLogValue = (
  value: unknown,
  seen = new WeakSet<object>(),
): unknown => {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[Circular]";

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeOAuthLogValue(item, seen));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      isSensitiveKey(key)
        ? maskOAuthSecret(nestedValue)
        : sanitizeOAuthLogValue(nestedValue, seen),
    ]),
  );
};
