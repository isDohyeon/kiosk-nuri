// 누리 메뉴 시스템
class NuriMenuSystem {
    constructor() {
        this.currentMainTab = 'menu';
        this.currentCategoryTab = 'coffee';
        this.cartItems = [];
        this.isCartExpanded = false;
        this.helpSystem = null;
        
        this.menuData = {
            coffee: [
                { id: 1, name: "아메리카노", price: 2500, image: "../../assets/images/menu/coffee/아메리카노.png" },
                { id: 2, name: "카페라떼", price: 3000, image: "../../assets/images/menu/coffee/카페라떼.png" },
                { id: 3, name: "바닐라라떼", price: 3500, image: "../../assets/images/menu/coffee/바닐라라떼.png" },
                { id: 4, name: "헤이즐넛라떼", price: 3000, image: "../../assets/images/menu/coffee/헤이즐넛라떼.png" },
                { id: 5, name: "초코라떼", price: 3500, image: "../../assets/images/menu/coffee/초코라떼.png" },
                { id: 6, name: "토피넛라떼", price: 3500, image: "../../assets/images/menu/coffee/토피넛라떼.png" },
                { id: 7, name: "돌체라떼", price: 4000, image: "../../assets/images/menu/coffee/돌체라떼.png" },
                { id: 8, name: "큐브라떼", price: 3500, image: "../../assets/images/menu/coffee/카라멜마끼아또.png" },
                { id: 9, name: "콜드브루라떼", price: 3000, image: "../../assets/images/menu/coffee/돌체라떼.png" },
                { id: 10, name: "카페모카", price: 3500, image: "../../assets/images/menu/coffee/카페모카.png" },
                { id: 11, name: "카푸치노", price: 3500, image: "../../assets/images/menu/coffee/카푸치노.png" },
                { id: 12, name: "콜드브루", price: 2500, image: "../../assets/images/menu/coffee/아메리카노.png" }
            ],
            tea: [
                { id: 21, name: "딸기주스", price: 4000, image: "../../assets/images/menu/tea/딸기주스.png" },
                { id: 22, name: "수박주스", price: 4000, image: "../../assets/images/menu/tea/수박주스.png" },
                { id: 23, name: "블루베리주스", price: 4000, image: "../../assets/images/menu/tea/블루베리주스.png" },
                { id: 24, name: "아이스티", price: 3500, image: "../../assets/images/menu/tea/아이스티.png" },
                { id: 25, name: "레몬에이드", price: 3500, image: "../../assets/images/menu/tea/레몬에이드.png" },
                { id: 26, name: "자몽에이드", price: 3500, image: "../../assets/images/menu/tea/자몽에이드.png" },
                { id: 27, name: "메실에이드", price: 4500, image: "../../assets/images/menu/tea/메실에이드.png" },
                { id: 28, name: "녹차", price: 3000, image: "../../assets/images/menu/tea/녹차.png" },
                { id: 29, name: "얼그레이", price: 3000, image: "../../assets/images/menu/tea/녹차.png" },
                { id: 30, name: "캐모마일", price: 3000, image: "../../assets/images/menu/tea/녹차.png" },
                { id: 31, name: "페퍼민트", price: 3000, image: "../../assets/images/menu/tea/녹차.png" },
                { id: 32, name: "유자차", price: 3000, image: "../../assets/images/menu/tea/유자차.png" }
            ],
            dessert: [
                { id: 44, name: "밀크티쿠키", price: 3500, image: "../../assets/images/menu/dessert/밀크티쿠키.png" },
                { id: 45, name: "몽쉘케이크", price: 2500, image: "../../assets/images/menu/dessert/몽쉘케이크.png" },
                { id: 46, name: "초코마카롱", price: 2000, image: "../../assets/images/menu/dessert/초코마카롱.png" },
                { id: 47, name: "프라페마카롱", price: 2000, image: "../../assets/images/menu/dessert/프라페마카롱.png" },
                { id: 48, name: "딸기마카롱", price: 2000, image: "../../assets/images/menu/dessert/딸기마카롱.png" },
                { id: 49, name: "감자빵", price: 2500, image: "../../assets/images/menu/dessert/감자빵.png" },
                { id: 50, name: "샌드위치", price: 3000, image: "../../assets/images/menu/dessert/샌드위치.png" },
                { id: 51, name: "초코멜로샌드", price: 3000, image: "../../assets/images/menu/dessert/초코멜로샌드.png" },
                { id: 52, name: "허니브레드", price: 4500, image: "../../assets/images/menu/dessert/허니브레드.png" }
            ]
        };

        // 장바구니 관리자 초기화
        this.cartManager = new CartManager(this.menuData);
        
        // Help System 초기화
        this.initializeHelpSystem();
        
        this.init();
    }

