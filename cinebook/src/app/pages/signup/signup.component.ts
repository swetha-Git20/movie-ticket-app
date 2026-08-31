import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  city = 'New York';
  isLoading = false;
  errorMessage = '';

  cities = ['New York', 'Los Angeles', 'San Francisco', 'Chicago'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  signup(): void {
    // Reset error
    this.errorMessage = '';

    // Validation
    if (!this.name || !this.email || !this.mobile || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (!this.isValidMobile(this.mobile)) {
      this.errorMessage = 'Invalid mobile number (10 digits required)';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    this.authService.signup({
      name: this.name,
      email: this.email,
      mobile: this.mobile,
      password: this.password,
      city: this.city
    }).subscribe(result => {
      this.isLoading = false;
      if (result.success) {
        this.router.navigate(['/']);
      } else {
        this.errorMessage = result.message;
      }
    });
  }

  navigateToLogin(): void {
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
