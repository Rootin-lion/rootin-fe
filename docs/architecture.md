# 아키텍처

기준일: 2026-11-13. 현재 프로젝트의 폴더 구조, 라우트, API 요청과 상태 관리 방식을 설명합니다.

## 기술 구성

| 기술                               | 현재 사용처                                                                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Next.js 16 · React 19 · TypeScript | App Router 기반 페이지·레이아웃, Server Component와 Client Component, Server Action, OAuth·API Route Handler |
| Tailwind CSS 4                     | [globals.css](../src/app/globals.css)의 색상·타이포그래피 토큰과 컴포넌트별 반응형 스타일                    |
| Axios                              | [client.ts](../src/apis/client.ts)의 서버 전용 API 클라이언트와 인증·401 재시도 처리                         |
| Zustand 5                          | 대회 참가 정보, 오늘의 대회, 면접 대화 상태                                                                  |
| Chart.js · react-chartjs-2         | 마이페이지 [분야별 정답률 차트](../src/components/my/dashboard/CategoryAccuracyChart.tsx)                    |
| SVGR                               | [next.config.ts](../next.config.ts)의 Turbopack 규칙을 통한 SVG React 컴포넌트 가져오기                      |
| Vitest · Testing Library · jsdom   | [Vitest 설정](../vitest.config.mts), [단위 테스트](../test/unit), DOM matcher와 cleanup 공통 setup           |

패키지 선언과 실행 명령은 [package.json](../package.json)에 있습니다.

코드 배치·이름·import와 커밋 메시지 작성 기준은 [커밋·코드 컨벤션](./conventions.md)에 정리되어 있습니다.

## 전체 흐름

```text
브라우저
  ├─ 페이지 요청 → app의 Server Component → 레이아웃·초기 props
  ├─ 화면 조작 → Client Component / hook
                    → Server Action
                    → apis의 Axios 요청 → 백엔드
                    ← 성공 데이터 또는 에러 결과
                 → 화면·클라이언트 상태 갱신
  └─ 대회 문제 이동 → fetch → 문제 상세 GET Route Handler
                            → 서버 Axios → 백엔드
                         ← 결과를 화면별 메모리에 보관

소셜 로그인 → OAuth Route Handler → 공급자 인가 화면
            → callback Route Handler → 백엔드 코드 교환 → 쿠키 저장
```

Axios 공통 모듈은 `server-only`이며 서버 쿠키를 읽습니다. Client Component는 Server Action을 호출하거나, 대회 문제 상세처럼 `fetch`로 API Route Handler를 호출합니다. 두 경로 모두 백엔드 인증 요청은 서버 Axios에서 수행합니다. OAuth는 브라우저 리다이렉트와 Route Handler를 사용합니다.

## 폴더별 책임

