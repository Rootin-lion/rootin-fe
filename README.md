# ROOTIN Frontend

개발자 취업 준비를 위한 CS 통합 학습 플랫폼 **ROOTIN**의 프론트엔드입니다. CS 대회, AI 모의 면접, 대회별 랭킹, 오답노트와 학습 리포트를 제공합니다.

## 구현 범위

- 카카오·구글 OAuth, 온보딩, 인증 쿠키와 토큰 재발급 처리
- 대회 조회·참가·문제 풀이·답안 저장·제출·결과·랭킹 API 호출
- 대회 답안 즉시 선택 반영·저장 실패 시 복원, 방문한 문제 캐시와 인증된 GET 상세 조회
- 면접 생성·질문 조회·답변 제출·리포트 생성 및 조회 API 호출
- 마이페이지 대시보드·북마크·오답노트·면접 리포트 조회
- 모바일 반응형 레이아웃, 모바일 면접 카메라 제외, 인앱 브라우저 외부 열기 안내

## 문서

| 문서                                                   | 내용                                             |
| ------------------------------------------------------ | ------------------------------------------------ |
| [아키텍처](./docs/architecture.md)                     | 폴더별 책임, 라우트, 데이터 흐름과 상태 관리     |
| [인증 흐름](./docs/auth-flow.md)                       | OAuth, 쿠키, 온보딩과 토큰 재발급                |
| [모바일 반응형 계획](./docs/mobile-responsive-plan.md) | 화면 너비 기준, 현재 반영 사항과 검증 체크리스트 |

## 기술 스택

| 구분            | 사용 기술                                                |
| --------------- | -------------------------------------------------------- |
| 프레임워크      | Next.js 16, App Router                                   |
| UI              | React 19.2.4, TypeScript 5                               |
| 스타일          | Tailwind CSS 4, Pretendard                               |
| HTTP            | Axios 서버 전용 API 클라이언트, 문제 상세 조회용 `fetch` |
| 클라이언트 상태 | Zustand 5, 일부 상태의 `sessionStorage` 저장             |
| 차트            | Chart.js 4, react-chartjs-2 5                            |
| 개발 서버·SVG   | Turbopack, SVGR (`@svgr/webpack`)                        |
| 코드 검사·포맷  | ESLint 9, Prettier 3, `prettier-plugin-tailwindcss`      |
| 테스트          | Vitest 5, Testing Library, jsdom 29                      |

버전 범위와 실행 명령은 [package.json](./package.json), 설치 버전은 [package-lock.json](./package-lock.json)을 기준으로 합니다. Chart.js는 마이페이지 분야별 정답률 차트에 사용합니다.

## 시작하기

개발·테스트 환경은 **Node.js 22.13 이상인 22.x**를 기준으로 합니다. Vitest 5와 jsdom 29의 요구사항을 함께 반영한 기준이며, Next.js 자체의 최소 요구 버전과는 다릅니다. npm으로 의존성을 설치합니다.

```bash
npm ci
```

저장소 루트에 `.env.local`을 만들고 다음 값을 설정합니다. API 주소와 클라이언트 ID는 사용하는 개발 환경의 값으로 교체합니다.

```dotenv
NEXT_API_BASE_URL=https://api.example.com
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_REDIRECT_URI=http://localhost:3000/oauth/kakao/callback
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth/google/callback
```

| 변수                  | 용도                                                |
| --------------------- | --------------------------------------------------- |
| `NEXT_API_BASE_URL`   | Next.js 서버에서 호출하는 백엔드 API 기본 주소      |
| `KAKAO_CLIENT_ID`     | 카카오 인가 요청의 클라이언트 ID                    |
| `KAKAO_REDIRECT_URI`  | 카카오 콜백 주소 및 백엔드 코드 교환 시 전달할 주소 |
| `GOOGLE_CLIENT_ID`    | 구글 인가 요청의 클라이언트 ID                      |
| `GOOGLE_REDIRECT_URI` | 구글 콜백 주소 및 백엔드 코드 교환 시 전달할 주소   |

각 공급자에 등록한 Redirect URI와 환경 변수의 주소를 일치시킵니다. 위 변수는 서버에서 사용하므로 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다. `.env*`는 Git 추적에서 제외되어 있습니다.

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다. `/`를 포함한 서비스 화면은 `sessionToken` 쿠키가 없으면 `/login`으로 이동합니다. 로그인과 서비스 데이터 조회에는 OAuth 설정과 접근 가능한 백엔드가 필요합니다. Pretendard는 CDN 스타일시트로 불러옵니다.

프로덕션 빌드와 실행:

```bash
npm run build
npm run start
```

## 개발 명령어

| 명령어                 | 설명                             |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Turbopack 개발 서버 실행         |
| `npm run build`        | 프로덕션 빌드                    |
| `npm run start`        | 빌드 결과로 프로덕션 서버 실행   |
| `npm run lint`         | ESLint 검사                      |
| `npm run format`       | 프로젝트 전체 Prettier 포맷 적용 |
| `npm run format:check` | Prettier 포맷 검사               |
| `npx tsc --noEmit`     | TypeScript 타입 검사             |
| `npx vitest run`       | `test/unit/**/*.test.ts` 실행    |

## 화면 경로

