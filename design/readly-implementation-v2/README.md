# Readly 구현 화면 · 2026-10-24

`../figma-revision-v2`의 Figma 수정본을 실제 Next.js 페이지와 shadcn/ui · Tailwind CSS로 구현했습니다.
`previews`의 이미지는 API 응답을 로컬 테스트 데이터로 대체한 브라우저 캡처입니다.
예시 데이터나 테스트용 API는 애플리케이션에 포함하지 않았습니다.

- 데스크톱: 파일명 `1440`
- 모바일: 파일명 `390`
- 화면: 메인, 기록 목록, 기록 상세, 도서 목록, 도서 상세, 로그인, 회원가입, 기록 작성

| 화면           | 데스크톱                                | 모바일                                 |
| -------------- | --------------------------------------- | -------------------------------------- |
| 메인           | [보기](previews/home-1440.png)          | [보기](previews/home-390.png)          |
| 독서 기록 목록 | [보기](previews/records-1440.png)       | [보기](previews/records-390.png)       |
| 독서 기록 상세 | [보기](previews/record-detail-1440.png) | [보기](previews/record-detail-390.png) |
| 도서 목록      | [보기](previews/books-1440.png)         | [보기](previews/books-390.png)         |
| 도서 상세      | [보기](previews/book-detail-1440.png)   | [보기](previews/book-detail-390.png)   |
| 로그인         | [보기](previews/login-1440.png)         | [보기](previews/login-390.png)         |
| 회원가입       | [보기](previews/signup-1440.png)        | [보기](previews/signup-390.png)        |
| 기록 작성      | [보기](previews/create-1440.png)        | [보기](previews/create-390.png)        |

[기록 0건 도서 표시 예시](previews/books-with-unrecorded-390.png)

검증한 내용:

- 320·390·640·768·1024·1440px의 반응형 배치와 가로 넘침
- 모바일 도서 목록 한 열 배치와 책 표지 비율
- 리스트·그리드 전환, 페이지 이동, 기록이 있는 도서 필터
- 기본 도서 목록에서 기록 0건 도서 표시와 스위치에 따른 숨김·복원
- 도서 검색·선택, 필수 입력·쪽수 순서 검증, 책 전체 스위치의 시각적 상태와 입력 비활성화
- 기록 등록, 기존 HTML의 이미지·표·색상·정렬을 유지한 수정
- 댓글·대댓글 등록, 좋아요
- 로그인 오류·성공 후 복귀, 회원가입 비밀번호 검증·등록, 닉네임 수정·로그아웃

테스트 응답 기준으로 브라우저 런타임 오류는 없었습니다.
실제 백엔드 저장과 Google·Kakao 외부 인증/공유는 별도 연동 환경에서 확인해야 합니다.