    init() {
        console.log('누리 메뉴 시스템 초기화 시작...');
        
        // 어느 페이지에서 돌아온 경우인지 확인
        const referrer = document.referrer;
        const isFromKnownPage = referrer.includes('option.html') || 
                               referrer.includes('discount.html') || 
                               referrer.includes('point.html') || 
                               referrer.includes('payment.html');
        
        // 옵션 페이지에서 뒤로가기 한 경우 감지
        const isFromOptionPage = referrer.includes('option.html');
        
        // 새 주문 시작인지 확인 (세션 스토리지 기반)
        const isNewOrder = !sessionStorage.getItem('orderInProgress');
        
        console.log('Referrer:', referrer);
        console.log('알려진 페이지에서 돌아온 경우:', isFromKnownPage);
        console.log('옵션 페이지에서 돌아온 경우:', isFromOptionPage);
        console.log('새 주문 시작:', isNewOrder);
        
        // 🔥 CRITICAL: 옵션 페이지에서 뒤로가기 한 경우만 처리
        if (isFromOptionPage) {
            const hasSelectedMenuItems = localStorage.getItem('selectedMenuItems');
            
            // selectedMenuItems가 있으면서 완료된 커피가 최근에 업데이트되지 않은 경우 = 뒤로가기
            if (hasSelectedMenuItems) {
                const completedCoffeesData = localStorage.getItem('completedCoffees');
                let isBackFromOption = true;
                
                if (completedCoffeesData) {
                    try {
                        const data = JSON.parse(completedCoffeesData);
                        const lastUpdated = new Date(data.lastUpdated || 0).getTime();
                        const now = Date.now();
                        // 5초 이내에 업데이트되었으면 정상 완료로 간주
                        if (now - lastUpdated < 5000) {
                            isBackFromOption = false;
                        }
                    } catch (e) {
                        console.warn('completedCoffees 파싱 실패');
                    }
                }
                
                if (isBackFromOption) {
                    console.log('⚠️ 옵션 페이지에서 뒤로가기 감지 - 선택했던 커피를 미완료 상태로 복원');
                    
                    // 1. 먼저 기존 미완료 커피들 복원
                    const tempIncompleteCoffeesData = localStorage.getItem('tempIncompleteCoffees');
                    if (tempIncompleteCoffeesData) {
                        try {
                            const tempData = JSON.parse(tempIncompleteCoffeesData);
                            const tempCoffees = tempData.items || [];
                            
                            tempCoffees.forEach(coffee => {
                                // 기존 미완료 커피들을 장바구니에 다시 추가
                                this.cartManager.items.push({
                                    ...coffee,
                                    addedTimestamp: coffee.addedTimestamp || Date.now()
                                });
                                console.log(`기존 미완료 커피 복원: ${coffee.name} x${coffee.quantity}`);
                            });
                            
                            // 임시 데이터 정리
                            localStorage.removeItem('tempIncompleteCoffees');
                            console.log('기존 미완료 커피들 복원 완료');
                        } catch (e) {
                            console.error('기존 미완료 커피 복원 중 오류:', e);
                        }
                    }
                    
                    // 2. 선택 중이던 커피를 미완료 상태로 추가 (뒤로가기 시)
                    try {
                        const selectedCoffees = JSON.parse(hasSelectedMenuItems);
                        
                        // 🔥 디버깅: 뒤로가기 복원 과정 로그
                        console.log('=== 뒤로가기 시 selectedMenuItems 복원 ===');
                        console.log('selectedMenuItems 데이터:', selectedCoffees);
                        
                        selectedCoffees.forEach(coffee => {
                            // 메뉴 데이터에서 해당 커피의 전체 정보 찾기
                            let fullCoffeeInfo = null;
                            for (const category in this.menuData) {
                                const foundCoffee = this.menuData[category].find(item => item.id === coffee.id);
                                if (foundCoffee) {
                                    fullCoffeeInfo = foundCoffee;
                                    break;
                                }
                            }
                            
                            if (fullCoffeeInfo) {
                                // 🔥 수정: selectedMenuItems의 수량은 이미 "기존 수량 + 새로 선택한 수량"의 전체 수량
                                // 따라서 뒤로가기 시에는 이 전체 수량을 그대로 복원해야 함
                                const existingCoffee = this.cartManager.items.find(item => 
                                    item.id === coffee.id && !item.isCompletedCoffee
                                );
                                
                                if (existingCoffee) {
                                    // 🔥 중요: 기존 수량을 selectedMenuItems의 전체 수량으로 설정
                                    const previousQuantity = existingCoffee.quantity;
                                    existingCoffee.quantity = coffee.quantity || 1; // 전체 수량으로 설정
                                    console.log(`기존 커피 수량 복원: ${fullCoffeeInfo.name} x${previousQuantity} → x${existingCoffee.quantity}`);
                                } else {
                                    // 새로운 커피라면 selectedMenuItems의 수량으로 미완료 상태로 추가
                                    this.cartManager.items.push({
                                        ...fullCoffeeInfo,
                                        quantity: coffee.quantity || 1, // 전체 수량으로 추가
                                        addedTimestamp: coffee.selectedTimestamp || Date.now(),
                                        isCompletedCoffee: false
                                    });
                                    console.log(`새로운 미완료 커피 추가: ${fullCoffeeInfo.name} x${coffee.quantity || 1}`);
                                }
                            }
                        });
                        
                        console.log('뒤로가기 복원 완료, 현재 장바구니:', this.cartManager.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
                        console.log('=======================================');
                        
                        // 복원된 상태 저장
                        this.cartManager.saveNonCoffeeItems();
                    } catch (e) {
                        console.error('선택된 커피 복원 중 오류:', e);
                    }
                    
                    // selectedMenuItems 정리
                    localStorage.removeItem('selectedMenuItems');
                } else {
                    console.log('✓ 옵션 페이지에서 정상 완료 감지');
                }
            }
        }
        
        // 새 주문이 아니고 알려진 페이지에서 돌아온 경우에만 데이터 유지
        const shouldKeepData = !isNewOrder && isFromKnownPage;
        
        // 주문 진행 중 플래그 설정
        if (isNewOrder) {
            sessionStorage.setItem('orderInProgress', 'true');
        }
        
        // 장바구니 초기화 (데이터 유지 여부에 따라)
        this.cartManager.initialize(shouldKeepData);
        this.cartItems = this.cartManager.getItems();
        
        // 초기화 시 기존 데이터 정리 (새 주문이거나 알 수 없는 페이지에서 온 경우)
        this.clearPreviousSessionData(shouldKeepData);
        
        this.initializeNavigationButtons();
        this.setupEventListeners();
        this.renderMenu();
        
        // 장바구니 렌더링 및 이벤트 설정
        this.renderCart();
        this.setupCartEventListeners();
        this.updateTabStates();
        
        console.log('누리 메뉴 시스템 초기화 완료!');
        
        // 첫 세션 감지 및 도움말 표시
        this.checkFirstSession();
    }

    initializeNavigationButtons() {
        // NavigationButtons 컴포넌트 초기화 (누리 스타일)
        if (typeof NavigationButtons !== 'undefined') {
            this.navButtons = new NavigationButtons({
                container: '.nav-buttons.nuri-style',
                style: 'nuri',
                onBackClick: () => this.goBack(),
                onHomeClick: () => this.goHome()
            });
            console.log('NavigationButtons (누리 스타일) 초기화 완료');
        } else {
            console.warn('NavigationButtons 클래스를 찾을 수 없습니다.');
        }
    }

    setupEventListeners() {
        console.log('이벤트 리스너 설정 시작...');
        
        // 안전한 이벤트 리스너 추가 헬퍼 함수
        const addSafeEventListener = (selector, event, handler, description) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener(event, handler);
                console.log(`✓ ${description} 이벤트 리스너 등록됨: ${selector}`);
            } else {
                console.warn(`⚠ ${description} 요소를 찾을 수 없음: ${selector}`);
            }
        };

        // 메인 탭 이벤트
        addSafeEventListener('.text-wrapper', 'click', () => this.switchMainTab('menu'), '메뉴 탭');
        addSafeEventListener('.text-wrapper-2', 'click', () => this.switchMainTab('option'), '옵션 탭');
        addSafeEventListener('.text-wrapper-3', 'click', () => this.switchMainTab('benefit'), '혜택 탭');
        addSafeEventListener('.text-wrapper-4', 'click', () => this.switchMainTab('payment'), '계산 탭');
        addSafeEventListener('.text-wrapper-5', 'click', () => this.switchMainTab('point'), '적립 탭');

        // 카테고리 탭 이벤트
        addSafeEventListener('.text-wrapper-6', 'click', () => this.switchCategoryTab('coffee'), '커피 카테고리');
        addSafeEventListener('.text-wrapper-7', 'click', () => this.switchCategoryTab('tea'), '음료 카테고리');
        addSafeEventListener('.text-wrapper-8', 'click', () => this.switchCategoryTab('dessert'), '디저트 카테고리');

        // 네비게이션 버튼은 이제 NavigationButtons 컴포넌트에서 처리됩니다

