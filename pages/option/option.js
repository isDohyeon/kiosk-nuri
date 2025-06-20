// 옵션 선택 시스템
class OptionSelectionSystem {
    constructor() {
        this.selectedMenuItems = []; // 여러 커피 저장
        this.currentCoffeeIndex = 0; // 현재 옵션 설정 중인 커피 인덱스
        this.allCoffeeOptions = []; // 모든 커피의 옵션 저장
        this.helpSystem = null; // help system 인스턴스
        this.menuData = null; // 메뉴 데이터
        this.basePrices = []; // 각 커피의 기본 가격 저장
        this.currentPrices = []; // 각 커피의 현재 가격 저장 (옵션 포함)
        
        this.init();
    }

    async init() {
        console.log('옵션 선택 시스템 초기화 시작...');
        await this.loadMenuData();
        this.loadSelectedMenuItem();
        this.initializePrices();
        this.initializeNavigationButtons();
        this.initializeHelpSystem();
        this.setupEventListeners();
        this.displaySelectedMenuItem();
        this.loadCurrentCoffeeOptions();
        console.log('옵션 선택 시스템 초기화 완료!');
    }

    initializeNavigationButtons() {
        // NavigationButtons 컴포넌트 초기화
        console.log('NavigationButtons 초기화 시작...');
        console.log('NavigationButtons 클래스 존재 여부:', typeof NavigationButtons !== 'undefined');
        
        if (typeof NavigationButtons !== 'undefined') {
            // 현재 선택된 메뉴 이름 가져오기
            const currentCoffee = this.selectedMenuItems[this.currentCoffeeIndex];
            const menuName = currentCoffee ? currentCoffee.name : '아메리카노';
            const title = `<span class="menu-name">${menuName}</span>의 옵션을 선택해주세요.`;
            
            console.log('초기 제목 생성:', title);
            
            this.navButtons = NavigationButtons.createWithTitle(title, {
                onBackClick: () => this.goBack(),
                onHomeClick: () => this.goHome()
            });
            
            console.log('NavigationButtons 인스턴스 생성됨:', this.navButtons);
            console.log('NavigationButtons updateTitle 메서드 존재 여부:', typeof this.navButtons.updateTitle === 'function');
            console.log('NavigationButtons centerElement:', this.navButtons.centerElement);
            
            // DOM에 실제로 렌더링되었는지 확인
            setTimeout(() => {
                const pageTitle = document.querySelector('.page-title');
                console.log('DOM에서 page-title 요소 찾기:', pageTitle);
                if (pageTitle) {
                    console.log('현재 page-title 내용:', pageTitle.innerHTML);
                } else {
                    console.error('page-title 요소를 DOM에서 찾을 수 없음!');
                    // nav-buttons 컨테이너 확인
                    const navButtons = document.querySelector('.nav-buttons');
                    console.log('nav-buttons 컨테이너:', navButtons);
                    if (navButtons) {
                        console.log('nav-buttons 내용:', navButtons.innerHTML);
                    }
                }
            }, 100);
            
            console.log('NavigationButtons 초기화 완료:', title);
        } else {
            console.warn('NavigationButtons 클래스를 찾을 수 없습니다.');
        }
    }

    async loadMenuData() {
        try {
            const response = await fetch('../../assets/data/menu-config.json');
            this.menuData = await response.json();
            console.log('메뉴 데이터 로드 완료:', this.menuData);
        } catch (error) {
            console.error('메뉴 데이터 로드 실패:', error);
            // 기본 데이터 설정
            this.menuData = {
                menuItems: {},
                settings: {}
            };
        }
    }

    initializePrices() {
        console.log('가격 초기화 시작...');
        
        // 각 커피의 기본 가격 및 현재 가격 초기화
        this.basePrices = [];
        this.currentPrices = [];
        
        if (this.selectedMenuItems && this.selectedMenuItems.length > 0) {
            this.selectedMenuItems.forEach((coffee, index) => {
                const basePrice = this.findMenuPrice(coffee.name);
                this.basePrices[index] = basePrice;
                this.currentPrices[index] = basePrice;
                
                console.log(`커피 ${coffee.name}: 기본가격 ${basePrice}원`);
            });
        }
        
        console.log('가격 초기화 완료:', {
            basePrices: this.basePrices,
            currentPrices: this.currentPrices
        });
    }

