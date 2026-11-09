# 인증 흐름

기준일: 2026-11-09. 현재 프로젝트의 OAuth 로그인, 온보딩, 인증 쿠키와 토큰 재발급 흐름을 설명합니다.

## 주요 코드

| 역할                  | 위치                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 로그인 버튼           | [SocialLoginSection](../src/components/login/SocialLoginSection.tsx)                                                                                       |
| 공급자 인가 요청      | [카카오 Route Handler](../src/app/oauth/kakao/route.ts), [구글 Route Handler](../src/app/oauth/google/route.ts)                                            |
| 콜백 진입             | [카카오 콜백](../src/app/oauth/kakao/callback/route.ts), [구글 콜백](../src/app/oauth/google/callback/route.ts)                                            |
| 공통 콜백 처리        | [handleOAuthCallback](../src/lib/oauth/handleCallback.ts)                                                                                                  |
| 인증 요청·토큰 재발급 | [API 클라이언트](../src/apis/client.ts)                                                                                                                    |
| 프로필 캐시 파싱      | [getMemberSnapshot](../src/lib/auth/getMemberSnapshot.ts)                                                                                                  |
| 온보딩·프로필 복구    | [페이지](../src/app/onboarding/page.tsx), [Action](../src/app/onboarding/action.ts), [복구 UI](../src/components/onboarding/OnboardingProfileRecovery.tsx) |

## 환경 설정

