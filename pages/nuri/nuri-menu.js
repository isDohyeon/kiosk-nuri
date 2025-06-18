// 누리 메뉴 시스템
class NuriMenuSystem {
    constructor() {
        this.currentMainTab = 'menu';
        this.currentCategoryTab = 'coffee';
        this.cartItems = [];
        this.isCartExpanded = false;
        
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
                { id: 41, name: "초코스모쿠키", price: 2500, image: "../../assets/images/menu/dessert/초코스모어쿠키.png" },
                { id: 42, name: "초코칩쿠키", price: 2000, image: "../../assets/images/menu/dessert/초코칩쿠키.png" },
                { id: 43, name: "마카다미쿠키", price: 2000, image: "../../assets/images/menu/dessert/마카다미쿠키.png" },
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

        this.init();
    }

    init() {
        console.log('누리 메뉴 시스템 초기화 시작...');
        
        // 초기화 시 기존 데이터 정리
        this.clearPreviousSessionData();
        
        this.initializeNavigationButtons();
        this.setupEventListeners();
        this.renderMenu();
        
        // 완료된 커피들을 장바구니에 로드 (세션이 연속된 경우만)
        this.loadCompletedCoffees();
        
        // 초기 장바구니 상태 확인
        console.log('초기 장바구니 상태:', this.cartItems);
        this.renderCart(); // 장바구니 초기 렌더링
        
        this.setupCartEventListeners(); // 장바구니 렌더링 후 이벤트 리스너 설정
        this.updateTabStates();
        console.log('누리 메뉴 시스템 초기화 완료!');
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
        
        // 커피 카테고리인지 확인
        const isCoffeeItem = this.menuData.coffee.some(coffeeItem => coffeeItem.id === item.id);
        
        if (isCoffeeItem) {
            // 커피인 경우 바로 옵션 선택 화면으로 이동
            console.log('커피 아이템 - 옵션 선택 화면으로 이동:', item.name);
            
            // 선택된 커피를 localStorage에 저장 (단일 커피)
            const selectedCoffee = [{
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            }];
            
            localStorage.setItem('selectedMenuItems', JSON.stringify(selectedCoffee));
            
            // 옵션 화면으로 이동
            window.location.href = '../option/option.html';
            return;
        }
        
        // 커피가 아닌 경우 기존 로직대로 장바구니에 추가
        const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex !== -1) {
            // 기존 아이템 수량 증가
            this.cartItems[existingItemIndex].quantity += 1;
        } else {
            // 새 아이템 추가 (최대 20개 아이템 - 누리 모드)
            if (this.cartItems.length < 20) {
                this.cartItems.push({ ...item, quantity: 1 });
            } else {
                alert('장바구니가 가득 찼습니다. (최대 20개 메뉴)');
                return;
            }
        }
        
