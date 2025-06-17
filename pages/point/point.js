class PointPage {
    constructor() {
        this.selectedPointMethods = []; // 배열로 변경하여 중복 선택 지원
        this.orderData = null;
        this.helpSystem = new HelpSystem();
        this.bottomPanel = null;
        // 적립 페이지 인스턴스를 전역으로 등록
        window.pointPageInstance = this;
        this.init();
    }

    async init() {
        console.log('적립 페이지 초기화 시작');
        this.loadOrderData();
        await this.initBottomPanel();
        this.setupHelpTargets();
        this.initPointMethods();
        this.updatePriceSummary();
        console.log('적립 페이지 초기화 완료. 현재 주문 데이터:', this.orderData);
    }

    // 하단 패널 초기화
    async initBottomPanel() {
        this.bottomPanel = new BottomPanel({
            container: document.querySelector('.screen'),
            totalAmount: this.orderData ? this.orderData.totalAmount : 0,
            discountAmount: this.orderData ? this.orderData.discountAmount || 0 : 0,
            finalAmount: this.orderData ? this.orderData.finalAmount || this.orderData.totalAmount : 0,
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
        const finalOrderWithDiscount = localStorage.getItem('finalOrderWithDiscount');
        if (finalOrderWithDiscount) {
            this.orderData = JSON.parse(finalOrderWithDiscount);
            console.log('로드된 주문 데이터 (할인 포함):', this.orderData);
        } else {
            // 할인 정보가 없는 경우 기본 주문 데이터 로드
            const finalOrder = localStorage.getItem('finalOrder');
            if (finalOrder) {
                this.orderData = JSON.parse(finalOrder);
                console.log('로드된 기본 주문 데이터:', this.orderData);
            } else {
                console.warn('주문 데이터가 없습니다.');
                // 테스트용 기본 데이터
                this.orderData = {
                    totalAmount: 2500,
                    finalAmount: 2500,
                    items: []
                };
            }
        }
    }

    // 적립 방법 선택 이벤트 초기화
    initPointMethods() {
        const pointMethods = document.querySelectorAll('.discount-method');
        
        pointMethods.forEach(method => {
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
                    this.selectedPointMethods = this.selectedPointMethods.filter(m => m !== methodType);
                } else {
                    method.classList.add('selected');
                    if (!this.selectedPointMethods.includes(methodType)) {
                        this.selectedPointMethods.push(methodType);
                    }
                }
                
                console.log('선택된 적립 방법들:', this.selectedPointMethods);
                this.updatePriceSummary();
                this.updateHelpStatus();
            });
        });
    }

    // 바코드 모달 열기
    openBarcodeModal() {
        console.log('바코드 모달을 엽니다.');
        if (typeof openBarcodeModal === 'function') {
            openBarcodeModal();
        } else if (window.BarcodeModal) {
            window.BarcodeModal.open();
        } else {
            alert('바코드 스캔 기능이 준비되지 않았습니다.');
        }
    }

    // 번호 조회 모달 열기 (내장된 모달 사용)
    openNumberModal() {
        console.log('번호 조회 모달을 엽니다.');
        
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
            
            // 키패드 리스너 플래그 리셋
            this.keypadListenersSet = false;
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
        // 기존 리스너가 이미 설정되어 있다면 중복 설정 방지
        if (this.keypadListenersSet) {
            return;
        }
        
        const keypadBtns = document.querySelectorAll('#numberModal .keypad-btn');
        
        keypadBtns.forEach(btn => {
            btn.addEventListener('click', this.handleKeypadClick.bind(this));
        });
        
        this.keypadListenersSet = true;
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
        console.log('바코드 스캔 완료:', barcodeData);
        
        // 바코드 적립 방법 선택
        const barcodeMethod = document.querySelector('.discount-method[data-method="barcode"]');
        if (barcodeMethod) {
            // 바코드 적립 선택
            barcodeMethod.classList.add('selected');
            if (!this.selectedPointMethods.includes('barcode')) {
                this.selectedPointMethods.push('barcode');
            }
            
            console.log('바코드 적립이 적용되었습니다:', this.selectedPointMethods);
            
            this.updatePriceSummary();
            this.updateHelpStatus();
            
            // 자동으로 결제 화면으로 이동
            console.log('바코드 적립 완료 - 결제 화면으로 이동합니다.');
            this.proceedToNext();
        }
    }

    // 번호 인증 완료 처리 (번호 모달에서 호출됨)
    onNumberVerified(phoneNumber) {
        console.log('번호 인증 완료:', phoneNumber);
        
        // 번호 적립 방법 선택
        const numberMethod = document.querySelector('.discount-method[data-method="number"]');
        if (numberMethod) {
            // 번호 적립 선택
            numberMethod.classList.add('selected');
            if (!this.selectedPointMethods.includes('number')) {
                this.selectedPointMethods.push('number');
            }
            
            console.log('번호 적립이 적용되었습니다:', this.selectedPointMethods);
            this.updatePriceSummary();
            this.updateHelpStatus();
            
            // 1초 후 자동으로 결제 화면으로 이동
            this.proceedToNext();
        }
    }



    // 가격 요약 업데이트 (적립 화면에서는 가격 변경 없음)
    updatePriceSummary() {
        if (!this.orderData || !this.bottomPanel) return;
        
        // 총 주문 금액은 항상 원래 메뉴 금액을 사용
        const totalAmount = this.orderData.totalAmount;
        const discountAmount = this.orderData.discountAmount || 0;
        const finalAmount = this.orderData.finalAmount || this.orderData.totalAmount;
        
        console.log('가격 업데이트 (적립 화면):', {
            totalAmount,
            discountAmount,
            finalAmount,
            selectedMethods: this.selectedPointMethods
        });
        
        // 적립 화면에서는 가격 변경 없이 현재 가격 유지
        this.bottomPanel.setPrices(totalAmount, discountAmount, finalAmount);
    }

    // 다음 단계로 이동
    proceedToNext() {
        if (!this.orderData) {
            console.error('주문 정보가 없습니다.');
            return;
        }

        // 최종 주문 정보에 적립 정보 추가
        const finalOrderWithPoint = {
            ...this.orderData,
            pointMethods: this.selectedPointMethods
        };

        // localStorage에 최종 주문 정보 저장
        localStorage.setItem('finalOrderWithPoint', JSON.stringify(finalOrderWithPoint));

        console.log('최종 주문 정보 (적립 포함) 저장 완료:', finalOrderWithPoint);
        console.log('결제 페이지로 이동 중...');

        // 결제 페이지로 이동
        try {
            window.location.href = '../payment/payment.html';
        } catch (error) {
            console.error('페이지 이동 중 오류:', error);
            // 대안 방법으로 이동 시도
            setTimeout(() => {
                window.location.assign('../payment/payment.html');
            }, 100);
        }
    }

    // 할인 방법 이름 반환
    getDiscountMethodName(method) {
        switch (method) {
            case 'number': return '번호 조회 할인';
            case 'barcode': return '바코드 할인';
            default: return '할인 없음';
        }
    }

    // 적립 방법 이름 반환
    getPointMethodName(method) {
        switch (method) {
            case 'number': return '번호 조회 적립';
            case 'barcode': return '바코드 적립';
            default: return '적립 없음';
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
        // 모든 주문 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        localStorage.removeItem('finalOrderWithPoint');
        
        alert('결제가 완료되었습니다!\n\n주문해주셔서 감사합니다.');
        
        // 처음 화면으로 이동
        window.location.href = '../start/start.html';
    }

    // 뒤로가기
    goBack() {
        console.log('할인 화면으로 돌아가기');
        window.location.href = '../discount/discount.html';
    }

    // 처음으로
    goHome() {
        console.log('처음으로 돌아가기');
        // 모든 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        localStorage.removeItem('finalOrderWithPoint');
        
        window.location.href = '../start/start.html';
    }

    // 도움 시스템 대상 설정
    setupHelpTargets() {
        this.helpSystem.registerMultipleTargets({
            'general-point': {
                selector: '.general-discount .section-title',
                type: 'left',
                position: 'end',
                offsetX: 300,
                offsetY: -20,
                message: '일반 적립 방법을 선택해주세요'
            },
            'complete': {
                selector: '.primary-button',
                type: 'bottom',
                offsetX: -550,
                offsetY: -250,
                message: '적립이 필요 없으시면, 다음으로 버튼을 눌러주세요',
                textPosition: 'left'
            }
        });
    }

    // 현재 필요한 단계 판단
    determineCurrentStep() {
        // 일반 적립이 선택되지 않았다면
        const generalSelected = document.querySelector('.discount-method.selected');
        if (!generalSelected) {
            return 'general-point';
        }
        
        // 일반 적립이 선택되면 완료
        return 'complete';
    }

    // 도움 요청
    requestHelp() {
        console.log('도움말 요청');
        
        // 일반 적립 텍스트에 하이라이팅 적용 (시간제한 없음)
        this.helpSystem.showHelp('general-point');
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
let pointPageInstance;

// 페이지 로드 시 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    pointPageInstance = new PointPage();
    window.pointPageInstance = pointPageInstance; // 모달에서 접근 가능하도록
    console.log('PointPage 인스턴스가 window.pointPageInstance에 설정되었습니다.');
});

function goBack() {
    if (pointPageInstance) {
        pointPageInstance.goBack();
    }
}

function goHome() {
    if (pointPageInstance) {
        pointPageInstance.goHome();
    }
}

function requestHelp() {
    if (pointPageInstance) {
        pointPageInstance.requestHelp();
    }
}

function proceedToNext() {
    if (pointPageInstance) {
        pointPageInstance.proceedToNext();
    }
}

// HTML에서 호출되는 모달 관련 전역 함수들
function closeNumberModal() {
    if (pointPageInstance) {
        pointPageInstance.closeNumberModal();
    }
}

function confirmPhoneNumber() {
    if (pointPageInstance) {
        pointPageInstance.confirmPhoneNumber();
    }
} 