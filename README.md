# 🏪 키오스크 누리 (Kiosk Nuri) - 웹 키오스크 시스템

## 📁 프로젝트 폴더 구조

```
kiosk-nuri/
├── index.html                 # 메인 진입점
├── README.md                  # 프로젝트 설명서
├── package.json              # 의존성 관리 (추후 추가)
│
├── assets/                    # 공통 리소스
│   ├── css/
│   │   ├── global.css        # 전역 스타일
│   │   ├── variables.css     # CSS 변수 정의
│   │   └── common.css        # 공통 컴포넌트 스타일
│   ├── js/
│   │   ├── main.js          # 메인 JavaScript
│   │   ├── utils.js         # 유틸리티 함수
│   │   └── api.js           # API 통신
│   ├── images/
│   │   ├── icons/           # 아이콘
│   │   ├── logos/           # 로고
│   │   └── backgrounds/     # 배경 이미지
│   └── fonts/               # 폰트 파일
│
├── pages/                     # 개별 페이지
│   ├── main/                 # 메인 화면
│   │   ├── main.html
│   │   ├── main.css
│   │   └── main.js
│   ├── menu/                 # 메뉴 선택 화면
│   │   ├── menu.html
│   │   ├── menu.css
│   │   └── menu.js
│   ├── order/                # 주문 화면
│   │   ├── order.html
│   │   ├── order.css
│   │   └── order.js
│   ├── payment/              # 결제 화면
│   │   ├── payment.html
│   │   ├── payment.css
│   │   └── payment.js
│   ├── complete/             # 주문 완료 화면
│   │   ├── complete.html
│   │   ├── complete.css
│   │   └── complete.js
│   └── settings/             # 설정 화면
│       ├── settings.html
│       ├── settings.css
│       └── settings.js
│
├── components/               # 재사용 가능한 컴포넌트
│   ├── buttons/
│   │   ├── primary-button.css
│   │   ├── nav-button.css
│   │   └── service-button.css
│   ├── cards/
│   │   ├── menu-card.css
│   │   ├── service-card.css
│   │   └── order-card.css
│   ├── modals/
│   │   ├── alert-modal.css
│   │   ├── confirm-modal.css
│   │   └── loading-modal.css
│   └── navigation/
│       ├── header.css
│       ├── footer.css
│       └── breadcrumb.css
│
├── utils/                    # 유틸리티
│   ├── constants.js         # 상수 정의
│   ├── helpers.js           # 헬퍼 함수
│   └── validation.js        # 유효성 검사
│
└── config/                   # 설정 파일
    ├── theme.css           # 테마 설정
    ├── responsive.css      # 반응형 설정
    └── kiosk-config.js     # 키오스크 설정
```

## 🎯 화면 플로우

```
메인 화면 (index.html)
    ↓
메뉴 선택 (pages/menu/)
    ↓
주문 화면 (pages/order/)
    ↓
결제 화면 (pages/payment/)
    ↓
완료 화면 (pages/complete/)
```

## 🚀 개발 규칙

### 1. 파일 명명 규칙
- HTML: `kebab-case.html`
- CSS: `kebab-case.css`
- JS: `camelCase.js`
- 이미지: `kebab-case.png/jpg/svg`

### 2. CSS 구조
- 전역 스타일: `assets/css/global.css`
- 페이지별 스타일: `pages/{page-name}/{page-name}.css`
- 컴포넌트 스타일: `components/{component-type}/{component-name}.css`

### 3. JavaScript 구조
- 각 페이지별 독립적인 JS 파일
- 공통 기능은 `assets/js/utils.js`에 정의
- API 통신은 `assets/js/api.js`에 집중

### 4. 이미지 관리
- 피그마에서 추출한 이미지: `assets/images/figma/`
- 아이콘: `assets/images/icons/`
- 로고: `assets/images/logos/`

## 🔧 추천 개발 도구

- **Live Server**: 실시간 개발 서버
- **Figma to Code**: 피그마 디자인 자동 변환
- **CSS Grid/Flexbox**: 레이아웃
- **Vanilla JS**: 가벼운 성능을 위해

## 📱 키오스크 최적화

- **터치 친화적**: 큰 버튼과 명확한 인터랙션
- **접근성**: 시각적 피드백과 음성 안내
- **성능**: 빠른 로딩과 부드러운 애니메이션
- **안정성**: 에러 처리와 자동 리셋 