# 개발 테스트

기준일: 2026-11-13. 현재 설치된 테스트 도구, 수집되는 테스트와 작성 방법을 설명합니다.

## 도구별 역할

| 도구            | 현재 확인하는 내용                                                              | 실행 환경                            |
| --------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| Vitest          | 입력 검증, 선택 상태, 페이지·URL·날짜 계산, 인앱 브라우저 판별과 면접 세션 복원 | Node.js의 `jsdom` 환경               |
| Testing Library | DOM matcher와 테스트 후 DOM 정리를 공통 setup에 등록                            | 현재 컴포넌트 테스트는 수집하지 않음 |

최근 로컬 검증 환경은 Node.js 22.22.1입니다. 패키지와 명령은 [package.json](../package.json), 설치 버전은 [package-lock.json](../package-lock.json)에 있습니다. 현재 `package.json`에 Node 버전을 고정하는 `engines`와 별도 테스트용 `npm` 스크립트는 없으며, Vitest는 `npx vitest`로 실행합니다.

## Vitest 단위 테스트

### 설정과 실행

설정 파일은 [vitest.config.mts](../vitest.config.mts)입니다.

| 설정                                  | 현재 동작                                                                                    |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `environment: "jsdom"`                | Node.js에서 DOM API를 제공하며 실제 Chrome을 실행하지 않음                                   |
| `include: ["test/unit/**/*.test.ts"]` | `test/unit/` 아래 `.test.ts` 파일만 수집                                                     |
| `setupFiles`                          | [vitest.setup.ts](../test/setup/vitest.setup.ts)에서 DOM matcher와 `afterEach(cleanup)` 등록 |
| `clearMocks: true`                    | 테스트마다 mock 호출 기록 정리                                                               |
| `vite-tsconfig-paths`                 | [tsconfig.json](../tsconfig.json)의 `@/*` → `src/*` 별칭 해석                                |
| `@vitejs/plugin-react`                | JSX 변환 지원                                                                                |

```bash
# 전체 단위 테스트를 한 번 실행
npx vitest run

# 개발 중 변경 사항을 감지하며 실행
npx vitest --watch

# 특정 파일만 실행
npx vitest run test/unit/constants/my/navigation.test.ts
```

현재 테스트는 순수 함수 중심이므로 Next.js 서버, 프로덕션 빌드, 로그인 계정과 백엔드 연결 없이 실행합니다.

### 실행 결과

#### 2026-11-13

| 명령                                   | 결과                       |
| -------------------------------------- | -------------------------- |
| `npx vitest run`                       | 8개 파일·114개 테스트 통과 |
| `npx tsc --noEmit --incremental false` | 타입 검사 통과             |
| `npx eslint test/unit`                 | 단위 테스트 코드 검사 통과 |

위 결과는 로컬 단위 테스트와 정적 검사에 해당합니다. 실제 브라우저·인증 공급자·백엔드 연동 결과는 포함하지 않습니다.

### 수집되는 테스트

| 테스트 파일                                                                                                        | 검증하는 동작                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| [isValidProfileEmail.test.ts](../test/unit/lib/profile/isValidProfileEmail.test.ts)                                | 정상 이메일, `@` 누락, 빈 문자열 판정                                                                                |
| [toggleInterestField.test.ts](../test/unit/lib/profile/toggleInterestField.test.ts)                                | 관심 분야 추가·해제, 최대 3개 제한, 원본 배열 유지                                                                   |
| [navigation.test.ts](../test/unit/constants/my/navigation.test.ts)                                                 | 메뉴 판별, 메뉴·목록 URL 생성, 페이지 파싱과 안전한 정수 경계                                                        |
| [getRankingPagination.test.ts](../test/unit/components/competition/ranking/board/getRankingPagination.test.ts)     | 0부터 시작하는 랭킹 페이지 인덱스, 번호 묶음, 처음·끝·말줄임 표시                                                    |
| [mobileInAppBrowser.test.ts](../test/unit/lib/shared/mobileInAppBrowser.test.ts)                                   | Android·iOS 인앱과 WebView 판별, 일반 브라우저 제외, 터치 정보를 이용한 iPad 판별, Chrome 링크의 경로·쿼리·해시 보존 |
| [formatDottedDate.test.ts](../test/unit/lib/shared/formatDottedDate.test.ts)                                       | 날짜 구분자 변경, 시간 제거, 날짜를 시간대 변환 없이 표시, 빈 문자열                                                 |
| [formatCompetitionDateWithWeekday.test.ts](../test/unit/lib/competitions/formatCompetitionDateWithWeekday.test.ts) | 한국어 요일, 윤년, 서울 시간대의 요일과 원본 날짜 유지, 파싱 불가능한 날짜의 대체 결과                               |
| [interviewSessionPersistence.test.ts](../test/unit/stores/interviewSessionPersistence.test.ts)                     | 면접 대화 복원, 잘못된 ID·세션·메시지 제외, 구버전 데이터와 종료 상태 복원                                           |