| 위치             | 책임                                                                  | 대표 코드                                                                                                |
| ---------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/app`        | 페이지 진입, 레이아웃, URL 해석, Server Action·Route Handler          | [서비스 레이아웃](<../src/app/(service)/layout.tsx>)                                                     |
| `src/apis`       | 엔드포인트·메서드·요청 데이터 정의, 인증 헤더와 재발급                | [공통 클라이언트](../src/apis/client.ts), [대회 요청](../src/apis/competitions.ts)                       |
| `src/components` | 화면 렌더링, 이벤트, 기능별 UI와 전용 훅                              | [문제 풀이](../src/components/competition/problem/ProblemContent.tsx)                                    |
| `src/hooks`      | 여러 화면에서 사용하는 모달·에러·타이머 로직                          | [에러 모달 훅](../src/hooks/useErrorModal.ts)                                                            |
| `src/stores`     | 화면 간 공유 상태와 일부 세션 상태 저장                               | [면접 상태](../src/stores/useInterviewSessionStore.ts)                                                   |
| `src/lib`        | UI와 분리한 파싱·응답 처리·정책·포맷 함수                             | [프로필 파서](../src/lib/auth/getMemberSnapshot.ts), [응답 처리](../src/lib/shared/executeDataAction.ts) |
| `src/constants`  | 선택 항목, 경로 구성, 쿠키·OAuth 설정                                 | [마이페이지 URL 규칙](../src/constants/my/navigation.ts)                                                 |
| `src/types`      | 기능별 요청·응답·화면 상태 타입                                       | [면접 타입](../src/types/interviews/interview.ts)                                                        |
| `src/assets`     | 이미지·SVG                                                            | [SVG 설정](../next.config.ts)                                                                            |
| `test/unit`      | 입력 검증·선택 상태·페이지·URL·날짜 계산과 면접 세션 복원 단위 테스트 | [마이페이지 URL·페이지 테스트](../test/unit/constants/my/navigation.test.ts)                             |
| `test/setup`     | 테스트 공통 환경 초기화와 DOM 정리                                    | [Vitest setup](../test/setup/vitest.setup.ts)                                                            |

기능 전용 훅은 해당 컴포넌트 폴더에 함께 둡니다. 예를 들어 `useCompetitionProblems`, `useInterviewAnswer`, `useMyPagedList`는 각각 문제 풀이·면접·마이페이지 영역에 있습니다.

## 라우트와 레이아웃

- [루트 레이아웃](../src/app/layout.tsx): Pretendard와 전역 CSS를 적용하고 `MobileInAppBrowserGate`로 감쌉니다.
- [서비스 레이아웃](<../src/app/(service)/layout.tsx>): `sessionToken` 존재를 확인하고 공통 Header·Footer를 렌더링합니다. `(service)`는 URL에서 생략됩니다.
- [면접 레이아웃](<../src/app/(service)/interviews/layout.tsx>): 설정·진행·결과 화면을 `InterviewMediaProvider`로 감싸 카메라 스트림을 관리합니다.
- `/login`, `/onboarding`, `/onboarding/success`, `/oauth/*`는 서비스 라우트 그룹 밖에 있습니다. 온보딩 페이지는 자체적으로 세션과 프로필을 확인합니다.

| 영역       | 경로 구성                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 홈         | `/`                                                                                                                                     |
| 대회       | `/competitions` → `/competitions/[competitionId]` → `/competitions/[competitionId]/result` 또는 `/competitions/[competitionId]/ranking` |
| 면접       | `/interviews` → `/interviews/[interviewId]` → `/transition?flow=interview-report&interviewId=...` → `/interviews/[interviewId]/result`  |
| 마이페이지 | `/my?section=...`, 북마크 상세는 `/my/bookmarks/[competitionId]/[competitionProblemId]`                                                 |
| OAuth      | `/oauth/kakao`, `/oauth/google` 및 각 `/callback`                                                                                       |

전체 화면 목록은 [README](../README.md#화면-경로)를 참고합니다.

## API와 Server Action

1. 일반적인 기능 요청은 컴포넌트나 훅이 기능별 Server Action을 호출합니다.
2. Action은 `src/apis`의 요청 함수를 호출합니다.
3. 인증 요청은 `apiClient`가 쿠키의 access token을 `Authorization` 헤더에 추가합니다. OAuth 코드 교환과 토큰 재발급은 `apiPublic`을 사용합니다.
4. Action은 응답을 추출하고 필요한 검증을 수행한 뒤 결과를 반환합니다.
5. 화면은 성공 데이터로 상태를 갱신하거나 해당 화면의 오류 UI를 표시합니다.

주요 Action 위치는 [대회](<../src/app/(service)/competitions/action.ts>), [면접](<../src/app/(service)/interviews/action.ts>), [마이페이지](<../src/app/(service)/my/action.ts>), [온보딩](../src/app/onboarding/action.ts), [북마크](../src/components/bookmark/action.ts)입니다.

### 응답과 에러

- `executeNestedDataAction`은 Axios 응답의 `response.data.data`를 추출합니다.
- `executeResponseDataAction`은 `response.data`를 추출합니다. 답안 저장·북마크 변경 등에 사용합니다.
- 공통 반환은 `{ ok: true, data }` 또는 `{ ok: false, error }`입니다. 온보딩 저장은 성공 시 `{ ok: true }`, 닉네임 중복 검사는 API 응답 본문을 반환합니다.
- 공통 함수는 데이터 존재 확인과 오류 변환을 담당합니다. 면접 답변·리포트 생성 상태, 북마크 목록 등은 각 Action에서 추가 검증합니다.
- 공통 응답 함수는 추출한 값이 falsy이면 실패로 처리합니다. `null`·`undefined`뿐 아니라 `0`·`false`·빈 문자열도 실패이며, 빈 배열과 빈 객체는 이 검사에서 성공으로 통과합니다.
- [apiError](../src/lib/shared/apiError.ts)는 Next.js 제어 흐름 오류를 다시 던지고 백엔드 오류를 코드·메시지·상태로 변환합니다.
- 에러 모달을 열지, 화면 안에 오류를 표시할지는 각 호출 화면이 결정합니다.

인증 헤더, 401 재시도, 쿠키 저장 흐름은 [인증 흐름](./auth-flow.md)에 정리되어 있습니다.

### 대회 문제 풀이

화면 경로는 `/competitions/[competitionId]`입니다. 문제 ID는 상세 조회용 API 경로에 포함하며, 문제별 화면 페이지를 추가하지 않습니다.

| 책임               | 코드와 동작                                                                                                                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 초기화·문제 이동   | [useCompetitionProblems](../src/components/competition/problem/useCompetitionProblems.ts): 참여 상태와 최초 문제 복원, 상세 캐시, 중복 조회 합치기, 마지막으로 선택한 문제만 표시   |
| 답안 선택·저장     | [useCompetitionAnswers](../src/components/competition/problem/useCompetitionAnswers.ts): 선택 즉시 표시, 서버 저장값 분리, 문제별 순차 저장과 최신 선택 합치기, 실패 시 복원        |
| 브라우저 상세 요청 | [fetchCompetitionProblem](../src/lib/competitions/fetchCompetitionProblem.ts): 인증 쿠키를 포함한 같은 출처 GET 요청, 세션 만료 시 로그인 처리용 결과 반환                          |
| 인증된 상세 조회   | [GET Route Handler](../src/app/api/competitions/[competitionId]/problems/[competitionProblemId]/route.ts): ID 검사·세션 확인, 기존 서버 Axios로 상세 조회, `private, no-store` 응답 |
| 최종 제출          | [useCompetitionSubmission](../src/components/competition/problem/useCompetitionSubmission.ts): 신규 선택 잠금, 대기 중 저장 확인, 중복 제출 방지, 수동·만료 제출 처리               |

- 답안 선택은 서버 응답보다 먼저 화면에 반영하지만, 내비게이터의 풀이 완료 표시는 저장이 확인된 답안만 기준으로 합니다. 이전 선택의 실패 응답이 더 나중의 선택을 되돌리지 않도록 변경 순서를 관리합니다.
- 최초 문제와 방문한 문제는 현재 화면의 메모리에만 보관합니다. 대회 변경·화면 이탈 시 폐기하며, 새로고침하면 서버에서 상태를 복원합니다. 조회 중 다른 문제를 선택하면 이전 응답으로 현재 화면을 덮어쓰지 않습니다.
- 문제 상세 GET은 답안 저장 Server Action의 클라이언트 대기열과 분리합니다. 백엔드까지의 요청 자체가 없어지는 것은 아니며, 처음 방문하는 문제는 응답을 기다립니다.
- 수동 제출 중 저장이 실패하면 제출을 중단하고 입력을 재개합니다. 시간 만료 시에는 저장 실패가 있어도 자동 제출을 진행하며, 최종 마감·답안 인정 여부는 서버가 판단합니다.
- 배포 환경의 응답 시간과 실제 백엔드 저장·마감 판정은 로컬 단위 테스트로 검증되지 않습니다.

## 상태 관리

| 상태                                        | 저장 위치                                     | 범위                                                                    |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| 입력값, 모달, 선택 상태                     | React state / hook                            | 해당 화면                                                               |
| 마이페이지 섹션·목록 페이지·북마크 카테고리 | URL query                                     | 새로고침·이전/다음 이동 시 복원                                         |
| 대회 참가 정보                              | `useCompetitionParticipationStore` 메모리     | 참가 ID, 시작·만료 시각                                                 |
| 오늘의 대회                                 | `useTodayCompetitionStore` → `sessionStorage` | `today-competition`, 대회 ID·날짜                                       |
| 면접 대화                                   | `useInterviewSessionStore` → `sessionStorage` | `interview-sessions`, 면접 ID별 안내 완료·대화·종료 상태                |
| 면접 카메라 허용 상태                       | `sessionStorage`                              | `interview-camera:<interviewId>`                                        |
| 면접 타이머                                 | `sessionStorage`                              | `interview-deadline:<interviewId>`, 최초 진입 시점부터 30분인 종료 시각 |
| 인증 정보·프로필 캐시                       | HttpOnly 쿠키                                 | 서버에서 읽고 처리                                                      |

면접 대화 복원은 [interviewSessionPersistence](../src/stores/interviewSessionPersistence.ts)에서 저장 데이터 구조를 검사합니다. 브라우저 저장값은 대화·선택 상태·남은 시간 복원에 사용하며, 인증 토큰은 서버에서 HttpOnly 쿠키로 읽습니다.

### 면접 세션 복원

- Zustand persist의 `merge`에서 `restoreSessions()`로 저장된 세션을 복원합니다.
- 면접 ID는 양의 안전한 정수여야 하며, 안내 완료 여부와 메시지 배열의 구조를 검사합니다.
- 메시지 하나라도 검사에 실패하면 해당 세션 전체를 제외하고 다른 정상 세션은 유지합니다. 안내·질문·답변·피드백·종료 메시지는 종류별 필드를 확인합니다.
- 구버전 데이터에 `interviewCompleted`가 없어도 복원합니다. 종료 플래그가 `true`이거나 `COMPLETION` 메시지가 있으면 종료 상태이며, 둘 다 없으면 진행 중 상태입니다.
- 이 복원 함수는 저장 데이터를 읽어 화면 상태로 정리하며, 백엔드의 면접 진행 상태나 답변 저장 여부를 조회하지 않습니다.

### 마이페이지 목록

- `section`은 `dashboard`, `bookmark`, `review`, `interview`, `option` 중 하나입니다.
- 페이지 번호는 1부터 시작합니다. [페이지 진입 코드](<../src/app/(service)/my/page.tsx>)가 잘못된 query를 기본값으로 정리하고 필요한 경우 정상 URL로 이동합니다.
- [useMyPagedList](../src/components/my/hooks/useMyPagedList.ts)는 화면이 바뀐 뒤 도착한 이전 요청 결과를 무시합니다.
- 북마크는 [useMyBookmarks](../src/components/my/hooks/useMyBookmarks.ts)가 API의 전체 페이지를 모은 뒤 클라이언트에서 카테고리 필터와 페이지를 계산합니다.
- 북마크 변경 요청에는 `problemId`, 상세 경로에는 `competitionId`와 `competitionProblemId`를 사용합니다.

### 날짜 표시

| 함수                                                                                            | 현재 동작                                                                            | 사용처                           |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | -------------------------------- |
| [formatDottedDate](../src/lib/shared/formatDottedDate.ts)                                       | 앞 10글자의 `-`를 `.`으로 바꿈. 날짜 파싱이나 시간대 변환은 하지 않음                | 북마크·오답노트·면접 리포트 날짜 |
| [formatCompetitionDateWithWeekday](../src/lib/competitions/formatCompetitionDateWithWeekday.ts) | 위 날짜 표기에 `Asia/Seoul` 기준 한국어 요일 추가. 파싱할 수 없으면 날짜 표기만 반환 | 대회 목록·결과 요약              |

날짜 부분과 요일의 기준은 다릅니다. 예를 들어 `2026-11-13T23:30:00Z`는 현재 구현에서 `2026.11.13 (토)`로 표시됩니다. 날짜는 입력 문자열을 유지하고 요일만 서울 시간대로 계산하며, 이 동작은 단위 테스트로 확인합니다.

## 공통 UI와 브라우저 기능

- 색상·타이포그래피는 [globals.css](../src/app/globals.css), 버튼·모달·페이지네이션은 `components/shared`를 기준으로 합니다.
- [MobileInAppBrowserGate](../src/components/shared/MobileInAppBrowserGate.tsx)는 모바일 인앱 브라우저·Android WebView 판별 시 Chrome 열기를 시도하고 수동 링크와 주소 복사를 제공합니다.
- [cameraPolicy](../src/lib/interviews/cameraPolicy.ts)는 768px 미만 면접에서 카메라 사용을 제외합니다. 스트림 생성·해제는 [InterviewMediaProvider](../src/components/interviews/InterviewMediaProvider.tsx)가 담당합니다.
- 면접 결과 대기 화면은 [InterviewReportLoading](../src/components/interviews/result/InterviewReportLoading.tsx)에서 리포트 생성 Action을 호출합니다. 생성 중이거나 마지막 답변 분석 중인 `C409-6` 응답이면 3초 뒤 다시 요청하고, `COMPLETED`이면 결과 화면으로 이동합니다. 실패 시 오류 모달과 재시도 버튼을 표시합니다.

화면 너비별 배치와 카메라·인앱 브라우저 처리는 [모바일 반응형 구현](./mobile-responsive-plan.md)에 정리되어 있습니다.

## 개발 테스트

- Vitest는 `test/unit/**/*.test.ts`의 순수 함수 테스트를 `jsdom`에서 실행합니다. React Testing Library 공통 setup은 있지만 `.test.tsx` 컴포넌트 테스트는 현재 수집하지 않습니다.
- 테스트는 `src/`와 같은 경로를 사용합니다. 예를 들어 `src/stores/interviewSessionPersistence.ts`의 테스트는 `test/unit/stores/interviewSessionPersistence.test.ts`에 둡니다. 한 모듈의 여러 함수는 하나의 테스트 파일 안에서 `describe`로 구분합니다.
- 2026-11-13 로컬 실행 결과는 8개 파일·114개 테스트 통과입니다. 이메일·관심 분야, 마이페이지 URL·페이지, 랭킹 페이지, 인앱 판별·Chrome URL, 날짜와 면접 세션 복원을 검증합니다.
- Vitest는 Next.js 서버 없이 실행합니다. 현재 OAuth·백엔드 통합·실제 모바일 기기의 동작을 검증하는 자동 테스트는 없습니다.

실행 명령, 테스트 파일별 범위와 작성 방법은 [개발 테스트](./testing.md)를 참고합니다.
