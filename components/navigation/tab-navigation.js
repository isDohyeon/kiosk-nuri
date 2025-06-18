/**
 * 재사용 가능한 탭 네비게이션 컴포넌트
 */
class TabNavigation {
    constructor(options = {}) {
        this.currentTab = options.activeTab || 'menu';
        this.onTabChange = options.onTabChange || null;
        this.container = options.container || document.body;
        
        this.tabConfig = {
            menu: { text: '메뉴', background: '.tab-menu', textElement: '.tab-menu-text' },
            option: { text: '옵션', background: '.tab-option', textElement: '.tab-option-text' },
            benefit: { text: '할인', background: '.tab-benefit', textElement: '.tab-benefit-text' },
            payment: { text: '계산', background: '.tab-payment', textElement: '.tab-payment-text' },
            point: { text: '적립', background: '.tab-point', textElement: '.tab-point-text' }
        };
        
        this.init();
    }

    /**
     * 컴포넌트 초기화
     */
    init() {
        console.log('TabNavigation 초기화 시작');
        this.renderHTML();
        this.setupEventListeners();
        this.setActiveTab(this.currentTab);
        console.log('TabNavigation 컴포넌트 초기화 완료');
    }

    /**
     * HTML 직접 렌더링 (fetch 대신)
     */
    renderHTML() {
        console.log('TabNavigation HTML 렌더링 시작');
        
        const html = `
            <div class="tab-navigation">
                <div class="tab-container">
                    <!-- 상단 메인 탭 버튼들 -->
                    <div class="tab-background tab-menu"></div>
                    <div class="tab-background tab-option"></div>
                    <div class="tab-background tab-benefit"></div>
                    <div class="tab-background tab-point"></div>
                    <div class="tab-background tab-payment"></div>
                    
                    <!-- 메인 탭 텍스트들 -->
                    <div class="tab-text tab-menu-text">메뉴</div>
                    <div class="tab-text tab-option-text">옵션</div>
                    <div class="tab-text tab-benefit-text">할인</div>
                    <div class="tab-text tab-point-text">적립</div>
                    <div class="tab-text tab-payment-text">계산</div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        console.log('TabNavigation HTML 렌더링 완료');
    }

    /**
     * 현재 페이지 위치에 따른 기본 경로 계산
     */
    getBasePath() {
        const currentPath = window.location.pathname;
        
        // 페이지별 기본 경로 계산
        if (currentPath.includes('/pages/menu/')) {
            return '../../..';
        } else if (currentPath.includes('/pages/')) {
            return '../..';
        } else {
            return '.';
        }
    }

    /**
     * 페이지별 이동 경로 계산
     */
    getPagePath(tabKey) {
        const currentPath = window.location.pathname;
        const basePath = this.getBasePath();
        
        const pageMap = {
            menu: '/pages/nuri/nuri-menu.html',
            option: '/pages/option/option.html',
            benefit: '/pages/discount/discount.html',
            point: '/pages/point/point.html',
            payment: '/pages/payment/payment.html'
        };
        
        // 메뉴 페이지의 경우 일반 메뉴와 누리 메뉴 구분
        if (tabKey === 'menu') {
            if (currentPath.includes('/pages/menu/normal/')) {
                // 일반 메뉴 페이지에서는 누리 메뉴로 이동
                return `${basePath}/pages/nuri/nuri-menu.html`;
            } else {
                // 다른 페이지에서는 누리 메뉴로 이동
                return `${basePath}/pages/nuri/nuri-menu.html`;
            }
        }
        
        return `${basePath}${pageMap[tabKey]}`;
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        console.log('TabNavigation 이벤트 리스너 설정 시작');
        
        // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 이벤트 리스너 설정
        setTimeout(() => {
            Object.keys(this.tabConfig).forEach(tabKey => {
                const textElement = this.container.querySelector(this.tabConfig[tabKey].textElement);
                if (textElement) {
                    console.log(`이벤트 리스너 설정 성공: ${tabKey} -> ${this.tabConfig[tabKey].textElement}`);
                    
                    // 기존 이벤트 리스너 제거 (중복 방지)
                    textElement.removeEventListener('click', textElement._tabClickHandler);
                    
                    // 새 이벤트 리스너 생성 및 저장
                    textElement._tabClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`탭 클릭 이벤트 발생: ${tabKey}`);
                        this.handleTabClick(tabKey);
                    };
                    
                    textElement.addEventListener('click', textElement._tabClickHandler);
                    
                    // 클릭 가능하도록 스타일 설정
                    textElement.style.cursor = 'pointer';
                    textElement.style.userSelect = 'none';
                    textElement.style.pointerEvents = 'auto';
                } else {
                    console.error(`텍스트 요소를 찾을 수 없음: ${this.tabConfig[tabKey].textElement}`);
                }
            });
            console.log('TabNavigation 이벤트 리스너 설정 완료');
        }, 100);
    }

    /**
     * 탭 클릭 핸들러
     */
    handleTabClick(tabKey) {
        console.log(`탭 클릭 핸들러 실행: ${tabKey}`);
        
        // 현재 탭이 클릭된 경우 아무것도 하지 않음
        if (tabKey === this.currentTab) {
            console.log(`현재 탭(${tabKey})이므로 이동하지 않음`);
            return;
        }
        
        // 옵션 탭 클릭 시 특별 처리
        if (tabKey === 'option') {
            this.showOptionMessage();
            return;
        }
        
        // 커스텀 콜백이 있으면 호출, 없으면 기본 네비게이션 처리
        if (this.onTabChange && typeof this.onTabChange === 'function') {
            console.log(`커스텀 콜백 호출: ${tabKey}`);
            this.onTabChange(tabKey);
        } else {
            console.log(`기본 네비게이션 처리: ${tabKey}`);
            this.navigateToPage(tabKey);
        }
    }

    /**
     * 옵션 메시지 표시
     */
    showOptionMessage() {
        console.log('옵션 메시지 표시');
        
        // 기존 메시지가 있으면 제거
        const existingMessage = document.querySelector('.option-message-overlay');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 메시지 오버레이 생성
        const messageOverlay = document.createElement('div');
        messageOverlay.className = 'option-message-overlay';
        messageOverlay.innerHTML = `
            <div class="option-message-container">
                <div class="option-message-content">
                    <div class="option-message-text">먼저 메뉴를 선택해주세요!</div>
                    <button class="option-message-close" onclick="this.closest('.option-message-overlay').remove()">확인</button>
                </div>
            </div>
        `;
        
        // CSS 스타일 추가
        messageOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const messageContainer = messageOverlay.querySelector('.option-message-container');
        messageContainer.style.cssText = `
            background-color: #ffffff;
            border-radius: 20px;
            padding: 40px 60px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
        `;
        
        const messageText = messageOverlay.querySelector('.option-message-text');
        messageText.style.cssText = `
            font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            font-size: 32px;
            font-weight: 600;
            color: #333333;
            margin-bottom: 30px;
            line-height: 1.4;
        `;
        
        const closeButton = messageOverlay.querySelector('.option-message-close');
        closeButton.style.cssText = `
            background-color: #54d761;
            color: #ffffff;
            border: none;
            border-radius: 30px;
            padding: 15px 40px;
            font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            font-size: 28px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // 호버 효과 추가
        closeButton.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#45c451';
            this.style.transform = 'translateY(-2px)';
        });
        
        closeButton.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#54d761';
            this.style.transform = 'translateY(0)';
        });
        
        // 배경 클릭 시 닫기
        messageOverlay.addEventListener('click', function(e) {
            if (e.target === messageOverlay) {
                messageOverlay.remove();
            }
        });
        
        // ESC 키로 닫기
        const handleEscape = function(e) {
            if (e.key === 'Escape') {
                messageOverlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // 문서에 추가
        document.body.appendChild(messageOverlay);
        
        // 3초 후 자동으로 닫기
        setTimeout(() => {
            if (document.body.contains(messageOverlay)) {
                messageOverlay.remove();
            }
        }, 3000);
    }

    /**
     * 페이지 이동 처리
     */
    navigateToPage(tabKey) {
        const targetPath = this.getPagePath(tabKey);
        console.log(`페이지 이동 실행: ${tabKey} -> ${targetPath}`);
        
        // 페이지 이동
        try {
            window.location.href = targetPath;
        } catch (error) {
            console.error(`페이지 이동 실패: ${error}`);
        }
    }

    /**
     * 활성 탭 설정
     */
    setActiveTab(tabKey) {
        console.log(`활성 탭 설정: ${tabKey}`);
        
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

        console.log(`활성 탭 변경 완료: ${tabKey}`);
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
        
        console.log('TabNavigation 컴포넌트 제거됨');
    }
}

// 전역에서 사용할 수 있도록 export
window.TabNavigation = TabNavigation; 