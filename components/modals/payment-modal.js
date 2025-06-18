/**
 * 결제 모달 컴포넌트
 * 카페 키오스크 결제 시스템용 재사용 가능한 모달
 */

class PaymentModal {
  constructor(options = {}) {
    this.options = {
      modalId: 'paymentModal',
      autoClose: false,
      closeOnOverlay: true,
      closeOnEscape: true,
      ...options
    };
    
    this.modal = null;
    this.isOpen = false;
    this.currentStatus = 'waiting'; // waiting, processing, success, error
    
    this.callbacks = {
      onOpen: options.onOpen || (() => {}),
      onClose: options.onClose || (() => {}),
      onCancel: options.onCancel || (() => {}),
      onRetry: options.onRetry || (() => {}),
      onSuccess: options.onSuccess || (() => {}),
      onError: options.onError || (() => {})
    };
    
    this.init();
  }
  
  /**
   * 모달 초기화
   */
  init() {
    this.modal = document.getElementById(this.options.modalId);
    if (!this.modal) {
      console.error(`Modal with id "${this.options.modalId}" not found`);
      return;
    }
    
    this.bindEvents();
    this.setupKeyboardEvents();
  }
  
  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    // 오버레이 클릭으로 닫기
    const overlay = this.modal.querySelector('.modal-overlay');
    if (overlay && this.options.closeOnOverlay) {
      overlay.addEventListener('click', () => this.close());
    }
    
    // 취소 버튼
    const cancelBtn = this.modal.querySelector('.cancel-button');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.handleCancel());
    }
    
    // 다시 시도 버튼
    const retryBtn = this.modal.querySelector('.retry-button');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.handleRetry());
    }
    
    // 모달 컨테이너 클릭 시 이벤트 전파 방지
    const container = this.modal.querySelector('.modal-container');
    if (container) {
      container.addEventListener('click', (e) => e.stopPropagation());
    }
  }
  
  /**
   * 키보드 이벤트 설정
   */
  setupKeyboardEvents() {
    if (this.options.closeOnEscape) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }
  }
  
  /**
   * 모달 열기
   * @param {Object} config - 모달 설정
   */
  open(config = {}) {
    if (this.isOpen) return;
    
    const {
      title = '카드를 리더기에 꽂아주세요.',
      message = '결제를 진행하고 있습니다...',
      showSpinner = true,
      status = 'waiting'
    } = config;
    
    // 제목 설정
    const titleElement = this.modal.querySelector('.modal-title');
    if (titleElement) {
      titleElement.textContent = title;
    }
    
    // 상태 메시지 설정
    const messageElement = this.modal.querySelector('.status-message');
    if (messageElement) {
      messageElement.textContent = message;
    }
    
    // 스피너 표시/숨김
    const spinner = this.modal.querySelector('.loading-spinner');
    if (spinner) {
      spinner.style.display = showSpinner ? 'block' : 'none';
    }
    
    // 상태 설정
    this.setStatus(status);
    
    // 모달 표시
    this.modal.classList.add('active');
    this.isOpen = true;
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 콜백 실행
    this.callbacks.onOpen(this);
    
    // 접근성: 포커스 관리
    this.trapFocus();
  }
  
  /**
   * 모달 닫기
   */
  close() {
    if (!this.isOpen) return;
    
    this.modal.classList.remove('active');
    this.isOpen = false;
    
    // body 스크롤 복원
    document.body.style.overflow = '';
    
    // 상태 초기화
    this.setStatus('waiting');
    
    // 콜백 실행
    this.callbacks.onClose(this);
  }
  
  /**
   * 모달 상태 설정
   * @param {string} status - 상태 (waiting, processing, success, error)
   */
  setStatus(status) {
    const validStatuses = ['waiting', 'processing', 'success', 'error'];
    if (!validStatuses.includes(status)) {
      console.warn(`Invalid status: ${status}`);
      return;
    }
    
    // 기존 상태 클래스 제거
    validStatuses.forEach(s => {
      this.modal.classList.remove(s);
    });
    
    // 새 상태 클래스 추가
    this.modal.classList.add(status);
    this.currentStatus = status;
    
    // 상태별 UI 업데이트
    this.updateUIForStatus(status);
  }
  
  /**
   * 상태별 UI 업데이트
   * @param {string} status - 현재 상태
   */
  updateUIForStatus(status) {
    const messageElement = this.modal.querySelector('.status-message');
    const spinner = this.modal.querySelector('.loading-spinner');
    const retryBtn = this.modal.querySelector('.retry-button');
    
    switch (status) {
      case 'waiting':
        if (messageElement) messageElement.textContent = '결제를 진행하고 있습니다...';
        if (spinner) spinner.style.display = 'block';
        if (retryBtn) retryBtn.disabled = false;
        break;
        
      case 'processing':
        if (messageElement) messageElement.textContent = '결제 처리 중입니다...';
        if (spinner) spinner.style.display = 'block';
        if (retryBtn) retryBtn.disabled = true;
        break;
        
      case 'success':
        if (messageElement) messageElement.textContent = '결제가 완료되었습니다.';
        if (spinner) spinner.style.display = 'none';
        if (retryBtn) retryBtn.disabled = false;
        this.callbacks.onSuccess(this);
        break;
        
      case 'error':
        if (messageElement) messageElement.textContent = '결제 중 오류가 발생했습니다.';
        if (spinner) spinner.style.display = 'none';
        if (retryBtn) retryBtn.disabled = false;
        this.callbacks.onError(this);
        break;
    }
  }
  
  /**
   * 결제 일러스트레이션 설정
   * @param {string} iconUrl - 이미지 URL (기본값: payment-credit-card.png)
   * @param {string} altText - 대체 텍스트
   */
  setPaymentIcon(iconUrl = '../../assets/images/payment-credit-card.png', altText = '카드 리더기') {
    const illustration = this.modal.querySelector('.payment-illustration');
    if (illustration) {
      illustration.src = iconUrl;
      illustration.alt = altText;
    }
  }
  
  /**
   * 취소 버튼 클릭 처리 - 콜백 실행 후 모달 닫음
   */
  handleCancel() {
    // 먼저 콜백 실행 (타이머 정리 등)
    if (this.callbacks.onCancel) {
      this.callbacks.onCancel(this);
    }
    // 그 다음 모달 닫기
    this.close();
  }
  
  /**
   * 다시 시도 버튼 클릭 처리
   */
  handleRetry() {
    this.setStatus('processing');
    this.callbacks.onRetry(this);
  }
  
  /**
   * 포커스 트랩 (접근성)
   */
  trapFocus() {
    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // 첫 번째 요소에 포커스
    firstElement.focus();
    
    // Tab 키 이벤트 처리
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
  
  /**
   * 결제 진행 시뮬레이션 (테스트용)
   * @param {number} duration - 처리 시간 (밀리초)
   * @param {boolean} shouldSuccess - 성공 여부
   */
  simulatePayment(duration = 3000, shouldSuccess = true) {
    this.setStatus('processing');
    
    setTimeout(() => {
      if (shouldSuccess) {
        this.setStatus('success');
        if (this.options.autoClose) {
          setTimeout(() => this.close(), 2000);
        }
      } else {
        this.setStatus('error');
      }
    }, duration);
  }
  
  /**
   * 모달 제거
   */
  destroy() {
    if (this.modal) {
      this.close();
      this.modal.remove();
    }
  }
}

