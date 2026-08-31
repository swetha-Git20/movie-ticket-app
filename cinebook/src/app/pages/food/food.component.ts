import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { BookingService } from '../../services/booking.service';
import { FoodItem, CartItem } from '../../models/food.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-food',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  foodItems: FoodItem[] = [];
  cart: CartItem[] = [];
  categories: string[] = [];
  selectedCategory = 'All';
  isLoading = true;
  cartTotal = 0;

  constructor(
    private foodService: FoodService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFoodItems();
    this.loadCart();
  }

  loadFoodItems(): void {
    this.foodService.getFoodItems().subscribe(items => {
      this.foodItems = items;
      this.isLoading = false;
    });

    this.foodService.getCategories().subscribe(cats => {
      this.categories = ['All', ...cats];
    });
  }

  loadCart(): void {
    this.foodService.getCart().subscribe(cart => {
      this.cart = cart;
      this.updateCartTotal();
    });
  }

  updateCartTotal(): void {
    this.cartTotal = this.cart.reduce((total, item) => total + (item.foodItem.price * item.quantity), 0);
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
  }

  get filteredFoodItems(): FoodItem[] {
    if (this.selectedCategory === 'All') {
      return this.foodItems;
    }
    return this.foodItems.filter(item => item.category === this.selectedCategory);
  }

  addToCart(foodItem: FoodItem): void {
    this.foodService.addToCart(foodItem, 1);
  }

  updateQuantity(foodItemId: string, change: number): void {
    const cartItem = this.cart.find(item => item.foodItem.id === foodItemId);
    if (cartItem) {
      const newQuantity = cartItem.quantity + change;
      this.foodService.updateCartQuantity(foodItemId, newQuantity);
    }
  }

  removeFromCart(foodItemId: string): void {
    this.foodService.removeFromCart(foodItemId);
  }

  getCartItem(foodItemId: string): CartItem | undefined {
    return this.cart.find(item => item.foodItem.id === foodItemId);
  }

  getCartItemQuantity(foodItemId: string): number {
    const item = this.getCartItem(foodItemId);
    return item ? item.quantity : 0;
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  skipFood(): void {
    this.router.navigate(['/checkout']);
  }

  goBack(): void {
    this.router.navigate(['/seat-selection']);
  }
}
