# 커밋·코드 컨벤션

기준일: 2026-11-14. 커밋 및 코드 컨벤션 양식을 설명합니다.

## 커밋 메시지

### 기본 형식

```text
type: 변경 대상과 내용
```

| 타입       | 사용 기준                               |
| ---------- | --------------------------------------- |
| `feat`     | 기능·사용자 동작 추가                   |
| `fix`      | 기존 동작의 오류 수정                   |
| `refactor` | 책임 분리, 이름·구조 정리               |
| `style`    | UI 배치·타이포그래피·반응형 스타일 변경 |
| `test`     | 테스트 추가·수정                        |
| `docs`     | 문서 작성·갱신                          |

### 제목과 변경 범위

- 커밋 대상 diff를 기준으로 제목을 정합니다. 여러 파일이 같은 기능 변경에 필요하면 함께 묶고, 별개 목적의 변경은 분리합니다.
- 본문이 필요하면 제목 다음에 빈 줄을 두고 변경 이유, 달라진 동작, 실제 수행한 검증을 적습니다.
- 실행하지 않은 테스트나 측정하지 않은 성능 개선을 검증 결과로 적지 않습니다.

현재 commitlint·Husky 설정은 없으며 커밋 형식은 자동으로 강제하지 않습니다. 기존 기록은 다음 명령으로 확인할 수 있습니다.

```bash
git log -60 --no-merges --oneline
git diff
git diff --cached
```

## 코드 배치와 이름

| 대상            | 기준                                                | 예시                                                  |
| --------------- | --------------------------------------------------- | ----------------------------------------------------- |
| 컴포넌트        | 파일·컴포넌트 이름에 PascalCase 사용                | `ProblemContent.tsx`, `ProblemSubmitModal.tsx`        |
| 훅              | `use`로 시작하는 camelCase 사용                     | `useCompetitionAnswers.ts`, `useMyPagedList.ts`       |
| 일반 함수·변수  | 역할을 나타내는 camelCase 사용                      | `getCompetitionProblems`, `selectedOptionByProblemId` |
| 설정 상수       | UPPER_SNAKE_CASE 사용                               | `SESSION_TOKEN_COOKIE`, `MOBILE_INTERVIEW_QUERY`      |
| 타입·인터페이스 | PascalCase 사용. 기존 모듈의 선언 방식 유지         | `ApiError`, `InterviewSessionSnapshot`                |
| 테스트          | 순수 함수는 `.test.ts`, 컴포넌트는 `.test.tsx` 사용 | `navigation.test.ts`, `SessionForm.test.tsx`          |

- 여러 화면에서 쓰는 훅은 `src/hooks/`, 기능 전용 훅은 해당 `src/components/` 영역에 둡니다.
- UI와 분리한 포맷·검증·정책 함수는 `src/lib/`, 공유 상태는 `src/stores/`에 둡니다.
- 서버 요청은 `src/apis/`, 화면에서 호출하는 Server Action은 해당 기능의 `action.ts`에 둡니다. 북마크 Action은 현재 `src/components/bookmark/action.ts`에 있습니다.
- 순수 함수 테스트는 `src/` 경로를 따라 `test/unit/`에, 컴포넌트 테스트는 `src/components/` 경로를 따라 `test/components/`에 둡니다. 데이터·mock은 한 파일에서만 쓰면 그 테스트 안에 정의합니다.

