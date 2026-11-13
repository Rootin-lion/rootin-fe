# 모바일 반응형 구현

기준일: 2026-11-13. 현재 프로젝트의 화면 너비별 배치, 면접 카메라 제어와 모바일 인앱 브라우저 처리를 설명합니다. 반응형 설명은 현재 소스의 클래스와 미디어 쿼리를 기준으로 합니다.

## 반응형 구성

- 화면 너비에 따라 배치·여백·글자 크기가 달라지며, 색상·폰트는 공통 디자인 토큰을 사용합니다.
- 대회 풀이·제출, 면접 질문·답변·결과, 마이페이지는 같은 컴포넌트에서 반응형 스타일을 적용합니다.
- **768px 미만 면접에서는 카메라 UI·권한 요청·자동 연결을 제공하지 않습니다.**

## 화면 너비별 분기

| 범위               | 적용된 구성                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------- |
| 768px 미만         | 대회 풀이·면접 설정·마이페이지 단일 열, 면접 카메라 제외                                      |
| 768px 이상 (`md`)  | 대회 풀이 내비게이터와 문제를 나란히 배치, 마이페이지 사이드바 분리, 면접 설정·진행 다열 배치 |
| 1024px 이상 (`lg`) | Header 메뉴·프로필 가로 배치, 홈 섹션에 최소 화면 높이 적용, 데스크톱 여백·글자 크기 적용     |

공통 Header는 1024px 미만에서 접이식 메뉴를 사용합니다. 모달은 `max-sm`(640px 미만)에서 너비를 `calc(100% - 32px)`로 설정하고 최소 폭을 해제합니다. 모달 최대 높이는 `calc(100dvh - 32px)`이며 내부 세로 스크롤을 제공합니다.

## 화면별 구현

| 영역           | 반영된 처리                                                      | 주요 코드                                                                                                                                           |
| -------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header·모달    | 1024px 미만 접이식 메뉴, 모달 좁은 화면 폭과 내부 세로 스크롤    | [Header](../src/components/shared/Header.tsx), [ModalWrapper](../src/components/shared/ModalWrapper.tsx)                                            |
| 로그인·온보딩  | 모바일 단일 열, 로그인 소개 영역 숨김, 폼 여백·텍스트 조정       | [로그인](../src/app/login/page.tsx), [온보딩 폼](../src/components/onboarding/OnboardingProfileForm.tsx)                                            |
| 홈             | 1024px 미만 콘텐츠 기반 섹션 높이, 통계 2열, 너비별 간격 조정    | [SectionWrapper](../src/components/main/SectionWrapper.tsx), [StatsSection](../src/components/main/stats/StatsSection.tsx)                          |
| 대회 목록      | 모바일 카드 1열, 모바일 전용 이전·다음 페이지 이동               | [지난 대회](../src/components/competition/PastCompetitionSection.tsx)                                                                               |
| 대회 풀이      | 모바일 1열, 768px 이상 내비게이터·문제 다열 배치                 | [ProblemContent](../src/components/competition/problem/ProblemContent.tsx)                                                                          |
| 결과·랭킹      | 문제 패널의 결과 전용 모바일 분기, 랭킹 4열 유지와 닉네임 말줄임 | [ProblemPanel](../src/components/competition/shared/ProblemPanel.tsx), [RankingTable](../src/components/competition/ranking/board/RankingTable.tsx) |
| 면접 설정·진행 | 모바일 카메라 제외, 채팅 중심 배치, 답변 입력 safe area 여백     | [InterviewContent](../src/components/interviews/InterviewContent.tsx), [SessionForm](../src/components/interviews/session/SessionForm.tsx)          |
| 면접 결과      | 모바일 단일 열, 너비별 카드 여백·글자 크기                       | [InterviewResultContent](../src/components/interviews/result/InterviewResultContent.tsx)                                                            |
| 마이페이지     | 모바일 단일 열, 768px 이상 사이드바 배치                         | [MyContent](../src/components/my/MyContent.tsx)                                                                                                     |
| 프로필 설정    | 136px 프로필 이미지와 모바일 중앙 정렬, 관심 분야 펼침 영역 배치 | [MyOption](../src/components/my/option/MyOption.tsx)                                                                                                |
| 인앱 브라우저  | 모바일 인앱·WebView 판별 후 Chrome 열기 시도·수동 안내           | [MobileInAppBrowserGate](../src/components/shared/MobileInAppBrowserGate.tsx)                                                                       |

