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
    this.seedInitialUsers();
    this.loadFromLocalStorage();
  }

  // Seed default demo accounts if none exist
  private seedInitialUsers(): void {
    const existing = localStorage.getItem('cinebook_users');
    if (!existing || JSON.parse(existing).length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'user-swetha',
          name: 'Swetha R',
          email: 'swetha@example.com',
          mobile: '9876543210',
          city: 'Chennai',
          preferences: { preferredLanguage: 'Tamil', preferredFormat: 'IMAX 3D' }
        },
        {
          id: 'user-demo-1',
          name: 'Karthik Raja',
          email: 'karthik@cinebook.com',
          mobile: '9840123456',
          city: 'Coimbatore',
          preferences: { preferredLanguage: 'Tamil', preferredFormat: 'Dolby Atmos' }
        },
        {
          id: 'user-demo-2',
          name: 'Priya Sharma',
          email: 'priya@cinebook.com',
          mobile: '9790987654',
          city: 'Madurai',
          preferences: { preferredLanguage: 'Tamil', preferredFormat: '2D' }
        }
      ];
      localStorage.setItem('cinebook_users', JSON.stringify(defaultUsers));
    }
  }

  // Auth methods
  signup(userData: { name: string; email: string; mobile: string; password: string; city: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const existingUsers = this.getStoredUsers();
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanMobile = (userData.mobile || '').replace(/[\s-]/g, '').trim();

    const userExists = existingUsers.some(u => u.email.toLowerCase() === cleanEmail || u.mobile === cleanMobile);
    
    if (userExists) {
      return of({ success: false, message: 'User with this email or mobile already exists. Please sign in.' }).pipe(delay(250));
    }

    if (!userData.name?.trim() || !cleanEmail || !cleanMobile || !userData.password) {
      return of({ success: false, message: 'All fields are required' }).pipe(delay(200));
    }

    if (!this.isValidEmail(cleanEmail)) {
      return of({ success: false, message: 'Invalid email format' }).pipe(delay(200));
    }

    if (!this.isValidMobile(cleanMobile)) {
      return of({ success: false, message: 'Invalid mobile number (10 digits required)' }).pipe(delay(200));
    }

    if (userData.password.length < 6) {
      return of({ success: false, message: 'Password must be at least 6 characters' }).pipe(delay(200));
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: userData.name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      city: userData.city || 'Chennai',
      preferences: {
        preferredLanguage: 'Tamil',
        preferredFormat: '2D'
      }
    };

    existingUsers.push(newUser);
    localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    
    // Save password
    const passwords = this.getStoredPasswords();
    passwords[cleanEmail] = userData.password;
    localStorage.setItem('cinebook_passwords', JSON.stringify(passwords));

    // Auto login after signup
    this.currentUser = newUser;
    this.currentUserSubject.next(newUser);
    localStorage.setItem('cinebook_current_user', JSON.stringify(newUser));
    this.selectedCity = newUser.city;
    this.selectedCitySubject.next(newUser.city);
    localStorage.setItem('cinebook_selected_city', newUser.city);

    return of({ success: true, message: 'Signup successful! Welcome to CineBook', user: newUser }).pipe(delay(250));
  }

  login(credentials: { email: string; password: string }): Observable<{ success: boolean; message: string; user?: User }> {
    const cleanEmail = (credentials.email || '').trim().toLowerCase();
    const cleanPassword = credentials.password || '';

    if (!cleanEmail || !cleanPassword) {
      return of({ success: false, message: 'Please enter both email and password' }).pipe(delay(200));
    }

    if (!this.isValidEmail(cleanEmail)) {
      return of({ success: false, message: 'Invalid email format' }).pipe(delay(200));
    }

    if (cleanPassword.length < 6) {
      return of({ success: false, message: 'Password must be at least 6 characters.' }).pipe(delay(200));
    }

    const existingUsers = this.getStoredUsers();
    let user = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
    
    // If not in stored users, check or create demo user dynamically
    if (!user) {
      const demoName = cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      const capitalizedName = demoName.charAt(0).toUpperCase() + demoName.slice(1);
      user = {
        id: 'user-' + Date.now(),
        name: capitalizedName || 'CineBook Member',
        email: cleanEmail,
        mobile: '9876543210',
        city: 'Chennai',
        preferences: { preferredLanguage: 'Tamil', preferredFormat: '2D' }
      };
      existingUsers.push(user);
      localStorage.setItem('cinebook_users', JSON.stringify(existingUsers));
    }

    this.currentUser = user;
    this.currentUserSubject.next(user);
    localStorage.setItem('cinebook_current_user', JSON.stringify(user));
    if (user.city) {
      this.selectedCity = user.city;
      this.selectedCitySubject.next(user.city);
      localStorage.setItem('cinebook_selected_city', user.city);
    }

    return of({ success: true, message: 'Login successful! Welcome back', user }).pipe(delay(250));
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

  setCurrentUser(user: User): void {
    this.currentUser = user;
    this.currentUserSubject.next(user);
    localStorage.setItem('cinebook_current_user', JSON.stringify(user));
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

  private getStoredPasswords(): { [email: string]: string } {
    const stored = localStorage.getItem('cinebook_passwords');
    return stored ? JSON.parse(stored) : {};
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

