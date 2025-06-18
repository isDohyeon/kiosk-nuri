// 옵션 선택 시스템
class OptionSelectionSystem {
    constructor() {
        this.selectedMenuItems = []; // 여러 커피 저장
        this.currentCoffeeIndex = 0; // 현재 옵션 설정 중인 커피 인덱스
        this.allCoffeeOptions = []; // 모든 커피의 옵션 저장
        this.helpSystem = null; // help system 인스턴스
        
        this.init();
    }

    init() {
        console.log('옵션 선택 시스템 초기화 시작...');
        this.initializeHelpSystem();
        this.loadSelectedMenuItem();
        this.setupEventListeners();
        this.displaySelectedMenuItem();
        this.loadCurrentCoffeeOptions();
        console.log('옵션 선택 시스템 초기화 완료!');
    }

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
                    message: '차갑게 또는 뜨겁게 중 하나를 선택해주세요',
                    textPosition: 'right'
                },
                'step2': {
                    selector: '.options-subtitle',
                    type: 'left',
                    position: 'center',
                    offsetX: 410,
                    offsetY: -5,
                    message: '추가 옵션을 선택하거나 다음 단계로 진행하세요',
                    textPosition: 'right'
                },
                'step3': {
                    selector: '.button.primary',
                    type: 'bottom',
                    position: 'center',
                    offsetX: -420,
                    offsetY: -250,
                    message: '다 골랐어요 버튼을 클릭하세요',
                    textPosition: 'left'
                }
            });
            
            console.log('Help System 초기화 완료');
        } else {
            console.warn('HelpSystem 클래스를 찾을 수 없습니다.');
        }
    }

    loadSelectedMenuItem() {
        console.log('커피 데이터 로딩 시작...');
        
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
                const urlParams = new URLSearchParams(window.location.search);
                const menuName = urlParams.get('menu');
                console.log('URL 파라미터 menu:', menuName);
                
                if (menuName) {
                    this.selectedMenuItems = [{ name: menuName, quantity: 1 }];
                    console.log('✓ URL 파라미터에서 커피 로드:', menuName);
                } else {
                    // 기본값으로 아메리카노 설정
                    this.selectedMenuItems = [{ name: '아메리카노', quantity: 1 }];
                    console.log('✓ 기본값: 아메리카노 설정');
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
        const orderStatusElement = document.querySelector('.order-status');
        if (orderStatusElement && this.selectedMenuItems.length > 0) {
            const currentCoffee = this.selectedMenuItems[this.currentCoffeeIndex];
            const progressText = this.selectedMenuItems.length > 1 
                ? ` (${this.currentCoffeeIndex + 1}/${this.selectedMenuItems.length})`
                : '';
            
            // HTML로 구성하여 커피 이름을 하이라이팅
            orderStatusElement.innerHTML = `지금은 <span class="coffee-name">${currentCoffee.name}</span> 주문 중입니다${progressText}`;
            
            
            console.log('주문 상태 텍스트 업데이트:', `지금은 ${currentCoffee.name} 주문 중입니다${progressText}`);
            console.log('현재 커피 인덱스:', this.currentCoffeeIndex);
            console.log('현재 커피 정보:', currentCoffee);
        } else {
            console.log('주문 상태 업데이트 실패 - 요소 또는 커피 목록 없음');
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
        
        // 이미 선택된 옵션이 있다면 복원
        if (currentOptions.temperature) {
            const tempCard = document.querySelector(`[data-option="${currentOptions.temperature}"]`);
            if (tempCard) tempCard.classList.add('selected');
        }
        
        if (currentOptions.strength) {
            const strengthCard = document.querySelector(`[data-option="${currentOptions.strength}"]`);
            if (strengthCard) strengthCard.classList.add('selected');
        }
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
        const optionElements = document.querySelectorAll('[data-type][data-value]');
        
        optionElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const type = e.currentTarget.dataset.type;
                const value = e.currentTarget.dataset.value;
                
                this.selectOption(type, value);
            });
        });
        
        // 연하게 옵션 추가 (div-wrapper)
        const mildOption = document.querySelector('.div-wrapper');
        if (mildOption) {
            mildOption.dataset.type = 'strength';
            mildOption.dataset.value = 'mild';
            mildOption.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectOption('strength', 'mild');
            });
        }
    }

    selectOption(type, value) {
        console.log('옵션 선택:', type, value);
        
        // 이전 선택 해제
        const sameTypeElements = document.querySelectorAll(`[data-type="${type}"]`);
        sameTypeElements.forEach(el => {
            el.classList.remove('selected');
        });
        
        // div-wrapper의 경우 특별 처리
        if (type === 'strength') {
            const mildWrapper = document.querySelector('.div-wrapper');
            if (mildWrapper) {
                mildWrapper.classList.remove('selected');
            }
        }
        
        // 새로운 선택 적용
        if (type === 'strength' && value === 'mild') {
            const mildWrapper = document.querySelector('.div-wrapper');
            if (mildWrapper) {
                mildWrapper.classList.add('selected');
            }
        } else {
            const selectedElement = document.querySelector(`[data-type="${type}"][data-value="${value}"]`);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
        }
        
        // 옵션 선택 상태 업데이트
        this.optionSelections[type] = value;
        
        console.log('현재 선택된 옵션들:', this.optionSelections);
    }

    setupTabEventListeners() {
        // 메뉴 탭 - 메뉴 페이지로 이동
        const menuTab = document.querySelector('.text-wrapper');
        if (menuTab) {
            menuTab.addEventListener('click', () => {
                this.goToMenu();
            });
        }
        
        // 뒤로 버튼
        const backButton = document.querySelector('.back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.goBack();
            });
        }
        
        // 처음으로 버튼
        const homeButton = document.querySelector('.home-btn');
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                this.goHome();
            });
        }
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
        
        // 새로 완료된 커피들 추가
        this.selectedMenuItems.forEach((coffee, index) => {
            const options = this.allCoffeeOptions[index];
            allCompletedCoffees.push({
                ...coffee,
                options: options,
                completedAt: new Date().toISOString()
            });
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
        const step1Selected = document.querySelector('.step1-options .option-card.selected');
        const step2Selected = document.querySelector('.step2-options .option-card.selected');
        
        if (step1Selected) {
            this.allCoffeeOptions[this.currentCoffeeIndex].temperature = step1Selected.dataset.option;
        }
        
        if (step2Selected) {
            this.allCoffeeOptions[this.currentCoffeeIndex].strength = step2Selected.dataset.option;
        }
    }

    getCurrentRequiredStep() {
        // 1단계 (차갑게/뜨겁게) 선택 확인
        const step1Selected = document.querySelector('.step1-options .option-card.selected');
        
        if (!step1Selected) {
            return 1; // 1단계를 선택해야 함
        }
        
        // 2단계 (진하게/연하게/더 달게) 선택 확인
        const step2Selected = document.querySelector('.step2-options .option-card.selected');
        
        if (!step2Selected) {
            return 2; // 2단계를 선택해야 함
        }
        
        // 모든 단계가 완료됨
        return 3; // 완료 단계 - 다 골랐어요 버튼을 누를 차례
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
            
            // 기존 도움말 모두 숨기기
            this.helpSystem.hideHelp();
            
            // 새로운 단계의 도움말 표시
            if (currentStep === 1) {
                this.helpSystem.showHelp('step1');
            } else if (currentStep === 2) {
                this.helpSystem.showHelp('step2');
            } else if (currentStep === 3) {
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

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    const optionSystem = new OptionSelectionSystem();
    
    // 전역 객체로 등록 (디버깅용)
    window.optionSystem = optionSystem;
    
    // 테스트 함수들도 전역으로 등록
    window.setTestData = setTestData;
    window.setSingleCoffee = setSingleCoffee;
    window.clearTestData = clearTestData;

    // 1단계 옵션 (차갑게/뜨겁게) - 하나만 선택 가능
    const step1Options = document.querySelectorAll('.step1-options .option-card');
    
    step1Options.forEach(card => {
        card.addEventListener('click', function() {
            // 1단계에서 다른 모든 카드의 selected 클래스 제거
            step1Options.forEach(otherCard => {
                otherCard.classList.remove('selected');
            });
            
            // 클릭된 카드에 selected 클래스 추가
            this.classList.add('selected');
            
            // 현재 커피의 옵션 저장
            optionSystem.saveCurrentCoffeeOptions();
            
            // 도움말 상태 업데이트
            optionSystem.updateHelpStatus();
        });
    });

    // 2단계 옵션 (진하게/연하게/더 달게) - 하나만 선택 가능 (라디오 버튼 방식)
    const step2Options = document.querySelectorAll('.step2-options .option-card');
    
    step2Options.forEach(card => {
        card.addEventListener('click', function() {
            // 2단계에서 다른 모든 카드의 selected 클래스 제거
            step2Options.forEach(otherCard => {
                otherCard.classList.remove('selected');
            });
            
            // 클릭된 카드에 selected 클래스 추가
            this.classList.add('selected');
            
            // 현재 커피의 옵션 저장
            optionSystem.saveCurrentCoffeeOptions();
            
            // 도움말 상태 업데이트
            optionSystem.updateHelpStatus();
        });
    });
}); 