// 전역에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PaymentModal;
} else if (typeof window !== 'undefined') {
  window.PaymentModal = PaymentModal;
}

// 사용 예시 및 헬퍼 함수들
window.PaymentModalUtils = {
  /**
   * 간단한 결제 모달 생성
   */
  createSimpleModal() {
    return new PaymentModal({
      onCancel: (modal) => {
        console.log('결제 취소됨');
      },
      onRetry: (modal) => {
        console.log('다시 시도');
        modal.simulatePayment(2000, Math.random() > 0.3);
      },
      onSuccess: (modal) => {
        console.log('결제 성공');
      },
      onError: (modal) => {
        console.log('결제 실패');
      }
    });
  },
  
  /**
   * 카드 결제 모달
   */
  createCardPaymentModal() {
    const modal = new PaymentModal({
      onOpen: (modal) => {
        // 기본 카드 리더기 이미지 사용
        modal.setPaymentIcon('../../assets/images/payment-credit-card.png', '카드 리더기');
      }
    });
    
    return modal;
  },
  
  /**
   * 모바일 결제 모달
   */
  createMobilePaymentModal(paymentType = 'kakao') {
    const modal = new PaymentModal({
      onOpen: (modal) => {
        // 모든 결제 방법에 대해 동일한 카드 리더기 이미지 사용
        modal.setPaymentIcon('../../assets/images/payment-credit-card.png', '카드 리더기');
      }
    });
    
    return modal;
  }
}; 