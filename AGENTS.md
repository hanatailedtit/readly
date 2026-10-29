# Readly 작업 규칙

## 컴포넌트 제작 및 리디자인

사용자가 컴포넌트 제작, UI 수정 또는 리디자인을 요청하면 아래 규칙을 항상 적용한다.

- UI는 **shadcn/ui 컴포넌트와 Tailwind CSS**로 구성한다.
- 먼저 `src/components/ui`의 설치된 shadcn/ui 컴포넌트를 재사용한다. 필요한 컴포넌트가 없다면 shadcn/ui에서 추가한 뒤 프로젝트 스타일에 맞게 커스텀한다.
- 도메인별 조합 컴포넌트는 `src/components/records`, `src/components/books`, `src/components/profile` 등 기존 폴더 구조에 맞춰 둔다.
- 스타일링은 Tailwind CSS 유틸리티와 기존 시맨틱 토큰을 사용한다. 같은 UI를 위한 별도 CSS/SCSS 파일이나 새 UI 라이브러리를 추가하지 않는다.
- `src/app/globals.css`, `tailwind.config.ts`, `design/readly-design-v1/DESIGN.md`의 Readly 색상·서체·간격을 우선한다. 개별 컴포넌트 때문에 전역 스타일을 바꾸지 않는다.
- 디자인 작업에는 `frontend-design`과 `use-design-md` 스킬을 적용한다. 기존 Readly 디자인은 리디 카탈로그를 참고했으므로, 다른 방향이 지정되지 않으면 해당 문서의 최신 규칙과 Known Gaps를 확인하고 Readly의 기존 토큰에 맞춰 적용한다.
- 모바일 배치, 최소 44px 조작 영역, 입력 레이블, 키보드 포커스, 로그인·비로그인·비활성·저장 중 상태를 함께 확인한다.
- 변경한 컴포넌트를 실제 화면에서 확인하고 타입 검사와 린트를 실행한다. 데이터 처리나 동작을 변경했다면 관련 테스트도 실행한다.
