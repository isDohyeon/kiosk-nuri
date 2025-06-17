/**
 * 재사용 가능한 하단 패널 컴포넌트
 * 가격 요약과 액션 버튼을 포함하는 컴포넌트
 */
class BottomPanel {
    constructor(options = {}) {
        this.container = options.container || document.body;
        this.config = {
            // 가격 정보
            totalAmount: options.totalAmount || 0,
            discountAmount: options.discountAmount || 0,
            finalAmount: options.finalAmount || 0,
            
            // 버튼 설정
            secondaryButtonText: options.secondaryButtonText || '도움이 필요해요',
            primaryButtonText: options.primaryButtonText || '다음으로',
            
            // 콜백 함수
            onSecondaryClick: options.onSecondaryClick || null,
            onPrimaryClick: options.onPrimaryClick || null,
            
            // 스타일 옵션
            showDiscountRow: options.showDiscountRow !== false, // 기본값: true
            cssPath: options.cssPath || '../../components/panels/bottom-panel.css'
        };
        
        this.panel = null;
        this.isInitialized = false;
    }

    /**
     * 컴포넌트를 초기화합니다
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.loadCSS();
            await this.loadHTML();
            this.setupEventListeners();
            this.updatePrices();
            this.isInitialized = true;
            console.log('BottomPanel 컴포넌트가 초기화되었습니다.');
        } catch (error) {
            console.error('BottomPanel 초기화 실패:', error);
        }
    }

    /**
     * CSS 파일을 로드합니다
     */
    async loadCSS() {
        // 이미 로드된 CSS인지 확인
        if (document.querySelector('link[href*="bottom-panel.css"]')) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = this.config.cssPath;
        document.head.appendChild(link);

        // CSS 로드 완료를 기다림
        return new Promise((resolve, reject) => {
            link.onload = resolve;
            link.onerror = reject;
        });
    }

    /**
     * HTML 구조를 로드하고 삽입합니다
     */
    async loadHTML() {
        try {
            const htmlPath = this.config.cssPath.replace('.css', '.html');
            const response = await fetch(htmlPath);
            const html = await response.text();
            
            // 기존 bottom-panel이 있다면 제거
            const existingPanel = this.container.querySelector('.bottom-panel');
            if (existingPanel) {
                existingPanel.remove();
            }
            
            // 새로운 패널 추가
            this.container.insertAdjacentHTML('beforeend', html);
            this.panel = this.container.querySelector('.bottom-panel');
            
            // 버튼 텍스트 설정
            this.updateButtonTexts();
            
        } catch (error) {
            console.error('HTML 로드 실패:', error);
            // 폴백: 직접 HTML 생성
            this.createHTMLDirectly();
        }
    }

    /**
     * HTML을 직접 생성합니다 (폴백)
     */
    createHTMLDirectly() {
        const html = `
            <footer class="bottom-panel">
                <div class="price-summary">
                    <div class="price-row">
                        <span class="price-label">총 주문 금액</span>
                        <span class="price-value" id="totalAmount">₩ 0</span>
                    </div>
                    ${this.config.showDiscountRow ? `
                    <div class="price-divider">-</div>
                    <div class="price-row">
                        <span class="price-label">총 할인 금액</span>
                        <span class="price-value" id="discountAmount">₩ 0</span>
                    </div>
                    ` : ''}
                    <div class="price-equals">=</div>
                    <div class="price-row total">
                        <span class="price-label">최종 결제 금액</span>
                        <span class="price-value final" id="finalAmount">₩ 0</span>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="secondary-button" data-action="help">${this.config.secondaryButtonText}</button>
                    <button class="primary-button" data-action="next">${this.config.primaryButtonText}</button>
                </div>
            </footer>
        `;
        
        // 기존 패널 제거
        const existingPanel = this.container.querySelector('.bottom-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        this.container.insertAdjacentHTML('beforeend', html);
        this.panel = this.container.querySelector('.bottom-panel');
    }

    /**
     * 이벤트 리스너를 설정합니다
     */
    setupEventListeners() {
        if (!this.panel) return;

        // 세컨더리 버튼 클릭
        const secondaryBtn = this.panel.querySelector('.secondary-button');
        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                if (this.config.onSecondaryClick) {
                    this.config.onSecondaryClick();
                }
            });
        }

        // 프라이머리 버튼 클릭
        const primaryBtn = this.panel.querySelector('.primary-button');
        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                if (this.config.onPrimaryClick) {
                    this.config.onPrimaryClick();
                }
            });
        }
    }

    /**
     * 버튼 텍스트를 업데이트합니다
     */
    updateButtonTexts() {
        if (!this.panel) return;

        const secondaryBtn = this.panel.querySelector('.secondary-button');
        const primaryBtn = this.panel.querySelector('.primary-button');

        if (secondaryBtn) {
            secondaryBtn.textContent = this.config.secondaryButtonText;
        }
        if (primaryBtn) {
            primaryBtn.textContent = this.config.primaryButtonText;
        }
    }

    /**
     * 가격 정보를 업데이트합니다
     */
    updatePrices() {
        if (!this.panel) return;

        const totalElement = this.panel.querySelector('#totalAmount');
        const discountElement = this.panel.querySelector('#discountAmount');
        const finalElement = this.panel.querySelector('#finalAmount');

        if (totalElement) {
            totalElement.textContent = `₩ ${this.config.totalAmount.toLocaleString()}`;
        }
        if (discountElement && this.config.showDiscountRow) {
            discountElement.textContent = `₩ ${this.config.discountAmount.toLocaleString()}`;
        }
        if (finalElement) {
            finalElement.textContent = `₩ ${this.config.finalAmount.toLocaleString()}`;
        }
    }

    /**
     * 가격 데이터를 설정합니다
     */
    setPrices(totalAmount, discountAmount = 0, finalAmount = null) {
        this.config.totalAmount = totalAmount;
        this.config.discountAmount = discountAmount;
        this.config.finalAmount = finalAmount !== null ? finalAmount : (totalAmount - discountAmount);
        
        this.updatePrices();
    }

    /**
     * 버튼 텍스트를 변경합니다
     */
    setButtonTexts(secondaryText, primaryText) {
        this.config.secondaryButtonText = secondaryText;
        this.config.primaryButtonText = primaryText;
        
        this.updateButtonTexts();
    }

    /**
     * 버튼 콜백을 설정합니다
     */
    setButtonCallbacks(onSecondaryClick, onPrimaryClick) {
        this.config.onSecondaryClick = onSecondaryClick;
        this.config.onPrimaryClick = onPrimaryClick;
    }

    /**
     * 할인 행 표시/숨김을 토글합니다
     */
    toggleDiscountRow(show) {
        this.config.showDiscountRow = show;
        // 재생성이 필요한 경우
        if (this.isInitialized) {
            this.createHTMLDirectly();
            this.setupEventListeners();
            this.updatePrices();
        }
    }

    /**
     * 컴포넌트를 제거합니다
     */
    destroy() {
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
        this.isInitialized = false;
    }
}

// 전역으로 사용할 수 있도록 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BottomPanel;
} else {
    window.BottomPanel = BottomPanel;
} 