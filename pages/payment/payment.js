class PaymentPage {
    constructor() {
        this.selectedPaymentMethod = null;
        this.orderData = null;
        this.helpSystem = new HelpSystem();
        this.paymentModal = null;
        this.paymentTimer = null; // 결제 처리 타이머
        this.processingTimer = null; // 처리 중 타이머
        this.init();
    }

    async init() {
        console.log('결제 페이지 초기화 시작');
        this.loadOrderData();
        this.initPaymentModal();
        this.setupHelpTargets();
        this.initPaymentMethods();
        this.updatePriceSummary();
        this.renderOrderItems(); // 주문 내역 카드 렌더링 추가
        this.showHelpSystem(); // 페이지 로드 시 헬프 시스템 자동 표시
        console.log('결제 페이지 초기화 완료. 현재 주문 데이터:', this.orderData);
    }

    // 주문 데이터 로드 (적립까지 완료된 데이터)
    loadOrderData() {
        // 적립까지 완료된 주문 데이터 로드
        const finalOrderWithPoint = localStorage.getItem('finalOrderWithPoint');
        if (finalOrderWithPoint) {
            this.orderData = JSON.parse(finalOrderWithPoint);
            console.log('로드된 주문 데이터 (적립 포함):', this.orderData);
        } else {
            // 적립 정보가 없는 경우 할인까지 완료된 데이터 로드
            const finalOrderWithDiscount = localStorage.getItem('finalOrderWithDiscount');
            if (finalOrderWithDiscount) {
                this.orderData = JSON.parse(finalOrderWithDiscount);
                console.log('로드된 주문 데이터 (할인 포함):', this.orderData);
            } else {
                // 할인 정보도 없는 경우 기본 주문 데이터 로드
                const finalOrder = localStorage.getItem('finalOrder');
                if (finalOrder) {
                    this.orderData = JSON.parse(finalOrder);
                    console.log('로드된 기본 주문 데이터:', this.orderData);
                } else {
                    console.warn('주문 데이터가 없습니다.');
                    // 테스트용 기본 데이터
                    this.orderData = {
                        totalAmount: 0,
                        finalAmount: 0,
                        items: []
                    };
                }
            }
        }
    }

    // 결제 방법 선택 이벤트 초기화
    initPaymentMethods() {
        const paymentMethods = document.querySelectorAll('.payment-option');
        console.log('결제 방법 요소 개수:', paymentMethods.length);
        
        paymentMethods.forEach((method, index) => {
            console.log(`결제 방법 ${index}:`, method.dataset.method);
            method.addEventListener('click', (e) => {
                console.log('결제 방법 클릭됨:', method.dataset.method);
                const methodType = method.dataset.method;
                
                // 기존 선택 해제
                paymentMethods.forEach(m => {
                    m.classList.remove('selected');
                    console.log('선택 해제:', m.dataset.method);
                });
                
                // 새로운 선택 적용
                method.classList.add('selected');
                this.selectedPaymentMethod = methodType;
                console.log('선택 적용됨:', methodType, '클래스 목록:', method.classList.toString());
                
                // 바로 결제 진행
                setTimeout(() => {
                    this.proceedToPayment();
                }, 300); // 선택 애니메이션이 보이도록 약간의 지연
                
                this.updateHelpStatus();
            });
        });
    }



    // 결제 모달 초기화
    initPaymentModal() {
        this.paymentModal = new PaymentModal({
            onCancel: () => {
                console.log('결제 취소됨');
                // 모든 결제 타이머 정리
                this.clearPaymentTimers();
                this.paymentModal.close();
            },
            onRetry: () => {
                console.log('결제 다시 시도');
                this.processPaymentWithModal();
            },
            onSuccess: () => {
                console.log('결제 성공');
                // 이제 이 콜백은 사용되지 않음 (바로 주문완료 화면으로 이동)
            },
            onError: () => {
                console.log('결제 실패');
            }
        });
    }

    // 결제 진행
    proceedToPayment() {
        if (this.helpSystem) {
            this.helpSystem.hideHelp();
            console.log('주문 완료 - 도움 시스템 비활성화됨');
        }
        if (!this.selectedPaymentMethod) {
            alert('결제 방법을 선택해주세요.');
            return;
        }

        // 결제 정보를 주문 데이터에 추가
        const paymentData = {
            ...this.orderData,
            paymentMethod: this.selectedPaymentMethod,
            paymentTime: new Date().toISOString(),
            status: 'completed'
        };

        // 최종 결제 데이터 저장 (모달에서 사용할 수 있도록)
        this.currentPaymentData = paymentData;
        localStorage.setItem('finalPayment', JSON.stringify(paymentData));

        // 결제 모달 표시
        this.showPaymentModal();
    }

    // 결제 모달 표시
    showPaymentModal() {
        if (!this.paymentModal) return;

        // 기존 타이머들 정리
        this.clearPaymentTimers();

        // 결제 방식별 설정
        const paymentConfig = this.getPaymentConfig(this.selectedPaymentMethod);
        
        // 결제 방식 이미지 설정
        this.paymentModal.setPaymentIcon(paymentConfig.icon, paymentConfig.name);
        
        // 모달 열기 (초기에는 인식중 메시지만 표시)
        this.paymentModal.open({
            title: paymentConfig.title,
            message: `${paymentConfig.name}으로 결제합니다.`,
            status: 'waiting',
            showSpinner: false // 초기에는 스피너 숨김
        });

        // 초기에 "인식중..." 메시지 표시
        this.showRecognizingStatus();

        // 2초 후 결제 진행 메시지와 스피너 표시
        this.paymentTimer = setTimeout(() => {
            this.showProgressIndicators();
            // 추가로 2초 후 처리 중 상태로 변경
            this.processingTimer = setTimeout(() => {
                this.processPaymentWithModal();
            }, 2000);
        }, 2000);
    }

    // 결제 타이머들 정리
    clearPaymentTimers() {
        if (this.paymentTimer) {
            clearTimeout(this.paymentTimer);
            this.paymentTimer = null;
        }
        if (this.processingTimer) {
            clearTimeout(this.processingTimer);
            this.processingTimer = null;
        }
    }

    // 인식중 상태 표시 (검정 텍스트)
    showRecognizingStatus() {
        if (!this.paymentModal) return;
        
        const messageElement = this.paymentModal.modal.querySelector('.status-message');
        const spinner = this.paymentModal.modal.querySelector('.loading-spinner');
        
        if (messageElement) {
            messageElement.textContent = '인식중...';
            messageElement.classList.add('recognizing');
            messageElement.style.display = 'block';
        }
        if (spinner) {
            spinner.style.display = 'none'; // 스피너는 숨김
        }
    }

    // 진행 상태 표시 (초록 메시지와 스피너)
    showProgressIndicators() {
        if (!this.paymentModal) return;
        
        const messageElement = this.paymentModal.modal.querySelector('.status-message');
        const spinner = this.paymentModal.modal.querySelector('.loading-spinner');
        
        if (messageElement) {
            messageElement.textContent = '결제를 진행하고 있습니다...';
            messageElement.classList.remove('recognizing'); // 검정 텍스트 클래스 제거
            messageElement.style.display = 'block';
        }
        if (spinner) {
            spinner.style.display = 'block';
        }
    }

    // 진행 상태 숨김 (메시지와 스피너) - 더 이상 사용되지 않음
    hideProgressIndicators() {
        if (!this.paymentModal) return;
        
        const messageElement = this.paymentModal.modal.querySelector('.status-message');
        const spinner = this.paymentModal.modal.querySelector('.loading-spinner');
        
        if (messageElement) {
            messageElement.style.display = 'none';
        }
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    // 결제 방식별 설정 반환
    getPaymentConfig(paymentMethod) {
        const configs = {
            'card': {
                name: '신용카드',
                icon: '../../assets/images/payment-credit-card.png',
                title: '하단에 카드를 꽂아주세요.'
            },
            'samsung-pay': {
                name: '삼성페이',
                icon: '../../assets/images/payment-pay.png',
                title: '휴대폰을 리더기에 태그하세요.'
            },
            'kakao-pay': {
                name: '카카오페이',
                icon: '../../assets/images/payment-pay.png',
                title: 'QR코드를 스캔해주세요.'
            },
            'naver-pay': {
                name: '네이버페이',
                icon: '../../assets/images/payment-pay.png',
                title: 'QR코드를 스캔해주세요.'
            },
            'voucher': {
                name: '교환권',
                icon: '../../assets/images/payment-pay.png',
                title: '교환권을 제출해주세요.'
            }
        };

        return configs[paymentMethod] || configs['card'];
    }

    // 모달과 함께 결제 처리
    processPaymentWithModal() {
        if (!this.paymentModal) return;
        
        this.paymentModal.setStatus('processing');
        
        // 바로 모달 닫고 주문완료 화면으로 이동 (타이머는 showPaymentModal에서 이미 설정됨)
        this.paymentModal.close();
        this.completePayment(this.currentPaymentData);
    }

    // 결제 처리 시뮬레이션 (기존 메서드 유지 - 다른 곳에서 사용할 수 있음)
    processPayment(paymentData) {
        console.log('결제 처리 중...', paymentData);
        
        // 로딩 상태 표시
        this.showPaymentLoading();
        
        // 실제로는 서버 API 호출
        setTimeout(() => {
            this.completePayment(paymentData);
        }, 2000);
    }

    // 결제 로딩 상태 표시
    showPaymentLoading() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                </div>
                <div class="success-message">
                    결제를 처리하고 있습니다...<br>
                    잠시만 기다려주세요.
                </div>
            `;
        }
    }

    // 결제 완료 처리
    completePayment(paymentData) {
        console.log('결제 완료:', paymentData);
        
        // 전체 화면을 완료 화면으로 교체
        const screen = document.querySelector('.screen');
        if (screen) {
            const orderNumber = this.generateOrderNumber();
            const orderItemsHtml = this.generateOrderItemsForComplete(paymentData);
            
            screen.innerHTML = `
                <div class="payment-complete-screen">
                    <!-- 상단 체크 아이콘 -->
                    <div class="complete-icon-container">
                        <img src="../../assets/images/order-finish.png" alt="주문 완료" class="complete-icon">
                    </div>
                    
                    <!-- 완료 메시지 -->
                    <div class="complete-message">
                        주문이 완료되었습니다.
                    </div>
                    
                    <!-- 주문번호 카드 -->
                    <div class="order-number-card">
                        <div class="order-number-label">주문번호</div>
                        <div class="order-number-value">${orderNumber}</div>
                    </div>
                    
                    <!-- 주문내역 타이틀 -->
                    <div class="order-items-title">주문내역</div>
                    
                    <!-- 주문내역 카드 -->
                    <div class="order-items-card">
                        <div class="order-items-header">
                            <span class="header-menu">메뉴</span>
                            <span class="header-quantity">수량</span>
                            <span class="header-price">가격</span>
                        </div>
                        <div class="order-items-divider"></div>
                        <div class="order-items-section">
                            ${orderItemsHtml}
                        </div>
                    </div>
                    
                    <!-- 하단 버튼들 -->
                    <div class="complete-buttons">
                        <button class="receipt-button" onclick="printReceipt()">영수증 뽑기</button>
                        <button class="home-button" onclick="goHome()">처음으로</button>
                    </div>
                </div>
            `;
        }

        // 자동 홈 이동은 제거 (사용자가 직접 선택하도록)
        console.log('결제 완료 화면 표시 완료');
    }

    // 주문번호 생성 (3자리 랜덤 숫자)
    generateOrderNumber() {
        return Math.floor(Math.random() * 900) + 100; // 100-999 사이의 랜덤 숫자
    }

    // 결제 방법 이름 반환
    getPaymentMethodName(method) {
        const methodNames = {
            'card': '신용카드',
            'samsung-pay': '삼성페이',
            'kakao-pay': '카카오페이',
            'naver-pay': '네이버페이',
            'voucher': '교환권'
        };
        return methodNames[method] || method;
    }

    // 결제 완료 요약 생성
    generatePaymentSummary(paymentData) {
        let html = '<div class="order-items">';
        
        if (paymentData.items && paymentData.items.length > 0) {
            paymentData.items.forEach(item => {
                html += `
                    <div class="order-item">
                        <div class="item-info">
                            <div class="item-name">${item.name}</div>
                        </div>
                        <div class="item-quantity">${item.quantity}개</div>
                        <div class="item-price">₩ ${(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        return html;
    }

    // 완료 화면용 주문내역 생성
    generateOrderItemsForComplete(paymentData) {
        if (!paymentData.items || paymentData.items.length === 0) {
            return '<div class="no-items">주문 내역이 없습니다.</div>';
        }

        let html = '';
        paymentData.items.forEach(item => {
            html += `
                <div class="complete-order-item">
                    <span class="complete-item-name">${item.name}</span>
                    <span class="complete-item-quantity">${item.quantity}개</span>
                    <span class="complete-item-price">₩ ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `;
        });

        return html;
    }

    // 영수증 출력 (시뮬레이션)
    printReceipt() {
        alert('영수증이 출력되었습니다.\n주문해주셔서 감사합니다.');
        console.log('영수증 출력 요청');
    }

    // 홈으로 이동 (완전한 세션 초기화)
    goHome() {
        console.log('완전한 세션 초기화 시작...');
        
        // 모든 주문 관련 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        localStorage.removeItem('finalOrderWithPoint');
        localStorage.removeItem('finalPayment');
        
        // 옵션 관련 데이터 정리
        localStorage.removeItem('coffeeOptions');
        localStorage.removeItem('selectedMenuItem'); // 구버전 호환
        
        // 기타 세션 데이터 정리
        localStorage.removeItem('nonCoffeeItems');
        localStorage.removeItem('orderData');
        localStorage.removeItem('currentStep');
        localStorage.removeItem('selectedOptions');
        localStorage.removeItem('nuri-menu-visited');
        localStorage.removeItem('testMode');
        
        console.log('세션 초기화 완료');
        window.location.href = '../../index.html';
    }

    // 이전 페이지로 이동
    goBack() {
        window.location.href = '../point/point.html';
    }

    // 도움 요청
    requestHelp() {
        if (this.helpSystem) {
            // 기존 헬프 시스템이 있으면 갱신, 없으면 표시
            this.helpSystem.hideHelp();
            setTimeout(() => {
                this.helpSystem.showHelp('payment-methods');
                this.helpSystem.showHelp('order-items-title');
            }, 100);
        } else {
            alert('도움을 요청했습니다. 직원이 곧 도와드리겠습니다.');
        }
    }

    // 도움 대상 설정
    setupHelpTargets() {
        if (this.helpSystem) {
            // 결제 방법 선택 섹션에 대한 도움말
            this.helpSystem.registerTarget('payment-methods', {
                selector: '.payment-section',
                type: 'bottom',
                message: '원하시는 결제 방법을 선택해주세요!',
                textPosition: 'right',
                offsetY: -750,
                offsetX: -210
            });

            // 주문내역 타이틀에 대한 도움말
            this.helpSystem.registerTarget('order-items-title', {
                selector: '.order-items-title',
                type: 'left',
                message: '주문 내역을 확인해주세요!',
                textPosition: 'right',
                offsetX: 210,
                offsetY: -2
            });
        }
    }

    // 헬프 시스템 표시
    showHelpSystem() {
        if (this.helpSystem) {
            // 페이지 요소들이 완전히 로드된 후 헬프 시스템 표시
            setTimeout(() => {
                this.helpSystem.showHelp('payment-methods');
                this.helpSystem.showHelp('order-items-title');
                console.log('결제 페이지 헬프 시스템 표시됨');
            }, 500);
        }
    }

    // 도움 상태 업데이트
    updateHelpStatus() {
        // 결제 방법 선택 상태에 따른 도움 시스템 업데이트
        const currentStep = this.selectedPaymentMethod ? 'payment-selected' : 'payment-selection';
        console.log('현재 단계:', currentStep);
    }

    // 주문 내역 카드 렌더링
    renderOrderItems() {
        const orderItemsContainer = document.getElementById('orderItemsContainer');
        if (!orderItemsContainer || !this.orderData || !this.orderData.items) {
            if (orderItemsContainer) {
                orderItemsContainer.innerHTML = '<div class="no-items">주문 내역이 없습니다.</div>';
            }
            return;
        }

        if (this.orderData.items.length === 0) {
            orderItemsContainer.innerHTML = '<div class="no-items">주문 내역이 없습니다.</div>';
            return;
        }

        let html = '';
        this.orderData.items.forEach(item => {
            html += `
                <div class="complete-order-item">
                    <span class="complete-item-name">${item.name}</span>
                    <span class="complete-item-quantity">${item.quantity}개</span>
                    <span class="complete-item-price">₩ ${(item.price * item.quantity).toLocaleString()}</span>
                </div>
            `;
        });

        orderItemsContainer.innerHTML = html;
    }

    // 가격 요약 업데이트
    updatePriceSummary() {
        const totalAmount = this.orderData ? this.orderData.totalAmount || 0 : 0;
        const discountAmount = this.orderData ? this.orderData.discountAmount || 0 : 0;
        const finalAmount = this.orderData ? this.orderData.finalAmount || totalAmount : 0;

        // 총 주문 금액
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = `₩ ${totalAmount.toLocaleString()}`;
        }

        // 할인 금액 (있는 경우에만 표시)
        const discountRow = document.getElementById('discountRow');
        const discountAmountElement = document.getElementById('discountAmount');
        if (discountAmount > 0) {
            if (discountRow) discountRow.style.display = 'flex';
            if (discountAmountElement) discountAmountElement.textContent = `- ₩ ${discountAmount.toLocaleString()}`;
        } else {
            if (discountRow) discountRow.style.display = 'none';
        }

        // 최종 결제 금액
        const finalAmountElement = document.getElementById('finalAmount');
        if (finalAmountElement) {
            finalAmountElement.textContent = `₩ ${finalAmount.toLocaleString()}`;
        }
    }
}

// 전역 인스턴스 생성
let paymentPageInstance;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    paymentPageInstance = new PaymentPage();
});

// 전역 함수들 (HTML에서 직접 호출용)
function goBack() {
    if (paymentPageInstance) {
        paymentPageInstance.goBack();
    }
}

function goHome() {
    if (paymentPageInstance) {
        paymentPageInstance.goHome();
    }
}

function requestHelp() {
    if (paymentPageInstance) {
        paymentPageInstance.requestHelp();
    }
}

function proceedToNext() {
    if (paymentPageInstance) {
        paymentPageInstance.proceedToPayment();
    }
}

function printReceipt() {
    if (paymentPageInstance) {
        paymentPageInstance.printReceipt();
    } else {
        alert('영수증을 출력합니다. (시뮬레이션)');
        console.log('영수증 출력 요청');
    }
} 