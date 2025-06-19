// 메뉴 렌더링 클래스
class MenuRenderer {
  constructor(containerId) {
    this.container = document.querySelector(containerId);
    this.currentCategory = 'coffee'; // 기본 카테고리
    this.selectedItems = []; // 장바구니 아이템들
    this.optionModal = null; // 옵션 모달 인스턴스
    
    if (!this.container) {
      console.error(`Container with id '${containerId}' not found`);
      return;
    }
    
    this.init();
  }
  
  // 초기화
  init() {
    this.createMenuGridContainer();
    this.renderCategories();
    this.renderMenuItems(this.currentCategory);
    this.initOptionModal();
    this.setupEventListeners();
  }
  
  // 메뉴 그리드 컨테이너 생성
  createMenuGridContainer() {
    // 기존 그리드 컨테이너가 있으면 제거
    const existingGrid = this.container.querySelector('.menu-grid-container');
    if (existingGrid) {
      existingGrid.remove();
    }
    
    // 새 그리드 컨테이너 생성
    const gridContainer = document.createElement('div');
    gridContainer.className = 'menu-grid-container';
    this.container.appendChild(gridContainer);
    
    this.gridContainer = gridContainer;
  }
  
  // 카테고리 탭 렌더링
  renderCategories() {
    const categories = MenuData.getCategories();
    
    categories.forEach(category => {
      const categoryElement = document.createElement('div');
      categoryElement.className = `category-tab ${category.id === this.currentCategory ? 'active' : ''}`;
      categoryElement.setAttribute('data-category', category.id);
      
      const textElement = document.createElement('div');
      textElement.className = `text-wrapper-${this.getCategoryTextClass(category.id)}`;
      textElement.textContent = category.name;
      
      categoryElement.appendChild(textElement);
      this.container.appendChild(categoryElement);
    });
  }
  
  // 카테고리별 텍스트 클래스 매핑
  getCategoryTextClass(categoryId) {
    const classMap = {
      'new': '20',
      'coffee': '18',
      'tea': '22',
      'frappe': '24',
      'smoothie': '21',
      'juice': '19',
      'large': '23',
      'dessert': '25'
    };
    return classMap[categoryId] || '18';
  }
  
  // 메뉴 아이템 렌더링
  renderMenuItems(categoryId) {
    // 그리드 컨테이너 내의 기존 메뉴 아이템들 제거
    if (this.gridContainer) {
      this.gridContainer.innerHTML = '';
    }
    
    const items = MenuData.getItemsByCategory(categoryId);
    
    items.forEach((item, index) => {
      const menuItemElement = this.createMenuItemElement(item, index, categoryId);
      if (this.gridContainer) {
        this.gridContainer.appendChild(menuItemElement);
      }
    });
  }
  
