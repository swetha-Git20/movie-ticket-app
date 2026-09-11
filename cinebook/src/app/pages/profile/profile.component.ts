import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = true;
  isEditing = false;
  
  // Form data
  name = '';
  email = '';
  mobile = '';
  city = '';
  
  cities: string[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.cities = this.authService.getAvailableCities();
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (!user) {
        localStorage.setItem('cinebook_redirect_url', '/profile');
        this.router.navigate(['/login']);
        return;
      }
      this.loadUserData();
    });
  }

  loadUserData(): void {
    if (this.currentUser) {
      this.name = this.currentUser.name;
      this.email = this.currentUser.email;
      this.mobile = this.currentUser.mobile;
      this.city = this.currentUser.city;
      this.isLoading = false;
    }
  }

  enableEdit(): void {
    this.isEditing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserData();
    this.successMessage = '';
    this.errorMessage = '';
  }

  saveProfile(): void {
    // Validation
    if (!this.name || !this.email || !this.mobile || !this.city) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (!this.isValidMobile(this.mobile)) {
      this.errorMessage = 'Invalid mobile number';
      return;
    }

    this.authService.updateUser({
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      city: this.city
    }).subscribe(result => {
      if (result.success) {
        this.currentUser = result.user || null;
        this.isEditing = false;
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
      } else {
        this.errorMessage = result.message;
        this.successMessage = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidMobile(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile.replace(/[\s-]/g, ''));
  }
}
