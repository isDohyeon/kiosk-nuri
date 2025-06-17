/**
 * 재사용 가능한 탭 네비게이션 컴포넌트
 */
class TabNavigation {
    constructor(options = {}) {
        this.currentTab = options.activeTab || 'menu';
        this.onTabChange = options.onTabChange || (() => {});
        this.container = options.container || document.body;
        
        this.tabConfig = {
            menu: { text: '메뉴', background: '.tab-menu', textElement: '.tab-menu-text' },
            option: { text: '옵션', background: '.tab-option', textElement: '.tab-option-text' },
            benefit: { text: '혜택', background: '.tab-benefit', textElement: '.tab-benefit-text' },
            payment: { text: '계산', background: '.tab-payment', textElement: '.tab-payment-text' },
            point: { text: '적립', background: '.tab-point', textElement: '.tab-point-text' }
        };
        
        this.init();
    }

    /**
     * 컴포넌트 초기화
     */
    async init() {
        await this.loadComponent();
        this.setupEventListeners();
        this.setActiveTab(this.currentTab);
        console.log('TabNavigation 컴포넌트 초기화 완료');
    }

    /**
     * HTML과 CSS 로드
     */
    async loadComponent() {
        try {
            // HTML 로드
            const htmlResponse = await fetch('../../components/navigation/tab-navigation.html');
            const htmlContent = await htmlResponse.text();
            
            // CSS 로드
            const cssResponse = await fetch('../../components/navigation/tab-navigation.css');
            const cssContent = await cssResponse.text();
            
            // CSS 스타일 추가
            if (!document.querySelector('#tab-navigation-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'tab-navigation-styles';
                styleElement.textContent = cssContent;
                document.head.appendChild(styleElement);
            }
            
            // HTML 삽입
            this.container.innerHTML = htmlContent;
            
        } catch (error) {
            console.error('TabNavigation 컴포넌트 로드 실패:', error);
            this.fallbackRender();
        }
    }

    /**
     * 폴백 렌더링 (파일 로드 실패 시)
     */
    fallbackRender() {
        this.container.innerHTML = `
            <div class="tab-navigation">
                <div class="tab-container">
                    <div class="tab-background tab-menu"></div>
                    <div class="tab-background tab-option"></div>
                    <div class="tab-background tab-benefit"></div>
                    <div class="tab-background tab-point"></div>
                    <div class="tab-background tab-payment"></div>
                    
                    <div class="tab-text tab-menu-text">메뉴</div>
                    <div class="tab-text tab-option-text">옵션</div>
                    <div class="tab-text tab-benefit-text">혜택</div>
                    <div class="tab-text tab-point-text">적립</div>
                    <div class="tab-text tab-payment-text">계산</div>
                </div>
            </div>
        `;
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        Object.keys(this.tabConfig).forEach(tabKey => {
            const textElement = this.container.querySelector(this.tabConfig[tabKey].textElement);
            if (textElement) {
                textElement.addEventListener('click', () => {
                    this.handleTabClick(tabKey);
                });
            }
        });
    }

    /**
     * 탭 클릭 핸들러
     */
    handleTabClick(tabKey) {
        console.log(`탭 클릭: ${tabKey}`);
        this.setActiveTab(tabKey);
        this.onTabChange(tabKey);
    }

    /**
     * 활성 탭 설정
     */
    setActiveTab(tabKey) {
        if (!this.tabConfig[tabKey]) {
            console.warn(`알 수 없는 탭: ${tabKey}`);
            return;
        }

        this.currentTab = tabKey;

        // 모든 탭 비활성화
        Object.keys(this.tabConfig).forEach(key => {
            const config = this.tabConfig[key];
            const background = this.container.querySelector(config.background);
            const textElement = this.container.querySelector(config.textElement);
            
            if (background) background.classList.remove('active');
            if (textElement) textElement.classList.remove('active');
        });

        // 선택된 탭 활성화
        const activeConfig = this.tabConfig[tabKey];
        const activeBackground = this.container.querySelector(activeConfig.background);
        const activeText = this.container.querySelector(activeConfig.textElement);
        
        if (activeBackground) activeBackground.classList.add('active');
        if (activeText) activeText.classList.add('active');

        console.log(`활성 탭 변경: ${tabKey}`);
    }

    /**
     * 현재 활성 탭 반환
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * 탭 변경 콜백 설정
     */
    setTabChangeCallback(callback) {
        this.onTabChange = callback;
    }

    /**
     * 특정 탭 비활성화
     */
    disableTab(tabKey) {
        const config = this.tabConfig[tabKey];
        if (config) {
            const textElement = this.container.querySelector(config.textElement);
            if (textElement) {
                textElement.style.pointerEvents = 'none';
                textElement.style.opacity = '0.5';
            }
        }
    }

    /**
     * 특정 탭 활성화
     */
    enableTab(tabKey) {
        const config = this.tabConfig[tabKey];
        if (config) {
            const textElement = this.container.querySelector(config.textElement);
            if (textElement) {
                textElement.style.pointerEvents = 'auto';
                textElement.style.opacity = '1';
            }
        }
    }

    /**
     * 컴포넌트 제거
     */
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        
        const styleElement = document.querySelector('#tab-navigation-styles');
        if (styleElement) {
            styleElement.remove();
        }
        
        console.log('TabNavigation 컴포넌트 제거됨');
    }
}

// 전역에서 사용할 수 있도록 export
window.TabNavigation = TabNavigation; 