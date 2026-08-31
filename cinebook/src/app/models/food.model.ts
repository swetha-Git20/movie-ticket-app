export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // Popcorn, Drinks, Snacks, Combos
  imageUrl: string;
  vegetarian: boolean;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}
