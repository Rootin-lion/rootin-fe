# 개발 테스트

기준일: 2026-11-14. 현재 설치된 테스트 도구, 수집되는 테스트와 작성 방법을 설명합니다.

## 도구별 역할

| 도구            | 현재 확인하는 내용                                                              | 실행 환경              |
| --------------- | ------------------------------------------------------------------------------- | ---------------------- |
| Vitest          | 입력 검증, 선택 상태, 페이지·URL·날짜 계산, 인앱 브라우저 판별과 면접 세션 복원 | Node.js의 `jsdom` 환경 |
| Testing Library | 컴포넌트 렌더링, 입력·클릭·제출, 접근성 속성과 조건부 표시 검증                 | Vitest의 `jsdom` 환경  |

최근 로컬 검증 환경은 Node.js 22.22.1입니다. 패키지와 명령은 [package.json](../package.json), 설치 버전은 [package-lock.json](../package-lock.json)에 있습니다. 현재 `package.json`에 Node 버전을 고정하는 `engines`와 별도 테스트용 `npm` 스크립트는 없으며, Vitest는 `npx vitest`로 실행합니다.

## Vitest 단위 테스트

### 설정과 실행

설정 파일은 [vitest.config.mts](../vitest.config.mts)입니다.

| 설정                   | 현재 동작                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `environment: "jsdom"` | Node.js에서 DOM API를 제공하며 실제 Chrome을 실행하지 않음                                    |
| `include`              | `test/unit/**/*.test.ts`와 `test/components/**/*.test.tsx` 수집                               |
| `setupFiles`           | [vitest.setup.ts](../test/setup/vitest.setup.ts)에서 DOM matcher·cleanup·dialog API 대체 등록 |
| `clearMocks: true`     | 테스트마다 mock 호출 기록 정리                                                                |
| `vite-tsconfig-paths`  | [tsconfig.json](../tsconfig.json)의 `@/*` → `src/*` 별칭 해석                                 |
| `@vitejs/plugin-react` | JSX 변환 지원                                                                                 |

```bash
# 전체 단위·컴포넌트 테스트를 한 번 실행
npx vitest run

# 개발 중 변경 사항을 감지하며 실행
npx vitest --watch

# 특정 파일만 실행
npx vitest run test/unit/constants/my/navigation.test.ts
```

현재 단위·컴포넌트 테스트는 Next.js 서버, 프로덕션 빌드, 로그인 계정과 백엔드 연결 없이 실행합니다.

### 실행 결과

#### 2026-11-14

| 명령                                                                                 | 결과                                                                   |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `node node_modules/vitest/vitest.mjs run --pool=threads --maxWorkers=1 --no-isolate` | 전체 23개 파일·227개 테스트 통과. 컴포넌트 테스트 15개 파일·113개 포함 |
| `npx tsc --noEmit --incremental false`                                               | 타입 검사 통과                                                         |
| ESLint: 2차 컴포넌트 테스트 6개 파일                                                 | 변경 범위 검사 통과                                                    |
| Prettier: 2차 컴포넌트 테스트 6개 파일·이 문서                                       | 포맷 검사 통과                                                         |

검증 환경에서 기본 `npx vitest run`은 worker 시작 응답 시간 초과로 테스트를 실행하지 못했습니다. 위 통과 결과는 단일 threads worker를 재사용한 실행 결과이며, 저장소의 기본 pool·worker 수·파일 격리 설정은 변경하지 않았습니다.

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

순수 함수 테스트는 `src/`의 경로를 따라 `test/unit/`에 두고 `.test.ts`를 붙입니다. 컴포넌트 테스트는 `src/components/`의 경로를 따라 `test/components/`에 두고 `.test.tsx`를 붙입니다. 여러 함수를 내보내는 모듈은 파일 안에서 함수별 `describe`로 구분합니다.

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
├─ components/
│  ├─ shared/
│  ├─ bookmark/
│  ├─ competition/
│  │  ├─ problem/
│  │  └─ ranking/board/
│  ├─ interviews/
│  │  ├─ session/
│  │  └─ result/
│  └─ onboarding/
└─ setup/
   └─ vitest.setup.ts
