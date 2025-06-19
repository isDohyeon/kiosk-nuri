/**
 * 옵션 선택 모달 컴포넌트
 * 카페 키오스크 메뉴 옵션 선택용 재사용 가능한 모달
 */

class OptionModal {
  constructor(options = {}) {
    this.options = {
      modalId: 'optionModal',
      autoClose: false,
      closeOnOverlay: true,
      closeOnEscape: true,
      ...options
    };
    
    this.modal = null;
    this.isOpen = false;
    this.currentItem = null;
    this.currentQuantity = 1;
    this.selectedTemperature = null; // 기본값: 선택되지 않음
    this.selectedOptions = {
      shot: 0,
      weak: 0,
      syrup: 0,
      tumbler: false
    };
    
    // 옵션 가격 정의
    this.optionPrices = {
      shot: 500,
      weak: 0,
      syrup: 500,
      tumbler: 0
    };
    
    this.callbacks = {
      onOpen: options.onOpen || (() => {}),
      onClose: options.onClose || (() => {}),
      onCancel: options.onCancel || (() => {}),
      onConfirm: options.onConfirm || (() => {}),
      onItemAdded: options.onItemAdded || (() => {})
    };
    
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
      <!-- 옵션 선택 모달 -->
             <div class="modal-overlay" id="${this.options.modalId}">
         <div class="modal-container">
           <div class="modal-content">
             <!-- 상단 헤더 (이미지 + 제목) -->
             <div class="item-header">
               <!-- 메뉴 이미지 -->
               <div class="item-image-container">
                 <img src="" alt="" class="item-image" id="modal-item-image" />
               </div>
               
               <!-- 메뉴명 -->
               <h2 class="item-title" id="modal-item-title">아메리카노</h2>
             </div>
            
                         <!-- 수량 및 가격 -->
             <div class="quantity-selector">
               <div class="quantity-controls">
                 <button class="quantity-btn decrease" id="decrease-quantity" aria-label="수량 감소">-</button>
                 <span class="quantity" id="item-quantity">1</span>
                 <button class="quantity-btn increase" id="increase-quantity" aria-label="수량 증가">+</button>
               </div>
               <span class="item-price" id="modal-item-price">₩2,500</span>
             </div>
            
            <!-- 온도 선택 -->
            <div class="temperature-selector">
              <button class="temperature-option" data-temp="ice" id="temp-ice">Ice</button>
              <button class="temperature-option" data-temp="hot" id="temp-hot">Hot</button>
            </div>
            
            <!-- 옵션 추가 -->
            <h3 class="options-title">옵션 추가</h3>
            <ul class="options-list" id="options-list">
              <li class="option-item">
                <span class="option-name">샷추가</span>
                <span class="option-price">₩ 500</span>
                <div class="option-quantity">
                  <button class="option-btn decrease" data-option="shot" aria-label="옵션 수량 감소">-</button>
                  <span class="option-count" data-option="shot">0</span>
                  <button class="option-btn increase" data-option="shot" aria-label="옵션 수량 증가">+</button>
                </div>
              </li>
              <li class="option-item">
                <span class="option-name">연하게</span>
                <span class="option-price">₩ 0</span>
                <div class="option-quantity">
                  <button class="option-btn decrease" data-option="weak" aria-label="옵션 수량 감소">-</button>
                  <span class="option-count" data-option="weak">0</span>
                  <button class="option-btn increase" data-option="weak" aria-label="옵션 수량 증가">+</button>
                </div>
              </li>
              <li class="option-item">
                <span class="option-name">시럽 추가</span>
                <span class="option-price">₩ 500</span>
                <div class="option-quantity">
                  <button class="option-btn decrease" data-option="syrup" aria-label="옵션 수량 감소">-</button>
                  <span class="option-count" data-option="syrup">0</span>
                  <button class="option-btn increase" data-option="syrup" aria-label="옵션 수량 증가">+</button>
                </div>
              </li>
              <li class="option-item">
                <span class="option-name">개인 텀블러 사용</span>
                <div class="option-checkbox">
                  <input type="checkbox" id="tumbler-checkbox" data-option="tumbler" />
                  <label for="tumbler-checkbox"></label>
                </div>
              </li>
            </ul>
            
            <!-- 모달 액션 버튼 -->
            <div class="modal-actions">
              <button class="modal-btn cancel" id="modal-cancel">취소</button>
              <button class="modal-btn confirm" id="modal-confirm">선택 완료</button>
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
    const container = this.modal.querySelector('.modal-content');
    if (container) {
      container.addEventListener('click', (e) => e.stopPropagation());
    }
    
    // 수량 조절 버튼
    const decreaseBtn = this.modal.querySelector('#decrease-quantity');
    const increaseBtn = this.modal.querySelector('#increase-quantity');
    
    if (decreaseBtn) {
      decreaseBtn.addEventListener('click', () => this.decreaseQuantity());
    }
    if (increaseBtn) {
      increaseBtn.addEventListener('click', () => this.increaseQuantity());
    }
    
    // 온도 선택 버튼
    const tempButtons = this.modal.querySelectorAll('.temperature-option');
    tempButtons.forEach(btn => {
      btn.addEventListener('click', () => this.selectTemperature(btn.dataset.temp));
    });
    
    // 옵션 수량 조절 버튼
    const optionBtns = this.modal.querySelectorAll('.option-btn');
    console.log('옵션 버튼 개수:', optionBtns.length);
    optionBtns.forEach((btn, index) => {
      console.log(`버튼 ${index + 1}:`, btn.dataset.option, btn.classList.contains('increase') ? 'increase' : 'decrease');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const option = btn.dataset.option;
        const isIncrease = btn.classList.contains('increase');
        console.log('옵션 버튼 클릭:', option, isIncrease ? '증가' : '감소');
        this.adjustOption(option, isIncrease);
      });
    });

    // 텀블러 체크박스
    const tumblerCheckbox = this.modal.querySelector('#tumbler-checkbox');
    if (tumblerCheckbox) {
      tumblerCheckbox.addEventListener('change', () => {
        this.selectedOptions.tumbler = tumblerCheckbox.checked;
        console.log('텀블러 선택:', this.selectedOptions.tumbler);
      });
    }
    
    // 취소/확인 버튼
    const cancelBtn = this.modal.querySelector('#modal-cancel');
    const confirmBtn = this.modal.querySelector('#modal-confirm');
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.handleCancel());
    }
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
   * @param {Object} item - 메뉴 아이템 정보
   */
  open(item) {
    if (this.isOpen || !item) return;
    
    this.currentItem = item;
    this.resetSelections();
    this.updateModalContent();
    
    // 모달 표시
    this.modal.classList.add('active');
    this.isOpen = true;
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    
    // 콜백 실행
    this.callbacks.onOpen(this, item);
    
    console.log('옵션 모달 열림:', item.name);
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
    
    console.log('옵션 모달 닫힘');
  }
  
  /**
   * 선택 항목 초기화
   */
  resetSelections() {
    this.currentQuantity = 1;
    this.selectedTemperature = null;
    this.selectedOptions = {
      shot: 0,
      weak: 0,
      syrup: 0,
      tumbler: false
    };
  }
  
  /**
   * 모달 내용 업데이트
   */
  updateModalContent() {
    if (!this.currentItem) return;
    
    // 이미지 업데이트
    const image = this.modal.querySelector('#modal-item-image');
    if (image) {
      image.src = `../../../assets/images/coffee/${this.currentItem.image}`;
      image.alt = this.currentItem.name;
    }
    
    // 제목 업데이트
    const title = this.modal.querySelector('#modal-item-title');
    if (title) {
      title.textContent = this.currentItem.name;
    }
    
    // 수량 및 가격 업데이트
    this.updateQuantityAndPrice();
    
    // 온도 선택 초기화 (기본값: 선택되지 않음)
    this.updateTemperatureSelection();
    
    // 옵션 수량 초기화
    this.updateOptionsDisplay();
  }
  
  /**
   * 수량 감소
   */
  decreaseQuantity() {
    if (this.currentQuantity > 1) {
      this.currentQuantity--;
      this.updateQuantityAndPrice();
    }
  }
  
  /**
   * 수량 증가
   */
  increaseQuantity() {
    if (this.currentQuantity < 10) { // 최대 10개
      this.currentQuantity++;
      this.updateQuantityAndPrice();
    }
  }
  
  /**
   * 온도 선택
   */
  selectTemperature(temperature) {
    this.selectedTemperature = temperature;
    this.updateTemperatureSelection();
  }
  
  /**
   * 옵션 수량 조절
   */
  adjustOption(option, isIncrease) {
    console.log('adjustOption 호출됨:', option, isIncrease ? '증가' : '감소', '현재값:', this.selectedOptions[option]);
    
    if (option === 'tumbler') {
      // 텀블러는 체크박스이므로 수량 조절 안함
      return;
    }
    
    if (isIncrease) {
      if (this.selectedOptions[option] < 5) { // 최대 5개
        this.selectedOptions[option]++;
      }
    } else {
      if (this.selectedOptions[option] > 0) {
        this.selectedOptions[option]--;
      }
    }
    
    console.log('변경 후 값:', this.selectedOptions[option]);
    this.updateOptionsDisplay();
    this.updateQuantityAndPrice();
  }
  
  /**
   * 수량 및 가격 업데이트
   */
  updateQuantityAndPrice() {
    // 수량 표시
    const quantityElement = this.modal.querySelector('#item-quantity');
    if (quantityElement) {
      quantityElement.textContent = this.currentQuantity;
    }
    
    // 총 가격 계산 및 표시
    const totalPrice = this.calculateTotalPrice();
    const priceElement = this.modal.querySelector('#modal-item-price');
    if (priceElement) {
      priceElement.textContent = `₩${totalPrice.toLocaleString()}`;
    }
  }
  
  /**
   * 온도 선택 UI 업데이트
   */
  updateTemperatureSelection() {
    const tempButtons = this.modal.querySelectorAll('.temperature-option');
    tempButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.temp === this.selectedTemperature);
    });
  }
  
  /**
   * 옵션 표시 업데이트
   */
  updateOptionsDisplay() {
    Object.keys(this.selectedOptions).forEach(option => {
      if (option === 'tumbler') {
        // 텀블러 체크박스 업데이트
        const checkbox = this.modal.querySelector(`#tumbler-checkbox`);
        if (checkbox) {
          checkbox.checked = this.selectedOptions[option];
        }
      } else {
        // 수량 카운트 업데이트 - 옵션별로 정확한 selector 사용
        const countElement = this.modal.querySelector(`.option-count[data-option="${option}"]`);
        console.log(`옵션 ${option} 카운트 업데이트:`, countElement, '값:', this.selectedOptions[option]);
        if (countElement) {
          countElement.textContent = this.selectedOptions[option];
        }
      }
    });
  }
  
  /**
   * 총 가격 계산
   */
  calculateTotalPrice() {
    let totalPrice = this.currentItem.price;
    
    // 옵션 가격 추가
    Object.keys(this.selectedOptions).forEach(option => {
      totalPrice += this.selectedOptions[option] * this.optionPrices[option];
    });
    
    // 수량 곱하기
    return totalPrice * this.currentQuantity;
  }
  
  /**
   * 취소 처리
   */
  handleCancel() {
    this.callbacks.onCancel(this);
    this.close();
  }
  
  /**
   * 확인 처리 (장바구니에 추가)
   */
  handleConfirm() {
    if (!this.currentItem) return;
    
    // 온도가 선택되지 않았으면 기본값 설정
    const temperature = this.selectedTemperature || 'ice';
    
    // 장바구니에 추가할 아이템 데이터 생성
    const cartItem = {
      ...this.currentItem,
      quantity: this.currentQuantity,
      temperature: temperature,
      options: { ...this.selectedOptions },
      totalPrice: this.calculateTotalPrice(),
      optionPrice: this.calculateTotalPrice() - (this.currentItem.price * this.currentQuantity)
    };
    
    console.log('장바구니에 추가될 아이템:', cartItem);
    
    // 콜백 실행
    this.callbacks.onConfirm(this, cartItem);
    this.callbacks.onItemAdded(cartItem);
    
    this.close();
  }
  
  /**
   * 현재 선택 상태 반환
   */
  getCurrentSelection() {
    return {
      item: this.currentItem,
      quantity: this.currentQuantity,
      temperature: this.selectedTemperature,
      options: { ...this.selectedOptions },
      totalPrice: this.calculateTotalPrice()
    };
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
  window.OptionModal = OptionModal;
} 