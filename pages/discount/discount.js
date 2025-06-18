class DiscountPage {
    constructor() {
        this.selectedDiscountMethods = []; // 배열로 변경하여 중복 선택 지원
        this.selectedCarrier = null;
        this.tempSelectedCarrier = null; // 통신사 선택 시 임시 저장용
        this.orderData = null;
        this.helpSystem = new HelpSystem();
        this.bottomPanel = null;
        this.keypadEventListeners = []; // 키패드 이벤트 리스너 참조 저장
        this.modalsLoaded = false; // 모달 로드 상태 추적
        this.init();
    }

    async init() {
        console.log('할인 페이지 초기화 시작');
        this.loadOrderData();
        await this.loadModals(); // 모달 컴포넌트 로드
        await this.initBottomPanel();
        this.setupHelpTargets();
        this.initDiscountMethods();
        this.initCarrierOptions();
        this.updatePriceSummary();
        console.log('할인 페이지 초기화 완료. 현재 주문 데이터:', this.orderData);
    }

    // 모달 컴포넌트들을 동적으로 로드
    async loadModals() {
        try {
            // 바코드 모달 HTML 로드
            const barcodeResponse = await fetch('../../components/modals/barcode-modal.html');
            const barcodeHTML = await barcodeResponse.text();
            
            // 번호 조회 모달 HTML 로드
            const numberResponse = await fetch('../../components/modals/number-modal.html');
            const numberHTML = await numberResponse.text();
            
            // HTML에서 모달 부분만 추출하여 body에 추가
            const parser = new DOMParser();
            const barcodeDoc = parser.parseFromString(barcodeHTML, 'text/html');
            const numberDoc = parser.parseFromString(numberHTML, 'text/html');
            
            const barcodeModal = barcodeDoc.getElementById('barcodeModal');
            const numberModal = numberDoc.getElementById('numberModal');
            
            if (barcodeModal) {
                document.body.appendChild(barcodeModal);
            }
            
            if (numberModal) {
                // 번호 조회 모달의 제목을 할인용으로 수정
                const modalTitle = numberModal.querySelector('.modal-title');
                if (modalTitle) {
                    modalTitle.textContent = '할인 번호 조회';
                }
                document.body.appendChild(numberModal);
            }
            
            // 바코드 모달 JavaScript 동적 로드
            await this.loadBarcodeModalScript();
            
            this.modalsLoaded = true;
            console.log('모달 컴포넌트 로드 완료');
        } catch (error) {
            console.error('모달 로드 실패:', error);
        }
    }

    // 바코드 모달 JavaScript 동적 로드
    async loadBarcodeModalScript() {
        return new Promise((resolve, reject) => {
            // 이미 로드되어 있는지 확인
            if (window.BarcodeModal) {
                // 이미 로드된 경우에도 다시 초기화
                window.BarcodeModal.init();
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = '../../components/modals/barcode-modal.js';
            script.onload = () => {
                console.log('바코드 모달 JavaScript 로드 완료');
                
                // 할인 페이지 인스턴스를 전역으로 등록
                window.discountPageInstance = this;
                
                // 바코드 모달 초기화
                if (window.BarcodeModal) {
                    window.BarcodeModal.init();
                    console.log('바코드 모달 초기화 완료');
                }
                
                resolve();
            };
            script.onerror = () => {
                console.error('바코드 모달 JavaScript 로드 실패');
                reject(new Error('바코드 모달 JavaScript 로드 실패'));
            };
            document.head.appendChild(script);
        });
    }

    // 하단 패널 초기화
    async initBottomPanel() {
        this.bottomPanel = new BottomPanel({
            container: document.querySelector('.screen'),
            totalAmount: this.orderData ? this.orderData.totalAmount : 0,
            discountAmount: 0,
            finalAmount: this.orderData ? this.orderData.totalAmount : 0,
            secondaryButtonText: '도움이 필요해요',
            primaryButtonText: '다음으로',
            onSecondaryClick: () => this.requestHelp(),
            onPrimaryClick: () => this.proceedToNext(),
            showDiscountRow: true
        });

        await this.bottomPanel.init();
        console.log('BottomPanel 컴포넌트 초기화 완료');
    }

    // 주문 데이터 로드
    loadOrderData() {
        const finalOrder = localStorage.getItem('finalOrder');
        if (finalOrder) {
            this.orderData = JSON.parse(finalOrder);
            console.log('로드된 주문 데이터:', this.orderData);
        } else {
            console.warn('주문 데이터가 없습니다.');
            // 테스트용 기본 데이터
            this.orderData = {
                totalAmount: 2500,
                items: []
            };
        }
    }

    // 할인 방법 선택 이벤트 초기화
    initDiscountMethods() {
        const discountMethods = document.querySelectorAll('.discount-method');
        
        discountMethods.forEach(method => {
            method.addEventListener('click', () => {
                const methodType = method.dataset.method;
                
                // 바코드 조회인 경우 모달 열기
                if (methodType === 'barcode') {
                    this.openBarcodeModal();
                    return;
                }
                
                // 번호 조회인 경우 모달 열기
                if (methodType === 'number') {
                    this.openNumberModal();
                    return;
                }
                
                // 현재 방법이 이미 선택되어 있다면 해제, 아니면 추가
                if (method.classList.contains('selected')) {
                    method.classList.remove('selected');
                    this.selectedDiscountMethods = this.selectedDiscountMethods.filter(m => m !== methodType);
                } else {
                    method.classList.add('selected');
                    if (!this.selectedDiscountMethods.includes(methodType)) {
                        this.selectedDiscountMethods.push(methodType);
                    }
                }
                
                console.log('선택된 할인 방법들:', this.selectedDiscountMethods);
                this.updatePriceSummary();
                this.updateHelpStatus();
            });
        });
    }

    // 바코드 모달 열기
    openBarcodeModal() {
        console.log('바코드 모달을 엽니다.');
        
        if (!this.modalsLoaded) {
            alert('모달이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        
        console.log('BarcodeModal 객체 확인:', window.BarcodeModal);
        
        if (window.BarcodeModal) {
            console.log('BarcodeModal.open() 호출');
            window.BarcodeModal.open();
        } else {
            console.error('BarcodeModal 객체가 없습니다.');
            alert('바코드 스캔 기능이 준비되지 않았습니다.');
        }
    }

    // 번호 조회 모달 열기
    openNumberModal() {
        console.log('번호 조회 모달을 엽니다.');
        
        if (!this.modalsLoaded) {
            alert('모달이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
            return;
        }
        
        const modal = document.getElementById('numberModal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // 입력 필드 초기화
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput) {
                phoneInput.value = '';
            }
            
            // 에러 메시지 숨기기
            const errorElement = document.getElementById('phoneError');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
            
            // 입력 필드 에러 스타일 제거
            if (phoneInput) {
                phoneInput.classList.remove('error');
            }
            
            // 키패드 이벤트 리스너 설정
            this.setupKeypadEventListeners();
            
            // 배경 스크롤 방지
            document.body.style.overflow = 'hidden';
        } else {
            alert('번호 조회 기능이 준비되지 않았습니다.');
        }
    }

    // 번호 조회 모달 닫기 (내장된 모달 사용)
    closeNumberModal() {
        console.log('번호 조회 모달을 닫습니다.');
        
        const modal = document.getElementById('numberModal');
        if (modal) {
            modal.classList.add('hidden');
            
            // 배경 스크롤 복원
            document.body.style.overflow = '';
            
            // 입력값 초기화
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput) {
                phoneInput.value = '';
                phoneInput.classList.remove('error');
            }
            
            // 에러 메시지 숨기기
            const errorElement = document.getElementById('phoneError');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
            
            // 키패드 이벤트 리스너 제거
            this.removeKeypadEventListeners();
        }
    }

    // 휴대폰 번호 확인 (내장된 모달 사용)
    confirmPhoneNumber() {
        const phoneInput = document.getElementById('phoneNumber');
        const phoneNumber = phoneInput ? phoneInput.value : '';
        
        if (!phoneNumber) {
            this.showPhoneError('휴대폰 번호를 입력해주세요.');
            return;
        }
        
        // 휴대폰 번호 유효성 검사
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        if (!phoneRegex.test(phoneNumber)) {
            this.showPhoneError('올바른 휴대폰 번호를 입력해주세요. (예: 010-0000-0000)');
            return;
        }
        
        // 번호 조회 시뮬레이션
        this.processPhoneNumber(phoneNumber);
    }

    // 휴대폰 번호 처리 (내장된 모달 사용)
    processPhoneNumber(phoneNumber) {
        console.log('휴대폰 번호 조회:', phoneNumber);
        
        // 로딩 효과
        const confirmBtn = document.querySelector('.number-modal .btn-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '조회 중...';
        }
        
        // 시뮬레이션 딜레이
        setTimeout(() => {
            // 로딩 해제
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '확인';
            }
            
            // 모달 닫기
            this.closeNumberModal();
            
            // 번호 인증 처리
            this.onNumberVerified(phoneNumber);
        }, 1500);
    }

    // 휴대폰 번호 에러 표시
    showPhoneError(message) {
        const errorElement = document.getElementById('phoneError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
        
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.classList.add('error');
        }
    }

    // 키패드 이벤트 리스너 설정
    setupKeypadEventListeners() {
        // 기존 리스너들 먼저 제거
        this.removeKeypadEventListeners();
        
        const keypadBtns = document.querySelectorAll('#numberModal .keypad-btn');
        
        keypadBtns.forEach(btn => {
            const handler = this.handleKeypadClick.bind(this);
            btn.addEventListener('click', handler);
            
            // 나중에 제거할 수 있도록 참조 저장
            this.keypadEventListeners.push({
                element: btn,
                type: 'click',
                handler: handler
            });
        });
        
        console.log('키패드 이벤트 리스너 설정 완료:', this.keypadEventListeners.length);
    }

    // 키패드 이벤트 리스너 제거
    removeKeypadEventListeners() {
        this.keypadEventListeners.forEach(({ element, type, handler }) => {
            element.removeEventListener(type, handler);
        });
        this.keypadEventListeners = [];
        console.log('키패드 이벤트 리스너 제거 완료');
    }

    // 키패드 클릭 처리
    handleKeypadClick(event) {
        const btn = event.target;
        const number = btn.getAttribute('data-number');
        const action = btn.getAttribute('data-action');
        
        if (number) {
            this.addNumberToInput(number);
        } else if (action === 'backspace') {
            this.removeLastNumber();
        }
    }

    // 숫자를 입력 필드에 추가
    addNumberToInput(number) {
        const phoneInput = document.getElementById('phoneNumber');
        if (!phoneInput) return;
        
        let currentValue = phoneInput.value.replace(/[^\d]/g, ''); // 숫자만 추출
        
        // 11자리 제한
        if (currentValue.length >= 11) return;
        
        currentValue += number;
        
        // 포맷팅 적용 (010-0000-0000)
        this.formatPhoneNumber(phoneInput, currentValue);
    }

    // 마지막 숫자 제거
    removeLastNumber() {
        const phoneInput = document.getElementById('phoneNumber');
        if (!phoneInput) return;
        
        let currentValue = phoneInput.value.replace(/[^\d]/g, ''); // 숫자만 추출
        
        if (currentValue.length > 0) {
            currentValue = currentValue.slice(0, -1);
            this.formatPhoneNumber(phoneInput, currentValue);
        }
    }

    // 휴대폰 번호 포맷팅 (010-0000-0000)
    formatPhoneNumber(input, value) {
        if (value.length <= 3) {
            input.value = value;
        } else if (value.length <= 7) {
            input.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            input.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
    }

    // 바코드 스캔 완료 처리 (바코드 모달에서 호출됨)
    onBarcodeScanned(barcodeData) {
        console.log('할인 페이지 - 바코드 스캔 완료:', barcodeData);
        
        // 바코드 조회 방법을 선택된 상태로 표시
        const barcodeMethod = document.querySelector('.discount-method[data-method="barcode"]');
        if (barcodeMethod && !barcodeMethod.classList.contains('selected')) {
            barcodeMethod.classList.add('selected');
            if (!this.selectedDiscountMethods.includes('barcode')) {
                this.selectedDiscountMethods.push('barcode');
            }
        }
        
        console.log('선택된 할인 방법들:', this.selectedDiscountMethods);
        this.updatePriceSummary();
        this.updateHelpStatus();
        
        // 바로 적립 화면으로 이동
        setTimeout(() => {
            this.proceedToNext();
        }, 300);
    }

    // 번호 인증 완료 처리 (번호 모달에서 호출됨)
    onNumberVerified(phoneNumber) {
        console.log('번호 인증 완료:', phoneNumber);
        
        // 통신사 할인을 위한 번호 조회인지 확인
        if (this.tempSelectedCarrier) {
            // 통신사 할인 적용
            const carrierOptions = document.querySelectorAll('.carrier-option');
            carrierOptions.forEach(o => o.classList.remove('selected'));
            
            const selectedCarrierOption = document.querySelector(`[data-carrier="${this.tempSelectedCarrier}"]`);
            if (selectedCarrierOption) {
                selectedCarrierOption.classList.add('selected');
            }
            
            this.selectedCarrier = this.tempSelectedCarrier;
            this.tempSelectedCarrier = null; // 임시 변수 초기화
            
            console.log('통신사 할인이 적용되었습니다:', this.selectedCarrier);
            this.updatePriceSummary();
            this.updateHelpStatus();
            
            // 바로 적립 화면으로 이동
            setTimeout(() => {
                this.proceedToNext();
            }, 1000);
        } else {
            // 일반 번호 조회 할인
            const numberMethod = document.querySelector('.discount-method[data-method="number"]');
            if (numberMethod) {
                // 번호 할인 선택
                numberMethod.classList.add('selected');
                if (!this.selectedDiscountMethods.includes('number')) {
                    this.selectedDiscountMethods.push('number');
                }
                
                console.log('번호 할인이 적용되었습니다:', this.selectedDiscountMethods);
                this.updatePriceSummary();
                this.updateHelpStatus();
                
                // 바로 적립 화면으로 이동
                setTimeout(() => {
                    this.proceedToNext();
                }, 1000);
            }
        }
    }

    // 통신사 옵션 이벤트 초기화
    initCarrierOptions() {
        const carrierOptions = document.querySelectorAll('.carrier-option');
        
        carrierOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 선택된 통신사 임시 저장
                this.tempSelectedCarrier = option.dataset.carrier;
                
                console.log('통신사 선택됨, 번호 조회 모달 열기:', this.tempSelectedCarrier);
                
                // 번호 조회 모달 열기
                this.openNumberModal();
            });
        });
    }

    // 가격 요약 업데이트
    updatePriceSummary() {
        if (!this.orderData || !this.bottomPanel) return;
        
        const originalAmount = this.orderData.totalAmount;
        const discountAmount = this.calculateDiscountAmount(originalAmount);
        const finalAmount = originalAmount - discountAmount;
        
        console.log('가격 업데이트:', {
            originalAmount,
            discountAmount,
            finalAmount,
            selectedMethods: this.selectedDiscountMethods,
            selectedCarrier: this.selectedCarrier
        });
        
        // BottomPanel 컴포넌트를 통해 가격 업데이트
        this.bottomPanel.setPrices(originalAmount, discountAmount, finalAmount);
    }

    // 할인 금액 계산
    calculateDiscountAmount(originalAmount) {
        let discountAmount = 0;
        
        console.log('할인 계산 시작:', {
            originalAmount,
            selectedMethods: this.selectedDiscountMethods,
            selectedCarrier: this.selectedCarrier
        });
        
        // 할인 방법이나 통신사 할인이 없으면 할인 없음
        if (this.selectedDiscountMethods.length === 0 && !this.selectedCarrier) {
            console.log('선택된 할인 방법이 없어 할인 없음');
            return 0;
        }
        
        // 선택된 할인 방법들에 따른 할인 (중복 적용)
        this.selectedDiscountMethods.forEach(method => {
            switch (method) {
                case 'number':
                    const numberDiscount = Math.floor(originalAmount * 0.1);
                    discountAmount += numberDiscount;
                    console.log(`번호 조회 할인: ₩${numberDiscount.toLocaleString()}`);
                    break;
                case 'barcode':
                    const barcodeDiscount = Math.floor(originalAmount * 0.1);
                    discountAmount += barcodeDiscount;
                    console.log(`바코드 할인: ₩${barcodeDiscount.toLocaleString()}`);
                    break;
            }
        });
        
        // 통신사 할인
        if (this.selectedCarrier) {
            let carrierDiscount = 0;
            switch (this.selectedCarrier) {
                case 'skt':
                    carrierDiscount = Math.floor(originalAmount * 0.03);
                    break;
                case 'kt':
                    carrierDiscount = Math.floor(originalAmount * 0.04);
                    break;
                case 'uplus':
                    carrierDiscount = Math.floor(originalAmount * 0.05);
                    break;
            }
            discountAmount += carrierDiscount;
            console.log(`통신사 할인 (${this.selectedCarrier}): ₩${carrierDiscount.toLocaleString()}`);
        }
        
        const finalDiscountAmount = Math.min(discountAmount, originalAmount);
        console.log(`총 할인 금액: ₩${finalDiscountAmount.toLocaleString()}`);
        
        return finalDiscountAmount; // 최대 원래 금액까지만
    }

    // 다음 단계로 진행
    proceedToNext() {
        if (!this.orderData) {
            alert('주문 정보가 없습니다.');
            return;
        }

        // 도움 시스템 비활성화
        if (this.helpSystem) {
            this.helpSystem.hideHelp();
            console.log('도움 시스템 비활성화됨');
        }

        // 최종 주문 정보에 할인 정보 추가
        const originalAmount = this.orderData.totalAmount;
        const discountAmount = this.calculateDiscountAmount(originalAmount);
        const finalAmount = originalAmount - discountAmount;

        const finalOrderWithDiscount = {
            ...this.orderData,
            discountMethods: this.selectedDiscountMethods,
            carrier: this.selectedCarrier,
            originalAmount: originalAmount,
            discountAmount: discountAmount,
            finalAmount: finalAmount
        };

        // localStorage에 최종 주문 정보 저장
        localStorage.setItem('finalOrderWithDiscount', JSON.stringify(finalOrderWithDiscount));

        console.log('최종 주문 정보 (할인 포함):', finalOrderWithDiscount);

        // 적립 화면으로 이동
        window.location.href = '../point/point.html';
    }

    // 주문 요약 생성
    generateOrderSummary(orderData) {
        let summary = '=== 최종 주문 내역 ===\n\n';
        
        if (orderData.items && orderData.items.length > 0) {
            orderData.items.forEach(item => {
                const itemName = item.displayName || item.name;
                summary += `${itemName} x${item.quantity} = ₩${(item.price * item.quantity).toLocaleString()}\n`;
            });
        }
        
        summary += `\n원래 금액: ₩${orderData.originalAmount.toLocaleString()}`;
        
        if (orderData.discountAmount > 0) {
            summary += `\n할인 금액: -₩${orderData.discountAmount.toLocaleString()}`;
            if (orderData.discountMethods && orderData.discountMethods.length > 0) {
                const discountNames = orderData.discountMethods.map(method => this.getDiscountMethodName(method));
                summary += ` (${discountNames.join(' + ')}`;
                if (orderData.carrier) {
                    summary += ` + ${this.getCarrierName(orderData.carrier)}`;
                }
                summary += ')';
            }
        }
        
        summary += `\n\n최종 결제 금액: ₩${orderData.finalAmount.toLocaleString()}`;
        summary += '\n\n결제를 진행하시겠습니까?';
        
        return summary;
    }

    // 할인 방법 이름 반환
    getDiscountMethodName(method) {
        switch (method) {
            case 'number': return '번호 조회 할인';
            case 'barcode': return '바코드 할인';
            default: return '할인 없음';
        }
    }

    // 통신사 이름 반환
    getCarrierName(carrier) {
        switch (carrier) {
            case 'skt': return 'T 멤버십';
            case 'kt': return 'KT 멤버십';
            case 'uplus': return 'U+ 멤버십';
            default: return '';
        }
    }

    // 주문 완료
    completeOrder() {
        // 도움 시스템 비활성화
        if (this.helpSystem) {
            this.helpSystem.hideHelp();
            console.log('주문 완료 - 도움 시스템 비활성화됨');
        }
        
        // 모든 주문 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        
        alert('결제가 완료되었습니다!\n\n주문해주셔서 감사합니다.');
        
        // 처음 화면으로 이동
        window.location.href = '../start/start.html';
    }

    // 뒤로가기
    goBack() {
        console.log('메뉴로 돌아가기');
        window.location.href = '../nuri/nuri-menu.html';
    }

    // 처음으로
    goHome() {
        console.log('처음으로 돌아가기');
        // 모든 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        
        window.location.href = '../start/start.html';
    }

    // 도움 시스템 대상 설정
    setupHelpTargets() {
        this.helpSystem.registerMultipleTargets({
            'general-discount': {
                selector: '.general-discount .section-title',
                type: 'left',
                position: 'end',
                offsetX: 370,
                offsetY: -20,
                message: '카페 회원이시면, 회원 할인 방법을 선택해주세요!'
            },
            'carrier-discount': {
                selector: '.carrier-discount .section-title',
                type: 'left',
                position: 'end',
                offsetX: 333,
                offsetY: -19,
                message: '통신사 회원이시면, 통신사 할인을 선택해주세요!'
            },
            'complete': {
                selector: '.primary-button',
                type: 'bottom',
                position: 'center',
                offsetX: -550,
                offsetY: -250,
                message: '할인이 필요 없으시면, 다음으로 버튼을 눌러주세요!',
                textPosition: 'left'
            }
        });
    }

    // 현재 필요한 단계 판단
    determineCurrentStep() {
        // 일반 할인이 선택되지 않았다면
        const generalSelected = document.querySelector('.discount-method.selected');
        if (!generalSelected) {
            return 'general-discount';
        }
        
        // 통신사 할인이 선택되지 않았다면 (선택 안함 제외)
        const carrierSelected = document.querySelector('.carrier-option.selected');
        if (!carrierSelected && !this.selectedDiscountMethods.includes('none')) {
            return 'carrier-discount';
        }
        
        // 모든 선택이 완료되면 다음 버튼 안내
        return 'complete';
    }

    // 도움 요청
    requestHelp() {
        console.log('도움말 요청');
        
        // 모든 도움말을 한 번에 표시
        this.helpSystem.showHelp('general-discount');
        this.helpSystem.showHelp('carrier-discount');
        this.helpSystem.showHelp('complete');
    }

    // 도움말 상태 업데이트
    updateHelpStatus() {
        // 도움말이 활성화되어 있다면 현재 상태에 맞게 업데이트
        if (this.helpSystem.isHelpActive()) {
            const currentStep = this.determineCurrentStep();
            this.helpSystem.showHelp(currentStep);
        }
    }
}

// 전역 함수들 (HTML에서 호출)
let discountPageInstance;

// 페이지 로드 시 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    discountPageInstance = new DiscountPage();
    window.discountPageInstance = discountPageInstance; // 모달에서 접근 가능하도록
    console.log('DiscountPage 인스턴스가 window.discountPageInstance에 설정되었습니다.');
});

function goBack() {
    if (discountPageInstance) {
        discountPageInstance.goBack();
    }
}

function goHome() {
    if (discountPageInstance) {
        discountPageInstance.goHome();
    }
}

function requestHelp() {
    if (discountPageInstance) {
        discountPageInstance.requestHelp();
    }
}

function proceedToNext() {
    if (discountPageInstance) {
        discountPageInstance.proceedToNext();
    }
}

// HTML에서 호출되는 모달 관련 전역 함수들
function closeNumberModal() {
    if (discountPageInstance) {
        discountPageInstance.closeNumberModal();
    }
}

function confirmPhoneNumber() {
    if (discountPageInstance) {
        discountPageInstance.confirmPhoneNumber();
    }
} 