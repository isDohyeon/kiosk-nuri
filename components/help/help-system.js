/**
 * 재사용 가능한 도움 시스템 컴포넌트
 * 특정 요소를 하이라이팅하고 화살표 애니메이션을 표시합니다.
 */
class HelpSystem {
    constructor(options = {}) {
        this.isActive = false;
        this.currentStep = null;
        this.helpTargets = new Map(); // 도움 대상들을 저장
        
        // 기본 설정
        this.config = {
            arrowColor: '#54d761',
            highlightColor: '#54d761',
            animationDuration: '0.8s',
            animationEasing: 'ease-in-out',
            ...options
        };
        
        this.init();
    }

    init() {
        this.injectCSS();
        console.log('HelpSystem 초기화 완료');
    }

    /**
     * 도움 대상을 등록합니다.
     * @param {string} stepKey - 단계 식별자
     * @param {Object} target - 도움 대상 설정
     * @param {string} target.selector - CSS 선택자
     * @param {string} target.type - 화살표 타입 ('left', 'right', 'top', 'bottom')
     * @param {string} target.message - 도움말 메시지 (옵션)
     * @param {string} target.textPosition - 텍스트 위치 ('left', 'right') (옵션, 기본값: 'right')
     * @param {string} target.position - 위치 조정 ('start', 'end', 'center') (옵션)
     * @param {number} target.offsetX - X축 추가 오프셋 (옵션)
     * @param {number} target.offsetY - Y축 추가 오프셋 (옵션)
     */
    registerTarget(stepKey, target) {
        this.helpTargets.set(stepKey, {
            selector: target.selector,
            type: target.type || 'left',
            message: target.message || '',
            textPosition: target.textPosition || 'right',
            position: target.position || 'center',
            offsetX: target.offsetX || 0,
            offsetY: target.offsetY || 0,
            element: null // 실제 DOM 요소는 나중에 찾기
        });
        
        console.log(`도움 대상 등록: ${stepKey}`, target);
    }

    /**
     * 여러 도움 대상을 한번에 등록합니다.
     * @param {Object} targets - 대상들의 객체
     */
    registerMultipleTargets(targets) {
        Object.entries(targets).forEach(([stepKey, target]) => {
            this.registerTarget(stepKey, target);
        });
    }

    /**
     * 도움말을 활성화합니다.
     * @param {string} stepKey - 활성화할 단계 식별자
     */
    showHelp(stepKey) {
        console.log(`도움말 활성화 시도: ${stepKey}`);
        
        const target = this.helpTargets.get(stepKey);
        if (!target) {
            console.warn(`도움 대상을 찾을 수 없습니다: ${stepKey}`);
            return;
        }

        console.log(`대상 설정:`, target);

        // DOM 요소 찾기
        const element = document.querySelector(target.selector);
        if (!element) {
            console.warn(`DOM 요소를 찾을 수 없습니다: ${target.selector}`);
            console.log(`사용 가능한 요소들:`, document.querySelectorAll('.section-title'));
            return;
        }

        console.log(`찾은 요소:`, element);
        target.element = element;
        this.isActive = true;

        // 기존 해당 단계의 화살표 제거 (중복 방지)
        this.removeArrowsForStep(stepKey);

        // 하이라이팅 적용
        this.applyHighlight(element);
        console.log(`하이라이팅 적용됨:`, element.classList.contains('help-highlight'));
        
        // 화살표 추가
        this.addArrow(element, target.type, target.position, target.offsetX, target.offsetY, stepKey, target.message, target.textPosition);
        
        console.log(`도움말 활성화 완료: ${stepKey}`);
    }

    /**
     * 도움말을 비활성화합니다.
     * @param {string} stepKey - 특정 단계만 비활성화 (옵션)
     */
    hideHelp(stepKey = null) {
        if (stepKey) {
            // 특정 단계만 비활성화
            const target = this.helpTargets.get(stepKey);
            if (target && target.element) {
                target.element.classList.remove('help-highlight');
                // 해당 단계의 화살표만 제거
                this.removeArrowsForStep(stepKey);
            }
        } else {
            // 모든 도움말 비활성화
            if (!this.isActive) return;

            // 모든 하이라이팅 제거
            document.querySelectorAll('.help-highlight').forEach(el => {
                el.classList.remove('help-highlight');
            });

            // 모든 화살표 제거
            document.querySelectorAll('.help-arrow-container').forEach(container => {
                container.remove();
            });

            this.isActive = false;
        }
        
        console.log(`도움말 비활성화: ${stepKey || '전체'}`);
    }

