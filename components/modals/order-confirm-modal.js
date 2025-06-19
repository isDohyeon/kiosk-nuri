/**
 * 주문 확인 모달 클래스
 */
class OrderConfirmModal {
  constructor(options = {}) {
    this.options = {
      modalId: 'orderConfirmModal',
      closeOnOverlay: true,
      closeOnEscape: true,
      ...options
    };
    
    this.callbacks = {
      onConfirm: options.onConfirm || (() => {}),
      onCancel: options.onCancel || (() => {}),
      onOpen: options.onOpen || (() => {}),
      onClose: options.onClose || (() => {})
    };
    
    this.modal = null;
    this.isOpen = false;
    this.orderData = null;
    
    this.init();
  }
  
  /**
   * 모달 초기화
   */
  init() {
    this.createModal();
    this.bindEvents();
    this.setupKeyboardEvents();
  }
  
  /**
   * 모달 HTML 생성
   */
  createModal() {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById(this.options.modalId);
    if (existingModal) {
      existingModal.remove();
    }
    
    // 새 모달 생성
    const modalHtml = `
      <div class="order-confirm-modal" id="${this.options.modalId}">
        <div class="modal-overlay"></div>
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">주문 내역 확인</h2>
          </div>
          
          <div class="modal-body">
            <div class="order-items-section" id="orderItemsList">
              <!-- 주문 내역이 동적으로 들어갈 곳 -->
            </div>
            
            <div class="order-summary">
              <div class="summary-row">
                <span class="summary-label">총 수량</span>
                <span class="summary-value" id="totalQuantity">0개</span>
              </div>
              <div class="summary-row total">
                <span class="summary-label">총 결제 금액</span>
                <span class="summary-value" id="totalAmount">₩ 0</span>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <div class="modal-actions">
              <button class="modal-button cancel-button" type="button" id="modal-cancel">
                <span class="button-text">취소</span>
              </button>
              <button class="modal-button confirm-button" type="button" id="modal-confirm">
                <span class="button-text">결제하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.modal = document.getElementById(this.options.modalId);
  }
  
  /**
   * 이벤트 바인딩
   */
  bindEvents() {
    if (!this.modal) return;
    
    // 오버레이 클릭으로 닫기
    const overlay = this.modal.querySelector('.modal-overlay');
    if (overlay && this.options.closeOnOverlay) {
      overlay.addEventListener('click', () => this.close());
    }
    
    // 모달 컨테이너 클릭 시 이벤트 전파 방지
    const container = this.modal.querySelector('.modal-container');
    if (container) {
      container.addEventListener('click', (e) => e.stopPropagation());
    }
    
    // 취소 버튼
    const cancelBtn = this.modal.querySelector('#modal-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.handleCancel());
    }
    
    // 확인 버튼
    const confirmBtn = this.modal.querySelector('#modal-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.handleConfirm());
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
   * @param {Object} orderData - 주문 데이터
   */
  open(orderData) {
    if (this.isOpen || !orderData) return;
    
    this.orderData = orderData;
    this.updateModalContent();
    
    // 모달 표시
    this.modal.classList.add('active');
    this.isOpen = true;
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 콜백 실행
    this.callbacks.onOpen(this, orderData);
    
    console.log('주문 확인 모달 열림:', orderData);
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
    
    // 콜백 실행
    this.callbacks.onClose(this);
    
    console.log('주문 확인 모달 닫힘');
  }
  
  /**
   * 모달 내용 업데이트
   */
  updateModalContent() {
    if (!this.orderData) return;
    
    // 주문 내역 렌더링
    this.renderOrderItems();
    
    // 총 수량 업데이트
    const totalQuantityElement = this.modal.querySelector('#totalQuantity');
    if (totalQuantityElement) {
      totalQuantityElement.textContent = `${this.orderData.totalQuantity}개`;
    }
    
    // 총 금액 업데이트
    const totalAmountElement = this.modal.querySelector('#totalAmount');
    if (totalAmountElement) {
      totalAmountElement.textContent = `₩ ${this.orderData.totalPrice.toLocaleString()}`;
    }
  }
  
  /**
   * 주문 내역 렌더링
   */
  renderOrderItems() {
    const container = this.modal.querySelector('#orderItemsList');
    if (!container || !this.orderData.items) return;
    
    container.innerHTML = '';
    
    this.orderData.items.forEach(item => {
      const itemElement = this.createOrderItemElement(item);
      container.appendChild(itemElement);
    });
  }
  
  /**
   * 주문 아이템 요소 생성
   */
  createOrderItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';
    
    // 아이템 정보 생성
    let itemDetails = '';
    
    // 온도 정보 추가
    if (item.temperature) {
      itemDetails += `${item.temperature === 'ice' ? '아이스' : '핫'}`;
    }
    
    // 옵션 정보 추가
    if (item.options) {
      const options = [];
      if (item.options.shot > 0) options.push(`샷추가 x${item.options.shot}`);
      if (item.options.weak > 0) options.push(`연하게 x${item.options.weak}`);
      if (item.options.syrup > 0) options.push(`시럽추가 x${item.options.syrup}`);
      if (item.options.milk > 0) options.push(`우유변경 x${item.options.milk}`);
      if (item.options.tumbler) options.push('개인 텀블러 사용');
      
      if (options.length > 0) {
        if (itemDetails) itemDetails += ', ';
        itemDetails += options.join(', ');
      }
    }
    
    const itemTotal = item.totalPrice || (item.price * item.quantity);
    
    itemDiv.innerHTML = `
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        ${itemDetails ? `<div class="item-details">${itemDetails}</div>` : ''}
      </div>
      <div class="item-quantity">${item.quantity}개</div>
      <div class="item-price">₩ ${itemTotal.toLocaleString()}</div>
    `;
    
    return itemDiv;
  }
  
  /**
   * 취소 처리
   */
  handleCancel() {
    this.callbacks.onCancel(this);
    this.close();
  }
  
  /**
   * 확인 처리
   */
  handleConfirm() {
    // "결제되었습니다" 알림 표시
    this.showPaymentCompleteAlert();
    
    // 콜백 실행
    this.callbacks.onConfirm(this, this.orderData);
    
    this.close();
  }
  
  /**
   * 결제 완료 알림 표시
   */
  showPaymentCompleteAlert() {
    // 간단한 알림창 표시
    alert('결제되었습니다!\n주문해주셔서 감사합니다.');
    
    // 또는 더 세련된 알림을 원한다면 커스텀 알림 모달을 만들 수 있습니다
    // this.showCustomAlert('결제되었습니다!', '주문해주셔서 감사합니다.');
  }
  
  /**
   * 커스텀 알림 (향후 확장 가능)
   */
  showCustomAlert(title, message) {
    // 커스텀 알림 모달 구현
    console.log('커스텀 알림:', title, message);
  }
  
  /**
   * 현재 주문 데이터 반환
   */
  getOrderData() {
    return this.orderData;
  }
  
  /**
   * 모달 제거
   */
  destroy() {
    if (this.modal) {
      this.modal.remove();
    }
  }
}

// 전역 스코프에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  window.OrderConfirmModal = OrderConfirmModal;
} 