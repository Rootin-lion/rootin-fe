export const OAUTH_DEBUG_STORAGE_KEY = "rootin:oauth-debug-logs";

export interface OAuthBrowserLogEntry {
  level: "info" | "warn" | "error";
  label: string;
  data: unknown;
}