    findMenuPrice(menuName) {
        if (!this.menuData || !this.menuData.menuItems) {
            console.warn('메뉴 데이터가 없어 기본 가격 적용:', menuName);
            return 3000; // 기본 가격
        }

        // 모든 카테고리에서 메뉴 검색
        for (const category in this.menuData.menuItems) {
            const items = this.menuData.menuItems[category];
            const foundItem = items.find(item => item.name === menuName);
            if (foundItem) {
                console.log(`${menuName} 가격 찾음: ${foundItem.price}원`);
                return foundItem.price;
            }
        }

        console.warn(`${menuName}의 가격을 찾을 수 없어 기본 가격 적용`);
        return 3000; // 기본 가격
    }

    // 가격 표시 UI는 제거되었지만, 가격 계산 로직은 백그라운드에서 계속 동작합니다.

    initializeHelpSystem() {
        // HelpSystem 클래스가 로드되었는지 확인
        if (typeof HelpSystem !== 'undefined') {
            this.helpSystem = new HelpSystem();
            
            // 도움 대상들 등록
            this.helpSystem.registerMultipleTargets({
                'step1': {
                    selector: '.options-title',
                    type: 'left',
                    position: 'center',
                    offsetX: 440,
                    offsetY: -5,
                    message: '차갑게 또는 뜨겁게 중 하나를 선택해주세요!',
                    textPosition: 'right'
                },
                'step2': {
                    selector: '.options-subtitle',
                    type: 'left',
                    position: 'center',
                    offsetX: 410,
                    offsetY: -5,
                    message: '추가 옵션을 선택하거나, 다 골랐어요 버튼을 눌러주세요!',
                    textPosition: 'right'
                },
                'step3': {
                    selector: '.button.primary',
                    type: 'bottom',
                    position: 'center',
                    offsetX: -360,
                    offsetY: -250,
                    message: '다 골랐어요 버튼을 눌러주세요!',
                    textPosition: 'left'
                }
            });
            
            console.log('Help System 초기화 완료');
        } else {
            console.warn('HelpSystem 클래스를 찾을 수 없습니다.');
        }
    }

