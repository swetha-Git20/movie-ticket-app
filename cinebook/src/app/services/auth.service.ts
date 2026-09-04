import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private selectedCity: string = 'Chennai';
  private selectedCitySubject = new BehaviorSubject<string>('Chennai');

  constructor() {
    this.loadFromLocalStorage();
  }

  // Auth methods
  signup(userData: { name: string; email: string; mobile: string; password: string; city: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const existingUsers = this.getStoredUsers();
    const userExists = existingUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase() || u.mobile === userData.mobile);
    
    if (userExists) {
      return of({ success: false, message: 'User with this email or mobile already exists' }).pipe(delay(300));
    }

    if (!userData.name || !userData.email || !userData.mobile || !userData.password) {
      return of({ success: false, message: 'All fields are required' }).pipe(delay(300));
    }

    if (!this.isValidEmail(userData.email)) {
      return of({ success: false, message: 'Invalid email format' }).pipe(delay(300));
    }

    if (!this.isValidMobile(userData.mobile)) {
      return of({ success: false, message: 'Invalid mobile number (10 digits required)' }).pipe(delay(300));
    }

    if (userData.password.length < 6) {
      return of({ success: false, message: 'Password must be at least 6 characters' }).pipe(delay(300));
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      mobile: userData.mobile,
      city: userData.city || 'Chennai',
      preferences: {
        preferredLanguage: 'Tamil',
        preferredFormat: '2D'
      }
    };

    existingUsers.push(newUser);
    localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    
    // Auto login after signup
    this.currentUser = newUser;
    this.currentUserSubject.next(newUser);
    localStorage.setItem('cinebook_current_user', JSON.stringify(newUser));
    this.selectedCity = newUser.city;
    this.selectedCitySubject.next(newUser.city);
    localStorage.setItem('cinebook_selected_city', newUser.city);

    return of({ success: true, message: 'Signup successful! Welcome to CineBook', user: newUser }).pipe(delay(300));
  }

  login(credentials: { email: string; password: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const existingUsers = this.getStoredUsers();
    const user = existingUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    
    if (!user) {
      // Demo fallback user if fresh install
      if (credentials.email && credentials.password.length >= 6) {
        const demoUser: User = {
          id: 'user-demo',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          mobile: '9876543210',
          city: 'Chennai',
          preferences: { preferredLanguage: 'Tamil', preferredFormat: '2D' }
        };
        this.currentUser = demoUser;
        this.currentUserSubject.next(demoUser);
        localStorage.setItem('cinebook_current_user', JSON.stringify(demoUser));
        return of({ success: true, message: 'Login successful', user: demoUser }).pipe(delay(300));
      }
      return of({ success: false, message: 'User not found. Please sign up or check email.' }).pipe(delay(300));
    }

    if (!credentials.password || credentials.password.length < 6) {
      return of({ success: false, message: 'Invalid credentials. Password must be at least 6 characters.' }).pipe(delay(300));
    }

    this.currentUser = user;
    this.currentUserSubject.next(user);
    localStorage.setItem('cinebook_current_user', JSON.stringify(user));
    if (user.city) {
      this.selectedCity = user.city;
      this.selectedCitySubject.next(user.city);
      localStorage.setItem('cinebook_selected_city', user.city);
    }

    return of({ success: true, message: 'Login successful', user }).pipe(delay(300));
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

  getCurrentUserValue(): User | null {
    return this.currentUser;
  }

  updateUser(updates: Partial<User>): Observable<{ success: boolean; message: string; user?: User }> {
    if (!this.currentUser) {
      return of({ success: false, message: 'No user logged in' }).pipe(delay(200));
    }

    const updatedUser = { ...this.currentUser, ...updates };
    this.currentUser = updatedUser;
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('cinebook_current_user', JSON.stringify(updatedUser));

    const existingUsers = this.getStoredUsers();
    const index = existingUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      existingUsers[index] = updatedUser;
      localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    }

    return of({ success: true, message: 'Profile updated successfully', user: updatedUser }).pipe(delay(200));
  }

  // City management
  setSelectedCity(city: string): void {
    this.selectedCity = city;
    this.selectedCitySubject.next(city);
    localStorage.setItem('cinebook_selected_city', city);
    
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

  getAvailableCities(): string[] {
    return ['Chennai', 'Pondicherry', 'Trichy', 'Vellore', 'Ranipet', 'Coimbatore', 'Madurai', 'Salem'];
  }

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
      try {
        this.currentUser = JSON.parse(userStr);
        this.currentUserSubject.next(this.currentUser);
      } catch (e) {
        this.currentUser = null;
      }
    }

    const cityStr = localStorage.getItem('cinebook_selected_city');
    if (cityStr) {
      this.selectedCity = cityStr;
      this.selectedCitySubject.next(cityStr);
    }
  }
}