    /**
     * 요소에 하이라이팅을 적용합니다.
     * @param {HTMLElement} element - 하이라이팅할 요소
     */
    applyHighlight(element) {
        element.classList.add('help-highlight');
    }

    /**
     * 특정 단계의 화살표들을 제거합니다.
     * @param {string} stepKey - 제거할 단계 식별자
     */
    removeArrowsForStep(stepKey) {
        const arrowContainers = document.querySelectorAll(`.help-arrow-container[data-step="${stepKey}"]`);
        arrowContainers.forEach(container => {
            container.remove();
            console.log(`기존 화살표 제거됨: 단계 ${stepKey}`);
        });
    }

    /**
     * 화살표를 추가합니다.
     * @param {HTMLElement} element - 대상 요소
     * @param {string} type - 화살표 타입
     * @param {string} position - 위치 조정
     * @param {number} offsetX - X축 추가 오프셋
     * @param {number} offsetY - Y축 추가 오프셋
     * @param {string} stepKey - 단계 식별자
     * @param {string} message - 표시할 텍스트 메시지
     * @param {string} textPosition - 텍스트 위치 ('left', 'right')
     */
    addArrow(element, type, position = 'center', offsetX = 0, offsetY = 0, stepKey, message = '', textPosition = 'right') {
        // 화살표 컨테이너 생성
        const arrowContainer = document.createElement('div');
        arrowContainer.className = 'help-arrow-container';
        arrowContainer.setAttribute('data-step', stepKey);
        
        // 화살표 요소 생성
        const arrow = document.createElement('div');
        arrow.className = `help-arrow help-arrow-${type}`;
        
        // 화살표 텍스트 설정
        const arrowChars = {
            left: '◀',
            right: '▶',
            top: '▲',
            bottom: '▼'
        };
        
        arrow.textContent = arrowChars[type] || '◀';
        
        // 텍스트 요소 생성 (메시지가 있는 경우에만)
        let textElement = null;
        if (message.trim()) {
            textElement = document.createElement('div');
            textElement.className = 'help-text';
            textElement.textContent = message;
        }
        
        // 텍스트 위치에 따라 컨테이너에 추가
        if (textElement) {
            if (textPosition === 'left') {
                arrowContainer.appendChild(textElement);
                arrowContainer.appendChild(arrow);
                arrowContainer.classList.add('text-left');
            } else {
                arrowContainer.appendChild(arrow);
                arrowContainer.appendChild(textElement);
                arrowContainer.classList.add('text-right');
            }
        } else {
            arrowContainer.appendChild(arrow);
        }
        
        // 위치 계산 및 설정
        this.positionArrow(arrowContainer, element, type, position, offsetX, offsetY);
        
        // DOM에 추가
        document.body.appendChild(arrowContainer);
        console.log(`화살표 추가됨: ${type}, 단계: ${stepKey}, 메시지: ${message}`);
    }

    /**
     * 화살표 위치를 계산하고 설정합니다.
     * @param {HTMLElement} arrow - 화살표 요소
     * @param {HTMLElement} target - 대상 요소
     * @param {string} type - 화살표 타입
     * @param {string} position - 위치 조정 ('start', 'end', 'center')
     * @param {number} offsetX - X축 추가 오프셋
     * @param {number} offsetY - Y축 추가 오프셋
     */
    positionArrow(arrow, target, type, position = 'center', offsetX = 0, offsetY = 0) {
        const rect = target.getBoundingClientRect();
        const arrowSize = 40;
        const offset = 30;
        
        let left, top;
        
        // 텍스트 위치 계산을 위한 추가 계산
        let textPosition = 0.5; // 기본값: 중앙
        if (position === 'start') {
            textPosition = 0.1; // 시작 지점
        } else if (position === 'end') {
            textPosition = 0.9; // 끝 지점
        }
        
        switch (type) {
            case 'left':
                left = rect.left - arrowSize - offset;
                top = rect.top + (rect.height * textPosition) - (arrowSize / 2);
                arrow.style.animation = 'help-bounce-horizontal 0.8s ease-in-out infinite';
                break;
            case 'right':
                left = rect.right + offset;
                top = rect.top + (rect.height * textPosition) - (arrowSize / 2);
                arrow.style.animation = 'help-bounce-horizontal 0.8s ease-in-out infinite';
                break;
            case 'top':
                left = rect.left + (rect.width * textPosition) - (arrowSize / 2);
                top = rect.top - arrowSize - offset;
                arrow.style.animation = 'help-bounce-vertical 0.8s ease-in-out infinite';
                break;
            case 'bottom':
                left = rect.left + (rect.width * textPosition) - (arrowSize / 2);
                top = rect.bottom + offset;
                arrow.style.animation = 'help-bounce-vertical 0.8s ease-in-out infinite';
                break;
        }
        
        // 추가 오프셋 적용
        left += offsetX;
        top += offsetY;
        
        arrow.style.left = `${left}px`;
        arrow.style.top = `${top}px`;
    }

