import { NextRequest } from "next/server";
import { handleOAuthCallback } from "@/lib/oauth/handleCallback";

export async function GET(request: NextRequest) {
  return handleOAuthCallback(request, "google");
}
