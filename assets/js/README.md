# 키오스크 메뉴 시스템

이 폴더는 키오스크의 메뉴 데이터와 렌더링을 관리하는 JavaScript 파일들을 포함합니다.

## 파일 구조

```
assets/js/
├── menu-data.js          # 메뉴 데이터 정의
├── menu-renderer.js      # 메뉴 동적 렌더링 클래스
├── menu-utils.js         # 메뉴 관리 유틸리티 함수들
└── README.md            # 이 파일

assets/data/
└── menu-config.json     # JSON 형태의 메뉴 설정 파일
```

## 주요 기능

### 1. 동적 메뉴 렌더링
- 하드코딩된 HTML 대신 데이터 기반으로 메뉴 생성
- 카테고리별 필터링 및 전환
- 실시간 장바구니 관리

### 2. 재사용 가능한 구조
- 모든 메뉴 데이터를 별도 파일로 분리
- 언제든지 메뉴 추가/수정/삭제 가능
- 일반 모드와 누리 모드에서 동일한 시스템 사용

### 3. 확장성
- 새로운 카테고리 쉽게 추가 가능
- 메뉴 아이템 속성 확장 가능 (할인, 품절 등)
- 다양한 데이터 소스 지원 (JSON, API 등)

## 사용법

### 기본 사용법

```html
<!-- HTML 파일에 스크립트 추가 -->
<script src="../../../assets/js/menu-data.js"></script>
<script src="../../../assets/js/menu-renderer.js"></script>
<script src="../../../assets/js/menu-utils.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // 메뉴 렌더러 초기화
  const menuRenderer = new MenuRenderer('#menu-container');
});
</script>
```

### 메뉴 데이터 접근

```javascript
// 모든 카테고리 가져오기
const categories = MenuData.getCategories();

// 특정 카테고리의 메뉴 아이템들 가져오기
const coffeeItems = MenuData.getItemsByCategory('coffee');

// 특정 아이템 가져오기
const americano = MenuData.getItem('coffee', 'americano');

// 모든 아이템 가져오기
const allItems = MenuData.getAllItems();
```

### 메뉴 렌더링 제어

```javascript
// 카테고리 변경
menuRenderer.changeCategory('dessert');

// 현재 선택된 아이템들 확인
const selectedItems = menuRenderer.getSelectedItems();

// 특정 아이템 제거
menuRenderer.removeItem('americano');

// 전체 취소
menuRenderer.cancelAll();
```

### 유틸리티 함수 사용

```javascript
// 메뉴 아이템 검색
const searchResults = MenuUtils.searchMenuItems('라떼', allItems);

// 가격대별 필터링
const affordableItems = MenuUtils.filterByPriceRange(allItems, 2000, 4000);

// 가격순 정렬
const sortedItems = MenuUtils.sortByPrice(allItems, true);

// 메뉴 통계
const stats = MenuUtils.getMenuStatistics(MENU_DATA);

// 데이터 백업
MenuUtils.exportMenuData(MENU_DATA, 'backup.json');
```

## 메뉴 데이터 구조

### 카테고리 데이터
```javascript
{
  id: 'coffee',           // 카테고리 ID (고유값)
  name: '커피',           // 표시할 이름
  position: {             // 화면상 위치
    row: 1,
    col: 2
  }
}
```

### 메뉴 아이템 데이터
```javascript
{
  id: 'americano',                    // 아이템 ID (고유값)
  name: '아메리카노',                  // 표시할 이름
  price: 2500,                       // 가격
  image: 'coffee1.png',              // 이미지 파일명
  description: '깔끔하고 진한 맛',    // 설명 (옵션)
  position: {                        // 화면상 위치
    row: 1,
    col: 1
  }
}
```

## 메뉴 추가/수정 방법

### 1. 새 카테고리 추가
`menu-data.js` 파일에서:
1. `categories` 배열에 새 카테고리 추가
2. `items` 객체에 해당 카테고리의 메뉴 아이템들 추가

### 2. 새 메뉴 아이템 추가
해당 카테고리의 배열에 새 아이템 객체 추가

### 3. 가격 수정
해당 아이템의 `price` 값 수정

### 4. 이미지 변경
1. 새 이미지를 `assets/images/coffee/` 폴더에 추가
2. 해당 아이템의 `image` 값을 새 파일명으로 수정

## 주의사항

1. **ID 고유성**: 카테고리 ID와 아이템 ID는 반드시 고유해야 합니다
2. **이미지 경로**: 이미지 파일은 `assets/images/coffee/` 폴더에 위치해야 합니다
3. **CSS 클래스**: 기존 CSS 클래스와 호환되도록 설계되었습니다
4. **브라우저 지원**: ES6+ 문법을 사용하므로 최신 브라우저에서 동작합니다

## 확장 계획

- [ ] API 연동을 통한 실시간 메뉴 업데이트
- [ ] 다국어 지원
- [ ] 메뉴 아이템 할인/품절 상태 관리
- [ ] 관리자 페이지에서 메뉴 편집 기능
- [ ] 메뉴 이미지 자동 최적화
- [ ] 접근성 개선 (스크린 리더 지원 등)