        this.renderCart();
        this.showCartAnimation();
    }

    // 수량 증가
    increaseQuantity(itemId) {
        console.log('수량 증가:', itemId, typeof itemId);
        // itemId를 숫자로 변환하여 비교
        const targetId = parseInt(itemId);
        const item = this.cartItems.find(item => item.id === targetId);
        if (item) {
            item.quantity += 1;
            console.log(`${item.name} 수량: ${item.quantity}`);
            // 간단한 수량 업데이트만 하고 전체 렌더링은 안함
            this.updateQuantityDisplayOnly(targetId, item.quantity);
        } else {
            console.error('수량 증가 실패 - 아이템을 찾을 수 없음:', itemId, targetId);
        }
    }

    // 수량 감소
    decreaseQuantity(itemId) {
        console.log('수량 감소:', itemId, typeof itemId);
        // itemId를 숫자로 변환하여 비교
        const targetId = parseInt(itemId);
        const item = this.cartItems.find(item => item.id === targetId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            console.log(`${item.name} 수량: ${item.quantity}`);
            // 간단한 수량 업데이트만 하고 전체 렌더링은 안함
            this.updateQuantityDisplayOnly(targetId, item.quantity);
        } else if (item && item.quantity === 1) {
            // 수량이 1일 때는 아이템 제거
            console.log(`${item.name} 제거`);
            this.removeFromCart(targetId);
        } else {
            console.error('수량 감소 실패 - 아이템을 찾을 수 없음:', itemId, targetId);
        }
    }

    // 수량 표시만 업데이트 (전체 렌더링 방지)
    updateQuantityDisplay(itemId, quantity) {
        const cartContainer = document.getElementById('cartItemsContainer');
        const itemElement = cartContainer.querySelector(`[data-id="${itemId}"]`);
        if (itemElement) {
            const quantityDisplay = itemElement.querySelector('.quantity-display');
            if (quantityDisplay) {
                quantityDisplay.textContent = quantity;
            }
        }
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
            } else {
                console.error('quantity-display 요소를 찾을 수 없음:', itemId);
            }
        } else {
            console.error('아이템 요소를 찾을 수 없음:', itemId);
        }
    }

    removeFromCart(itemId) {
        console.log('아이템 제거:', itemId, typeof itemId);
        // itemId를 숫자로 변환하여 비교
        const targetId = parseInt(itemId);
        const beforeLength = this.cartItems.length;
        this.cartItems = this.cartItems.filter(item => item.id !== targetId);
        const afterLength = this.cartItems.length;
        console.log(`제거 완료: ${beforeLength} -> ${afterLength}`);
        this.renderCart();
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
                console.log(`슬롯 ${index + 1}: 아이템 있음 - ${cartItem.name}`);
                const slot = document.createElement('div');
                slot.className = 'cart-item';
                slot.dataset.id = cartItem.id;
                slot.innerHTML = `
                    <div class="cart-item-content">
                        <button class="remove-btn" data-item-id="${cartItem.id}">×</button>
                        <img src="${cartItem.image}" alt="${cartItem.name}" onerror="this.src='../../assets/images/menu/placeholder.png'">
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
            console.log('기존 이벤트 리스너 제거됨');
        }
        
        // 새로운 이벤트 핸들러 생성
        this.cartEventHandler = (event) => {
            console.log('장바구니 클릭 이벤트 발생:', event.target.className, event.target.tagName);
            
            // 삭제 버튼 클릭
            if (event.target.classList.contains('remove-btn')) {
                event.preventDefault();
                event.stopPropagation();
                
                const itemId = event.target.dataset.itemId;
                console.log('삭제 버튼 클릭:', itemId);
                this.removeFromCart(itemId);
                return;
            }
            
            // 수량 조절 버튼 클릭
            if (event.target.classList.contains('quantity-btn')) {
                event.preventDefault();
                event.stopPropagation();
                
                const itemId = event.target.dataset.itemId;
                const isPlus = event.target.classList.contains('plus');
                console.log('수량 조절 버튼 클릭:', itemId, isPlus ? 'plus' : 'minus');
                
                if (isPlus) {
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
        cartArea.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            cartArea.style.transform = 'translateY(0)';
        }, 200);
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
        // 처음으로 가기
        window.location.href = '../../index.html';
    }

    clearPreviousSessionData() {
        // 페이지 새로고침이나 새 접속 시 이전 주문 데이터 정리
        console.log('이전 주문 데이터 정리 중...');
        
        // URL 파라미터나 referrer를 확인하여 옵션 페이지에서 돌아온 경우가 아니면 데이터 정리
        const isFromOptionPage = document.referrer.includes('option.html');
        
        if (!isFromOptionPage) {
            // 옵션 페이지에서 돌아온 것이 아니면 모든 데이터 정리 (새 주문 시작)
            console.log('새 주문 시작 - 이전 데이터 정리');
            localStorage.removeItem('completedCoffees');
            localStorage.removeItem('selectedMenuItems');
            localStorage.removeItem('coffeeOptions');
            localStorage.removeItem('finalOrder');
            localStorage.removeItem('nonCoffeeItems');
        } else {
            console.log('옵션 페이지에서 복귀 - 데이터 유지');
        }
    }

    loadCompletedCoffees() {
        // 완료된 커피들을 localStorage에서 로드하여 장바구니에 추가
        const completedCoffeesData = localStorage.getItem('completedCoffees');
        
        if (completedCoffeesData) {
            try {
                const data = JSON.parse(completedCoffeesData);
                const completedItems = data.items || [];
                
                console.log('완료된 커피들 로드:', completedItems);
                
                // 완료된 커피들을 장바구니에 추가
                completedItems.forEach(coffee => {
                    // 옵션 정보를 포함한 display name 생성
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
                    
                    // 기존에 동일한 커피+옵션이 있는지 확인
                    const existingItemIndex = this.cartItems.findIndex(item => 
                        item.id === coffee.id && item.displayName === displayName
                    );
                    
                    if (existingItemIndex !== -1) {
                        // 기존 아이템 수량 증가
                        this.cartItems[existingItemIndex].quantity += 1;
                    } else {
                        // 새 아이템 추가
                        this.cartItems.push({
                            id: coffee.id,
                            name: coffee.name,
                            displayName: displayName, // 옵션 포함된 표시명
                            price: coffee.price,
                            image: coffee.image,
                            quantity: 1,
                            options: coffee.options, // 옵션 정보 저장
                            isCompletedCoffee: true // 완료된 커피임을 표시
                        });
                    }
                });
                
                console.log('장바구니에 완료된 커피들 추가 완료:', this.cartItems);
                
            } catch (error) {
                console.error('완료된 커피 데이터 파싱 오류:', error);
                localStorage.removeItem('completedCoffees');
            }
        }
    }

    finishOrder() {
        if (this.cartItems.length === 0) {
            alert('장바구니에 상품을 추가해주세요.');
            return;
        }

        // 장바구니에 옵션이 미완료된 커피가 있는지 확인
        const incompleteCoffeeItems = this.cartItems.filter(item => 
            this.menuData.coffee.some(coffeeItem => coffeeItem.id === item.id) && 
            !item.isCompletedCoffee
        );

        if (incompleteCoffeeItems.length > 0) {
            alert('아직 옵션을 선택하지 않은 커피가 있습니다. 모든 커피의 옵션을 선택해주세요.');
            return;
        }

        // 모든 커피의 옵션이 완료된 경우 혜택 화면으로 이동
        console.log('모든 주문 완료 - 혜택 화면으로 이동');
        
        // 최종 주문 정보 준비
        const finalOrderData = {
            items: this.cartItems,
            timestamp: new Date().toISOString(),
            totalAmount: this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
        };
        
        // 최종 주문 정보 저장
        localStorage.setItem('finalOrder', JSON.stringify(finalOrderData));
        
        // 혜택 화면으로 이동
        this.goToBenefitStep();
    }

    requestHelp() {
        alert('직원을 호출하였습니다. 잠시만 기다려주세요.');
    }

    goToBenefitStep() {
        console.log('할인 단계로 이동 중...');
        
        // 최종 주문 정보 확인 및 로그
        const finalOrder = localStorage.getItem('finalOrder');
        if (finalOrder) {
            const orderData = JSON.parse(finalOrder);
            console.log('주문 정보:', orderData);
            
            // 주문 요약 로그
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
        
        // 완료된 커피 데이터 정리는 할인 페이지에서 처리
        // localStorage.removeItem('completedCoffees');
    }


}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    const nuriMenu = new NuriMenuSystem();
    
    // 전역 객체로 등록 (디버깅용)
    window.nuriMenu = nuriMenu;
}); 