  // 개별 메뉴 아이템 생성
  createMenuItemElement(item, index, categoryId) {
    const element = document.createElement('div');
    element.className = 'menu-item';
    element.setAttribute('data-category', categoryId);
    element.setAttribute('data-item-id', item.id);
    
    // 이미지
    const img = document.createElement('img');
    img.src = `../../../assets/images/coffee/${item.image}`;
    img.alt = item.name;
    
    // 메뉴명
    const nameDiv = document.createElement('div');
    nameDiv.className = 'menu-name';
    nameDiv.textContent = item.name;
    
    // 가격
    const priceDiv = document.createElement('div');
    priceDiv.className = 'menu-price';
    priceDiv.textContent = `₩${item.price.toLocaleString()}`;
    
    // 특별한 표시가 필요한 경우 (예: 아이스 아메리카노)
    if (item.id === 'iced-americano') {
      const badge = document.createElement('div');
      badge.className = 'menu-badge';
      badge.textContent = 'ICE';
      badge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #54d761;
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      `;
      element.appendChild(badge);
    }
    
    element.appendChild(img);
    element.appendChild(nameDiv);
    element.appendChild(priceDiv);
    
    return element;
  }
  

  
  // 카테고리 변경
  changeCategory(categoryId) {
    if (this.currentCategory === categoryId) return;
    
    this.currentCategory = categoryId;
    
    // 카테고리 탭 활성화 상태 업데이트
    const tabs = this.container.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
      if (tab.getAttribute('data-category') === categoryId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    
    // 메뉴 아이템 렌더링
    this.renderMenuItems(categoryId);
  }
  
  // 옵션 모달 초기화
  initOptionModal() {
    // OptionModal 클래스가 존재하는지 확인
    if (typeof OptionModal === 'undefined') {
      console.warn('OptionModal 클래스를 찾을 수 없습니다. 옵션 모달 없이 진행합니다.');
      return;
    }
    
    // 옵션 모달 인스턴스 생성
    this.optionModal = new OptionModal({
      onConfirm: (modal, cartItem) => {
        this.addItemToCart(cartItem);
        console.log('옵션 선택 완료, 장바구니에 추가:', cartItem);
      },
      onCancel: (modal) => {
        console.log('옵션 선택 취소됨');
      }
    });
    
    console.log('옵션 모달이 초기화되었습니다.');
  }

  // 메뉴 아이템 선택 (옵션 모달 열기)
  selectMenuItem(item) {
    console.log(`${item.name} (₩${item.price.toLocaleString()}) 선택됨`);
    
    // 옵션 모달이 있으면 모달 열기, 없으면 바로 장바구니에 추가
    if (this.optionModal) {
      this.optionModal.open(item);
    } else {
      // 옵션 모달이 없는 경우 기본 동작 (바로 장바구니에 추가)
      this.addItemToCart({
        ...item,
        quantity: 1,
        temperature: 'ice', // 옵션 모달이 없는 경우 기본값
        options: { shot: 0, weak: 0, syrup: 0, milk: 0 },
        totalPrice: item.price,
        optionPrice: 0
      });
    }
  }
  
  // 장바구니에 아이템 추가 (옵션 모달에서 호출)
  addItemToCart(cartItem) {
    console.log('장바구니에 추가:', cartItem);
    
    // 같은 메뉴, 같은 옵션의 기존 아이템 찾기
    const existingItemIndex = this.selectedItems.findIndex(selected => 
      selected.id === cartItem.id &&
      selected.temperature === cartItem.temperature &&
      JSON.stringify(selected.options) === JSON.stringify(cartItem.options)
    );
    
    if (existingItemIndex !== -1) {
      // 기존 아이템 수량 증가
      this.selectedItems[existingItemIndex].quantity += cartItem.quantity;
      // 총 가격 재계산
      this.selectedItems[existingItemIndex].totalPrice = 
        (cartItem.totalPrice / cartItem.quantity) * this.selectedItems[existingItemIndex].quantity;
    } else {
      // 새 아이템 추가 (최대 20개 아이템)
      if (this.selectedItems.length < 20) {
        this.selectedItems.push(cartItem);
      } else {
        alert('장바구니가 가득 찼습니다. (최대 20개 메뉴)');
        return;
      }
    }
    
    // 장바구니 UI 업데이트
    this.updateCartUI();
  }

  // 수량 증가
  increaseQuantity(itemId) {
    console.log('수량 증가:', itemId);
    const item = this.selectedItems.find(item => item.id === itemId);
    if (item) {
      item.quantity += 1;
      console.log(`${item.name} 수량: ${item.quantity}`);
      this.updateCartUI();
    } else {
      console.error('아이템을 찾을 수 없습니다:', itemId);
    }
  }

  // 수량 감소
  decreaseQuantity(itemId) {
    console.log('수량 감소:', itemId);
    const item = this.selectedItems.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      console.log(`${item.name} 수량: ${item.quantity}`);
      this.updateCartUI();
    } else if (item && item.quantity === 1) {
      // 수량이 1일 때는 아이템 제거
      console.log(`${item.name} 제거`);
      this.removeItem(itemId);
    } else {
      console.error('수량 감소 실패:', itemId);
    }
  }

  // 특정 아이템 제거
  removeItem(itemId) {
    const itemIndex = this.selectedItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      this.selectedItems.splice(itemIndex, 1);
      this.updateCartUI();
    }
  }
  
  // 장바구니 UI 업데이트 (동적 슬롯 생성)
  updateCartUI() {
    const cartContainer = this.container.querySelector('#cart-slots-container');
    if (!cartContainer) return;

    // 장바구니 컨테이너 비우기
    cartContainer.innerHTML = '';

    if (this.selectedItems.length === 0) {
      // 빈 장바구니 메시지
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-cart-message';
      emptyMessage.textContent = '메뉴를 선택해주세요';
      cartContainer.appendChild(emptyMessage);
    } else {
      // 각 아이템을 개별 슬롯으로 생성
      this.selectedItems.forEach((item, index) => {
        const slot = this.createCartSlot(item, index);
        cartContainer.appendChild(slot);
      });
    }

    // 총 금액 업데이트
    this.updateTotalPrice();
    
    // 버튼 상태 업데이트
    this.updateButtonStates();
  }

  // 개별 장바구니 슬롯 생성
  createCartSlot(item, index) {
    const slot = document.createElement('div');
    slot.className = 'cart-slot';
    slot.setAttribute('data-item-id', item.id);
    slot.setAttribute('data-item-index', index);

    slot.innerHTML = `
      <button class="remove-btn" data-item-id="${item.id}">×</button>
      <img class="slot-image" src="../../../assets/images/coffee/${item.image}" alt="${item.name}">
      <div class="slot-bottom">
        <button class="quantity-btn minus" data-item-id="${item.id}">-</button>
        <div class="quantity-display">${item.quantity}</div>
        <button class="quantity-btn plus" data-item-id="${item.id}">+</button>
      </div>
    `;

    return slot;
  }

  // 총 금액 업데이트
  updateTotalPrice() {
    const totalPrice = this.selectedItems.reduce((sum, item) => {
      // 옵션이 포함된 총 가격이 있으면 사용, 없으면 기본 가격 * 수량
      return sum + (item.totalPrice || (item.price * item.quantity));
    }, 0);
    const totalElement = this.container.querySelector('#total-amount');
    if (totalElement) {
      totalElement.textContent = `₩ ${totalPrice.toLocaleString()}`;
    }
  }

  // 버튼 상태 업데이트
  updateButtonStates() {
    const clearBtn = this.container.querySelector('#clear-cart-btn');
    const paymentBtn = this.container.querySelector('#proceed-payment-btn');
    
    const hasItems = this.selectedItems.length > 0;
    
    if (clearBtn) {
      clearBtn.disabled = !hasItems;
    }
    if (paymentBtn) {
      paymentBtn.disabled = !hasItems;
    }
  }
  
  // 전체 취소
  clearCart() {
    this.selectedItems = [];
    this.updateCartUI();
    console.log('장바구니가 전체 취소되었습니다.');
  }
  
  // 결제 진행
  proceedToPayment() {
    if (this.selectedItems.length === 0) {
      alert('주문할 메뉴를 선택해주세요.');
      return;
    }
    
    const totalPrice = this.selectedItems.reduce((sum, item) => {
      return sum + (item.totalPrice || (item.price * item.quantity));
    }, 0);
    const totalQuantity = this.selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    // 주문 확인 메시지 (메뉴와 가격만 표시)
    const orderSummary = this.selectedItems
      .map(item => {
        const itemTotal = item.totalPrice || (item.price * item.quantity);
        return `${item.name} x${item.quantity} - ₩${itemTotal.toLocaleString()}`;
      })
      .join('\n');
    
    const confirmMessage = `주문 내역:\n\n${orderSummary}\n\n총 결제 금액: ₩${totalPrice.toLocaleString()}\n\n결제하시겠습니까?`;
    
    if (confirm(confirmMessage)) {
      // 결제 완료 알림
      alert('결제되었습니다!\n주문해주셔서 감사합니다.');
      
      // 장바구니 비우기
      this.clearCart();
      
      console.log('결제 완료:', {
        items: this.selectedItems,
        totalPrice: totalPrice,
        totalQuantity: totalQuantity
      });
    }
  }
  
  // 이벤트 리스너 설정
  setupEventListeners() {
    // 메뉴 아이템 및 장바구니 관련 이벤트 (이벤트 위임 사용)
    this.container.addEventListener('click', (event) => {
      // 카테고리 탭 클릭
      const categoryTab = event.target.closest('.category-tab');
      if (categoryTab) {
        const categoryId = categoryTab.getAttribute('data-category');
        this.changeCategory(categoryId);
        return;
      }
      
      // 메뉴 아이템 클릭
      if (event.target.closest('.menu-item')) {
        const menuItem = event.target.closest('.menu-item');
        const menuId = menuItem.dataset.itemId; // data-item-id 속성 사용
        const categoryId = menuItem.dataset.category;
        
        // 해당 카테고리에서 메뉴 찾기
        const categoryItems = MenuData.getItemsByCategory(categoryId);
        const selectedMenu = categoryItems.find(item => item.id === menuId);
        
        if (selectedMenu) {
          this.selectMenuItem(selectedMenu);
        }
        return;
      }
      
      // 삭제 버튼 클릭
      if (event.target.classList.contains('remove-btn')) {
        const itemId = event.target.dataset.itemId; // 문자열 그대로 사용
        this.removeItem(itemId);
        return;
      }
      
      // 수량 조절 버튼 클릭
      if (event.target.classList.contains('quantity-btn')) {
        event.preventDefault();
        event.stopPropagation();
        
        const itemId = event.target.dataset.itemId;
        
        if (event.target.classList.contains('plus')) {
          this.increaseQuantity(itemId);
        } else if (event.target.classList.contains('minus')) {
          this.decreaseQuantity(itemId);
        }
        return;
      }
      
      // 전체 취소 버튼
      if (event.target.id === 'clear-cart-btn') {
        this.clearCart();
        return;
      }
      
      // 결제 진행 버튼
      if (event.target.id === 'proceed-payment-btn') {
        this.proceedToPayment();
        return;
      }
    });

    // 초기 장바구니 UI 설정
    this.updateCartUI();
  }
  
  // 현재 선택된 아이템들 반환
  getSelectedItems() {
    return [...this.selectedItems];
  }
  
  // 디버깅용 메서드들
  getCartStatus() {
    return {
      items: this.selectedItems,
      totalPrice: this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      totalQuantity: this.selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      itemCount: this.selectedItems.length
    };
  }

  // 장바구니 비어있는지 확인
  isEmpty() {
    return this.selectedItems.length === 0;
  }

  // 장바구니 가득 찼는지 확인
  isFull() {
    return this.selectedItems.length >= 20;
  }
}

// 전역 스코프에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  window.MenuRenderer = MenuRenderer;
}