오답노트와 면접 리포트 목록은 모바일에서 이전·현재 페이지·다음 버튼을 표시하고, 768px 이상에서 `BarPagination`을 사용합니다. 모바일 페이지 이동 버튼은 전체 페이지가 2개 이상일 때 표시합니다.

프로필 설정은 136px 이미지를 모바일에서 중앙에 배치합니다. 관심 분야를 펼치면 모바일·태블릿에서는 뒤의 입력 영역이 아래로 밀리고, 1024px 이상에서는 목록을 절대 위치로 표시합니다. 이미지는 JPG·PNG, 최대 5MB 파일을 선택해 미리 볼 수 있습니다. 닉네임·연령대·관심 분야 변경은 로컬 상태로 관리하며, 저장 버튼에는 API 호출이 연결되어 있지 않습니다.

## 대회 풀이의 답안 저장·문제 조회

- 풀이 화면 경로는 `/competitions/[competitionId]`를 유지합니다. 답안은 클릭 즉시 선택 표시를 반영하고, 저장 실패 시 마지막으로 서버 저장에 성공한 답안으로 복원합니다. 내비게이터의 풀이 완료 표시는 서버 저장 성공을 기준으로 합니다.
- 동일 문제의 답안 저장은 순서대로 처리하고 대기 중인 변경은 최신 선택으로 합칩니다. 수동 제출은 진행 중 저장을 확인한 뒤 실행하며, 시간 만료 시에는 저장 실패가 있어도 기존 자동 제출 흐름을 유지하고 최종 마감 판정은 서버에 맡깁니다.
- 문제 상세는 인증된 GET `/api/competitions/[competitionId]/problems/[competitionProblemId]`로 조회해 답안 저장 Server Action의 클라이언트 대기열과 분리합니다. 최초 문제와 방문한 문제는 해당 풀이 화면의 메모리에 보관하고, 대회가 바뀌거나 화면을 벗어나면 폐기합니다. 응답 순서와 관계없이 마지막으로 선택한 문제를 표시합니다.
- 768px 미만에서 다른 문제로 이동하면 문제 제목으로 초점을 옮기고 문제 패널 시작 위치로 스크롤합니다. 첫 문제 로딩에는 이 이동을 적용하지 않습니다.
- 즉시 선택 표시·문제 캐시·GET 조회 분리의 코드별 책임은 [아키텍처의 대회 문제 풀이](./architecture.md#대회-문제-풀이), 인증과 응답 정책은 [대회 문제 GET 조회](./auth-flow.md#대회-문제-get-조회)에 정리되어 있습니다. 실제 배포 환경의 응답 시간과 백엔드 저장·마감 판정은 현재 단위 테스트로 검증되지 않습니다.

## 면접 카메라 정책

공통 기준은 [cameraPolicy](../src/lib/interviews/cameraPolicy.ts)의 `(width < 768px)`입니다.

| 상황                               | 현재 동작                                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------- |
| 모바일에서 면접 시작               | 카메라 권한 요청 없이 면접 생성·진입                                              |
| 모바일 진행 화면                   | 카메라 컴포넌트를 마운트하지 않고 질문·답변·타이머 제공                           |
| 카메라 사용 중 모바일 너비로 축소  | 스트림 트랙 정지, 해당 면접의 카메라 상태를 `disabled`로 저장                     |
| 다시 넓히거나 같은 탭에서 새로고침 | 비활성화 상태 유지. 768px 이상에서는 회색 카메라 꺼짐 카드 표시, 자동 재연결 없음 |
| 768px 이상에서 새 면접 시작        | 기존 카메라 권한·연결·실패 안내 흐름 유지                                         |

카메라 제어는 아래 코드에 나뉘어 있습니다.

1. [InterviewContent](../src/components/interviews/InterviewContent.tsx): 시작 시 `startCamera()` 호출 조건
2. [InterviewMediaProvider](../src/components/interviews/InterviewMediaProvider.tsx): `getUserMedia` 진입 차단, 늦게 도착한 스트림 정리, 너비 변경 시 정지
3. [InterviewSessionContent](../src/components/interviews/session/InterviewSessionContent.tsx): `cameraEnabled`, 조건부 `SessionVideo` 렌더링, `sessionStorage` 상태
4. [SessionVideo](../src/components/interviews/session/SessionVideo.tsx): 자동 연결·재시도 조건
5. [SessionChat](../src/components/interviews/session/SessionChat.tsx)와 [면접 store](../src/stores/useInterviewSessionStore.ts): 카메라 안내 문구와 복원된 대화 처리

768px 미만에서는 `SessionVideo`를 마운트하지 않습니다. 768px 이상에서는 카메라 사용 여부에 따라 영상 또는 회색 배경·원형 카메라 꺼짐 아이콘을 표시합니다. 개발자 도구에서 320px → 768px로 변경하거나 모바일 회전으로 이 경계를 넘어도 비활성화한 카메라를 자동으로 다시 연결하지 않습니다. 연결 실패 시에도 같은 아이콘과 오류 안내·다시 연결 버튼을 표시합니다.

현재 미디어 요청은 `video: true, audio: false`로 영상만 가져옵니다. 면접 모드 선택에는 음성이 있지만, 현재 답변 입력은 텍스트 폼이며 음성 녹음·인식은 연결되어 있지 않습니다.

## 인앱 브라우저 처리

[MobileInAppBrowserGate](../src/components/shared/MobileInAppBrowserGate.tsx)는 루트 레이아웃에서 전체 페이지를 감쌉니다. [mobileInAppBrowser](../src/lib/shared/mobileInAppBrowser.ts)의 User-Agent·터치 정보로 모바일 플랫폼과 인앱 브라우저를 판별합니다.

- Android 또는 iOS 계열 기기에서 카카오톡·네이버·Instagram·Facebook·Line 등의 인앱 브라우저 식별자가 있거나, Android WebView의 `wv` 식별자가 있으면 전환 안내를 표시합니다.
- `Macintosh` User-Agent를 사용하는 iPad는 `maxTouchPoints > 1`일 때 iOS로 판별합니다. 이 경우에도 인앱 식별자가 있어야 전환 안내를 표시합니다.
- Android는 Chrome 패키지를 지정한 `intent:` URL, iOS는 `googlechrome:` 또는 `googlechromes:` URL로 현재 주소 열기를 시도합니다.
- 안내 화면에는 Chrome으로 열기, 주소 복사, 현재 페이지 주소를 제공합니다. 클립보드 복사가 실패하면 주소 입력란을 선택합니다.
- 일반 모바일 브라우저와 데스크톱에서는 페이지 내용을 그대로 렌더링합니다.
- 외부 브라우저를 열어도 기존 인앱 브라우저의 쿠키가 전달된다고 가정하지 않으며, 안내 화면은 열린 브라우저에서 다시 로그인하도록 설명합니다.

## 자동 검증 범위

- [mobileInAppBrowser.test.ts](../test/unit/lib/shared/mobileInAppBrowser.test.ts)는 User-Agent·터치 정보에 따른 인앱 판별과 Android·iOS Chrome 링크 생성 결과를 검증합니다.
- 테스트에는 `Macintosh` User-Agent와 터치 정보를 조합한 iPad 인앱 판별, 일반 iPad Safari 제외, iOS 링크의 해시 보존이 포함됩니다.
- [면접 세션 복원 테스트](../test/unit/stores/interviewSessionPersistence.test.ts)는 저장된 대화의 유효성·종료 상태를 검증합니다. 실제 `sessionStorage` 재수화나 카메라 컴포넌트의 마운트는 검증하지 않습니다.
- 현재 테스트는 `jsdom`에서 함수를 호출하므로 실제 앱의 외부 브라우저 전환, 카메라 권한과 반응형 CSS 배치는 검증하지 않습니다. 실제 iOS Safari·Android Chrome·카카오톡 WebView 호환성이나 OAuth 완료를 보장하지 않습니다.

현재 수집되는 테스트와 실행 방법은 [개발 테스트](./testing.md)에 있습니다.