| 경로                                                   | 화면                                |
| ------------------------------------------------------ | ----------------------------------- |
| `/login`                                               | 소셜 로그인                         |
| `/onboarding`                                          | 사용자 프로필 설정                  |
| `/onboarding/success`                                  | 온보딩 완료 후 홈으로 이동          |
| `/`                                                    | 서비스 소개, 학습 로드맵, 주요 기능 |
| `/competitions`                                        | 오늘의 대회, 지난 대회, 랭킹 요약   |
| `/competitions/[competitionId]`                        | 대회 문제 풀이                      |
| `/competitions/[competitionId]/result`                 | 대회 결과 및 상세 분석              |
| `/competitions/[competitionId]/ranking`                | 대회별 랭킹                         |
| `/interviews`                                          | 면접 분야·문항 수·모드 설정         |
| `/interviews/[interviewId]`                            | 면접 질문·답변·피드백               |
| `/interviews/[interviewId]/result`                     | 면접 리포트                         |
| `/transition?flow=interview-report&interviewId=...`    | 면접 리포트 생성 대기               |
| `/my?section=dashboard`                                | 마이페이지 대시보드                 |
| `/my?section=bookmark&category=all&page=1`             | 북마크                              |
| `/my?section=review&page=1`                            | 오답노트                            |
| `/my?section=interview&page=1`                         | 면접 리포트 목록                    |
| `/my?section=option`                                   | 프로필 설정 UI                      |
| `/my/bookmarks/[competitionId]/[competitionProblemId]` | 북마크 문제 상세                    |

`[competitionId]`, `[competitionProblemId]`, `[interviewId]`는 동적 경로 구간입니다. `src/app/(service)`는 URL에 포함되지 않는 라우트 그룹이며, 공통 인증 진입 확인·Header·Footer를 적용합니다. 별도의 `/ranking` 페이지는 없습니다.

### 대회 문제 풀이

- 화면 주소는 `/competitions/[competitionId]`를 유지하고, 문제 이동은 페이지 내부 상태로 처리합니다.
- 답안은 클릭 즉시 표시합니다. 서버 저장 실패 시 마지막으로 저장에 성공한 선택으로 복원하며, 문제 번호의 풀이 완료 표시는 서버 저장 성공을 기준으로 합니다.
- 문제 상세는 `GET /api/competitions/[competitionId]/problems/[competitionProblemId]`로 조회합니다. 답안 저장 Server Action의 클라이언트 대기열과 조회 요청을 분리하고, 최초 문제와 방문한 문제를 현재 풀이 화면의 메모리에 보관합니다.
- 수동 제출은 진행 중인 답안 저장을 확인한 뒤 실행합니다. 시간 만료 시에는 대기 중 저장이 실패해도 자동 제출을 진행하고, 마감 이후 답안 인정 여부는 서버가 판정합니다.

구현 책임과 인증 처리는 [아키텍처](./docs/architecture.md#대회-문제-풀이), [인증 흐름](./docs/auth-flow.md#대회-문제-get-조회)을 참고합니다. 배포 사이트에서의 지연 시간 개선 수치는 아직 측정하지 않았습니다.

## 폴더 구조

```text
docs/              # 아키텍처, 인증, 모바일 작업 기준
test/              # 테스트 코드와 공통 setup
src/
├── app/           # 페이지·레이아웃, Server Action, OAuth·API Route Handler
├── apis/          # Axios 클라이언트와 기능별 백엔드 요청
├── assets/        # 이미지와 SVG
├── components/    # shared 공통 UI와 기능별 화면·전용 훅
├── constants/     # 선택 항목, URL 규칙, 쿠키·OAuth 설정
├── hooks/         # 공통 모달·에러·타이머 훅
├── lib/           # 인증·응답 처리·날짜·모바일 브라우저 등의 유틸리티
├── stores/        # Zustand 상태와 저장 데이터 복원
└── types/         # 기능별 타입
```

세부 책임과 데이터 흐름은 [아키텍처 문서](./docs/architecture.md)를 참고합니다.

## 코드 작성 규칙

### Import

다음 순서로 정렬하며, import 문 사이에는 빈 줄을 두지 않습니다.

1. React, Next.js 및 외부 라이브러리
2. 이미지·SVG
3. 타입
4. 상수
5. 공통 컴포넌트 및 다른 영역의 컴포넌트
6. 같은 폴더·하위 폴더의 로컬 컴포넌트

타입으로만 사용하는 항목은 `import type`으로 작성합니다. 다른 영역의 파일은 `@/` 경로를, 같은 폴더와 하위 폴더는 `./` 경로를 사용합니다. `@/`는 `src/`를 가리킵니다. 필요한 파일에는 `"use client"`를 import보다 위에 둡니다.

현재 import 정렬은 수동 규칙입니다. ESLint에 import 자동 정렬 규칙은 없으며, Prettier의 Tailwind 플러그인은 클래스 순서를 정리합니다.

### 스타일 및 에셋

- 공통 색상과 타이포그래피는 [globals.css](./src/app/globals.css)의 테마·유틸리티를 사용합니다.
- 기능별 이미지와 SVG는 `src/assets/`의 해당 기능 폴더에 둡니다.
- SVG는 [next.config.ts](./next.config.ts)의 Turbopack SVGR 설정으로 React 컴포넌트로 가져옵니다. 타입 선언은 [svgr.d.ts](./svgr.d.ts)에 있습니다.
- 반응형 수정 전 [모바일 기준과 검증 항목](./docs/mobile-responsive-plan.md)을 확인합니다.

### AI 코딩 도구

저장소 작업 지침은 [AGENTS.md](./AGENTS.md)에 있으며, [CLAUDE.md](./CLAUDE.md)에서도 이를 참조합니다. Next.js 코드를 작성하기 전에 설치된 버전의 `node_modules/next/dist/docs/`에서 관련 가이드를 확인합니다.