`NEXT_API_BASE_URL`, `KAKAO_CLIENT_ID`, `KAKAO_REDIRECT_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_REDIRECT_URI`를 사용합니다. 설정 예시는 [README](../README.md#시작하기)에 있습니다.

공급자에 등록하는 콜백은 프론트엔드의 `/oauth/kakao/callback`, `/oauth/google/callback`입니다. 콜백에서 백엔드 `/auth/kakao`, `/auth/google`로 인가 코드와 같은 Redirect URI를 전달합니다.

## OAuth 로그인

1. 로그인 버튼이 `/oauth/kakao` 또는 `/oauth/google`로 이동합니다.
2. Route Handler는 클라이언트 ID·Redirect URI를 확인합니다. 누락 시 HTTP 500 응답을 반환합니다.
3. `crypto.randomUUID()`로 `state`를 만들고 해당 공급자의 콜백 경로에 5분짜리 HttpOnly 쿠키를 저장합니다.
4. `code` 인가 방식으로 공급자 화면에 리다이렉트합니다. 구글은 `openid email profile` scope를 요청합니다.
5. 콜백은 `code`, `state`, 저장된 state의 존재와 일치를 확인합니다. 실패하면 `/login`으로 이동합니다.
6. 백엔드에 인가 코드 교환을 요청합니다. 응답 본문 `data.data.accessToken`, `data.data.member`, 응답 헤더 `Set-Cookie`의 `refreshToken`을 확인합니다.
7. access token·refresh token·회원 정보가 있으면 `sessionToken`, `memberSnapshot`을 저장합니다.
8. `member.profileCompleted`가 참이면 `/`, 아니면 `/onboarding`으로 이동합니다. 응답의 `newMember` 값은 캐시에 저장하지만 목적지 판단은 `profileCompleted`를 사용합니다.
9. 성공·실패 리다이렉트에서 해당 state 쿠키를 제거합니다. 코드 교환이나 응답 확인 중 오류가 발생해도 `/login`으로 이동합니다.

구글 콜백은 과거 이름인 `googel_oauth_state`도 읽고 정리합니다. 새 요청에서는 `google_oauth_state`를 사용합니다.

## 쿠키의 역할

| 쿠키                 | 내용                            | 용도                                  | 유효기간·경로                 |
| -------------------- | ------------------------------- | ------------------------------------- | ----------------------------- |
| `sessionToken`       | access token·refresh token JSON | 백엔드 인증 요청                      | 1시간, `/`                    |
| `memberSnapshot`     | `newMember`와 회원 프로필 JSON  | Header·온보딩 등에 사용할 프로필 캐시 | 1시간, `/`                    |
| `kakao_oauth_state`  | 임의 state 문자열               | 카카오 콜백 요청 대조                 | 5분, `/oauth/kakao/callback`  |
| `google_oauth_state` | 임의 state 문자열               | 구글 콜백 요청 대조                   | 5분, `/oauth/google/callback` |

모두 `httpOnly: true`, `sameSite: "lax"`이며 `NODE_ENV === "production"`일 때 `secure: true`입니다. 인증 쿠키 옵션은 [sessionTokenCookie](../src/constants/auth/sessionTokenCookie.ts), 프로필 캐시는 [memberSnapshotCookie](../src/constants/auth/memberSnapshotCookie.ts)에 있습니다.

`sessionToken`의 access token은 백엔드 인증 요청에 사용하고, `memberSnapshot`은 화면에 전달할 프로필 캐시로 사용합니다. 두 쿠키의 `maxAge`는 각각 1시간이며 access token의 만료 시각을 파싱해 설정하지는 않습니다.

### 프로필 캐시 파싱

`getMemberSnapshot()`은 JSON을 `unknown`으로 읽고 다음을 검사해 `AuthMember | null`을 반환합니다.

- 유한한 숫자 ID, 유효한 이메일, boolean `profileCompleted`
- 문자열 이미지 URL·닉네임·연령대, 문자열 배열 관심 분야

필수 항목이 잘못되면 `null`이며, 선택 항목은 `null`이나 빈 배열로 정리합니다. 이 함수는 읽기·검사만 수행합니다. 복구 요청이나 쿠키 갱신은 호출 화면의 정책으로 결정합니다.

## 서비스 진입과 온보딩

[서비스 레이아웃](<../src/app/(service)/layout.tsx>)은 `sessionToken` 존재를 확인합니다. 없으면 `/login`으로 이동하고, 있으면 캐시에서 프로필을 읽어 Header에 전달합니다. 여기서 토큰 유효성이나 온보딩 완료를 백엔드에 조회하지는 않습니다.

[온보딩 페이지](../src/app/onboarding/page.tsx)의 분기는 다음과 같습니다.

| 상태                                      | 처리                               |
| ----------------------------------------- | ---------------------------------- |
| 세션 쿠키 없음                            | `/login` 이동                      |
| 프로필 캐시가 없거나 필수 정보가 잘못됨   | `OnboardingProfileRecovery` 렌더링 |
| 유효한 캐시이며 `profileCompleted: true`  | `/` 이동                           |
| 유효한 캐시이며 `profileCompleted: false` | 이메일을 전달해 프로필 폼 렌더링   |

### 캐시 복구

1. 복구 UI가 `recoverProfileAction()`을 호출합니다.
2. Action은 세션 쿠키 존재를 확인하고 인증된 `GET /users/profile`을 호출합니다.
3. 프로필 응답을 검사하고 `memberSnapshot`을 다시 저장합니다.
4. 완료된 프로필은 홈으로 이동하고, 미완료 프로필은 복구한 이메일로 폼을 표시합니다.
5. 실패하면 오류와 재시도 버튼을 표시합니다.

온보딩 페이지는 Server Component에서 쿠키를 읽고, 프로필 복구·저장은 Server Action에서 `memberSnapshot` 쿠키를 갱신하는 구조입니다.

### 프로필 저장

- 닉네임 중복 검사는 `GET /users/nickname/check`를 호출합니다.
- 제출은 `completeProfileAction()` → `PUT /users/profile` → `GET /users/profile` 순서입니다.
- 재조회한 프로필을 검사한 뒤 캐시를 갱신하고 성공을 반환합니다. 폼은 `/onboarding/success`로 이동하며 완료 화면은 3초 뒤 홈으로 이동합니다.
- 마이페이지 설정의 저장 버튼은 이 온보딩 저장 흐름과 연결되어 있지 않습니다.

## 인증 요청과 401 재발급

1. `apiClient`의 요청 인터셉터가 `sessionToken` JSON에서 비어 있지 않은 access token·refresh token 문자열을 읽습니다.
2. 쿠키가 없거나 구조가 잘못되면 오류를 발생시키고, 정상인 경우 `Authorization: Bearer <accessToken>`을 추가합니다.
3. HTTP 401 응답이며 아직 재시도하지 않은 요청이면 `_retry`를 표시합니다. 다른 상태나 재시도한 요청은 오류를 그대로 전달합니다.
4. `apiPublic`으로 `POST /auth/reissue`를 호출합니다. refresh token은 `Cookie: refreshToken=...` 헤더에 전달합니다.
5. 새 access token을 확인합니다. 새 refresh token이 응답 `Set-Cookie`에 있으면 교체하고, 없으면 기존 값을 유지합니다.
6. `sessionToken`을 다시 저장하고, 기존 `memberSnapshot`이 있으면 같은 내용으로 유효기간을 갱신합니다. 이 단계에서 프로필을 재조회하지는 않습니다.
7. 새 access token으로 원래 요청을 한 번 재시도합니다.
8. 재발급 요청·응답 확인·쿠키 갱신 중 실패하면 두 인증 관련 쿠키를 삭제하고 `/login`으로 이동합니다. 세션을 파싱할 수 없어 재발급을 시작하지 못한 경우에는 원래 401 오류를 전달합니다.

현재 인증 API는 대회·면접·마이페이지·온보딩·북마크 Server Action에서 호출합니다. 토큰 재발급과 인증 쿠키 갱신은 [API 클라이언트](../src/apis/client.ts)의 응답 인터셉터에 모여 있습니다.

모바일 인앱 브라우저에서는 루트 레이아웃의 `MobileInAppBrowserGate`가 Chrome 열기를 시도하고 안내 화면을 표시합니다. 판별 조건과 이동 방식은 [모바일 반응형 구현](./mobile-responsive-plan.md#인앱-브라우저-처리)에 정리되어 있습니다.