    loadSelectedMenuItem() {
        console.log('=== 커피 데이터 로딩 시작 ===');
        
        // 현재 URL과 파라미터 확인
        console.log('현재 URL:', window.location.href);
        const urlParams = new URLSearchParams(window.location.search);
        console.log('URL 파라미터:', Object.fromEntries(urlParams));
        
        // localStorage 상태 확인
        console.log('=== localStorage 상태 확인 ===');
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`${key}:`, localStorage.getItem(key));
        }
        console.log('===========================');
        
        // localStorage에서 선택된 커피들 가져오기
        const storedMenus = localStorage.getItem('selectedMenuItems');
        console.log('localStorage selectedMenuItems:', storedMenus);
        
        if (storedMenus) {
            try {
                this.selectedMenuItems = JSON.parse(storedMenus);
                console.log('✓ localStorage에서 커피 목록 로드 성공:', this.selectedMenuItems);
            } catch (e) {
                console.error('localStorage 데이터 파싱 오류:', e);
                this.selectedMenuItems = [{ name: '아메리카노', quantity: 1 }];
            }
        } else {
            console.log('selectedMenuItems가 localStorage에 없음');
            
            // 구버전 호환성을 위해 selectedMenuItem도 확인
            const oldStoredMenu = localStorage.getItem('selectedMenuItem');
            console.log('localStorage selectedMenuItem (구버전):', oldStoredMenu);
            
            if (oldStoredMenu) {
                try {
                    const oldMenu = JSON.parse(oldStoredMenu);
                    this.selectedMenuItems = [oldMenu];
                    console.log('✓ 구버전 localStorage에서 커피 로드:', this.selectedMenuItems);
                } catch (e) {
                    console.error('구버전 localStorage 데이터 파싱 오류:', e);
                }
            }
            
            // URL 파라미터에서 가져오기 (단일 메뉴의 경우)
            if (!this.selectedMenuItems || this.selectedMenuItems.length === 0) {
                const menuName = urlParams.get('menu');
                console.log('URL 파라미터 menu:', menuName);
                
                if (menuName) {
                    this.selectedMenuItems = [{ name: decodeURIComponent(menuName), quantity: 1 }];
                    console.log('✓ URL 파라미터에서 커피 로드:', decodeURIComponent(menuName));
                } else {
                    // 기본값으로 아메리카노 설정
                    this.selectedMenuItems = [{ name: '아메리카노', quantity: 1 }];
                    console.log('✓ 기본값: 아메리카노 설정 (데이터 없음)');
                }
            }
        }
        
        // 유효성 검사
        if (!this.selectedMenuItems || this.selectedMenuItems.length === 0) {
            console.warn('커피 목록이 비어있음, 기본값 설정');
            this.selectedMenuItems = [{ name: '아메리카노', quantity: 1 }];
        }
        
        // 각 커피별로 빈 옵션 객체 초기화
        this.allCoffeeOptions = this.selectedMenuItems.map(() => ({
            temperature: null,
            strength: null
        }));
        
        console.log('=== 최종 커피 데이터 ===');
        console.log('선택된 커피들:', this.selectedMenuItems);
        console.log('초기화된 옵션 배열:', this.allCoffeeOptions);
        console.log('현재 커피 인덱스:', this.currentCoffeeIndex);
        console.log('=======================');
    }

    displaySelectedMenuItem() {
        if (this.selectedMenuItems.length > 0) {
            const currentCoffee = this.selectedMenuItems[this.currentCoffeeIndex];
            const progressText = this.selectedMenuItems.length > 1 
                ? ` (${this.currentCoffeeIndex + 1}/${this.selectedMenuItems.length})`
                : '';
            
            // 제목 업데이트
            this.updatePageTitle();
            
            console.log('메뉴 표시 업데이트:', `${currentCoffee.name}${progressText}`);
            console.log('현재 커피 인덱스:', this.currentCoffeeIndex);
            console.log('현재 커피 정보:', currentCoffee);
            console.log('현재 가격 (백그라운드):', this.currentPrices[this.currentCoffeeIndex]);
        } else {
            console.log('메뉴 표시 업데이트 실패 - 커피 목록 없음');
        }
    }

    updatePageTitle() {
        console.log('updatePageTitle 호출됨');
        console.log('selectedMenuItems 길이:', this.selectedMenuItems ? this.selectedMenuItems.length : 'undefined');
        
        if (this.selectedMenuItems.length > 0) {
            const currentCoffee = this.selectedMenuItems[this.currentCoffeeIndex];
            const title = `<span class="menu-name">${currentCoffee.name}</span>의 옵션을 선택해주세요.`;
            
            console.log('업데이트할 제목:', title);
            console.log('navButtons 존재 여부:', !!this.navButtons);
            console.log('updateTitle 메서드 존재 여부:', this.navButtons && typeof this.navButtons.updateTitle === 'function');
            
            // NavigationButtons의 제목 업데이트
            if (this.navButtons && this.navButtons.updateTitle) {
                console.log('updateTitle 메서드 호출 중...');
                this.navButtons.updateTitle(title);
                
                // 업데이트 후 DOM 확인
                setTimeout(() => {
                    const pageTitle = document.querySelector('.page-title');
                    console.log('업데이트 후 DOM 확인 - page-title 요소:', pageTitle);
                    if (pageTitle) {
                        console.log('업데이트 후 page-title 내용:', pageTitle.innerHTML);
                    }
                }, 50);
            } else {
                console.error('navButtons.updateTitle 메서드를 호출할 수 없음!');
                console.log('navButtons:', this.navButtons);
                if (this.navButtons) {
                    console.log('navButtons의 사용 가능한 메서드들:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.navButtons)));
                }
            }
            
            console.log('페이지 제목 업데이트 완료');
        }
    }

    updateFinishButtonText() {
        const finishButton = document.querySelector('.button.primary');
        if (finishButton) {
            const isLastCoffee = this.currentCoffeeIndex === this.selectedMenuItems.length - 1;
            const hasMultipleCoffees = this.selectedMenuItems.length > 1;
            
            if (hasMultipleCoffees && !isLastCoffee) {
                finishButton.textContent = '다음 커피';
            } else if (hasMultipleCoffees && isLastCoffee) {
                finishButton.textContent = '혜택 선택';
            } else {
                finishButton.textContent = '혜택 선택';
            }
            
            console.log('버튼 텍스트 업데이트:', finishButton.textContent);
        }
    }

    loadCurrentCoffeeOptions() {
        // 현재 커피의 이미 선택된 옵션이 있다면 표시
        const currentOptions = this.allCoffeeOptions[this.currentCoffeeIndex];
        
        // 모든 옵션 카드 초기화
        document.querySelectorAll('.option-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // 현재 커피의 가격을 기본 가격으로 리셋
        this.currentPrices[this.currentCoffeeIndex] = this.basePrices[this.currentCoffeeIndex];
        
        // 이미 선택된 옵션이 있다면 복원
        if (currentOptions.temperature) {
            const tempCard = document.querySelector(`[data-option="${currentOptions.temperature}"]`);
            if (tempCard) tempCard.classList.add('selected');
        }
        
        if (currentOptions.strength) {
            const strengthCard = document.querySelector(`[data-option="${currentOptions.strength}"]`);
            if (strengthCard) strengthCard.classList.add('selected');
            
            // 진하게 옵션이 선택되어 있다면 가격 추가
            if (currentOptions.strength === 'strong') {
                this.currentPrices[this.currentCoffeeIndex] += 500;
            }
        }
        
        // 추가 옵션들 복원
        if (currentOptions.additionalOptions) {
            Object.keys(currentOptions.additionalOptions).forEach(option => {
                if (currentOptions.additionalOptions[option]) {
                    const optionCard = document.querySelector(`[data-option="${option}"]`);
                    if (optionCard) optionCard.classList.add('selected');
                    
                    // 더 달게 옵션이 선택되어 있다면 가격 추가
                    if (option === 'sweet') {
                        this.currentPrices[this.currentCoffeeIndex] += 500;
                    }
                }
            });
        }
        
        console.log('옵션 복원 완료 - 현재 가격 (백그라운드):', this.currentPrices[this.currentCoffeeIndex]);
    }

    setupEventListeners() {
        console.log('이벤트 리스너 설정 시작...');
        
        // 옵션 선택 이벤트
        this.setupOptionEventListeners();
        
        // 상단 탭 이벤트
        this.setupTabEventListeners();
        
        // 하단 버튼 이벤트
        this.setupButtonEventListeners();
        
        console.log('이벤트 리스너 설정 완료!');
    }

    setupOptionEventListeners() {
        // 모든 옵션 카드에 이벤트 리스너 추가
        const optionCards = document.querySelectorAll('.option-card');
        
        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const option = e.currentTarget.dataset.option;
                this.selectOption(option);
            });
        });
    }

    selectOption(option) {
        console.log('옵션 선택:', option);
        
        const currentCard = document.querySelector(`[data-option="${option}"]`);
        if (!currentCard) return;
        
        // 옵션 타입에 따른 선택 로직
        if (option === 'cold' || option === 'hot') {
            // 온도 옵션: 상호 배타적
            document.querySelectorAll('[data-option="cold"], [data-option="hot"]').forEach(card => {
                card.classList.remove('selected');
            });
            currentCard.classList.add('selected');
            
            // 현재 커피의 온도 옵션 저장
            this.allCoffeeOptions[this.currentCoffeeIndex].temperature = option;
            
        } else if (option === 'strong' || option === 'light') {
            // 농도 옵션: 상호 배타적
            const wasStrongSelected = document.querySelector('[data-option="strong"]').classList.contains('selected');
            
            document.querySelectorAll('[data-option="strong"], [data-option="light"]').forEach(card => {
                card.classList.remove('selected');
            });
            currentCard.classList.add('selected');
            
            // 현재 커피의 농도 옵션 저장
            this.allCoffeeOptions[this.currentCoffeeIndex].strength = option;
            
            // 가격 계산 (진하게 옵션만 +500원)
            if (option === 'strong') {
                // 진하게 선택: +500원
                this.currentPrices[this.currentCoffeeIndex] = this.basePrices[this.currentCoffeeIndex] + 500 + this.getAdditionalOptionsPrice();
            } else if (option === 'light') {
                // 연하게 선택: 기본 가격 + 추가 옵션 가격만
                this.currentPrices[this.currentCoffeeIndex] = this.basePrices[this.currentCoffeeIndex] + this.getAdditionalOptionsPrice();
            }
            
            // 이전에 진하게가 선택되어 있었다면 가격 재계산
            if (wasStrongSelected && option === 'light') {
                this.currentPrices[this.currentCoffeeIndex] = this.basePrices[this.currentCoffeeIndex] + this.getAdditionalOptionsPrice();
            }
            
        } else if (option === 'sweet' || option === 'personal-cup') {
            // 추가 옵션: 개별적으로 토글 가능
            const wasSelected = currentCard.classList.contains('selected');
            currentCard.classList.toggle('selected');
            
            // 현재 커피의 추가 옵션 저장
            if (!this.allCoffeeOptions[this.currentCoffeeIndex].additionalOptions) {
                this.allCoffeeOptions[this.currentCoffeeIndex].additionalOptions = {};
            }
            
            const isSelected = currentCard.classList.contains('selected');
            this.allCoffeeOptions[this.currentCoffeeIndex].additionalOptions[option] = isSelected;
            
            // 가격 계산 (더 달게 옵션만 +500원)
            if (option === 'sweet') {
                if (isSelected && !wasSelected) {
                    // 더 달게 선택: +500원
                    this.currentPrices[this.currentCoffeeIndex] += 500;
                } else if (!isSelected && wasSelected) {
                    // 더 달게 해제: -500원
                    this.currentPrices[this.currentCoffeeIndex] -= 500;
                }
            }
            // 개인 컵 사용은 가격 변동 없음
        }
        
        console.log('현재 커피 옵션:', this.allCoffeeOptions[this.currentCoffeeIndex]);
        console.log('현재 가격 (백그라운드):', this.currentPrices[this.currentCoffeeIndex] + '원');
        
        // 헬프 시스템이 활성화되어 있다면 상태 업데이트
        this.updateHelpStatus();
    }

    getAdditionalOptionsPrice() {
        const currentOptions = this.allCoffeeOptions[this.currentCoffeeIndex];
        let additionalPrice = 0;
        
        if (currentOptions.additionalOptions) {
            // 더 달게 옵션 가격 추가
            if (currentOptions.additionalOptions.sweet) {
                additionalPrice += 500;
            }
            // 개인 컵 사용은 가격 변동 없음
        }
        
        return additionalPrice;
    }

    setupTabEventListeners() {
        // 메뉴 탭 - 메뉴 페이지로 이동
        const menuTab = document.querySelector('.text-wrapper');
        if (menuTab) {
            menuTab.addEventListener('click', () => {
                this.goToMenu();
            });
        }
        
        // 네비게이션 버튼은 이제 NavigationButtons 컴포넌트에서 처리됩니다
    }

    setupButtonEventListeners() {
        // 다 골랐어요 버튼
        const finishButton = document.querySelector('.button.primary');
        if (finishButton) {
            finishButton.addEventListener('click', () => {
                this.finishOptionSelection();
            });
        }
        
        // 도움이 필요해요 버튼
        const helpButton = document.querySelector('.button.secondary');
        if (helpButton) {
            helpButton.addEventListener('click', () => {
                this.requestHelp();
            });
        }
    }

    finishOptionSelection() {
        console.log('현재 커피 옵션 선택 완료');
        
        // // 현재 단계가 완료되었는지 확인
        // const currentStep = this.getCurrentRequiredStep();
        // if (currentStep !== 3) {
        //     alert('모든 옵션을 선택해주세요.');
        //     return;
        // }
        
        // 현재 커피의 옵션 저장
        this.saveCurrentCoffeeOptions();
        
        // 다음 커피가 있는지 확인
        if (this.currentCoffeeIndex < this.selectedMenuItems.length - 1) {
            // 다음 커피로 이동
            this.currentCoffeeIndex++;
            this.displaySelectedMenuItem();
            this.loadCurrentCoffeeOptions();
            this.updateHelpStatus(); // 도움말 상태 업데이트
            
            console.log(`다음 커피로 이동: ${this.selectedMenuItems[this.currentCoffeeIndex].name} (${this.currentCoffeeIndex + 1}/${this.selectedMenuItems.length})`);
            
            // 간단한 알림으로 진행 상황 표시
            const remainingCount = this.selectedMenuItems.length - this.currentCoffeeIndex;
            console.log(`남은 커피 ${remainingCount}개의 옵션을 선택해주세요.`);
        } else {
            // 모든 커피의 옵션 선택 완료 - 메뉴로 돌아가기
            console.log('모든 커피 옵션 선택 완료 - 메뉴로 돌아가기');
            console.log('선택된 커피들:', this.selectedMenuItems);
            console.log('모든 옵션들:', this.allCoffeeOptions);
            
            // 커피 옵션 정보를 localStorage에 저장
            const coffeeOptionsData = {
                coffees: this.selectedMenuItems,
                options: this.allCoffeeOptions,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('coffeeOptions', JSON.stringify(coffeeOptionsData));
            
            // 주문 요약 표시
            const orderSummary = this.generateOrderSummary();
            console.log('주문 요약:', orderSummary);
            
            // 메뉴로 돌아가기
            this.goBackToMenu();
        }
    }

    generateOrderSummary() {
        let summary = '';
        
        this.selectedMenuItems.forEach((coffee, index) => {
            const options = this.allCoffeeOptions[index];
            let optionText = '';
            
            if (options.temperature) {
                const tempText = options.temperature === 'hot' ? '뜨겁게' : 
                               options.temperature === 'cold' ? '차갑게' : '';
                optionText += tempText;
            }
            
            if (options.strength) {
                const strengthText = options.strength === 'strong' ? '진하게' :
                                   options.strength === 'light' ? '연하게' :
                                   options.strength === 'sweet' ? '더 달게' : '';
                if (optionText && strengthText) optionText += ', ';
                optionText += strengthText;
            }
            
            summary += `${coffee.name} (${optionText || '기본'})\n`;
        });
        
        return summary;
    }

    goToMenu() {
        window.location.href = '../nuri/nuri-menu.html';
    }

    goBackToMenu() {
        // 옵션 선택 완료 알림과 함께 메뉴로 돌아가기
        const orderSummary = this.generateOrderSummary();
        // alert(`커피 옵션 선택이 완료되었습니다!\n\n선택한 옵션:\n${orderSummary}\n\n메뉴 화면으로 돌아갑니다.\n추가 주문을 하시거나 "다 골랐어요"를 눌러 혜택 단계로 이동하세요.`);
        
        // 완료된 커피를 장바구니에 추가하기 위해 정보 저장
        const completedCoffeeWithOptions = {
            coffees: this.selectedMenuItems,
            options: this.allCoffeeOptions,
            timestamp: new Date().toISOString()
        };
        
        // 기존 완료된 커피들과 병합
        const existingCompletedCoffees = localStorage.getItem('completedCoffees');
        let allCompletedCoffees = [];
        
        if (existingCompletedCoffees) {
            try {
                const existing = JSON.parse(existingCompletedCoffees);
                allCompletedCoffees = existing.items || [];
            } catch (error) {
                console.error('기존 완료된 커피 데이터 파싱 오류:', error);
            }
        }
        
        // 새로 완료된 커피들 추가 (옵션으로 인한 가격 변동 포함)
        this.selectedMenuItems.forEach((coffee, index) => {
            const options = this.allCoffeeOptions[index];
            const basePrice = this.basePrices[index];
            const finalPrice = this.currentPrices[index];
            const priceIncrease = finalPrice - basePrice;
            
            allCompletedCoffees.push({
                ...coffee,
                options: options,
                basePrice: basePrice, // 기본 가격
                finalPrice: finalPrice, // 옵션 포함 최종 가격
                priceIncrease: priceIncrease, // 옵션으로 인한 가격 증가
                quantity: coffee.quantity || 1, // 수량 정보 명시적 보존 (중요!)
                completedAt: new Date().toISOString(),
                selectedTimestamp: coffee.selectedTimestamp || Date.now(), // 원래 선택 시간 보존
                uniqueId: `${coffee.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // 고유 ID 생성
            });
            
            console.log(`${coffee.name}: 기본 ${basePrice}원 → 최종 ${finalPrice}원 (+${priceIncrease}원) x${coffee.quantity || 1}개`);
        });
        
        // 모든 완료된 커피들 저장
        localStorage.setItem('completedCoffees', JSON.stringify({
            items: allCompletedCoffees,
            lastUpdated: new Date().toISOString()
        }));
        
        // 옵션 선택 관련 임시 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('coffeeOptions');
        
        // 메뉴 페이지로 이동
        window.location.href = '../nuri/nuri-menu.html';
    }

    goBack() {
        window.history.back();
    }

    goHome() {
        window.location.href = '../../index.html';
    }

    goToBenefitStep() {
        console.log('혜택 단계로 이동 중...');
        
        // 현재는 임시로 알림을 표시하고 메뉴로 돌아감
        // 추후 혜택 페이지가 구현되면 해당 페이지로 이동할 예정
        const orderSummary = this.generateOrderSummary();
        
        alert(`모든 커피의 옵션 선택이 완료되었습니다!\n\n주문 내역:\n${orderSummary}\n\n혜택 선택 단계로 이동합니다.\n(혜택 페이지는 추후 구현 예정)`);
        
        // TODO: 혜택 페이지가 구현되면 아래 주석을 해제하고 위의 alert를 제거
        // window.location.href = '../benefit/benefit.html';
        
        // 임시로 메뉴 페이지로 돌아감
        this.goToMenu();
    }

    requestHelp() {
        console.log('도움말 요청');
        
        if (!this.helpSystem) {
            console.warn('Help System이 초기화되지 않았습니다.');
            return;
        }
        
        // 현재 선택해야 하는 단계 확인
        const currentStep = this.getCurrentRequiredStep();
        
        // 기존 도움말 모두 숨기기
        this.helpSystem.hideHelp();
        
        // 단계별 도움말 표시
        if (currentStep === 1) {
            this.helpSystem.showHelp('step1');
        } else if (currentStep === 2) {
            this.helpSystem.showHelp('step2');
        } else if (currentStep === 3) {
            this.helpSystem.showHelp('step3');
        }
    }

    saveCurrentCoffeeOptions() {
        // 현재 선택된 옵션들을 저장
        const currentOptions = this.allCoffeeOptions[this.currentCoffeeIndex];
        
        // 온도 옵션 저장
        const tempSelected = document.querySelector('[data-option="cold"].selected, [data-option="hot"].selected');
        if (tempSelected) {
            currentOptions.temperature = tempSelected.dataset.option;
        }
        
        // 농도 옵션 저장
        const strengthSelected = document.querySelector('[data-option="strong"].selected, [data-option="light"].selected');
        if (strengthSelected) {
            currentOptions.strength = strengthSelected.dataset.option;
        }
        
        // 추가 옵션들 저장
        if (!currentOptions.additionalOptions) {
            currentOptions.additionalOptions = {};
        }
        
        // 더 달게 옵션
        const sweetSelected = document.querySelector('[data-option="sweet"].selected');
        currentOptions.additionalOptions.sweet = !!sweetSelected;
        
        // 개인 컵 사용 옵션
        const personalCupSelected = document.querySelector('[data-option="personal-cup"].selected');
        currentOptions.additionalOptions['personal-cup'] = !!personalCupSelected;
    }

    getCurrentRequiredStep() {
        // 1단계 (차갑게/뜨겁게) 선택 확인
        const tempSelected = document.querySelector('[data-option="cold"].selected, [data-option="hot"].selected');
        
        if (!tempSelected) {
            return 1; // 1단계를 선택해야 함
        }
        
        // 2단계 옵션 선택 확인 (선택 사항)
        const step2Selected = document.querySelector('[data-option="strong"].selected, [data-option="light"].selected, [data-option="sweet"].selected, [data-option="personal-cup"].selected');
        
        if (step2Selected) {
            return 3; // 2단계 옵션이 선택되었으므로 완료 단계
        }
        
        // 1단계만 완료되었으므로 2단계 안내
        return 2; // 2단계 - 추가 옵션 선택 안내 (하지만 바로 완료도 가능)
    }

    showHelpAnimation(step) {
        // 레거시 호환성 - 아무것도 하지 않음
        console.log(`레거시 도움말 시스템 호출됨 - 단계 ${step}`);
    }

    hideHelpAnimation() {
        // 레거시 호환성 - 아무것도 하지 않음
        console.log('레거시 도움말 시스템 숨김');
    }

    updateHelpStatus() {
        if (!this.helpSystem) return;
        
        // 현재 help system이 활성화되어 있는지 확인
        if (this.helpSystem.isHelpActive()) {
            // 도움말이 활성화되어 있다면 현재 상태에 맞게 업데이트
            const currentStep = this.getCurrentRequiredStep();
            
            console.log('헬프 상태 업데이트 - 현재 단계:', currentStep);
            
            // 기존 도움말 모두 숨기기
            this.helpSystem.hideHelp();
            
            // 새로운 단계의 도움말 표시
            if (currentStep === 1) {
                this.helpSystem.showHelp('step1');
            } else if (currentStep === 2) {
                this.helpSystem.showHelp('step2');
                
                // 2단계에서 3초 후 자동으로 3단계로 전환
                setTimeout(() => {
                    if (this.helpSystem && this.helpSystem.isHelpActive()) {
                        this.helpSystem.showHelp('step3');
                    }
                }, 3000); // 3초 후 자동 전환
                
            } else if (currentStep === 3) {
                this.helpSystem.showHelp('step2');

                this.helpSystem.showHelp('step3');
            }
        }
    }
}

// 테스트용 함수들
function setTestData() {
    // 여러 커피 테스트 데이터 설정
    const testMenus = [
        { name: '아메리카노', quantity: 1 },
        { name: '카페라떼', quantity: 1 },
        { name: '카푸치노', quantity: 1 }
    ];
    localStorage.setItem('selectedMenuItems', JSON.stringify(testMenus));
    console.log('테스트 데이터 설정 완료:', testMenus);
    location.reload(); // 페이지 새로고침
}

function setSingleCoffee(coffeeName) {
    const singleMenu = [{ name: coffeeName, quantity: 1 }];
    localStorage.setItem('selectedMenuItems', JSON.stringify(singleMenu));
    console.log(`단일 커피 설정 완료: ${coffeeName}`);
    location.reload(); // 페이지 새로고침
}

function clearTestData() {
    localStorage.removeItem('selectedMenuItems');
    localStorage.removeItem('testMode');
    console.log('테스트 데이터 삭제 완료');
    location.reload();
}

// 실시간 디버깅 함수
function debugCurrentData() {
    console.log('=== 현재 상태 디버깅 ===');
    console.log('URL:', window.location.href);
    console.log('selectedMenuItems:', localStorage.getItem('selectedMenuItems'));
    
    if (window.optionSystem) {
        console.log('옵션 시스템 커피 목록:', window.optionSystem.selectedMenuItems);
        console.log('현재 커피 인덱스:', window.optionSystem.currentCoffeeIndex);
        console.log('기본 가격들:', window.optionSystem.basePrices);
        console.log('현재 가격들 (옵션 포함):', window.optionSystem.currentPrices);
        
        if (window.optionSystem.selectedMenuItems && window.optionSystem.selectedMenuItems.length > 0) {
            console.log('현재 커피:', window.optionSystem.selectedMenuItems[window.optionSystem.currentCoffeeIndex]);
            
            // 각 커피별 가격 변동 표시
            window.optionSystem.selectedMenuItems.forEach((coffee, index) => {
                const basePrice = window.optionSystem.basePrices[index];
                const currentPrice = window.optionSystem.currentPrices[index];
                const increase = currentPrice - basePrice;
                console.log(`${coffee.name}: ${basePrice}원 → ${currentPrice}원 (${increase > 0 ? '+' : ''}${increase}원)`);
            });
        }
    }
    console.log('========================');
}

// 가격 증가 테스트 함수
function testPriceIncrease() {
    if (!window.optionSystem) {
        console.log('옵션 시스템이 로드되지 않았습니다.');
        return;
    }
    
    console.log('=== 가격 증가 테스트 ===');
    console.log('1. 진하게 옵션 선택 테스트...');
    window.optionSystem.selectOption('strong');
    
    setTimeout(() => {
        console.log('2. 더 달게 옵션 추가 테스트...');
        window.optionSystem.selectOption('sweet');
        
        setTimeout(() => {
            console.log('3. 최종 가격 확인...');
            debugCurrentData();
        }, 1000);
    }, 1000);
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    const optionSystem = new OptionSelectionSystem();
    
    // 전역 객체로 등록 (디버깅용)
    window.optionSystem = optionSystem;
    
    // 테스트 함수들도 전역으로 등록
    window.setTestData = setTestData;
    window.setSingleCoffee = setSingleCoffee;
    window.clearTestData = clearTestData;
    window.debugCurrentData = debugCurrentData;
    window.testPriceIncrease = testPriceIncrease;
}); 