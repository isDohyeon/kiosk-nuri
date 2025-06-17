# 결제 모달 컴포넌트

카페 키오스크 환경에 최적화된 재사용 가능한 결제 모달 컴포넌트입니다.

## 📋 목차

- [특징](#특징)
- [구성 파일](#구성-파일)
- [기본 사용법](#기본-사용법)
- [API 문서](#api-문서)
- [커스터마이징](#커스터마이징)
- [예시 코드](#예시-코드)

## ✨ 특징

- **키오스크 최적화**: 1080x1920 해상도에 최적화된 크기와 터치 인터페이스
- **재사용 가능**: 어떤 페이지에서든 쉽게 사용할 수 있는 독립적인 컴포넌트
- **상태 관리**: 대기, 처리 중, 성공, 오류 상태를 지원
- **접근성**: 키보드 네비게이션과 포커스 트랩 지원
- **애니메이션**: 부드러운 페이드인/슬라이드업 효과
- **커스터마이징**: 아이콘, 메시지, 콜백 함수 등 자유로운 설정

## 📁 구성 파일

```
components/modals/
├── payment-modal.html          # 모달 HTML 구조
├── payment-modal.css           # 모달 스타일시트
├── payment-modal.js            # 모달 기능 JavaScript
├── payment-modal-example.html  # 사용 예시 페이지
└── README.md                   # 문서 (현재 파일)
```

## 🚀 기본 사용법

### 1. 파일 포함

```html
<!-- HTML 페이지에 포함 -->
<link rel="stylesheet" href="components/modals/payment-modal.css">
<script src="components/modals/payment-modal.js"></script>

<!-- 모달 HTML 추가 -->
<div id="paymentModalContainer"></div>
```

### 2. 모달 HTML 로드

```javascript
// payment-modal.html 내용을 페이지에 추가
fetch('components/modals/payment-modal.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('paymentModalContainer').innerHTML = html;
  });
```

### 3. 모달 생성 및 사용

```javascript
// 기본 사용법
const modal = new PaymentModal({
  onCancel: (modal) => console.log('취소됨'),
  onRetry: (modal) => console.log('다시 시도'),
  onSuccess: (modal) => console.log('성공'),
  onError: (modal) => console.log('실패')
});

// 모달 열기
modal.open({
  title: '카드를 리더기에 꽂아주세요.',
  message: '결제를 진행하고 있습니다...',
  status: 'waiting'
});
```

## 📚 API 문서

### PaymentModal 클래스

#### 생성자 옵션

```javascript
new PaymentModal({
  modalId: 'paymentModal',        // 모달 DOM ID
  autoClose: false,               // 성공 시 자동 닫기
  closeOnOverlay: true,           // 오버레이 클릭으로 닫기
  closeOnEscape: true,            // ESC 키로 닫기
  
  // 이벤트 콜백
  onOpen: (modal) => {},          // 모달 열림
  onClose: (modal) => {},         // 모달 닫힘
  onCancel: (modal) => {},        // 취소 버튼 클릭
  onRetry: (modal) => {},         // 다시 시도 버튼 클릭
  onSuccess: (modal) => {},       // 결제 성공
  onError: (modal) => {}          // 결제 실패
})
```

#### 주요 메서드

##### `open(config)`
모달을 엽니다.

```javascript
modal.open({
  title: '제목',                  // 모달 제목
  message: '상태 메시지',         // 상태 메시지
  showSpinner: true,              // 로딩 스피너 표시
  status: 'waiting'               // 초기 상태
});
```

##### `close()`
모달을 닫습니다.

##### `setStatus(status)`
모달 상태를 변경합니다.

- `'waiting'`: 대기 중
- `'processing'`: 처리 중
- `'success'`: 성공
- `'error'`: 오류

##### `setPaymentIcon(iconUrl, altText)`
결제 방법 아이콘을 설정합니다.

```javascript
modal.setPaymentIcon('/assets/images/payment-card.png', '신용카드');
```

##### `simulatePayment(duration, shouldSuccess)`
결제 처리를 시뮬레이션합니다. (테스트용)

```javascript
modal.simulatePayment(3000, true);  // 3초 후 성공
```

### PaymentModalUtils 헬퍼 함수

편의를 위한 사전 정의된 모달 생성 함수들입니다.

#### `createSimpleModal()`
기본 설정의 간단한 모달을 생성합니다.

#### `createCardPaymentModal()`
신용카드 결제용 모달을 생성합니다.

#### `createMobilePaymentModal(paymentType)`
모바일 결제용 모달을 생성합니다.

```javascript
// 카카오페이 모달
const kakaoModal = PaymentModalUtils.createMobilePaymentModal('kakao');

// 삼성페이 모달
const samsungModal = PaymentModalUtils.createMobilePaymentModal('samsung');

// 네이버페이 모달
const naverModal = PaymentModalUtils.createMobilePaymentModal('naver');
```

## 🎨 커스터마이징

### CSS 변수를 통한 테마 변경

```css
.payment-modal {
  --primary-color: #54d761;       /* 기본 녹색 */
  --error-color: #dc3545;         /* 오류 색상 */
  --success-color: #28a745;       /* 성공 색상 */
  --background-color: #ffffff;    /* 배경 색상 */
  --text-color: #121212;          /* 텍스트 색상 */
}
```

### 크기 조정

```css
.modal-container {
  width: 831px;                   /* 모달 너비 */
  height: 1087px;                 /* 모달 높이 */
}

.modal-title {
  font-size: 50px;                /* 제목 크기 */
}

.modal-button {
  font-size: 37.2px;              /* 버튼 텍스트 크기 */
}
```

## 📝 예시 코드

### 기본 결제 모달

```javascript
const basicModal = new PaymentModal({
  onCancel: (modal) => {
    console.log('결제가 취소되었습니다.');
    // 취소 로직 구현
  },
  onRetry: (modal) => {
    console.log('결제를 다시 시도합니다.');
    // 재시도 로직 구현
    modal.setStatus('processing');
  },
  onSuccess: (modal) => {
    console.log('결제가 완료되었습니다.');
    // 성공 후 로직 구현
    setTimeout(() => modal.close(), 2000);
  },
  onError: (modal) => {
    console.log('결제 중 오류가 발생했습니다.');
    // 오류 처리 로직
  }
});

// 모달 열기
basicModal.open();
```

### 카드 결제 모달

```javascript
const cardModal = new PaymentModal({
  onOpen: (modal) => {
    // 카드 아이콘 설정
    modal.setPaymentIcon('/assets/images/payment-card.png', '신용카드');
  },
  onRetry: (modal) => {
    // 실제 카드 결제 API 호출
    processCardPayment()
      .then(() => modal.setStatus('success'))
      .catch(() => modal.setStatus('error'));
  }
});

cardModal.open({
  title: '카드를 리더기에 꽂아주세요.',
  message: '신용카드 결제를 진행합니다.'
});
```

### 모바일 결제 모달

```javascript
const kakaoModal = new PaymentModal({
  onOpen: (modal) => {
    modal.setPaymentIcon('/assets/images/payment-kakao.png', '카카오페이');
  },
  onRetry: (modal) => {
    // 카카오페이 API 호출
    processKakaoPayment()
      .then(() => modal.setStatus('success'))
      .catch(() => modal.setStatus('error'));
  }
});

kakaoModal.open({
  title: 'QR코드를 스캔해주세요.',
  message: '카카오페이로 결제합니다.'
});
```

### 커스텀 설정 모달

```javascript
const customModal = new PaymentModal({
  modalId: 'customPaymentModal',
  autoClose: true,                    // 성공 시 자동 닫기
  closeOnOverlay: false,              // 오버레이 클릭 비활성화
  closeOnEscape: false,               // ESC 키 비활성화
  
  onSuccess: (modal) => {
    // 결제 성공 시 다음 페이지로 이동
    window.location.href = '/order-complete';
  }
});
```

## 🔧 문제 해결

### 모달이 표시되지 않는 경우

1. **HTML이 로드되었는지 확인**
   ```javascript
   // DOM이 로드된 후 모달 생성
   document.addEventListener('DOMContentLoaded', function() {
     const modal = new PaymentModal();
   });
   ```

2. **CSS가 포함되었는지 확인**
   ```html
   <link rel="stylesheet" href="components/modals/payment-modal.css">
   ```

3. **모달 HTML이 페이지에 있는지 확인**
   ```javascript
   if (!document.getElementById('paymentModal')) {
     console.error('결제 모달 HTML이 없습니다.');
   }
   ```

### 스타일이 적용되지 않는 경우

1. **CSS 파일 경로 확인**
2. **다른 CSS와의 충돌 확인**
3. **브라우저 캐시 클리어**

### 이벤트가 동작하지 않는 경우

1. **콜백 함수가 올바르게 정의되었는지 확인**
2. **모달이 제대로 초기화되었는지 확인**
3. **브라우저 콘솔에서 오류 메시지 확인**

## 🌟 라이센스

이 컴포넌트는 MIT 라이센스 하에 제공됩니다. 자유롭게 사용, 수정, 배포할 수 있습니다. 