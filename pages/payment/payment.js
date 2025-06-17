class PaymentPage {
    constructor() {
        this.selectedPaymentMethod = null;
        this.orderData = null;
        this.helpSystem = new HelpSystem();
        this.bottomPanel = null;
        this.paymentModal = null;
        this.init();
    }

    async init() {
        console.log('결제 페이지 초기화 시작');
        this.loadOrderData();
        await this.initBottomPanel();
        this.initPaymentModal();
        this.setupHelpTargets();
        this.initPaymentMethods();
        this.updatePriceSummary();
        this.renderOrderSummary();
        this.renderOrderItems(); // 주문 내역 카드 렌더링 추가
        console.log('결제 페이지 초기화 완료. 현재 주문 데이터:', this.orderData);
    }

    // 하단 패널 초기화
    async initBottomPanel() {
        this.bottomPanel = new BottomPanel({
            container: document.querySelector('.screen'),
            totalAmount: this.orderData ? this.orderData.finalAmount || this.orderData.totalAmount : 0,
            discountAmount: this.orderData ? this.orderData.discountAmount || 0 : 0,
            finalAmount: this.orderData ? this.orderData.finalAmount || this.orderData.totalAmount : 0,
            secondaryButtonText: '도움이 필요해요',
            primaryButtonText: '결제하기',
            onSecondaryClick: () => this.requestHelp(),
            onPrimaryClick: () => this.proceedToPayment(),
            showDiscountRow: true
        });

        await this.bottomPanel.init();
        console.log('BottomPanel 컴포넌트 초기화 완료');
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
                
                this.updateBottomPanel();
                this.updateHelpStatus();
            });
        });
    }

    // 주문 요약 렌더링
    renderOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        if (!orderItemsContainer || !this.orderData || !this.orderData.items) {
            this.showEmptyOrder();
            return;
        }

        if (this.orderData.items.length === 0) {
            this.showEmptyOrder();
            return;
        }

        let html = '';
        this.orderData.items.forEach(item => {
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

        orderItemsContainer.innerHTML = html;
    }

    // 주문 항목의 옵션 텍스트 생성
    getItemOptionsText(item) {
        let options = [];
        
        if (item.temperature) {
            options.push(item.temperature === 'hot' ? '뜨거움' : '차가움');
        }
        
        if (item.strength) {
            const strengthMap = {
                'yeon': '연하게',
                'dal': '달게',
                'jin': '진하게'
            };
            options.push(strengthMap[item.strength] || item.strength);
        }
        
        if (item.options && item.options.length > 0) {
            options = options.concat(item.options);
        }
        
        return options.length > 0 ? options.join(', ') : '기본';
    }

    // 빈 주문 상태 표시
    showEmptyOrder() {
        const orderItemsContainer = document.getElementById('orderItems');
        if (orderItemsContainer) {
            orderItemsContainer.innerHTML = `
                <div class="empty-order">
                    <div class="empty-order-icon">🛒</div>
                    <div class="empty-order-text">주문 내역이 없습니다.</div>
                </div>
            `;
        }
    }

    // 주문 내역 카드 렌더링 (주문 완료 화면과 동일한 스타일)
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
        if (!this.bottomPanel) return;

        const totalAmount = this.orderData ? this.orderData.totalAmount || 0 : 0;
        const discountAmount = this.orderData ? this.orderData.discountAmount || 0 : 0;
        const finalAmount = this.orderData ? this.orderData.finalAmount || totalAmount : 0;

        this.bottomPanel.setPrices(totalAmount, discountAmount, finalAmount);
    }

    // 하단 패널 업데이트
    updateBottomPanel() {
        if (!this.bottomPanel) return;

        // 결제 방법이 선택되었으면 버튼 텍스트 변경
        if (this.selectedPaymentMethod) {
            this.bottomPanel.setButtonTexts('도움이 필요해요', '결제하기');
        } else {
            this.bottomPanel.setButtonTexts('도움이 필요해요', '결제 방법을 선택해주세요');
        }
    }

    // 결제 모달 초기화
    initPaymentModal() {
        this.paymentModal = new PaymentModal({
            onCancel: () => {
                console.log('결제 취소됨');
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

        // 결제 방식별 설정
        const paymentConfig = this.getPaymentConfig(this.selectedPaymentMethod);
        
        // 결제 방식 이미지 설정
        this.paymentModal.setPaymentIcon(paymentConfig.icon, paymentConfig.name);
        
        // 모달 열기
        this.paymentModal.open({
            title: paymentConfig.title,
            message: `${paymentConfig.name}으로 결제합니다.`,
            status: 'waiting'
        });

        // 자동으로 결제 처리 시작 (2초 후)
        setTimeout(() => {
            this.processPaymentWithModal();
        }, 1000);
    }

    // 결제 방식별 설정 반환
    getPaymentConfig(paymentMethod) {
        const configs = {
            'card': {
                name: '신용카드',
                icon: '../../assets/images/payment-card.png',
                title: '카드를 리더기에 꽂아주세요.'
            },
            'samsung-pay': {
                name: '삼성페이',
                icon: '../../assets/images/payment-samsung.png',
                title: '휴대폰을 리더기에 태그하세요.'
            },
            'kakao-pay': {
                name: '카카오페이',
                icon: '../../assets/images/payment-kakao.png',
                title: 'QR코드를 스캔해주세요.'
            },
            'naver-pay': {
                name: '네이버페이',
                icon: '../../assets/images/payment-naver.png',
                title: 'QR코드를 스캔해주세요.'
            },
            'voucher': {
                name: '교환권',
                icon: '../../assets/images/payment-voucher.png',
                title: '교환권을 제출해주세요.'
            }
        };

        return configs[paymentMethod] || configs['card'];
    }

    // 모달과 함께 결제 처리
    processPaymentWithModal() {
        if (!this.paymentModal) return;
        

        this.paymentModal.setStatus('processing');
        
        // 2초 후 바로 모달 닫고 주문완료 화면으로 이동
        setTimeout(() => {
            this.paymentModal.close();
            this.completePayment(this.currentPaymentData);
        }, 2000);
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

    // 홈으로 이동
    goHome() {
        // 모든 주문 데이터 정리
        localStorage.removeItem('selectedMenuItems');
        localStorage.removeItem('completedCoffees');
        localStorage.removeItem('finalOrder');
        localStorage.removeItem('finalOrderWithDiscount');
        localStorage.removeItem('finalOrderWithPoint');
        localStorage.removeItem('finalPayment');
        
        window.location.href = '../../index.html';
    }

    // 이전 페이지로 이동
    goBack() {
        window.location.href = '../point/point.html';
    }

    // 도움 요청
    requestHelp() {
        if (this.helpSystem) {
            this.helpSystem.showHelp('payment-methods');
            this.helpSystem.showHelp('complete');
        } else {
            alert('도움을 요청했습니다. 직원이 곧 도와드리겠습니다.');
        }
    }

    // 도움 대상 설정
    setupHelpTargets() {
        if (this.helpSystem) {
            this.helpSystem.registerTarget('payment-methods', {
                selector: '.payment-methods',
                type: 'bottom',
                message: '원하시는 결제 방법을 선택해주세요.',
                position: 'center',
                offsetX: -240,
                offsetY: -750,
                textPosition: 'right'
            });

            this.helpSystem.registerTarget('complete', {
                selector: '.primary-button',
                type: 'bottom',
                message: '결제 방법을 선택하셨으면, 결제하기 버튼을 눌러주세요.',
                position: 'center',
                offsetX: -580,
                offsetY: -250,
                textPosition: 'left'
            });
        }
    }

    // 도움 상태 업데이트
    updateHelpStatus() {
        // 결제 방법 선택 상태에 따른 도움 시스템 업데이트
        const currentStep = this.selectedPaymentMethod ? 'payment-selected' : 'payment-selection';
        console.log('현재 단계:', currentStep);
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