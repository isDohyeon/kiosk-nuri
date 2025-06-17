// 바코드 모달 관리 객체
const BarcodeModal = {
    modal: null,
    isOpen: false,
    
    // 초기화
    init() {
        this.modal = document.getElementById('barcodeModal');
        this.setupEventListeners();
    },
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 모달 외부 클릭 시 닫기
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                    this.close();
                }
            });
        }
        
        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
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
            
            // 바코드 스캔 시뮬레이션 시작
            this.startBarcodeSimulation();
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
            
            // 바코드 스캔 중지
            this.stopBarcodeSimulation();
            
            // 안내 텍스트 원래 상태로 복원
            this.resetInstructionText();
        }
    },
    
    // 바코드 스캔 재시도
    retry() {
        console.log('바코드 스캔을 다시 시도합니다.');
        this.startBarcodeSimulation();
        
        // 실제 바코드 스캔 로직이 들어갈 곳
        // 카메라 접근, 바코드 인식 등
    },
    
    // 바코드 스캔 시뮬레이션 시작
    startBarcodeSimulation() {
        // 안내 텍스트 초기화
        this.resetInstructionText();
        
        // 바코드 플레이스홀더에 스캔 중 효과 추가
        const placeholder = document.querySelector('.barcode-placeholder');
        if (placeholder) {
            placeholder.style.borderColor = '#54d761';
            placeholder.style.backgroundColor = '#f0fff0';
        }
        
        // 스캔 시뮬레이션 (실제 구현 시 실제 바코드 스캔 로직으로 대체)
        this.scanTimeout = setTimeout(() => {
            this.onBarcodeScanned('123456789012'); // 샘플 바코드
        }, 3000);
    },
    
    // 바코드 스캔 중지
    stopBarcodeSimulation() {
        if (this.scanTimeout) {
            clearTimeout(this.scanTimeout);
            this.scanTimeout = null;
        }
        
        // 플레이스홀더 원래 상태로 복원
        const placeholder = document.querySelector('.barcode-placeholder');
        if (placeholder) {
            placeholder.style.borderColor = '#9e9fa4';
            placeholder.style.backgroundColor = '#f8f8f8';
        }
    },
    
    // 바코드 스캔 완료 처리 (모달에서는 시각적 피드백만 담당)
    onBarcodeScanned(barcodeData) {
        console.log('바코드 스캔 완료:', barcodeData);
        
        // 성공 효과
        const placeholder = document.querySelector('.barcode-placeholder');
        if (placeholder) {
            placeholder.style.borderColor = '#54d761';
            placeholder.style.backgroundColor = '#e8f5e8';
        }
        
        // 안내 텍스트를 "바코드 인식 성공"으로 변경
        const instructionText = document.querySelector('.instruction-text');
        if (instructionText) {
            instructionText.textContent = '바코드 인식 성공';
            instructionText.style.color = '#54d761';
            instructionText.style.fontWeight = '600';
        }
        
        // 스캔 완료 후 처리 (할인 적용은 할인 페이지에서만)
        setTimeout(() => {
            this.close();
            this.processBarcodeDiscount(barcodeData);
        }, 1000);
    },
    
    // 바코드 할인/적립 처리
    processBarcodeDiscount(barcodeData) {
        // 할인 페이지 인스턴스가 있다면 할인 처리
        if (window.discountPageInstance && typeof window.discountPageInstance.onBarcodeScanned === 'function') {
            window.discountPageInstance.onBarcodeScanned(barcodeData);
        }
        // 적립 페이지 인스턴스가 있다면 적립 처리
        else if (window.pointPageInstance && typeof window.pointPageInstance.onBarcodeScanned === 'function') {
            window.pointPageInstance.onBarcodeScanned(barcodeData);
        } else {
            // 기본 처리 (다른 페이지에서 사용될 때)
            console.log('페이지 인스턴스를 찾을 수 없습니다. 기본 처리를 진행합니다.');
        }
        
        // 실제 구현 시에는 서버에 바코드 데이터를 전송하여 할인/적립 정보를 가져오고
        // 해당 정보를 적용하는 로직이 들어갑니다.
    },
    
    // 바코드 이미지 설정 (사용자가 직접 바코드 이미지를 설정할 때 사용)
    setBarcodeImage(imageSrc) {
        const container = document.querySelector('.barcode-image-container');
        if (container) {
            container.innerHTML = `
                <div class="barcode-placeholder">
                    <img src="${imageSrc}" alt="바코드" class="barcode-image">
                </div>
            `;
        }
    },
    
    // 바코드 이미지 초기화 (기본 바코드 이미지로 복원)
    resetBarcodeImage() {
        const container = document.querySelector('.barcode-image-container');
        if (container) {
            container.innerHTML = `
                <div class="barcode-placeholder">
                    <img src="../../assets/images/discount-barcode.png" alt="바코드" class="barcode-image">
                    <div class="barcode-icon hidden">
                        <div class="barcode-lines">
                            <div class="line thick"></div>
                            <div class="line thin"></div>
                            <div class="line medium"></div>
                            <div class="line thick"></div>
                            <div class="line thin"></div>
                            <div class="line medium"></div>
                            <div class="line thick"></div>
                            <div class="line thin"></div>
                            <div class="line medium"></div>
                            <div class="line thick"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    },
    
    // 안내 텍스트 원래 상태로 복원
    resetInstructionText() {
        const instructionText = document.querySelector('.instruction-text');
        if (instructionText) {
            instructionText.textContent = '하단에 바코드를 인식해주세요.';
            instructionText.style.color = '';
            instructionText.style.fontWeight = '';
        }
    }
};

// 전역 함수들 (HTML에서 직접 호출)
function openBarcodeModal() {
    BarcodeModal.open();
}

function closeBarcodeModal() {
    BarcodeModal.close();
}

function retryBarcodeScan() {
    BarcodeModal.retry();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    BarcodeModal.init();
});

// 모듈 내보내기 (ES6 모듈 사용 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BarcodeModal;
}

// 전역 객체로 등록 (브라우저 환경)
if (typeof window !== 'undefined') {
    window.BarcodeModal = BarcodeModal;
} 