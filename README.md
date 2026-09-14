# ROOTIN Frontend

개발자 취업 준비를 위한 CS 통합 학습 플랫폼 **ROOTIN**의 프론트엔드입니다. CS 대회, 모의 면접, 랭킹과 학습 결과 분석 화면을 제공합니다.

현재는 화면 UI와 로컬 상태 중심으로 구현되어 있습니다. 대회·랭킹·분석 화면은 샘플 데이터를 사용하며, 실제 인증, 백엔드 API, AI 면접 응답 및 카메라·음성 기능은 아직 연동되지 않았습니다.

## 기술 스택

| 구분           | 사용 기술                                           |
| -------------- | --------------------------------------------------- |
| 프레임워크     | Next.js 16.2.6, App Router                          |
| UI             | React 19.2.4, TypeScript 5                          |
| 스타일         | Tailwind CSS 4, Pretendard                          |
| 개발 서버      | Turbopack                                           |
| SVG            | SVGR (`@svgr/webpack`)                              |
| 코드 검사·포맷 | ESLint 9, Prettier 3, `prettier-plugin-tailwindcss` |

버전 범위와 실행 명령은 [package.json](./package.json), 설치 버전은 `package-lock.json`을 기준으로 합니다.

## 시작하기

Node.js **20.9.0 이상**과 npm이 필요합니다. 저장소 루트에서 실행합니다.

```bash
npm ci
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 엽니다. 현재 소스 기준으로 로컬 UI 실행에 필요한 별도 환경 변수는 없습니다. Pretendard는 CDN 스타일시트로 불러옵니다.

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

## 화면 경로

| 경로                               | 화면                                    |
| ---------------------------------- | --------------------------------------- |
| `/`                                | 서비스 소개, 학습 로드맵, 주요 기능     |
| `/login`                           | 소셜 로그인 UI                          |
| `/onboarding`                      | 사용자 정보 및 관심 분야 설정 UI        |
| `/onboarding/success`              | 온보딩 완료                             |
| `/contests`                        | 오늘의 대회, 지난 대회, 대회 랭킹       |
| `/contests/[competitionId]`        | 대회 문제 풀이                          |
| `/contests/[competitionId]/result` | 대회 결과 요약 및 상세 분석             |
| `/interviews`                      | 면접 분야·문항 수·텍스트/음성 모드 설정 |
| `/interviews/[interviewId]`        | 면접 채팅·답변 입력·영상 영역 UI        |
| `/ranking`                         | 일간·주간·월간 랭킹 UI                  |

`[competitionId]`, `[interviewId]`는 동적 경로 구간입니다. `src/app/(service)` 아래의 화면은 공통 Header를 사용하며, `(service)`는 URL에 포함되지 않습니다.

## 폴더 구조

```text
src/
├── app/
│   ├── (service)/      # 메인, 대회, 면접, 랭킹 및 공통 서비스 레이아웃
│   │   ├── contests/   # 대회 목록
│   │   │   └── [competitionId]/  # 대회 문제 풀이
│   │   │       └── result/       # 대회 결과 및 상세 분석
│   │   ├── interviews/ # 면접 설정
│   │   │   └── [interviewId]/    # 면접 세션
│   │   ├── ranking/    # 랭킹
│   │   ├── page.tsx    # 메인 페이지
│   │   └── layout.tsx  # 공통 서비스 레이아웃
│   ├── login/          # 로그인
│   ├── onboarding/     # 온보딩 및 완료 화면
│   ├── globals.css     # Tailwind 테마, 타이포그래피, 공통 유틸리티
│   └── layout.tsx      # 루트 레이아웃 및 폰트 로딩
├── assets/             # 이미지와 SVG
├── components/
│   ├── shared/         # 버튼, 모달, 입력창 등 공통 UI
│   ├── main/           # 메인 페이지 섹션
│   ├── login/          # 로그인 UI
│   ├── onboarding/     # 관심 분야 선택
│   ├── roadmap/        # 학습 로드맵
│   ├── contests/       # 대회 목록, 문제 풀이, 결과 분석
│   ├── interviews/     # 면접 설정 및 세션 UI
│   └── ranking/        # 랭킹 보드, 페이지네이션, 사이드바
├── constants/          # 분야별 상수 및 선택 항목
└── types/              # 분야별 TypeScript 타입
```

## 코드 작성 규칙

### Import

다음 순서로 그룹을 나누고, 그룹 사이에는 빈 줄을 둡니다.

1. React, Next.js 및 외부 라이브러리
2. 이미지·SVG
3. 타입
4. 상수
5. 공통 컴포넌트 및 다른 영역의 컴포넌트
6. 같은 폴더·하위 폴더의 로컬 컴포넌트

타입으로만 사용하는 항목은 `import type`으로 작성합니다. 다른 영역의 파일은 `@/` 경로를, 같은 폴더와 하위 폴더는 `./` 경로를 사용합니다. `@/`는 `src/`를 가리킵니다. 필요한 파일에는 `"use client"`를 import보다 위에 둡니다.

현재 import 정렬은 수동 규칙입니다. ESLint에 import 자동 정렬 규칙은 없으며, Prettier의 Tailwind 플러그인은 클래스 순서를 정리합니다.

### 스타일 및 에셋

- 공통 색상과 타이포그래피는 `src/app/globals.css`의 테마·유틸리티를 사용합니다.
- 기능별 이미지와 SVG는 `src/assets/`의 해당 기능 폴더에 둡니다.
- SVG는 `next.config.ts`의 Turbopack SVGR 설정을 통해 React 컴포넌트로 import할 수 있습니다. 타입 선언은 `svgr.d.ts`에 있습니다.

### AI 코딩 도구

저장소 작업 지침은 [AGENTS.md](./AGENTS.md)에 있으며, [CLAUDE.md](./CLAUDE.md)에서도 이를 참조합니다. Next.js 코드를 작성하기 전에 설치된 버전의 `node_modules/next/dist/docs/`에서 관련 가이드를 확인합니다.