```

- `unit/lib`: 입력 검증, 포맷, 브라우저 판별 등 UI와 분리된 함수
- `unit/constants`: 상수 모듈에 포함된 경로 생성과 입력 해석 함수
- `unit/components`: 기능 전용 모듈의 계산 함수
- `unit/stores`: 저장 데이터 복원 함수
- `components`: React 컴포넌트를 렌더링하는 테스트
- `setup`: DOM matcher 등록, 테스트 후 DOM 정리, jsdom에 없는 dialog API 대체

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

## 컴포넌트 테스트

React Testing Library로 실제 컴포넌트를 렌더링하고, `user-event`로 입력·클릭·Enter 제출을 검증합니다. 역할과 접근성 이름으로 요소를 찾으며, 선택 상태는 `aria-current`·`aria-pressed`·`aria-expanded`, 입력 제한은 `disabled`와 콜백 호출 여부로 확인합니다.

### 1차: 입력·선택·모달과 탐색

| 테스트 파일                                                                                       | 검증하는 동작                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [BarPagination.test.tsx](../test/components/shared/BarPagination.test.tsx)                        | 페이지 버튼과 이름, 현재 페이지 변경, 1부터 시작하는 클릭 번호, 0 이하일 때 숨김                                                                                 |
| [ProblemSubmitModal.test.tsx](../test/components/competition/problem/ProblemSubmitModal.test.tsx) | 모달 제목·설명 연결, 취소와 제출 콜백 구분                                                                                                                       |
| [ProblemButtonBox.test.tsx](../test/components/competition/problem/ProblemButtonBox.test.tsx)     | 첫·중간·마지막·단일 문제의 버튼 표시, 이전·다음·제출 콜백                                                                                                        |
| [SessionForm.test.tsx](../test/components/interviews/session/SessionForm.test.tsx)                | 답변 표시와 입력 반영, 버튼·Enter 제출, 비활성 상태의 입력·제출 차단                                                                                             |
| [InterviewCount.test.tsx](../test/components/interviews/InterviewCount.test.tsx)                  | 입력 라벨·설명 연결과 라벨 클릭 포커스, 여러 입력의 ID 구분, 빈 입력, 1~5 정수·null 전달, 범위 밖 값과 소수 차단                                                 |
| [InterviewSetup.test.tsx](../test/components/interviews/InterviewSetup.test.tsx)                  | 분야·방식 그룹 이름과 초기 선택, 문항 수에 따른 시작 활성화, 설정 변경 전달                                                                                      |
| [InterestFieldSelector.test.tsx](../test/components/onboarding/InterestFieldSelector.test.tsx)    | 목록 ID 연결과 인스턴스 구분, 클릭·Enter·Space 펼치기/접기, 초기 펼침, 선택 라벨·콜백·부모 선택값 반영                                                           |
| [ProblemNavigator.test.tsx](../test/components/competition/problem/ProblemNavigator.test.tsx)     | 현재·풀이 상태, 문제 ID 전달, props 변경 반영, 빈 목록                                                                                                           |
| [ModalWrapper.test.tsx](../test/components/shared/ModalWrapper.test.tsx)                          | dialog API 호출, 오류·북마크·대회 모달의 이름/설명 연결, cancel 기본 동작 방지와 부모 콜백, 배경/본문 클릭 구분, 최신 콜백 사용, 닫힌 후 포커스 복귀, StrictMode |

### 2차: 비동기 응답과 상태 변화

테스트 6개 파일·48개를 추가했습니다. 아래 테스트는 기존 1차 테스트와 함께 수집됩니다.

| 테스트 파일                                                                                                                       | 검증하는 동작                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [InputWrapper.test.tsx](../test/components/shared/InputWrapper.test.tsx)                                                          | 라벨·입력 속성, 입력·삭제의 부모 상태 반영, 닉네임 검사 안내와 결과 변경, 빈 값·비활성 상태                                     |
| [RankingPagination.test.tsx](../test/components/competition/ranking/board/RankingPagination.test.tsx)                             | 처음·끝·단일 페이지 이동 제한, 0부터 시작하는 클릭 인덱스, 부모 페이지 변경에 따른 현재 표시                                    |
| [InterviewResultQuestionFeedbackItem.test.tsx](../test/components/interviews/result/InterviewResultQuestionFeedbackItem.test.tsx) | 클릭·Enter·Space 펼치기/접기, 본 질문·꼬리질문 답변과 피드백·정확도, 추천 개념 정리와 없음 안내                                 |
| [BookmarkAction.test.tsx](../test/components/bookmark/BookmarkAction.test.tsx)                                                    | 부모 북마크 상태 반영, 비동기 성공 응답 후에만 저장 안내, false 응답, 안내 닫기                                                 |
| [SessionTimer.test.tsx](../test/components/interviews/session/SessionTimer.test.tsx)                                              | 30분 시작과 저장, 초 감소, 저장 시각 복원·재마운트, 초 올림·만료, 잘못된 저장값, 면접 ID 구분과 interval 정리                   |
| [ProblemCard.test.tsx](../test/components/competition/problem/ProblemCard.test.tsx)                                               | 선택지 ID와 북마크 모드 인덱스 전달, 부모 선택값 반영, 읽기 전용 결과, 북마크 저장·해제의 성공/실패 응답·예외, 문제별 상태 유지 |

### 실행과 mock 범위

```bash
# 컴포넌트 테스트만 실행
npx vitest run test/components

