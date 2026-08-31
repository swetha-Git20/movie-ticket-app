import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, map } from 'rxjs';
import { FoodItem, CartItem } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private foodItems: FoodItem[] = [
    {
      id: 'f1',
      name: 'Classic Popcorn',
      description: 'Buttered popcorn, regular size',
      price: 6,
      category: 'Popcorn',
      imageUrl: 'https://picsum.photos/seed/popcorn1/200/200',
      vegetarian: true
    },
    {
      id: 'f2',
      name: 'Caramel Popcorn',
      description: 'Sweet caramel popcorn, regular size',
      price: 7,
      category: 'Popcorn',
      imageUrl: 'https://picsum.photos/seed/popcorn2/200/200',
      vegetarian: true
    },
    {
      id: 'f3',
      name: 'Large Popcorn Combo',
      description: 'Large popcorn with drink',
      price: 12,
      category: 'Combos',
      imageUrl: 'https://picsum.photos/seed/combo1/200/200',
      vegetarian: true
    },
    {
      id: 'f4',
      name: 'Coca-Cola',
      description: 'Regular soft drink, medium',
      price: 4,
      category: 'Drinks',
      imageUrl: 'https://picsum.photos/seed/coke/200/200',
      vegetarian: true
    },
    {
      id: 'f5',
      name: 'Sprite',
      description: 'Lemon-lime soft drink, medium',
      price: 4,
      category: 'Drinks',
      imageUrl: 'https://picsum.photos/seed/sprite/200/200',
      vegetarian: true
    },
    {
      id: 'f6',
      name: 'Nachos with Cheese',
      description: 'Tortilla chips with cheese sauce',
      price: 8,
      category: 'Snacks',
      imageUrl: 'https://picsum.photos/seed/nachos/200/200',
      vegetarian: true
    },
    {
      id: 'f7',
      name: 'Hot Dog',
      description: 'Classic beef hot dog with toppings',
      price: 7,
      category: 'Snacks',
      imageUrl: 'https://picsum.photos/seed/hotdog/200/200',
      vegetarian: false
    },
    {
      id: 'f8',
      name: 'Candy Box',
      description: 'Assorted chocolates and candies',
      price: 5,
      category: 'Snacks',
      imageUrl: 'https://picsum.photos/seed/candy/200/200',
      vegetarian: true
    },
    {
      id: 'f9',
      name: 'Family Combo',
      description: '2 large popcorns, 4 drinks, 2 snacks',
      price: 35,
      category: 'Combos',
      imageUrl: 'https://picsum.photos/seed/family/200/200',
      vegetarian: true
    },
    {
      id: 'f10',
      name: 'Premium Nachos',
      description: 'Nachos with jalapeños and extra cheese',
      price: 10,
      category: 'Snacks',
      imageUrl: 'https://picsum.photos/seed/premium/200/200',
      vegetarian: true
    }
  ];

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartKey = 'cinebook_food_cart';

  constructor() {
    this.loadCartFromStorage();
  }

  getFoodItems(): Observable<FoodItem[]> {
    return of(this.foodItems).pipe(delay(200));
  }

  getFoodItemsByCategory(category: string): Observable<FoodItem[]> {
    return of(this.foodItems.filter(f => f.category === category)).pipe(delay(200));
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.foodItems.map(f => f.category))];
    return of(categories).pipe(delay(200));
  }

  // Cart management
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  addToCart(foodItem: FoodItem, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.foodItem.id === foodItem.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({ foodItem, quantity });
    }
    
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
  }

  updateCartQuantity(foodItemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(item => item.foodItem.id === foodItemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(foodItemId);
      } else {
        item.quantity = quantity;
        this.cartSubject.next(currentCart);
        this.saveCartToStorage();
      }
    }
  }

  removeFromCart(foodItemId: string): void {
    const currentCart = this.cartSubject.value.filter(item => item.foodItem.id !== foodItemId);
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.saveCartToStorage();
  }

  getCartTotal(): Observable<number> {
    return this.cartSubject.pipe(
      delay(0),
      map(cart => cart.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0))
    );
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem(this.cartKey);
    if (stored) {
      this.cartSubject.next(JSON.parse(stored));
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartSubject.value));
  }
}