        // 장바구니 토글 이벤트 (vector 요소가 없으므로 주석 처리)
        // addSafeEventListener('.vector', 'click', () => this.toggleCart(), '장바구니 토글');

        // 하단 버튼 이벤트
        addSafeEventListener('.text-wrapper-34', 'click', () => this.finishOrder(), '다 골랐어요 버튼');
        addSafeEventListener('.text-wrapper-35', 'click', () => this.requestHelp(), '도움이 필요해요 버튼');
        
        console.log('이벤트 리스너 설정 완료!');
    }

    switchMainTab(tab) {
        if (tab === 'menu') {
            this.currentMainTab = tab;
            this.updateTabStates();
            this.renderMenu();
        } else {
            // 다른 탭들은 해당 페이지로 이동
            console.log(`${tab} 탭으로 이동`);
        }
    }

    switchCategoryTab(category) {
        this.currentCategoryTab = category;
        this.updateTabStates();
        this.renderMenu();
    }

    updateTabStates() {
        console.log('탭 상태 업데이트 시작...');
        
        // 메인 탭 상태 업데이트
        const mainTabs = [
            { element: '.rectangle-7', tab: 'menu' },
            { element: '.rectangle-6', tab: 'option' },
            { element: '.rectangle-5', tab: 'benefit' },
            { element: '.rectangle-4', tab: 'payment' },
            { element: '.rectangle-3', tab: 'point' }
        ];

        mainTabs.forEach(({ element, tab }) => {
            const el = document.querySelector(element);
            if (el) {
                if (tab === this.currentMainTab) {
                    el.classList.add('active-main');
                } else {
                    el.classList.remove('active-main');
                }
            } else {
                console.warn(`메인 탭 요소를 찾을 수 없음: ${element}`);
            }
        });

        // 카테고리 탭 상태 업데이트
        const categoryTabs = [
            { element: '.rectangle', category: 'coffee', textElement: '.text-wrapper-6' },
            { element: '.div', category: 'tea', textElement: '.text-wrapper-7' },
            { element: '.rectangle-2', category: 'dessert', textElement: '.text-wrapper-8' }
        ];

        categoryTabs.forEach(({ element, category, textElement }) => {
            const el = document.querySelector(element);
            const textEl = document.querySelector(textElement);
            
            if (el && textEl) {
                if (category === this.currentCategoryTab) {
                    el.classList.add('active-category');
                    textEl.style.color = '#ffffff';
                } else {
                    el.classList.remove('active-category');
                    textEl.style.color = '#7e7e87';
                }
            } else {
                console.warn(`카테고리 탭 요소를 찾을 수 없음: ${element} 또는 ${textElement}`);
            }
        });
        
        console.log('탭 상태 업데이트 완료!');
    }

    renderMenu() {
        console.log(`메뉴 렌더링 시작... 카테고리: ${this.currentCategoryTab}`);
        const menuContainer = document.getElementById('menuContainer');
        
        if (!menuContainer) {
            console.error('메뉴 컨테이너를 찾을 수 없습니다!');
                return;
            }
            
        const currentMenuData = this.menuData[this.currentCategoryTab] || [];
        console.log(`현재 카테고리 메뉴 수: ${currentMenuData.length}`);

        menuContainer.innerHTML = '';

        currentMenuData.forEach(item => {
            const menuItemElement = this.createMenuItemElement(item);
            menuContainer.appendChild(menuItemElement);
        });
        
        console.log('메뉴 렌더링 완료!');
    }

    createMenuItemElement(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.id = item.id;
        
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='../../assets/images/menu/placeholder.png'">
            <div class="menu-name">${item.name}</div>
            <div class="menu-price">₩${item.price.toLocaleString()}</div>
        `;

        menuItem.addEventListener('click', () => this.addToCart(item));

        return menuItem;
    }

    addToCart(item) {
        console.log(`${item.name} (₩${item.price.toLocaleString()}) 선택됨`);
        
        // 커피인지 확인
        if (this.cartManager.isCoffeeItem(item.id)) {
            // 커피는 옵션 선택 화면으로 이동 (장바구니에 실제 추가하지 않음)
            this.cartManager.saveForOptions(item);
            
            // 🔥 수정: 커피는 옵션 선택 완료 후에만 장바구니에 추가되므로
            // 여기서는 장바구니 렌더링을 하지 않음
            this.cartItems = this.cartManager.getItems();
            this.renderCart(); // 기존 미완료 커피가 제거된 상태로 렌더링
            
            window.location.href = '../option/option.html';
            return;
        }
        
        // 커피가 아닌 아이템은 바로 장바구니에 추가
        const success = this.cartManager.addItem(item);
        if (success) {
            this.cartItems = this.cartManager.getItems();
            this.renderCart();
            this.showCartAnimation();
        } else {
            alert('장바구니가 가득 찼습니다. (최대 20개 메뉴)');
        }
    }

    // 수량 증가
    increaseQuantity(itemId) {
        console.log('=== Plus 버튼 클릭 디버깅 ===');
        console.log('증가 전 장바구니 상태:', this.cartManager.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
        
        this.cartManager.increaseQuantity(parseInt(itemId));
        this.cartItems = this.cartManager.getItems();
        
        console.log('증가 후 장바구니 상태:', this.cartManager.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
        console.log('================================');
        
        this.updateQuantityDisplayOnly(parseInt(itemId), this.cartManager.getItemQuantity(parseInt(itemId)));
    }

    // 수량 감소
    decreaseQuantity(itemId) {
        const removed = this.cartManager.decreaseQuantity(parseInt(itemId));
        this.cartItems = this.cartManager.getItems();
        
        if (removed) {
            // 아이템이 제거된 경우 전체 재렌더링
            this.renderCart();
        } else {
            // 수량만 변경된 경우 표시만 업데이트
            this.updateQuantityDisplayOnly(parseInt(itemId), this.cartManager.getItemQuantity(parseInt(itemId)));
        }
    }

    // 아이템 제거
    removeFromCart(itemId) {
        this.cartManager.removeItem(parseInt(itemId));
        this.cartItems = this.cartManager.getItems();
        this.renderCart();
    }

    // 수량 표시만 업데이트 (이벤트 리스너 재설정 없음)
    updateQuantityDisplayOnly(itemId, quantity) {
        const cartContainer = document.getElementById('cartItemsContainer');
        const itemElement = cartContainer.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            const quantityDisplay = itemElement.querySelector('.quantity-display');
            if (quantityDisplay) {
                quantityDisplay.textContent = quantity;
                console.log(`수량 표시 업데이트 완료: ${itemId} -> ${quantity}`);
            }
        }
    }

    renderCart() {
        console.log('장바구니 렌더링 시작...', `아이템 수: ${this.cartItems.length}`);
        const cartContainer = document.getElementById('cartItemsContainer');
        
        if (!cartContainer) {
            console.error('장바구니 컨테이너를 찾을 수 없습니다!');
            return;
        }
        
        cartContainer.innerHTML = '';

        if (this.cartItems.length === 0) {
            // 빈 장바구니일 때 1개의 빈 슬롯만 표시
            const slot = document.createElement('div');
            slot.className = 'cart-item empty';
            slot.innerHTML = `
                <div class="cart-item-content">
                    <div class="empty-slot"></div>
                    <div class="slot-number">1</div>
                </div>
            `;
            cartContainer.appendChild(slot);
            console.log('빈 슬롯 1개 생성');
        } else {
            // 실제 아이템들만 렌더링 (최대 20개)
            this.cartItems.forEach((cartItem, index) => {
                const displayName = cartItem.displayName || cartItem.name;
                console.log(`슬롯 ${index + 1}: 아이템 있음 - ${displayName}`);
                const slot = document.createElement('div');
                slot.className = 'cart-item';
                slot.dataset.id = cartItem.id;
                slot.innerHTML = `
                    <div class="cart-item-content">
                        <button class="remove-btn" data-item-id="${cartItem.id}">×</button>
                        <img src="${cartItem.image}" alt="${displayName}" onerror="this.src='../../assets/images/menu/placeholder.png'">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-item-id="${cartItem.id}">-</button>
                            <div class="quantity-display">${cartItem.quantity}</div>
                            <button class="quantity-btn plus" data-item-id="${cartItem.id}">+</button>
                        </div>
                    </div>
                `;
                cartContainer.appendChild(slot);
            });
        }

        console.log('장바구니 렌더링 완료, DOM 요소 개수:', cartContainer.children.length);

        // DOM이 변경되었으므로 이벤트 리스너 재설정
        this.setupCartEventListeners();
    }

    setupCartEventListeners() {
        const cartContainer = document.getElementById('cartItemsContainer');
        
        if (!cartContainer) {
            console.error('장바구니 컨테이너를 찾을 수 없습니다!');
            return;
        }
        
        console.log('장바구니 이벤트 리스너 설정 중...');
        
        // 기존 이벤트 리스너가 있다면 제거
        if (this.cartEventHandler) {
            cartContainer.removeEventListener('click', this.cartEventHandler);
        }
        
        // 새로운 이벤트 핸들러 생성
        this.cartEventHandler = (event) => {
            // 삭제 버튼 클릭
            if (event.target.classList.contains('remove-btn')) {
                event.preventDefault();
                event.stopPropagation();
                this.removeFromCart(event.target.dataset.itemId);
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
        };
        
        // 이벤트 리스너 등록
        cartContainer.addEventListener('click', this.cartEventHandler);
        console.log('장바구니 이벤트 리스너 등록 완료');
    }

    showCartAnimation() {
        // 장바구니 추가 애니메이션 효과
        const cartArea = document.getElementById('cartArea');
        if (cartArea) {
            cartArea.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                cartArea.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    toggleCart() {
        // 장바구니 토글 기능 (필요시 구현)
        console.log('장바구니 토글');
    }

    goBack() {
        // 뒤로가기 기능
        window.history.back();
    }

    goHome() {
        // 처음으로 가기 - 모든 주문 데이터 정리
        console.log('처음으로 돌아가기 - 모든 데이터 정리');
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        localStorage.removeItem('finalOrderWithPoint');
        localStorage.removeItem('coffeeOptions');
        localStorage.removeItem('nonCoffeeItems');
        
        // 세션 스토리지도 정리
        sessionStorage.removeItem('orderInProgress');
        
        window.location.href = '../../index.html';
    }

    clearPreviousSessionData(shouldKeepData) {
        // 페이지 새로고침이나 새 접속 시 이전 주문 데이터 정리
        console.log('이전 주문 데이터 정리 중...');
        
        if (!shouldKeepData) {
            // 새 주문 시작 - 모든 데이터 정리
            console.log('새 주문 시작 - 이전 데이터 정리');
            localStorage.removeItem('completedCoffees');
            localStorage.removeItem('selectedMenuItems');
            localStorage.removeItem('coffeeOptions');
            localStorage.removeItem('finalOrder');
            localStorage.removeItem('nonCoffeeItems');
            localStorage.removeItem('tempIncompleteCoffees'); // 임시 커피 데이터도 정리
        }
    }

    finishOrder() {
        if (this.cartItems.length === 0) {
            alert('장바구니에 상품을 추가해주세요.');
            return;
        }

        // 미완료 커피가 있는지 확인
        const hasIncompleteCoffee = this.cartManager.hasIncompleteCoffee();
        if (hasIncompleteCoffee) {
            alert('아직 옵션을 선택하지 않은 커피가 있습니다. 모든 커피의 옵션을 선택해주세요.');
            return;
        }

        // 최종 주문 정보 저장 및 혜택 페이지로 이동
        this.cartManager.saveFinalOrder();
        this.goToBenefitStep();
    }

    requestHelp() {
        console.log('도움말 시스템 활성화');
        
        if (this.helpSystem) {
            // 기존에 표시된 모든 도움말 제거 (특히 helpButton 도움말)
            this.helpSystem.hideHelp('helpButton');
            this.helpSystem.hideHelp();
            
            // 새로운 도움말들 표시 (계속 유지됨)
            setTimeout(() => {
                this.helpSystem.showHelp('finishButton');
                this.helpSystem.showHelp('categoryTabs');
            }, 100);
        }
    }

    goToBenefitStep() {
        console.log('할인 단계로 이동 중...');
        
        // 최종 주문 정보 로그
        const finalOrder = localStorage.getItem('finalOrder');
        if (finalOrder) {
            const orderData = JSON.parse(finalOrder);
            console.log('주문 정보:', orderData);
            
            if (orderData.items && orderData.items.length > 0) {
                orderData.items.forEach(item => {
                    const itemName = item.displayName || item.name;
                    console.log(`- ${itemName} x${item.quantity} = ₩${(item.price * item.quantity).toLocaleString()}`);
                });
                console.log(`총 금액: ₩${orderData.totalAmount.toLocaleString()}`);
            }
        }
        
        // 할인 페이지로 이동
        window.location.href = '../discount/discount.html';
    }

    initializeHelpSystem() {
        if (typeof HelpSystem !== 'undefined') {
            this.helpSystem = new HelpSystem({
                arrowColor: '#54d761',
                highlightColor: '#54d761'
            });
            
            // "도움이 필요해요" 버튼에 대한 도움말 타겟 등록 (첫 세션용)
            this.helpSystem.registerTarget('helpButton', {
                selector: '.text-wrapper-35',
                type: 'bottom',
                message: '현재 화면에서 도움이 필요하면 눌러주세요!',
                textPosition: 'right',
                offsetY: -200,
                offsetX: 100
            });

            // "다 골랐어요" 버튼에 대한 도움말 타겟 등록
            this.helpSystem.registerTarget('finishButton', {
                selector: '.text-wrapper-34',
                type: 'bottom',
                message: '메뉴 선택이 끝나면 다 골랐어요 버튼을 눌러주세요!',
                textPosition: 'left',
                offsetY: -200,
                offsetX: -420
            });

            // 카테고리 탭에 대한 도움말 타겟 등록
            this.helpSystem.registerTarget('categoryTabs', {
                selector: '.rectangle.active-category',
                type: 'top',
                message: '여기서 메뉴의 종류를 선택할 수 있어요!',
                textPosition: 'right',
                offsetY: 190
            });
            
            console.log('Help System 초기화 완료');
        } else {
            console.warn('HelpSystem 클래스를 찾을 수 없습니다.');
        }
    }

    checkFirstSession() {
        // 첫 세션인지 확인 (nuri-menu-visited 키 사용)
        const hasVisitedBefore = localStorage.getItem('nuri-menu-visited');
        
        if (!hasVisitedBefore) {
            console.log('첫 세션 감지됨 - 도움말 표시');
            
            // 페이지 요소들이 완전히 로드된 후 도움말 표시
            setTimeout(() => {
                if (this.helpSystem) {
                    this.helpSystem.showHelp('helpButton');
                    
                    // 10초 후 자동으로 도움말 숨기기
                    setTimeout(() => {
                        this.helpSystem.hideHelp('helpButton');
                    }, 60000);
                }
            }, 100);
            
            // 방문 기록 저장
            localStorage.setItem('nuri-menu-visited', 'true');
        } else {
            console.log('재방문 세션 - 도움말 표시하지 않음');
        }
    }
}

// 장바구니 관리 클래스
class CartManager {
    constructor(menuData) {
        this.menuData = menuData;
        this.items = [];
        this.maxItems = 20; // 최대 아이템 수
    }

    // 장바구니 초기화
    initialize(shouldKeepData) {
        console.log('=== CartManager 초기화 시작 ===');
        console.log('데이터 유지 여부:', shouldKeepData);
        
        if (!shouldKeepData) {
            // 새로운 세션이면 장바구니 초기화
            this.items = [];
            console.log('새 세션 - 장바구니 초기화');
        } else {
            // 데이터를 유지해야 하는 경우 기존 데이터 로드
            console.log('기존 장바구니 데이터 유지 및 로드');
            console.log('로드 전 장바구니 아이템 수:', this.items.length);
            
            this.loadCompletedCoffees();
            console.log('완료된 커피 로드 후 아이템 수:', this.items.length);
            
            this.loadNonCoffeeItems();
            console.log('비커피 아이템 로드 후 아이템 수:', this.items.length);
            
            // 모든 아이템을 추가된 시간순으로 정렬
            this.sortItemsByAddedTime();
        }
        
        console.log('=== CartManager 초기화 완료 ===');
        console.log('최종 장바구니 아이템 수:', this.items.length);
        console.log('아이템 목록:', this.items.map(item => `${item.displayName || item.name} (완료된커피: ${!!item.isCompletedCoffee})`));
    }

    // 커피 아이템인지 확인
    isCoffeeItem(itemId) {
        return this.menuData.coffee.some(coffeeItem => coffeeItem.id === itemId);
    }

    // 아이템 추가
    addItem(item) {
        // 장바구니 용량 확인
        if (this.items.length >= this.maxItems) {
            return false;
        }

        // 기존 아이템 확인
        const existingItemIndex = this.items.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
            // 기존 아이템 수량 증가
            this.items[existingItemIndex].quantity += 1;
        } else {
            // 새 아이템 추가 (타임스탬프 포함)
            this.items.push({ 
                ...item, 
                quantity: 1,
                addedTimestamp: Date.now() // 추가된 시간 기록
            });
        }
        
        // 비커피 아이템들 저장
        this.saveNonCoffeeItems();
        return true;
    }

    // 수량 증가
    increaseQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity += 1;
            console.log(`${item.displayName || item.name} 수량 증가: ${item.quantity}`);
            
            // 완료된 커피인 경우 localStorage도 업데이트
            if (item.isCompletedCoffee) {
                this.updateCompletedCoffeeQuantity(item, item.quantity);
            } else {
                // 비커피 아이템인 경우만 saveNonCoffeeItems 호출
                this.saveNonCoffeeItems();
            }
        }
    }

    // 수량 감소
    decreaseQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                console.log(`${item.displayName || item.name} 수량 감소: ${item.quantity}`);
                
                // 완료된 커피인 경우 localStorage도 업데이트
                if (item.isCompletedCoffee) {
                    this.updateCompletedCoffeeQuantity(item, item.quantity);
                } else {
                    // 비커피 아이템인 경우만 saveNonCoffeeItems 호출
                    this.saveNonCoffeeItems();
                }
                return false; // 아이템이 제거되지 않음
            } else {
                // 수량이 1일 때는 아이템 제거
                this.removeItem(itemId);
                return true; // 아이템이 제거됨
            }
        }
        return false;
    }

    // 아이템 제거
    removeItem(itemId) {
        // 삭제될 아이템 정보 확인
        const itemToRemove = this.items.find(item => item.id === itemId);
        if (!itemToRemove) {
            console.warn('삭제할 아이템을 찾을 수 없음:', itemId);
            return;
        }

        const beforeLength = this.items.length;
        
        // 완료된 커피인 경우 localStorage에서도 제거
        if (itemToRemove.isCompletedCoffee) {
            console.log('완료된 커피 삭제:', itemToRemove.displayName || itemToRemove.name);
            this.removeCompletedCoffeeFromStorage(itemToRemove);
        }
        
        // 메모리에서 아이템 제거
        this.items = this.items.filter(item => item.id !== itemId);
        const afterLength = this.items.length;
        
        if (beforeLength > afterLength) {
            // 비커피 아이템들 저장 (완료된 커피가 아닌 경우에만)
            if (!itemToRemove.isCompletedCoffee) {
                this.saveNonCoffeeItems();
            }
            console.log(`아이템 제거 완료: ${beforeLength} -> ${afterLength}`);
        }
    }

    // localStorage에서 완료된 커피 제거
    removeCompletedCoffeeFromStorage(itemToRemove) {
        const completedCoffeesData = localStorage.getItem('completedCoffees');
        
        if (completedCoffeesData) {
            try {
                const data = JSON.parse(completedCoffeesData);
                const completedItems = data.items || [];
                
                // 삭제될 커피와 일치하는 항목 찾기
                const filteredItems = completedItems.filter(coffee => {
                    // 고유 ID가 있으면 우선 사용
                    if (itemToRemove.uniqueId && coffee.uniqueId) {
                        return coffee.uniqueId !== itemToRemove.uniqueId;
                    }
                    
                    // 고유 ID가 없으면 기존 방식으로 비교
                    if (coffee.id !== itemToRemove.id) {
                        return true; // 다른 ID면 유지
                    }
                    
                    // 같은 ID인 경우 옵션도 비교
                    const coffeeOptionsStr = JSON.stringify(coffee.options || {});
                    const itemOptionsStr = JSON.stringify(itemToRemove.options || {});
                    
                    // 옵션이 다르면 유지
                    return coffeeOptionsStr !== itemOptionsStr;
                });
                
                const removedCount = completedItems.length - filteredItems.length;
                
                if (removedCount > 0) {
                    // 변경된 데이터 저장
                    if (filteredItems.length > 0) {
                        localStorage.setItem('completedCoffees', JSON.stringify({
                            items: filteredItems,
                            lastUpdated: new Date().toISOString()
                        }));
                    } else {
                        // 완료된 커피가 모두 삭제된 경우
                        localStorage.removeItem('completedCoffees');
                    }
                    
                    console.log(`✓ localStorage에서 완료된 커피 제거: ${itemToRemove.displayName || itemToRemove.name}`);
                    console.log(`제거된 커피 수: ${removedCount}, 남은 커피 수: ${filteredItems.length}`);
                } else {
                    console.warn('localStorage에서 일치하는 완료된 커피를 찾을 수 없음:', itemToRemove.displayName || itemToRemove.name);
                }
                
            } catch (error) {
                console.error('완료된 커피 제거 중 오류:', error);
                localStorage.removeItem('completedCoffees');
            }
        }
    }

    // 특정 아이템의 수량 조회
    getItemQuantity(itemId) {
        const item = this.items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    }

    // 장바구니 아이템 목록 반환
    getItems() {
        return [...this.items]; // 복사본 반환
    }

    // 아이템들을 추가된 시간순으로 정렬
    sortItemsByAddedTime() {
        this.items.sort((a, b) => {
            const timeA = a.addedTimestamp || 0;
            const timeB = b.addedTimestamp || 0;
            return timeA - timeB; // 오래된 것부터 정렬 (먼저 담은 순서)
        });
        
        console.log('아이템 시간순 정렬 완료:');
        this.items.forEach((item, index) => {
            const time = item.addedTimestamp ? new Date(item.addedTimestamp).toLocaleTimeString() : '시간 없음';
            console.log(`${index + 1}. ${item.displayName || item.name} - ${time}`);
        });
    }

    // 옵션 선택을 위한 커피 저장
    saveForOptions(item) {
        console.log(`${item.name} 옵션 선택을 위해 저장`);
        
        // 🔥 중요: 커피 선택 시 장바구니에 실제로 추가하지 않음
        // 옵션 선택 완료 후에만 실제 장바구니에 추가됨
        
        // 현재 장바구니에서 동일한 커피(완료되지 않은)가 있는지 확인
        const existingCoffee = this.items.find(cartItem => 
            cartItem.id === item.id && !cartItem.isCompletedCoffee
        );
        
        // 🔥 디버깅: 현재 장바구니 상태 로그
        console.log('=== saveForOptions 디버깅 ===');
        console.log('현재 장바구니 아이템들:', this.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
        console.log('선택된 커피 ID:', item.id, '이름:', item.name);
        if (existingCoffee) {
            console.log('기존 동일 커피 발견:', existingCoffee.name, 'x', existingCoffee.quantity);
        }
        
        // 기존 미완료 커피들 정보 보존 (옵션 선택 취소 시 복원용)
        const existingIncompleteCoffees = this.items.filter(cartItem => 
            this.isCoffeeItem(cartItem.id) && !cartItem.isCompletedCoffee
        );
        
        // 🔥 디버깅: 임시 저장될 커피들 로그
        console.log('tempIncompleteCoffees에 저장될 커피들:', existingIncompleteCoffees.map(c => `${c.name} x${c.quantity}`));
        
        // 기존 미완료 커피들이 있다면 임시 저장
        if (existingIncompleteCoffees.length > 0) {
            localStorage.setItem('tempIncompleteCoffees', JSON.stringify({
                items: existingIncompleteCoffees,
                timestamp: Date.now()
            }));
            console.log('기존 미완료 커피들 임시 저장:', existingIncompleteCoffees.map(c => `${c.name} x${c.quantity}`));
        }
        
        let quantityToSave = 1;
        if (existingCoffee) {
            // 기존 미완료 커피가 있으면 그 수량 + 1로 계산
            quantityToSave = existingCoffee.quantity + 1;
            console.log(`기존 미완료 커피 발견: ${item.name} x${existingCoffee.quantity} -> 옵션 선택을 위해 ${quantityToSave}개로 설정`);
        }
        
        // 모든 미완료 커피들을 장바구니에서 제거 (옵션 선택 완료 후 복원됨)
        this.items = this.items.filter(cartItem => 
            !(this.isCoffeeItem(cartItem.id) && !cartItem.isCompletedCoffee)
        );
        console.log(`모든 미완료 커피 임시 제거 완료`);
        
        // 🔥 추가: 기존 nonCoffeeItems에서도 미완료 커피 데이터 정리
        // (Plus 버튼으로 증가시킨 커피 수량 데이터가 남아있을 수 있음)
        const existingNonCoffeeItems = localStorage.getItem('nonCoffeeItems');
        if (existingNonCoffeeItems) {
            try {
                const existingData = JSON.parse(existingNonCoffeeItems);
                const cleanedData = existingData.filter(item => 
                    !this.isCoffeeItem(item.id) // 커피가 아닌 아이템들만 유지
                );
                
                if (cleanedData.length !== existingData.length) {
                    // 미완료 커피 데이터가 제거되었으면 업데이트
                    if (cleanedData.length > 0) {
                        localStorage.setItem('nonCoffeeItems', JSON.stringify(cleanedData));
                    } else {
                        localStorage.removeItem('nonCoffeeItems');
                    }
                    console.log('기존 nonCoffeeItems에서 미완료 커피 데이터 정리 완료');
                }
            } catch (e) {
                console.error('nonCoffeeItems 정리 중 오류:', e);
            }
        }
        
        // 선택된 커피를 옵션 페이지로 전달 (선택 시간 기록)
        const selectedCoffee = [{
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: quantityToSave, // 계산된 수량 사용
            selectedTimestamp: Date.now() // 커피 선택 시간 기록
        }];
        
        localStorage.setItem('selectedMenuItems', JSON.stringify(selectedCoffee));
        console.log(`커피 아이템 옵션 선택을 위해 저장: ${item.name} x${quantityToSave}`);
        console.log('================================');
        
        // 현재 장바구니 상태 저장 (미완료 커피 제거된 상태, 비커피 아이템들만)
        this.saveNonCoffeeItems();
    }

    // 완료된 커피들 로드
    loadCompletedCoffees() {
        const completedCoffeesData = localStorage.getItem('completedCoffees');
        
        if (completedCoffeesData) {
            try {
                const data = JSON.parse(completedCoffeesData);
                const completedItems = data.items || [];
                
                console.log('완료된 커피들 로드 시작:', completedItems.length, '개');
                
                // 🔥 중요: 완료된 커피를 로드하기 전에 기존 미완료 커피들을 먼저 복원
                const tempIncompleteCoffeesData = localStorage.getItem('tempIncompleteCoffees');
                if (tempIncompleteCoffeesData) {
                    try {
                        const tempData = JSON.parse(tempIncompleteCoffeesData);
                        const tempCoffees = tempData.items || [];
                        
                        console.log('=== 옵션 완료 후 tempIncompleteCoffees 복원 ===');
                        console.log('복원할 미완료 커피들:', tempCoffees.map(c => `${c.name} x${c.quantity}`));
                        console.log('옵션 선택 완료 후 기존 미완료 커피들 복원 시작:', tempCoffees.length, '개');
                        
                        tempCoffees.forEach(coffee => {
                            // 기존 미완료 커피들을 장바구니에 다시 추가
                            this.items.push({
                                ...coffee,
                                addedTimestamp: coffee.addedTimestamp || Date.now()
                            });
                            console.log(`기존 미완료 커피 복원: ${coffee.name} x${coffee.quantity}`);
                        });
                        
                        console.log('복원 후 현재 장바구니:', this.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
                        
                        // 임시 데이터 정리
                        localStorage.removeItem('tempIncompleteCoffees');
                        console.log('기존 미완료 커피들 복원 완료');
                        console.log('==========================================');
                    } catch (e) {
                        console.error('기존 미완료 커피 복원 중 오류:', e);
                        localStorage.removeItem('tempIncompleteCoffees'); // 오류 발생 시 정리
                    }
                }
                
                // 완료된 커피들을 장바구니에 추가
                completedItems.forEach(coffee => {
                    const coffeeKey = `${coffee.id}_${JSON.stringify(coffee.options || {})}`;
                    
                    // 중복 확인 - 동일한 커피 + 옵션 조합이 이미 있는지 확인
                    let existingCompletedItem = null;
                    const existingIndex = this.items.findIndex(item => {
                        // 고유 ID가 있으면 우선 사용
                        if (coffee.uniqueId && item.uniqueId) {
                            if (coffee.uniqueId === item.uniqueId) {
                                existingCompletedItem = item;
                                return true;
                            }
                        }
                        
                        // 고유 ID가 없으면 기존 방식으로 비교
                        if (item.id === coffee.id && item.isCompletedCoffee) {
                            const itemOptionsStr = JSON.stringify(item.options || {});
                            const coffeeOptionsStr = JSON.stringify(coffee.options || {});
                            if (itemOptionsStr === coffeeOptionsStr) {
                                existingCompletedItem = item;
                                return true;
                            }
                        }
                        return false;
                    });
                    
                    if (existingCompletedItem) {
                        // 기존 완료된 커피가 있으면 수량 합치기
                        const previousQuantity = existingCompletedItem.quantity;
                        const newQuantity = coffee.quantity || 1;
                        existingCompletedItem.quantity = previousQuantity + newQuantity;
                        
                        console.log(`✓ 기존 완료된 커피와 수량 합치기: ${existingCompletedItem.displayName || existingCompletedItem.name} x${previousQuantity} + x${newQuantity} = x${existingCompletedItem.quantity}`);
                    } else {
                        // 새로운 완료된 커피 추가
                        const displayName = this.createCoffeeDisplayName(coffee);
                        
                        this.items.push({
                            id: coffee.id,
                            name: coffee.name,
                            displayName: displayName,
                            price: coffee.finalPrice || coffee.price, // 옵션으로 증가된 최종 가격 사용
                            basePrice: coffee.basePrice || coffee.price, // 기본 가격 보존
                            priceIncrease: coffee.priceIncrease || 0, // 가격 증가 정보 보존
                            image: coffee.image,
                            quantity: coffee.quantity || 1,
                            options: coffee.options,
                            isCompletedCoffee: true,
                            coffeeKey: coffeeKey,
                            uniqueId: coffee.uniqueId, // 고유 ID 보존
                            addedTimestamp: new Date(coffee.selectedTimestamp || coffee.completedAt || coffee.addedTimestamp || Date.now()).getTime()
                        });
                        
                        console.log(`✓ 완료된 커피 추가: ${displayName} x${coffee.quantity || 1}`);
                    }
                });
                
                console.log('완료된 커피들 로드 완료, 현재 장바구니 총 아이템 수:', this.items.length);
                
            } catch (error) {
                console.error('완료된 커피 데이터 파싱 오류:', error);
                localStorage.removeItem('completedCoffees');
            }
        }
    }

    // 커피 표시명 생성
    createCoffeeDisplayName(coffee) {
        let displayName = coffee.name;
        
        if (coffee.options) {
            let optionText = '';
            
            if (coffee.options.temperature) {
                const tempText = coffee.options.temperature === 'hot' ? '뜨겁게' : 
                               coffee.options.temperature === 'cold' ? '차갑게' : '';
                optionText += tempText;
            }
            
            if (coffee.options.strength) {
                const strengthText = coffee.options.strength === 'strong' ? '진하게' :
                                   coffee.options.strength === 'light' ? '연하게' :
                                   coffee.options.strength === 'sweet' ? '더 달게' : '';
                if (optionText && strengthText) optionText += ', ';
                optionText += strengthText;
            }
            
            if (optionText) {
                displayName += ` (${optionText})`;
            }
        }
        
        return displayName;
    }

    // 비커피 아이템들과 미완료 커피 아이템들 로드
    loadNonCoffeeItems() {
        const nonCoffeeItemsData = localStorage.getItem('nonCoffeeItems');
        
        if (nonCoffeeItemsData) {
            try {
                const savedItems = JSON.parse(nonCoffeeItemsData);
                console.log('=== loadNonCoffeeItems 시작 ===');
                console.log('nonCoffeeItems에서 로드할 아이템들:', savedItems.map(item => `${item.name} x${item.quantity}`));
                
                savedItems.forEach(item => {
                    // 🔥 중요: 커피 아이템은 완전히 무시 (tempIncompleteCoffees에서만 복원)
                    if (this.isCoffeeItem(item.id)) {
                        console.log(`⚠️ 커피 아이템 무시: ${item.name} x${item.quantity} (tempIncompleteCoffees에서 처리됨)`);
                        return; // 커피는 건너뛰기
                    }
                    
                    // 비커피 아이템만 처리
                    const existingItemIndex = this.items.findIndex(cartItem => 
                        cartItem.id === item.id && !cartItem.isCompletedCoffee
                    );
                    
                    if (existingItemIndex !== -1) {
                        // 기존 비커피 아이템 수량 업데이트
                        const existingItem = this.items[existingItemIndex];
                        existingItem.quantity = item.quantity;
                        existingItem.addedTimestamp = item.addedTimestamp || existingItem.addedTimestamp || Date.now();
                        console.log(`비커피 아이템 수량 업데이트: ${item.name} x${item.quantity}`);
                    } else {
                        // 새로운 비커피 아이템 추가
                        const itemWithTimestamp = {
                            ...item,
                            addedTimestamp: item.addedTimestamp || Date.now()
                        };
                        this.items.push(itemWithTimestamp);
                        console.log(`비커피 아이템 로드: ${item.name} x${item.quantity}`);
                    }
                });
                
                console.log('loadNonCoffeeItems 완료, 현재 장바구니:', this.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
                console.log('==============================');
                
            } catch (error) {
                console.error('저장된 아이템 데이터 파싱 오류:', error);
                localStorage.removeItem('nonCoffeeItems');
            }
        }
    }

    // 비커피 아이템들 저장 (완료된 커피 제외)
    saveNonCoffeeItems() {
        // 🔥 중요: 커피 아이템은 tempIncompleteCoffees에서만 관리하므로 
        // nonCoffeeItems에는 비커피 아이템들만 저장
        const nonCoffeeItems = this.items.filter(item => 
            !this.isCoffeeItem(item.id) && !item.isCompletedCoffee
        );
        
        // 🔥 수정: 미완료 커피는 더 이상 nonCoffeeItems에 저장하지 않음
        // 커피는 tempIncompleteCoffees에서만 관리됨
        
        console.log('=== saveNonCoffeeItems ===');
        console.log('저장할 비커피 아이템들:', nonCoffeeItems.map(item => `${item.name} x${item.quantity}`));
        
        if (nonCoffeeItems.length > 0) {
            localStorage.setItem('nonCoffeeItems', JSON.stringify(nonCoffeeItems));
            console.log('비커피 아이템들 저장 완료:', nonCoffeeItems.map(item => `${item.name} x${item.quantity}`));
        } else {
            localStorage.removeItem('nonCoffeeItems');
            console.log('저장할 비커피 아이템이 없어 nonCoffeeItems 제거');
        }
        console.log('========================');
    }

    // 미완료 커피가 있는지 확인
    hasIncompleteCoffee() {
        return this.items.some(item => 
            this.isCoffeeItem(item.id) && !item.isCompletedCoffee
        );
    }

    // 완료된 커피의 수량을 localStorage에서 업데이트
    updateCompletedCoffeeQuantity(updatedItem, newQuantity) {
        const completedCoffeesData = localStorage.getItem('completedCoffees');
        
        if (completedCoffeesData) {
            try {
                const data = JSON.parse(completedCoffeesData);
                const completedItems = data.items || [];
                
                // 해당 커피를 찾아서 수량 업데이트
                let updated = false;
                completedItems.forEach(coffee => {
                    // 고유 ID가 있으면 우선 사용
                    if (updatedItem.uniqueId && coffee.uniqueId) {
                        if (coffee.uniqueId === updatedItem.uniqueId) {
                            coffee.quantity = newQuantity;
                            updated = true;
                            console.log(`✓ localStorage에서 완료된 커피 수량 업데이트 (uniqueId): ${updatedItem.displayName || updatedItem.name} -> x${newQuantity}`);
                        }
                    }
                    // 고유 ID가 없으면 기존 방식으로 비교
                    else if (coffee.id === updatedItem.id) {
                        const coffeeOptionsStr = JSON.stringify(coffee.options || {});
                        const itemOptionsStr = JSON.stringify(updatedItem.options || {});
                        
                        if (coffeeOptionsStr === itemOptionsStr) {
                            coffee.quantity = newQuantity;
                            updated = true;
                            console.log(`✓ localStorage에서 완료된 커피 수량 업데이트: ${updatedItem.displayName || updatedItem.name} -> x${newQuantity}`);
                        }
                    }
                });
                
                if (updated) {
                    // 업데이트된 데이터 저장
                    localStorage.setItem('completedCoffees', JSON.stringify({
                        items: completedItems,
                        lastUpdated: new Date().toISOString()
                    }));
                } else {
                    console.warn('localStorage에서 해당 완료된 커피를 찾을 수 없음:', updatedItem.displayName || updatedItem.name);
                }
                
            } catch (error) {
                console.error('완료된 커피 수량 업데이트 중 오류:', error);
            }
        }
    }

    // 최종 주문 정보 저장
    saveFinalOrder() {
        // 총 금액 계산 (옵션으로 인한 가격 증가 포함)
        const totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // 옵션으로 인한 총 추가 비용 계산
        const totalOptionIncrease = this.items.reduce((total, item) => {
            const increase = item.priceIncrease || 0;
            return total + (increase * item.quantity);
        }, 0);
        
        const finalOrderData = {
            items: this.items,
            timestamp: new Date().toISOString(),
            totalAmount: totalAmount,
            totalOptionIncrease: totalOptionIncrease, // 옵션으로 인한 총 추가 비용
            summary: {
                itemCount: this.items.length,
                totalQuantity: this.items.reduce((total, item) => total + item.quantity, 0),
                baseAmount: totalAmount - totalOptionIncrease, // 기본 가격의 총합
                optionAmount: totalOptionIncrease // 옵션으로 추가된 금액
            }
        };
        
        localStorage.setItem('finalOrder', JSON.stringify(finalOrderData));
        
        console.log('최종 주문 정보 저장 완료:');
        console.log(`- 총 금액: ₩${totalAmount.toLocaleString()}`);
        console.log(`- 기본 금액: ₩${(totalAmount - totalOptionIncrease).toLocaleString()}`);
        console.log(`- 옵션 추가: ₩${totalOptionIncrease.toLocaleString()}`);
        
        // 옵션 추가 금액이 있는 항목들 로그
        if (totalOptionIncrease > 0) {
            console.log('옵션으로 가격이 증가한 항목들:');
            this.items.forEach(item => {
                if (item.priceIncrease > 0) {
                    console.log(`  - ${item.displayName || item.name}: +₩${item.priceIncrease * item.quantity}`);
                }
            });
        }
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    const nuriMenu = new NuriMenuSystem();
    
    // 전역 객체로 등록 (디버깅용)
    window.nuriMenu = nuriMenu;
    
    // 🔥 디버깅 함수 추가
    window.debugStorage = function() {
        console.log('=== 로컬 스토리지 디버깅 ===');
        console.log('tempIncompleteCoffees:', localStorage.getItem('tempIncompleteCoffees'));
        console.log('completedCoffees:', localStorage.getItem('completedCoffees'));
        console.log('nonCoffeeItems:', localStorage.getItem('nonCoffeeItems'));
        console.log('selectedMenuItems:', localStorage.getItem('selectedMenuItems'));
        console.log('현재 장바구니:', nuriMenu.cartManager.items.map(i => `${i.name} x${i.quantity} (완료:${!!i.isCompletedCoffee})`));
        console.log('=============================');
    };
    
    console.log('💡 브라우저 콘솔에서 debugStorage() 함수를 사용하여 로컬 스토리지 상태를 확인할 수 있습니다.');
}); 