전체 폴더 책임은 [아키텍처](./architecture.md#폴더별-책임), 테스트 구성은 [개발 테스트](./testing.md#파일-배치)를 참고합니다.

## Import와 모듈 경계

다음 그룹 순서를 사용합니다. 현재 소스에 일부 순서 차이가 있으며 자동 정렬 규칙은 없습니다.

1. React·Next.js·외부 라이브러리
2. 이미지·SVG
3. `import type`으로 가져오는 타입
4. 상수
5. 다른 영역의 모듈: API·Action·공통 컴포넌트·훅·유틸리티
6. 같은 폴더·하위 폴더의 로컬 모듈

- 다른 영역의 모듈은 `@/`, 같은 폴더·하위 폴더는 `./`를 사용합니다. `@/*`는 [tsconfig.json](../tsconfig.json)에서 `src/*`로 연결합니다.
- 타입으로만 사용하는 항목은 `import type`을 사용합니다.
- `"use client"`, `"use server"` 지시문은 해당 파일의 import보다 앞에 둡니다.
- [API 클라이언트](../src/apis/client.ts)는 `server-only`와 서버 쿠키에 의존합니다. Client Component는 Server Action이나 구현된 API Route Handler를 통해 요청합니다.
- 공통 응답 처리는 [executeDataAction](../src/lib/shared/executeDataAction.ts)을 사용하되, 면접·북마크 등 도메인 응답 검증은 해당 Action에서 수행합니다.

## 타입·상태·오류 처리

- 외부 데이터와 저장값 검증은 `unknown`에서 필요한 필드를 확인합니다. 현재 예시는 [프로필 캐시 파서](../src/lib/auth/getMemberSnapshot.ts), [면접 세션 복원](../src/stores/interviewSessionPersistence.ts)입니다.
- `null`·빈 배열 등 대체값은 기존 타입과 호출부 정책에 맞춥니다. API 클라이언트, Action, UI의 책임을 함께 바꾸지 않습니다.
- 공통 Action 응답은 `{ ok: true, data }` 또는 `{ ok: false, error }`를 사용합니다. 현재 온보딩 저장과 닉네임 검사는 반환 형태가 다르므로 호출부 계약을 확인합니다.
- 오류는 [apiError](../src/lib/shared/apiError.ts)로 정리하고 표시·이동 정책은 호출 화면에서 결정합니다. 이 함수는 Next.js 제어 흐름 오류를 먼저 다시 던집니다.
- React·Zustand 상태를 바꿀 때는 기존 값의 복사·새 배열 반환 등 해당 모듈의 갱신 방식을 유지합니다. 답안 저장과 같은 비동기 흐름은 선택값과 서버 저장값의 의미를 구분합니다.

## 스타일·에셋

- 색상·타이포그래피·공통 유틸리티는 [globals.css](../src/app/globals.css)를 기준으로 합니다.
- 기존 버튼·모달·페이지네이션은 `src/components/shared/`의 컴포넌트를 확인합니다.
- 에셋은 `src/assets/icons/<기능>/`, `src/assets/images/<기능>/`에 둡니다.
- SVG는 [next.config.ts](../next.config.ts)의 Turbopack SVGR 규칙으로 React 컴포넌트로 가져옵니다.
- 반응형 기준과 면접 카메라 분기는 [모바일 반응형 구현](./mobile-responsive-plan.md)을 따릅니다.

## 포맷과 검증

| 도구·설정                            | 적용 범위                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| [Prettier 설정](../.prettierrc.json) | `prettier-plugin-tailwindcss` 등록. 클래스 순서 정리와 Prettier 기본 포맷 사용     |
| [ESLint 설정](../eslint.config.mjs)  | Next.js Core Web Vitals·TypeScript 규칙. import·커밋 형식의 자동 정렬·검사는 없음  |
| [TypeScript 설정](../tsconfig.json)  | `strict: true`, `noEmit: true`                                                     |
| [Vitest 설정](../vitest.config.mts)  | `test/unit/**/*.test.ts`·`test/components/**/*.test.tsx` 수집, `jsdom`, 공통 setup |

변경 범위에 맞는 검사를 실행합니다. 문서는 포맷·링크를 확인하고, TypeScript·테스트 코드를 바꾼 경우 관련 정적 검사와 테스트를 실행합니다.

```bash
npm run lint
npm run format:check
npx tsc --noEmit --incremental false
npx vitest run
```

`format:check`는 저장소 전체를 검사하며, 특정 파일만 검사할 때는 `npx prettier --check <파일 경로>`를 사용할 수 있습니다. 테스트명은 기존 파일처럼 짧은 한국어 표현을 사용하며, 작성 예시와 실제 검증 범위는 [개발 테스트](./testing.md)에 있습니다.

AI 코딩 도구의 저장소 지침은 [AGENTS.md](../AGENTS.md)에 있으며 [CLAUDE.md](../CLAUDE.md)가 이를 참조합니다. Next.js 코드 작성 전에는 설치된 버전의 `node_modules/next/dist/docs/`에서 관련 가이드를 확인합니다.