# 특정 컴포넌트만 실행
npx vitest run test/components/interviews/session/SessionForm.test.tsx
```

- SVG를 사용하는 대상은 장식용 아이콘을 각 테스트 파일의 `vi.mock`으로 대체합니다. 테스트용 SVG 변환 플러그인이나 새 패키지는 추가하지 않았습니다.
- `SessionTimer`는 `vi.useFakeTimers`·`vi.setSystemTime`으로 시간을 제어하며, 테스트 후 타이머를 복원하고 `sessionStorage`를 비웁니다. 타이머 아이콘 import는 Next 정적 이미지 형태의 메타데이터로 대체하고 `next/image`는 실제 컴포넌트를 사용합니다.
- `ProblemCard`는 서버 요청 경계인 북마크 Server Action을 mock으로 대체하고 실제 `BookmarkAction`·저장 안내·오류 모달을 렌더링합니다. 실패 응답과 Promise 예외 모두 기존 버튼 상태가 유지되는지 확인합니다. 서버 통신과 백엔드 권한 검증은 실행하지 않습니다.
- 랭킹의 페이지 계산 경계는 기존 `getRankingPagination` 단위 테스트에서 검증합니다. 컴포넌트 테스트는 계산 결과가 버튼의 상태와 클릭 인덱스에 연결되는지 확인하며, 실제 모바일/데스크톱 표시 전환은 검사하지 않습니다.
- 입력값을 부모가 관리하는 컴포넌트는 상태를 가진 테스트용 부모나 `rerender`로 변경값을 전달합니다. 자식이 자체적으로 값을 바꾸는 것으로 가정하지 않습니다.
- `InterviewCount`의 범위 밖 값·소수는 중간 키 입력에 영향을 받지 않도록 `fireEvent.change`로 검증합니다.
- 관심 분야 최대 3개 제한은 기존 `toggleInterestField` 단위 테스트에서 검증합니다. `InterestFieldSelector`는 전달받은 선택값을 표시하고 클릭한 분야를 부모에 전달합니다.
- `InterviewCount`는 `label`·`htmlFor`와 `aria-describedby`로 입력 이름과 안내를 연결합니다. `InterviewTopic`·`InterviewMode`는 `fieldset`·`legend`로 이름이 있는 그룹을 구성하고, 테스트에서 `within`으로 각 그룹의 버튼을 찾습니다.
- `InterestFieldSelector`는 `useId`로 목록 ID를 만들고 `aria-controls`로 연결합니다. 접힌 목록은 `hidden`으로 숨겨 연결을 유지하며, 접근성 검색과 키보드 탐색에서 제외합니다.
- `ModalWrapper`는 네이티브 `<dialog>`를 `showModal()`로 엽니다. 제목 ID는 공통 Context로 연결하고, `Content`가 짧은 설명인 사용처는 `describedByContent`로 설명 ID 연결을 켭니다. 목록형 `Notice`는 통째로 설명으로 읽히지 않도록 별도로 유지합니다.
- jsdom에는 `showModal()`·`close()`가 없어 공통 setup에서 `open` 속성 변경만 대체합니다. 이 대체는 네이티브 초기 포커스·Tab 제한·배경 inert·Escape 입력에 따른 cancel 발생을 재현하지 않습니다. cancel 핸들러 테스트는 이벤트를 직접 발생시키며, 포커스 복귀는 컴포넌트가 구현한 동작을 검증합니다.

실제 브라우저 E2E 도구, API mock 도구와 커버리지 provider는 현재 프로젝트에 설정되어 있지 않습니다.

## 검증 범위

현재 테스트는 순수 함수의 입력·계산 결과와 컴포넌트의 DOM·사용자 상호작용을 검증합니다. `jsdom`에서는 실제 CSS 배치·화면 밀림·카메라 권한·앱 전환을 확인하지 않습니다. 또한 현재 테스트에는 OAuth 코드 교환, 토큰 재발급, Server Action과 백엔드 권한 검증이 포함되어 있지 않습니다.

2026-11-14 검증에서는 브라우저 연결 도구가 사용 불가하여 실제 브라우저의 dialog 포커스 순환·배경 조작 차단·Escape 닫기와 변경한 그룹의 시각적 배치를 확인하지 못했습니다. 위 컴포넌트 테스트 통과에 해당 브라우저 검증은 포함되지 않습니다.

- 날짜 테스트는 현재 포맷 함수의 동작을 검증합니다. 대회 날짜는 원본 문자열을 유지하고 요일만 서울 시간대로 계산하므로, UTC 입력에서는 날짜와 요일이 서로 다른 날을 가리킬 수 있습니다.
- 세션 복원 테스트는 `restoreSessions()`의 반환값을 검증합니다. Zustand store의 상태 변경, 실제 저장소 재수화, 화면·카메라 동작은 테스트 범위에 포함하지 않습니다.
- 랭킹 페이지 계산 테스트가 `unit/components/` 아래에 있어도 React 컴포넌트를 렌더링하는 테스트는 아닙니다. 원본 함수의 경로를 따른 배치입니다.

관련 구현은 [아키텍처](./architecture.md), [인증 흐름](./auth-flow.md), [모바일 반응형 구현](./mobile-responsive-plan.md)에 정리되어 있습니다. 코드·테스트 이름과 커밋 작성 기준은 [커밋·코드 컨벤션](./conventions.md)을 참고합니다.
