import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private selectedCity: string = 'New York';
  private selectedCitySubject = new BehaviorSubject<string>('New York');

  constructor() {
    this.loadFromLocalStorage();
  }

  // Auth methods
  signup(userData: { name: string; email: string; mobile: string; password: string; city: string }): Observable<{ success: boolean; message: string; user?: User }> {
    // Check if user already exists
    const existingUsers = this.getStoredUsers();
    const userExists = existingUsers.some(u => u.email === userData.email || u.mobile === userData.mobile);
    
    if (userExists) {
      return of({ success: false, message: 'User with this email or mobile already exists' }).pipe(delay(500));
    }

    // Validate inputs
    if (!userData.name || !userData.email || !userData.mobile || !userData.password) {
      return of({ success: false, message: 'All fields are required' }).pipe(delay(500));
    }

    if (!this.isValidEmail(userData.email)) {
      return of({ success: false, message: 'Invalid email format' }).pipe(delay(500));
    }

    if (!this.isValidMobile(userData.mobile)) {
      return of({ success: false, message: 'Invalid mobile number' }).pipe(delay(500));
    }

    if (userData.password.length < 6) {
      return of({ success: false, message: 'Password must be at least 6 characters' }).pipe(delay(500));
    }

    // Create new user
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      city: userData.city,
      preferences: {
        preferredLanguage: 'English',
        preferredFormat: '2D'
      }
    };

    existingUsers.push(newUser);
    localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    
    // Auto login after signup
    this.currentUser = newUser;
    this.currentUserSubject.next(newUser);
    localStorage.setItem('cinebook_current_user', JSON.stringify(newUser));
    this.selectedCity = userData.city;
    this.selectedCitySubject.next(userData.city);
    localStorage.setItem('cinebook_selected_city', userData.city);

    return of({ success: true, message: 'Signup successful', user: newUser }).pipe(delay(500));
  }

  login(credentials: { email: string; password: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const existingUsers = this.getStoredUsers();
    const user = existingUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return of({ success: false, message: 'User not found' }).pipe(delay(500));
    }

    // In a real app, we'd hash passwords. For this demo, we'll just check if password is provided
    if (!credentials.password || credentials.password.length < 6) {
      return of({ success: false, message: 'Invalid credentials' }).pipe(delay(500));
    }

    this.currentUser = user;
    this.currentUserSubject.next(user);
    localStorage.setItem('cinebook_current_user', JSON.stringify(user));
    this.selectedCity = user.city;
    this.selectedCitySubject.next(user.city);
    localStorage.setItem('cinebook_selected_city', user.city);

    return of({ success: true, message: 'Login successful', user }).pipe(delay(500));
  }

  logout(): void {
    this.currentUser = null;
    this.currentUserSubject.next(null);
    localStorage.removeItem('cinebook_current_user');
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  updateUser(updates: Partial<User>): Observable<{ success: boolean; message: string; user?: User }> {
    if (!this.currentUser) {
      return of({ success: false, message: 'No user logged in' }).pipe(delay(300));
    }

    const updatedUser = { ...this.currentUser, ...updates };
    this.currentUser = updatedUser;
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('cinebook_current_user', JSON.stringify(updatedUser));

    // Update in users list
    const existingUsers = this.getStoredUsers();
    const index = existingUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      existingUsers[index] = updatedUser;
      localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    }

    return of({ success: true, message: 'Profile updated successfully', user: updatedUser }).pipe(delay(300));
  }

  // City management
  setSelectedCity(city: string): void {
    this.selectedCity = city;
    this.selectedCitySubject.next(city);
    localStorage.setItem('cinebook_selected_city', city);
    
    // Update user city if logged in
    if (this.currentUser) {
      this.updateUser({ city });
    }
  }

  getSelectedCity(): Observable<string> {
    return this.selectedCitySubject.asObservable();
  }

  getSelectedCityValue(): string {
    return this.selectedCity;
  }

  // Validation helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidMobile(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile.replace(/[\s-]/g, ''));
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem('cinebook_users');
    return stored ? JSON.parse(stored) : [];
  }

  private loadFromLocalStorage(): void {
    const userStr = localStorage.getItem('cinebook_current_user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.currentUserSubject.next(this.currentUser);
    }

    const cityStr = localStorage.getItem('cinebook_selected_city');
    if (cityStr) {
      this.selectedCity = cityStr;
      this.selectedCitySubject.next(cityStr);
    }
  }
}
