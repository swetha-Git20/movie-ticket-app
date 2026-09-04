import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { FoodItem, CartItem } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private foodItems: FoodItem[] = [
    // --- POPCORN ---
    {
      id: 'f1',
      name: 'Classic Salted Butter Popcorn (Regular)',
      description: 'Warm, crispy freshly popped corn with rich melted butter',
      price: 120,
      category: 'Popcorn',
      imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f2',
      name: 'Jumbo Butter Popcorn (Large Tub)',
      description: 'Generous sharing tub with extra layered golden butter',
      price: 180,
      category: 'Popcorn',
      imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f3',
      name: 'Caramel Glazed Popcorn',
      description: 'Gourmet sweet crunch coated with slow-cooked golden caramel',
      price: 160,
      category: 'Popcorn',
      imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f4',
      name: 'South Indian Peri Peri Masala Popcorn',
      description: 'Zesty spiced popcorn tossed with aromatic Madras curry spices',
      price: 150,
      category: 'Popcorn',
      imageUrl: 'https://images.unsplash.com/photo-1512149673953-1e251807ec7c?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f5',
      name: 'Cheese Burst Popcorn',
      description: 'Loaded with creamy cheddar cheese dust for ultimate cheesy goodness',
      price: 170,
      category: 'Popcorn',
      imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },

    // --- BEVERAGES & DRINKS ---
    {
      id: 'f6',
      name: 'Coca-Cola Chilled (500ml)',
      description: 'Ice-cold refreshing Coca-Cola fountain drink',
      price: 80,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f7',
      name: 'Pepsi Max (500ml)',
      description: 'Chilled bubbly cola with intense flavor and zero sugar option',
      price: 80,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f8',
      name: 'Fresh Mint Lime Soda',
      description: 'Freshly squeezed lime juice with mint leaves and sparkling soda',
      price: 70,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f9',
      name: 'Authentic South Indian Filter Coffee',
      description: 'Traditional freshly brewed chicory-infused hot milk coffee',
      price: 50,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f10',
      name: 'Cardamom Masala Chai',
      description: 'Hot aromatic Indian spiced tea with ginger and cardamom',
      price: 40,
      category: 'Drinks',
      imageUrl: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },

    // --- HOT SNACKS ---
    {
      id: 'f11',
      name: 'Crispy Samosa (2 Pieces)',
      description: 'Golden fried crust stuffed with spiced potatoes and peas with mint chutney',
      price: 60,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f12',
      name: 'Cheesy Loaded Mexican Nachos',
      description: 'Crunchy tortilla chips drizzled with warm jalapeño cheese sauce and salsa',
      price: 160,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f13',
      name: 'Grilled Veg Cheese Sandwich',
      description: 'Toasted multi-grain sandwich with spiced veggies, paneer and melted mozzarella',
      price: 110,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f14',
      name: 'Crispy Salt & Pepper French Fries',
      description: 'Golden shoestring fries tossed in sea salt, served with tangy mayo & ketchup',
      price: 100,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f15',
      name: 'Crunchy Chicken Popcorn Bites',
      description: 'Tender bite-sized chicken breast nuggets deep fried with spicy seasoned coating',
      price: 180,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80',
      vegetarian: false
    },
    {
      id: 'f16',
      name: 'Paneer Tikka Burger',
      description: 'Tandoori marinated cottage cheese patty with mint mayo in soft brioche bun',
      price: 140,
      category: 'Snacks',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },

    // --- VALUE COMBOS ---
    {
      id: 'f17',
      name: 'Cine Single Combo (Popcorn + Drink)',
      description: '1 Regular Butter Popcorn + 1 Chilled Coca-Cola (500ml)',
      price: 180,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f18',
      name: 'Couple Movie Feast Combo',
      description: '1 Large Jumbo Popcorn + 2 Coke (500ml) + 1 Loaded Nachos with Cheese',
      price: 380,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f19',
      name: 'Mega Family Blockbuster Combo',
      description: '2 Large Popcorns + 4 Soft Drinks + 2 Samosas + 1 French Fries tub',
      price: 590,
      category: 'Combos',
      imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },

    // --- DESSERTS ---
    {
      id: 'f20',
      name: 'Molten Choco Lava Cake',
      description: 'Warm chocolate sponge cake with rich gooey chocolate center',
      price: 120,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    },
    {
      id: 'f21',
      name: 'Belgian Chocolate Ice Cream Tub',
      description: 'Creamy double-churned gourmet chocolate ice cream with chocolate chips',
      price: 130,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80',
      vegetarian: true
    }
  ];

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private cartKey = 'cinebook_food_cart_v2';

  constructor() {
    this.loadCartFromStorage();
  }

  getFoodItems(): Observable<FoodItem[]> {
    return of(this.foodItems).pipe(delay(150));
  }

  getFoodItemsByCategory(category: string): Observable<FoodItem[]> {
    if (!category || category === 'All') {
      return of(this.foodItems).pipe(delay(100));
    }
    return of(this.foodItems.filter(f => f.category === category)).pipe(delay(100));
  }

  getCategories(): Observable<string[]> {
    const categories = ['Popcorn', 'Combos', 'Snacks', 'Drinks', 'Desserts'];
    return of(categories).pipe(delay(50));
  }

  // Cart management
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  getCartValue(): CartItem[] {
    return this.cartSubject.value;
  }

  addToCart(foodItem: FoodItem, quantity: number = 1): void {
    const currentCart = [...this.cartSubject.value];
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
    let currentCart = [...this.cartSubject.value];
    
    if (quantity <= 0) {
      currentCart = currentCart.filter(item => item.foodItem.id !== foodItemId);
    } else {
      const item = currentCart.find(item => item.foodItem.id === foodItemId);
      if (item) {
        item.quantity = quantity;
      }
    }
    
    this.cartSubject.next(currentCart);
    this.saveCartToStorage();
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
      map(cart => cart.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0))
    );
  }

  private loadCartFromStorage(): void {
    const stored = localStorage.getItem(this.cartKey);
    if (stored) {
      try {
        this.cartSubject.next(JSON.parse(stored));
      } catch (e) {
        this.cartSubject.next([]);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.cartSubject.value));
  }
}
