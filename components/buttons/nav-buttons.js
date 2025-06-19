/**
 * 재사용 가능한 네비게이션 버튼 컴포넌트
 * 뒤로 가기와 처음으로 버튼을 동적으로 생성하고 관리합니다.
 */
class NavigationButtons {
    constructor(options = {}) {
        this.options = {
            container: '.nav-buttons',
            showBackButton: true,
            showHomeButton: true,
            centerContent: '',
            style: 'default', // 'default' or 'nuri'
            onBackClick: () => this.defaultBackHandler(),
            onHomeClick: () => this.defaultHomeHandler(),
            ...options
        };

        this.container = null;
        this.backButton = null;
        this.homeButton = null;
        this.centerElement = null;

        this.init();
    }

    init() {
        this.findContainer();
        if (this.container) {
            this.createButtons();
            this.setupEventListeners();
            console.log('NavigationButtons 초기화 완료');
        } else {
            console.warn(`NavigationButtons: 컨테이너를 찾을 수 없습니다 - ${this.options.container}`);
        }
    }

    findContainer() {
        this.container = document.querySelector(this.options.container);
        
        // 누리 스타일 적용
        if (this.options.style === 'nuri' && this.container) {
            this.container.classList.add('nuri-style');
        }
    }

    // 현재 페이지 위치에 따른 이미지 경로 계산
    getImageBasePath() {
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

    createButtons() {
        // 기존 내용 제거
        this.container.innerHTML = '';

        // 뒤로 버튼 생성
        if (this.options.showBackButton) {
            this.backButton = this.createButton('back', '뒤로 가기');
            this.container.appendChild(this.backButton);
        }

        // 가운데 컨텐츠 영역 생성
        this.centerElement = document.createElement('div');
        this.centerElement.className = 'nav-center-content';
        this.centerElement.innerHTML = this.options.centerContent;
        this.container.appendChild(this.centerElement);

        // 처음으로 버튼 생성
        if (this.options.showHomeButton) {
            this.homeButton = this.createButton('home', '처음으로');
            this.container.appendChild(this.homeButton);
        }
    }

    createButton(type, text) {
        const button = document.createElement('button');
        button.className = `nav-btn ${type}`;
        
        // 아이콘 영역 생성
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        
        // 아이콘 이미지 생성 및 설정
        const iconImg = document.createElement('img');
        iconImg.alt = text;
        
        // 버튼 타입에 따라 이미지 설정 (현재 페이지 위치에 따라 경로 조정)
        const basePath = this.getImageBasePath();
        if (type === 'back') {
            iconImg.src = `${basePath}/assets/images/image-back.png`;
        } else if (type === 'home') {
            iconImg.src = `${basePath}/assets/images/image-home-menu.png`;
        }
        
        // 이미지 로드 에러 처리
        iconImg.onerror = () => {
            console.warn(`아이콘 이미지를 로드할 수 없습니다: ${iconImg.src}`);
            iconImg.style.display = 'none';
        };
        
        iconDiv.appendChild(iconImg);
        
        // 텍스트 영역 생성
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = text;
        
        button.appendChild(iconDiv);
        button.appendChild(textDiv);
        
        return button;
    }

    setupEventListeners() {
        if (this.backButton) {
            this.backButton.addEventListener('click', this.options.onBackClick);
        }

        if (this.homeButton) {
            this.homeButton.addEventListener('click', this.options.onHomeClick);
        }
    }

    // 버튼 비활성화/활성화
    setDisabled(disabled = true) {
        if (this.backButton) {
            this.backButton.disabled = disabled;
        }
        if (this.homeButton) {
            this.homeButton.disabled = disabled;
        }
    }

    // 가운데 컨텐츠 업데이트
    updateCenterContent(content) {
        if (this.centerElement) {
            this.centerElement.innerHTML = content;
        }
    }

    // 제목 업데이트 (createWithTitle로 생성된 경우)
    updateTitle(title) {
        if (this.centerElement) {
            this.centerElement.innerHTML = `<h1 class="page-title">${title}</h1>`;
            console.log('NavigationButtons 제목 업데이트:', title);
        }
    }

    // 버튼 텍스트 업데이트
    updateButtonTexts(backText = '뒤로 가기', homeText = '처음으로') {
        if (this.backButton) {
            const textElement = this.backButton.querySelector('.text');
            if (textElement) textElement.textContent = backText;
        }
        if (this.homeButton) {
            const textElement = this.homeButton.querySelector('.text');
            if (textElement) textElement.textContent = homeText;
        }
    }

    // 아이콘 이미지 설정
    setIcons(backIconSrc, homeIconSrc) {
        if (this.backButton && backIconSrc) {
            const iconImg = this.backButton.querySelector('.icon img');
            if (iconImg) {
                iconImg.src = backIconSrc;
                iconImg.style.display = 'block';
                iconImg.onerror = () => {
                    iconImg.style.display = 'none';
                };
            }
        }
        
        if (this.homeButton && homeIconSrc) {
            const iconImg = this.homeButton.querySelector('.icon img');
            if (iconImg) {
                iconImg.src = homeIconSrc;
                iconImg.style.display = 'block';
                iconImg.onerror = () => {
                    iconImg.style.display = 'none';
                };
            }
        }
    }

    // 이벤트 핸들러 업데이트
    updateHandlers(onBackClick, onHomeClick) {
        if (this.backButton && onBackClick) {
            this.backButton.removeEventListener('click', this.options.onBackClick);
            this.options.onBackClick = onBackClick;
            this.backButton.addEventListener('click', this.options.onBackClick);
        }

        if (this.homeButton && onHomeClick) {
            this.homeButton.removeEventListener('click', this.options.onHomeClick);
            this.options.onHomeClick = onHomeClick;
            this.homeButton.addEventListener('click', this.options.onHomeClick);
        }
    }

    // 기본 뒤로 가기 핸들러
    defaultBackHandler() {
        // 이전 페이지 상태 정리
        localStorage.removeItem('currentStep');
        localStorage.removeItem('selectedOptions');
        
        // 브라우저 히스토리 백 또는 특정 페이지로 이동
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 히스토리가 없을 경우 홈으로
            this.defaultHomeHandler();
        }
    }

    // 기본 홈으로 가기 핸들러
    defaultHomeHandler() {
        // 모든 세션 데이터 정리
        localStorage.clear();
        sessionStorage.clear();
        
        // 홈 페이지로 이동
        window.location.href = '../../index.html';
    }

    // 정적 팩토리 메서드들
    static createWithTitle(title, options = {}) {
        return new NavigationButtons({
            centerContent: `<h1 class="page-title">${title}</h1>`,
            ...options
        });
    }

    static createWithOrderStatus(coffeeName, options = {}) {
        return new NavigationButtons({
            centerContent: `<div class="order-status"><span class="coffee-name">${coffeeName}</span>을(를) 선택했어요!</div>`,
            ...options
        });
    }

    // 텍스트 없이 버튼만 표시하는 팩토리 메서드
    static createButtonsOnly(options = {}) {
        return new NavigationButtons({
            centerContent: '', // 가운데 텍스트 없음
            ...options
        });
    }
}

// 전역으로 사용할 수 있도록 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationButtons;
} else {
    window.NavigationButtons = NavigationButtons;
} 