### 파일 배치

`test/unit/` 아래는 `src/`의 경로를 따릅니다. 파일 이름은 원본 모듈 이름에 `.test.ts`를 붙이며, 여러 함수를 내보내는 모듈은 파일 안에서 함수별 `describe`로 구분합니다.

```text
test/
├─ unit/
│  ├─ lib/
│  │  ├─ profile/
│  │  ├─ shared/
│  │  └─ competitions/
│  ├─ constants/my/
│  ├─ components/competition/ranking/board/
│  └─ stores/
└─ setup/
   └─ vitest.setup.ts
```

- `unit/lib`: 입력 검증, 포맷, 브라우저 판별 등 UI와 분리된 함수
- `unit/constants`: 상수 모듈에 포함된 경로 생성과 입력 해석 함수
- `unit/components`: 기능 전용 모듈의 계산 함수
- `unit/stores`: 저장 데이터 복원 함수
- `setup`: DOM matcher 등록과 테스트 후 DOM 정리

한 테스트 파일에서만 사용하는 데이터와 mock은 해당 파일 안에 둡니다. 현재 면접 메시지 예시도 세션 복원 테스트 안에 정의되어 있습니다.

### 작성 방식

새 단위 테스트는 현재 수집 패턴에 맞춰 `test/unit/<원본 경로>/<모듈명>.test.ts`에 둡니다. `describe`는 `날짜 형식 변환`, `면접 세션 복원`처럼 기능을 한국어로 적고, `test`는 `정상 이메일`, `안전한 정수 최댓값`처럼 조건·동작을 짧게 적습니다. 함수 내부 구조보다 반환값과 외부에서 관찰할 수 있는 동작을 검증합니다.

다음은 기존 관심 분야 선택 함수의 테스트 작성 예시입니다.

```ts
import { describe, expect, test } from "vitest";
import { toggleInterestField } from "@/lib/profile/toggleInterestField";

describe("관심 분야 선택", () => {
  test("선택한 분야 해제와 원본 배열 유지", () => {
    const selected = ["DATABASE", "NETWORK"];

    const result = toggleInterestField(selected, "DATABASE");

    expect(result).toEqual(["NETWORK"]);
    expect(selected).toEqual(["DATABASE", "NETWORK"]);
  });
});
```

React Testing Library, `user-event`, `jest-dom`과 React 플러그인은 설치되어 있지만 현재 컴포넌트 테스트 파일은 없습니다. 현재 `include`는 `.test.ts`만 수집하며 `.test.tsx`는 수집하지 않습니다. 실제 브라우저 E2E 도구, API mock 도구와 커버리지 provider는 현재 프로젝트에 설정되어 있지 않습니다.

## 검증 범위

현재 단위 테스트는 입력값과 계산 결과를 검증합니다. `jsdom`에서는 실제 CSS 배치·화면 밀림·카메라 권한·앱 전환을 확인하지 않습니다. 또한 현재 테스트에는 OAuth 코드 교환, 토큰 재발급, Server Action과 백엔드 권한 검증이 포함되어 있지 않습니다.

- 날짜 테스트는 현재 포맷 함수의 동작을 검증합니다. 대회 날짜는 원본 문자열을 유지하고 요일만 서울 시간대로 계산하므로, UTC 입력에서는 날짜와 요일이 서로 다른 날을 가리킬 수 있습니다.
- 세션 복원 테스트는 `restoreSessions()`의 반환값을 검증합니다. Zustand store의 상태 변경, 실제 저장소 재수화, 화면·카메라 동작은 테스트 범위에 포함하지 않습니다.
- 랭킹 페이지 계산 테스트가 `unit/components/` 아래에 있어도 React 컴포넌트를 렌더링하는 테스트는 아닙니다. 원본 함수의 경로를 따른 배치입니다.

관련 구현은 [아키텍처](./architecture.md), [인증 흐름](./auth-flow.md), [모바일 반응형 구현](./mobile-responsive-plan.md)에 정리되어 있습니다. 코드·테스트 이름과 커밋 작성 기준은 [커밋·코드 컨벤션](./conventions.md)을 참고합니다.
