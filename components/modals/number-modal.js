/**
 * 번호 조회 모달 컴포넌트
 * 휴대폰 번호를 입력받아 할인 혜택을 조회하는 모달
 */
const NumberModal = {
    modal: null,
    isOpen: false,
    phoneInput: null,
    errorElement: null,
    
    // 초기화
    init() {
        this.modal = document.getElementById('numberModal');
        this.phoneInput = document.getElementById('phoneNumber');
        this.errorElement = document.getElementById('phoneError');
        
        if (this.modal) {
            this.setupEventListeners();
            console.log('NumberModal 초기화 완료');
        } else {
            console.error('NumberModal: 모달 요소를 찾을 수 없습니다.');
        }
    },
    
    // 숫자 자판 이벤트 리스너 설정
    setupKeypadEventListeners() {
        // 숫자 자판 버튼들에 이벤트 리스너 추가
        const keypadButtons = document.querySelectorAll('.number-modal .keypad-btn');
        
        keypadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const number = button.getAttribute('data-number');
                const action = button.getAttribute('data-action');
                
                if (number) {
                    this.addNumberToInput(number);
                } else if (action === 'backspace') {
                    this.removeLastNumber();
                }
            });
        });
    },
    
    // 입력 필드에 숫자 추가
    addNumberToInput(number) {
        if (!this.phoneInput) return;
        
        // 현재 입력값에서 숫자만 추출
        let currentValue = this.phoneInput.value.replace(/[^\d]/g, '');
        
        // 최대 11자리까지만 입력 허용
        if (currentValue.length >= 11) return;
        
        // 숫자 추가
        currentValue += number;
        
        // 포맷팅 적용
        this.phoneInput.value = currentValue;
        this.formatPhoneNumber(this.phoneInput);
        
        // 에러 숨기기
        this.hideError();
    },
    
    // 마지막 숫자 제거
    removeLastNumber() {
        if (!this.phoneInput) return;
        
        // 현재 입력값에서 숫자만 추출
        let currentValue = this.phoneInput.value.replace(/[^\d]/g, '');
        
        // 마지막 문자 제거
        if (currentValue.length > 0) {
            currentValue = currentValue.slice(0, -1);
            
            // 포맷팅 적용
            this.phoneInput.value = currentValue;
            this.formatPhoneNumber(this.phoneInput);
        }
        
        // 에러 숨기기
        this.hideError();
    },

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 배경 클릭 시 모달 닫기
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                    this.close();
                }
            });
        }
        
        // 휴대폰 번호 입력 포맷팅
        if (this.phoneInput) {
            this.phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e.target);
                this.hideError();
            });
            
            // 엔터 키로 확인
            this.phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.confirmPhoneNumber();
                }
            });
        }
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
        
        // 숫자 자판 이벤트 리스너
        this.setupKeypadEventListeners();
    },
    
    // 모달 열기
    open() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.isOpen = true;
            document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
            
            // 하단 패널 z-index 임시 낮춤 (모달과의 충돌 방지)
            const bottomPanel = document.querySelector('.bottom-panel');
            if (bottomPanel) {
                bottomPanel.style.zIndex = '1';
            }
            
            // help-system 화살표들 완전히 숨김 (모달과의 충돌 방지)
            const helpArrows = document.querySelectorAll('.help-arrow');
            helpArrows.forEach(arrow => {
                arrow.style.visibility = 'hidden';
                arrow.style.display = 'none';
                arrow.setAttribute('data-hidden-by-modal', 'true');
            });
            
            // 입력 필드 초기화 및 포커스
            if (this.phoneInput) {
                this.phoneInput.value = '';
                this.phoneInput.focus();
            }
            this.hideError();
        }
    },
    
    // 모달 닫기
    close() {
        if (this.modal) {
            this.modal.classList.add('hidden');
            this.isOpen = false;
            document.body.style.overflow = ''; // 스크롤 복원
            
            // 하단 패널 z-index 원복
            const bottomPanel = document.querySelector('.bottom-panel');
            if (bottomPanel) {
                bottomPanel.style.zIndex = '';
            }
            
            // help-system 화살표들 다시 표시 (모달로 인해 숨겨진 것만)
            const hiddenArrows = document.querySelectorAll('.help-arrow[data-hidden-by-modal="true"]');
            hiddenArrows.forEach(arrow => {
                arrow.style.visibility = '';
                arrow.style.display = '';
                arrow.removeAttribute('data-hidden-by-modal');
            });
            
            // 입력값 및 에러 초기화
            if (this.phoneInput) {
                this.phoneInput.value = '';
            }
            this.hideError();
        }
    },
    
    // 휴대폰 번호 포맷팅 (010-0000-0000)
    formatPhoneNumber(input) {
        let value = input.value.replace(/[^\d]/g, ''); // 숫자만 추출
        
        if (value.length <= 3) {
            input.value = value;
        } else if (value.length <= 7) {
            input.value = value.slice(0, 3) + '-' + value.slice(3);
        } else {
            input.value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
    },
    
    // 휴대폰 번호 유효성 검사
    validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^010-\d{4}-\d{4}$/;
        return phoneRegex.test(phoneNumber);
    },
    
    // 에러 표시
    showError(message = '올바른 휴대폰 번호를 입력해주세요.') {
        if (this.errorElement) {
            this.errorElement.textContent = message;
            this.errorElement.classList.remove('hidden');
        }
        
        if (this.phoneInput) {
            this.phoneInput.classList.add('error');
        }
    },
    
    // 에러 숨기기
    hideError() {
        if (this.errorElement) {
            this.errorElement.classList.add('hidden');
        }
        
        if (this.phoneInput) {
            this.phoneInput.classList.remove('error');
        }
    },
    
    // 휴대폰 번호 확인
    confirmPhoneNumber() {
        const phoneNumber = this.phoneInput ? this.phoneInput.value : '';
        
        if (!phoneNumber) {
            this.showError('휴대폰 번호를 입력해주세요.');
            return;
        }
        
        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showError('올바른 휴대폰 번호를 입력해주세요. (예: 010-0000-0000)');
            return;
        }
        
        // 번호 조회 시뮬레이션
        this.processPhoneNumber(phoneNumber);
    },
    
    // 휴대폰 번호 처리
    processPhoneNumber(phoneNumber) {
        console.log('휴대폰 번호 조회:', phoneNumber);
        
        // 로딩 효과 (선택사항)
        this.showLoading();
        
        // 시뮬레이션 딜레이
        setTimeout(() => {
            this.hideLoading();
            this.close();
            this.onNumberVerified(phoneNumber);
        }, 1500);
    },
    
    // 로딩 표시
    showLoading() {
        const confirmBtn = document.querySelector('.number-modal .btn-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.textContent = '조회 중...';
        }
    },
    
    // 로딩 숨기기
    hideLoading() {
        const confirmBtn = document.querySelector('.number-modal .btn-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = '확인';
        }
    },
    
    // 번호 인증 완료 처리
    onNumberVerified(phoneNumber) {
        console.log('번호 인증 완료:', phoneNumber);
        
        // 할인 페이지 인스턴스가 있다면 해당 메서드 호출
        if (window.discountPageInstance && typeof window.discountPageInstance.onNumberVerified === 'function') {
            window.discountPageInstance.onNumberVerified(phoneNumber);
        }
        // 적립 페이지 인스턴스가 있다면 해당 메서드 호출
        else if (window.pointPageInstance && typeof window.pointPageInstance.onNumberVerified === 'function') {
            window.pointPageInstance.onNumberVerified(phoneNumber);
        } else {
            // 기본 처리 (다른 페이지에서 사용될 때)
            console.log('페이지 인스턴스를 찾을 수 없습니다. 기본 처리를 진행합니다.');
            console.log(`휴대폰 번호 ${phoneNumber}로 처리 완료`);
        }
        
        // 실제 구현 시에는 서버에 휴대폰 번호를 전송하여 할인/적립 정보를 가져오고
        // 메뉴 가격에 할인을 적용하거나 적립을 처리하는 로직이 들어갑니다.
    }
};

// 전역 함수들 (HTML에서 직접 호출)
function openNumberModal() {
    NumberModal.open();
}

function closeNumberModal() {
    NumberModal.close();
}

function confirmPhoneNumber() {
    NumberModal.confirmPhoneNumber();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    NumberModal.init();
    
    // 추가적인 초기화 재시도 (DOM 요소가 늦게 로드되는 경우 대비)
    setTimeout(() => {
        if (!NumberModal.modal || !NumberModal.phoneInput) {
            console.log('NumberModal 재초기화 시도');
            NumberModal.init();
        }
    }, 500);
});

// 윈도우 로드 시에도 초기화 시도 (모든 리소스 로드 완료 후)
window.addEventListener('load', () => {
    if (!NumberModal.modal || !NumberModal.phoneInput) {
        console.log('Window load 시 NumberModal 초기화 시도');
        NumberModal.init();
    }
});

// 모듈 내보내기 (ES6 모듈 사용 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumberModal;
}

// 전역 객체로 등록 (브라우저 환경)
if (typeof window !== 'undefined') {
    window.NumberModal = NumberModal;
} 