// This file simulates a backend database of nutritional information,
// similar to what might be sourced from FSSAI (Food Safety and Standards Authority of India).
// It's used to demonstrate a backend structure and can be expanded for future features.

export interface MockProduct {
  id: string;
  name: string;
  category: 'Snack' | 'Dairy' | 'Grain' | 'Beverage';
  servingSize: string;
  nutrients: {
    calories: number;
    protein: number; // in grams
    carbohydrates: number; // in grams
    sugar: number; // in grams
    fat: number; // in grams
    sodium: number; // in mg
  };
}

export const mockDatabase: MockProduct[] = [
  {
    id: '1',
    name: 'Parle-G Biscuit',
    category: 'Snack',
    servingSize: '10 biscuits (56g)',
    nutrients: {
      calories: 250,
      protein: 4,
      carbohydrates: 42,
      sugar: 14,
      fat: 8,
      sodium: 150,
    },
  },
  {
    id: '2',
    name: 'Amul Butter',
    category: 'Dairy',
    servingSize: '1 tbsp (14g)',
    nutrients: {
      calories: 100,
      protein: 0,
      carbohydrates: 0,
      sugar: 0,
      fat: 11,
      sodium: 90,
    },
  },
  {
    id: '3',
    name: 'Aashirvaad Atta',
    category: 'Grain',
    servingSize: '1/4 cup (30g)',
    nutrients: {
      calories: 100,
      protein: 3,
      carbohydrates: 22,
      sugar: 0,
      fat: 0.5,
      sodium: 0,
    },
  },
  {
    id: '4',
    name: 'Real Fruit Juice - Mixed',
    category: 'Beverage',
    servingSize: '200ml',
    nutrients: {
      calories: 110,
      protein: 0.2,
      carbohydrates: 27,
      sugar: 25,
      fat: 0,
      sodium: 10,
    },
  },
];