    /**
     * 현재 활성화된 도움말이 있는지 확인합니다.
     * @returns {boolean}
     */
    isHelpActive() {
        return this.isActive;
    }

    /**
     * 현재 단계를 반환합니다.
     * @returns {string|null}
     */
    getCurrentStep() {
        return this.currentStep;
    }

    /**
     * 필요한 CSS 스타일을 주입합니다.
     */
    injectCSS() {
        if (document.getElementById('help-system-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'help-system-styles';
        style.textContent = `
            /* 하이라이팅 스타일 */
            .help-highlight {
                color: ${this.config.highlightColor} !important;
                transition: color 0.3s ease;
            }
            
            /* 하이라이팅된 요소의 하위 텍스트 요소들도 초록색으로 변경 */
            .help-highlight .option-label,
            .help-highlight .options-title,
            .help-highlight .options-subtitle {
                color: ${this.config.highlightColor} !important;
                transition: color 0.3s ease;
            }
            
            /* primary 버튼에 하이라이트 적용 시 흰색 텍스트 유지 */
            .button.primary.help-highlight {
                color: #ffffff !important;
            }
            
            .primary-button.help-highlight {
                color: #ffffff !important;
            }
            
            /* "다 골랐어요" 버튼에 하이라이트 적용 시 흰색 텍스트 유지 */
            .text-wrapper-34.help-highlight {
                color: #ffffff !important;
            }
            
            /* 도움이 필요해요 버튼 전역 스타일 */
            .button.secondary {
                background-color: #ffffff !important;
                color: #9e9ea4 !important;
                border: none !important;
            }
            
            .button.secondary:hover {
                background-color: #f8f8f8 !important;
                color: #9e9ea4 !important;
            }
            
            /* 화살표 컨테이너 스타일 */
            .help-arrow-container {
                position: fixed;
                z-index: 9999;
                pointer-events: none;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .help-arrow-container.text-left {
                flex-direction: row;
            }
            
            .help-arrow-container.text-right {
                flex-direction: row;
            }
            
            /* 화살표 기본 스타일 */
            .help-arrow {
                font-size: 40px;
                color: ${this.config.arrowColor};
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(84, 215, 97, 0.3);
                flex-shrink: 0;
            }
            
            /* 도움말 텍스트 스타일 */
            .help-text {
                font-size: 26px;
                color: ${this.config.arrowColor};
                font-weight: bold;
                text-shadow: 0 2px 4px rgba(84, 215, 97, 0.3);
                white-space: nowrap;
                background: rgba(255, 255, 255, 0.9);
                padding: 8px 12px;
                border-radius: 8px;
                border: 2px solid ${this.config.arrowColor};
            }
            
            /* 좌우 살짝 움직이는 애니메이션 */
            @keyframes help-bounce-horizontal {
                0%, 100% {
                    transform: translateX(0);
                }
                50% {
                    transform: translateX(8px);
                }
            }
            
            /* 상하 살짝 움직이는 애니메이션 */
            @keyframes help-bounce-vertical {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(8px);
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * 창 크기 변경 시 화살표 위치를 업데이트합니다.
     */
    updateArrowPositions() {
        if (!this.isActive) return;
        
        const target = this.helpTargets.get(this.currentStep);
        if (target && target.element) {
            const arrowContainer = document.querySelector('.help-arrow-container');
            if (arrowContainer) {
                this.positionArrow(arrowContainer, target.element, target.type, target.position, target.offsetX, target.offsetY);
            }
        }
    }
}

// 전역으로 사용할 수 있도록 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpSystem;
} else {
    window.HelpSystem = HelpSystem;
} 