# Readly

읽은 책의 생각을 기록하고 다른 독자와 나누는 Next.js 애플리케이션입니다.

## 실행

```sh
npm ci
cp .env.example .env.local # 기존 파일이 없을 때만
npm run dev
```

개발 서버는 `yarn dev`로도 실행할 수 있습니다. 의존성 설치는 `package-lock.json`에 맞춰
`npm ci`를 사용합니다.

`NEXT_PUBLIC_READLY_API_URL`에 기존 Readly 백엔드 주소를 설정하세요. Google 로그인은
`NEXT_PUBLIC_GOOGLE_CLIENT_ID`, 카카오 공유는 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`를 사용합니다.
약관·개인정보 문서가 있으면 `NEXT_PUBLIC_TERMS_URL`, `NEXT_PUBLIC_PRIVACY_URL`에 공개 URL을
지정하세요. 문서 URL이 비어 있으면 해당 링크는 표시하지 않습니다.
TinyMCE 키와 클라이언트 JWT 검증 키는 사용하지 않습니다.

## 디자인과 컴포넌트

Figma에서 수정한 PNG/SVG 18개는 `design/figma-revision-v2`에 보관했습니다.
이를 기준으로 로고, Pretendard/Gowun Batang, 파란색 액션, 사각형 필터, 여백을 적용했습니다.
모바일 도서 목록과 기록 목록은 한 열로 배치하고 책 표지는 고정된 2:3 영역 안에서 비율을 유지합니다.

- `src/components/ui`: shadcn/ui 공식 Tailwind 3 / new-york 레지스트리에서 가져와 커스텀한 컴포넌트
- `src/components/layout`: 헤더와 푸터
- `src/components/records`: 기록 카드, 검색·정렬, 에디터, 댓글·답글, 공유
- `src/components/books`: 도서 목록과 표지
- `src/components/auth`: 인증 화면 레이아웃
- `src/app/globals.css`, `tailwind.config.ts`: 공통 디자인 토큰과 Tailwind 스타일
- `public/brand`, `public/fonts`: SVG 로고·일러스트와 로컬 글꼴 및 라이선스

`components.json`을 통해 shadcn 컴포넌트를 추가할 수 있습니다.
레거시 `Common*` 컴포넌트, 이전 스켈레톤·헤더·페이지네이션·토스트·훅과 SCSS는 삭제했습니다.
본문 에디터는 Tiptap을 사용하며 기존 HTML의 링크·이미지·표·텍스트 서식을 읽습니다.
상세 본문은 DOMPurify를 거쳐 표시합니다.

## 화면

| 경로                   | 기능                                                    |
| ---------------------- | ------------------------------------------------------- |
| `/`                    | 서비스 안내, 기록 쓰기, 그리드·리스트, 정렬·페이지 이동 |
| `/records`             | 검색, 이달의 추천, 분류별 기록 목록                     |
| `/summary/search`      | 이전 검색 URL 호환                                      |
| `/summary/detail/[id]` | 기록, 좋아요·공유, 댓글·답글, 수정·삭제                 |
| `/summary/create`      | 도서 검색·선택, 본문 작성, 책 전체·쪽수 범위            |
| `/summary/edit/[id]`   | 기존 기록 수정                                          |
| `/books`               | 도서 검색, 기록 수·정렬, 기록이 달린 도서 필터          |
| `/books/[isbn]`        | 도서 정보와 해당 도서의 기록                            |
| `/login`, `/sign-up`   | 일반·Google 로그인, 회원가입·입력 검증                  |
| `/my-page/[id]`        | 프로필 수정과 작성한 기록                               |

도서 목록은 기록이 있는 도서와 최근 찾아본 도서를 함께 보여줍니다. 스위치를 켜면 기록이 없는 도서는
숨깁니다. 도서 검색으로 추가 도서를 찾을 수 있습니다.
현재 백엔드에 도서별 집계 API가 없어 기존 기록 목록 API를 페이지 단위로 모두 조회해 정확한 도서별
기록 수를 계산합니다. 데이터가 커지면 서버 집계 API로 교체해야 합니다.
이달의 추천은 최근 기록 최대 100건 중 이번 달 기록을 좋아요순으로 선정합니다.

## 확인

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run storybook
```

단위 테스트는 도서별 집계, 쪽수 검증, HTML 제목, 링크·로그인 복귀 경로,
기존 카테고리 검색 요청 형식, 발행일 형식을 확인합니다.
화면 테스트용 예시 데이터는 애플리케이션에 포함하지 않습니다. 실제 조회·저장에는 백엔드 연결이 필요합니다.
