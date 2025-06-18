// 메뉴 데이터 구조
const MENU_DATA = {
  categories: [
    { id: 'new', name: '신메뉴', position: { row: 1, col: 1 } },
    { id: 'coffee', name: '커피', position: { row: 1, col: 2 } },
    { id: 'tea', name: '티/과일티', position: { row: 1, col: 3 } },
    { id: 'frappe', name: '프라페', position: { row: 1, col: 4 } },
    { id: 'smoothie', name: '스무디', position: { row: 2, col: 1 } },
    { id: 'juice', name: '주스/에이드', position: { row: 2, col: 2 } },
    { id: 'large', name: '대용량', position: { row: 2, col: 3 } },
    { id: 'dessert', name: '디저트', position: { row: 2, col: 4 } }
  ],
  
  items: {
    coffee: [
      { id: 'americano', name: '아메리카노', price: 2500, image: '아메리카노.png', position: { row: 1, col: 1 } },
      { id: 'cafe-latte', name: '카페라떼', price: 3000, image: '카페라떼.png', position: { row: 1, col: 2 } },
      { id: 'vanilla-latte', name: '바닐라라떼', price: 3500, image: '바닐라라떼.png', position: { row: 1, col: 3 } },
      { id: 'hazelnut-latte', name: '헤이즐넛라떼', price: 3000, image: '아메리카노.png', position: { row: 2, col: 1 } },
      { id: 'chocolate-latte', name: '초코라떼', price: 3500, image: '초코라떼.png', position: { row: 2, col: 2 } },
      { id: 'toffee-nut-latte', name: '토피넛라떼', price: 4000, image: '토피넛라떼.png', position: { row: 2, col: 3 } },
      { id: 'hazelnut-latte-2', name: '돌체라떼', price: 3000, image: '카페라떼.png', position: { row: 3, col: 1 } },
      { id: 'chocolate-latte-2', name: '딥초코라떼', price: 4000, image: '초코라떼.png', position: { row: 3, col: 2 } },
      { id: 'toffee-nut-latte-2', name: '콜드브루라떼', price: 3500, image: '콜드브루라떼.png', position: { row: 3, col: 3 } },
      { id: 'toffee-nut-latte-3', name: '카페모카', price: 3500, image: '카페모카.png', position: { row: 4, col: 1 } },
      { id: 'toffee-nut-latte-5', name: '카푸치노', price: 4000, image: '카푸치노.png', position: { row: 4, col: 2 } },
      { id: 'toffee-nut-latte-4', name: '콜드브루', price: 3500, image: '아샷추.png', position: { row: 4, col: 3 } },
      { id: 'toffee-nut-latte-6', name: '왕아메리카노', price: 4000, image: '아샷추.png', position: { row: 5, col: 1 } },
      { id: 'toffee-nut-latte-7', name: '왕카페라떼', price: 4000, image: '카페라떼.png', position: { row: 5, col: 2 } },
      { id: 'toffee-nut-latte-8', name: '왕초코라떼', price: 4000, image: '초코라떼.png', position: { row: 5, col: 3 } },
      { id: 'toffee-nut-latte-9', name: '왕콜드브루', price: 4000, image: '아샷추.png', position: { row: 5, col: 4 } },
    ],
    
    new: [
      { id: 'caramel-macchiato', name: '매실에이드', price: 4500, image: '메실에이드.png', position: { row: 1, col: 1 } },
      { id: 'cappuccino', name: '복숭아스무디', price: 3500, image: '복숭아스무디.png', position: { row: 1, col: 2 } },
      { id: 'cappuccino2', name: '화채스무디', price: 5500, image: '화채스무디.png', position: { row: 1, col: 3 } },
      { id: 'cappuccino3', name: '수박주스', price: 4500, image: '수박주스.png', position: { row: 1, col: 4 } },
      { id: 'cappuccino4', name: '아샷추스무디', price: 3500, image: '아샷추스무디.png', position: { row: 2, col: 1 } }
    ],
    
    tea: [
      { id: 'green-tea', name: '복숭아아이스티', price: 2500, image: '복숭아아이스티.png', position: { row: 1, col: 1 } },
      { id: 'chamomile-tea', name: '녹차', price: 3500, image: '녹차.png', position: { row: 1, col: 2 } },
      { id: 'earl-grey', name: '얼그레이', price: 3000, image: '녹차.png', position: { row: 1, col: 3 } },
      { id: 'fruit-tea1', name: '캐모마일', price: 3000, image: '녹차.png', position: { row: 1, col: 4 } },
      { id: 'fruit-tea2', name: '페퍼민트', price: 3000, image: '녹차.png', position: { row: 2, col: 1 } },
      { id: 'fruit-tea3', name: '유자차', price: 3500, image: '유자차.png', position: { row: 2, col: 2 } },
      { id: 'fruit-tea4', name: '자몽차', price: 3500, image: '자몽차.png', position: { row: 2, col: 3 } },
      { id: 'fruit-tea5', name: '레몬차', price: 3500, image: '레몬차.png', position: { row: 2, col: 4 } }
    ],
    
    frappe: [
      { id: 'coffee-frappe', name: '커피프라페', price: 4500, image: '커피프라페.png', position: { row: 1, col: 1 } },
      { id: 'chocolate-frappe', name: '초콜릿프라페', price: 4500, image: '초코프라페.png', position: { row: 1, col: 2 } },
      { id: 'vanilla-frappe', name: '녹차프라페', price: 4500, image: '녹차프라페.png', position: { row: 1, col: 3 } },
      { id: 'caramel-frappe', name: '민트초코프라페', price: 4500, image: '민트초코프라페.png', position: { row: 1, col: 4 } }
    ],
    
    smoothie: [
      { id: 'strawberry-smoothie', name: '요거트스무디', price: 4000, image: '요거트스무디.png', position: { row: 1, col: 1 } },
      { id: 'mango-smoothie1', name: '망고스무디', price: 4000, image: '망고스무디.png', position: { row: 1, col: 2 } },
      { id: 'mango-smoothie2', name: '딸기스무디', price: 4500, image: '딸기스무디.png', position: { row: 1, col: 2 } },
      { id: 'mango-smoothie3', name: '블루베리스무디', price: 4500, image: '블루베리스무디.png', position: { row: 1, col: 2 } },
    ],
    
    juice: [
      { id: 'orange-juice', name: '딸기에이드', price: 3500, image: '딸기에이드.png', position: { row: 1, col: 1 } },
      { id: 'apple-juice', name: '레몬에이드', price: 3500, image: '레몬에이드.png', position: { row: 1, col: 2 } },
      { id: 'grape-juice', name: '자몽에이드', price: 3500, image: '자몽에이드.png', position: { row: 1, col: 3 } },
      { id: 'lemon-ade', name: '매실에이드', price: 4000, image: '매실에이드.png', position: { row: 1, col: 4 } },
      { id: 'lemon-ade2', name: '블루베리주스', price: 4000, image: '블루베리주스.png', position: { row: 1, col: 4 } }
    ],
    
    large: [
      { id: 'large-americano', name: '왕아메리카노', price: 3500, image: '왕아메리카노.png', position: { row: 1, col: 1 } },
      { id: 'large-latte', name: '왕카페라떼', price: 4000, image: '카페라떼.png', position: { row: 1, col: 2 } },
      { id: 'large-cold-brew', name: '왕콜드브루', price: 4500, image: '아메리카노.png', position: { row: 1, col: 3 } },
      { id: 'large-frappe', name: '왕초코라떼', price: 4000, image: '초코라떼.png', position: { row: 1, col: 4 } }
    ],
    
    dessert: [
      { id: 'chocolate-cake', name: '초코스모어쿠키', price: 3200, image: '초코스모어쿠키.png', position: { row: 1, col: 1 } },
      { id: 'cheese-cake', name: '크로플', price: 3500, image: '크로플.png', position: { row: 1, col: 2 } },
      { id: 'cheese-cake1', name: '초코칩쿠키', price: 2500, image: '초코칩쿠키.png', position: { row: 1, col: 3 } },
    ]
  }
};

// 메뉴 데이터 접근 함수들
const MenuData = {
  // 모든 카테고리 가져오기
  getCategories: () => MENU_DATA.categories,
  
  // 특정 카테고리의 메뉴 아이템들 가져오기
  getItemsByCategory: (categoryId) => MENU_DATA.items[categoryId] || [],
  
  // 특정 아이템 가져오기
  getItem: (categoryId, itemId) => {
    const items = MENU_DATA.items[categoryId] || [];
    return items.find(item => item.id === itemId);
  },
  
  // 모든 아이템 가져오기
  getAllItems: () => {
    const allItems = [];
    Object.values(MENU_DATA.items).forEach(categoryItems => {
      allItems.push(...categoryItems);
    });
    return allItems;
  },
  
  // 카테고리 정보 가져오기
  getCategory: (categoryId) => {
    return MENU_DATA.categories.find(cat => cat.id === categoryId);
  }
};

// 전역 스코프에서 사용할 수 있도록 window 객체에 추가
if (typeof window !== 'undefined') {
  window.MenuData = MenuData;
  window.MENU_DATA = MENU_DATA;
} 