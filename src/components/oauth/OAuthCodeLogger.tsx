"use client";

import { useEffect } from "react";

export default function OAuthCodeLogger() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const provider = params.get("oauth_provider");
    const code = params.get("oauth_authorization_code");
    const redirectUri = params.get("oauth_redirect_uri");

    if (!code || (provider !== "google" && provider !== "kakao")) return;

    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.search,
    );
    console.log(`${provider} authorization code:`, code);
    console.log(`${provider} redirect URI:`, redirectUri);
  }, []);

  return null;
}
