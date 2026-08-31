import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Error clearing localStorage', e);
    }
  }

  // Clear all CineBook related data (for logout/reset)
  clearCineBookData(): void {
    const keysToRemove = [
      'cinebook_current_user',
      'cinebook_users',
      'cinebook_selected_city',
      'cinebook_seat_selection',
      'cinebook_food_cart',
      'cinebook_bookings'
    ];

    keysToRemove.forEach(key => this.removeItem(key));
  }
}
