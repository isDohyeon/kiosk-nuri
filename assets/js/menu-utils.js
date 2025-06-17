// 메뉴 유틸리티 함수들
class MenuUtils {
  
  // JSON 파일에서 메뉴 데이터 로드
  static async loadMenuDataFromJSON(jsonPath = '../../../assets/data/menu-config.json') {
    try {
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('메뉴 데이터 로드 실패:', error);
      // 기본 메뉴 데이터로 폴백
      return null;
    }
  }

  // 메뉴 아이템 검색
  static searchMenuItems(query, items = []) {
    if (!query || query.length < 2) return items;
    
    const searchQuery = query.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery) ||
      (item.description && item.description.toLowerCase().includes(searchQuery))
    );
  }

  // 가격대별 메뉴 필터링
  static filterByPriceRange(items, minPrice = 0, maxPrice = Infinity) {
    return items.filter(item => 
      item.price >= minPrice && item.price <= maxPrice
    );
  }

  // 메뉴 아이템을 가격순으로 정렬
  static sortByPrice(items, ascending = true) {
    return [...items].sort((a, b) => 
      ascending ? a.price - b.price : b.price - a.price
    );
  }

  // 메뉴 아이템을 이름순으로 정렬
  static sortByName(items, ascending = true) {
    return [...items].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (ascending) {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }

  // 특정 조건으로 메뉴 필터링
  static filterMenuItems(items, filterFn) {
    return items.filter(filterFn);
  }

  // 메뉴 데이터 유효성 검사
  static validateMenuItem(item) {
    const required = ['id', 'name', 'price', 'image'];
    const errors = [];

    required.forEach(field => {
      if (!item[field]) {
        errors.push(`${field} 필드가 필요합니다.`);
      }
    });

    if (typeof item.price !== 'number' || item.price < 0) {
      errors.push('가격은 0 이상의 숫자여야 합니다.');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // 메뉴 데이터를 localStorage에 저장
  static saveMenuDataToStorage(data, key = 'menuData') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('메뉴 데이터 저장 실패:', error);
      return false;
    }
  }

  // localStorage에서 메뉴 데이터 로드
  static loadMenuDataFromStorage(key = 'menuData') {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('메뉴 데이터 로드 실패:', error);
      return null;
    }
  }

  // 카테고리별 메뉴 통계
  static getMenuStatistics(menuData) {
    const stats = {
      totalCategories: menuData.categories.length,
      totalItems: 0,
      categoryStats: {},
      priceRange: { min: Infinity, max: 0 },
      averagePrice: 0
    };

    let totalPrice = 0;
    let itemCount = 0;

    Object.entries(menuData.menuItems).forEach(([categoryId, items]) => {
      stats.categoryStats[categoryId] = {
        name: menuData.categories.find(cat => cat.id === categoryId)?.name || categoryId,
        itemCount: items.length,
        totalValue: items.reduce((sum, item) => sum + item.price, 0),
        averagePrice: items.length > 0 ? items.reduce((sum, item) => sum + item.price, 0) / items.length : 0
      };

      items.forEach(item => {
        totalPrice += item.price;
        itemCount++;
        stats.priceRange.min = Math.min(stats.priceRange.min, item.price);
        stats.priceRange.max = Math.max(stats.priceRange.max, item.price);
      });
    });

    stats.totalItems = itemCount;
    stats.averagePrice = itemCount > 0 ? totalPrice / itemCount : 0;

    return stats;
  }

  // 메뉴 데이터 백업
  static exportMenuData(menuData, filename = 'menu-backup.json') {
    const dataStr = JSON.stringify(menuData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // CSV 형태로 메뉴 데이터 내보내기
  static exportToCSV(menuData, filename = 'menu-data.csv') {
    const headers = ['카테고리', '아이디', '이름', '가격', '이미지', '설명'];
    const rows = [headers.join(',')];

    Object.entries(menuData.menuItems).forEach(([categoryId, items]) => {
      const categoryName = menuData.categories.find(cat => cat.id === categoryId)?.name || categoryId;
      
      items.forEach(item => {
        const row = [
          categoryName,
          item.id,
          `"${item.name}"`,
          item.price,
          item.image,
          `"${item.description || ''}"`
        ];
        rows.push(row.join(','));
      });
    });

    const csvContent = rows.join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(csvBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 메뉴 데이터 형식 변환 (구 버전 호환성)
  static convertLegacyData(legacyData) {
    // 구 버전 데이터를 새 형식으로 변환하는 로직
    const converted = {
      categories: [],
      menuItems: {},
      settings: {
        imagePath: '../../../assets/images/coffee/',
        defaultCategory: 'new',
        maxItemsPerRow: 4,
        maxRows: 3
      }
    };

    // 변환 로직 구현...
    return converted;
  }

  // 메뉴 아이템 이미지 URL 생성
  static getImageUrl(imageName, basePath = '../../../assets/images/coffee/') {
    return `${basePath}${imageName}`;
  }

  // 가격 포맷팅
  static formatPrice(price, currency = '₩') {
    return `${currency}${price.toLocaleString()}`;
  }

  // 디바운스 함수 (검색 최적화용)
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// 전역 스코프에서 사용할 수 있도록 설정
if (typeof window !== 'undefined') {
  window.MenuUtils = MenuUtils;
} 