import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
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
export class SignupComponent implements OnInit {
  name = '';
  email = '';
  mobile = '';
  password = '';
  confirmPassword = '';
  city = 'Chennai';
  isLoading = false;
  errorMessage = '';

  cities: string[] = [];

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cities = this.authService.getAvailableCities();
    if (this.cities.length > 0 && !this.cities.includes(this.city)) {
      this.city = this.cities[0];
    }
  }

  signup(): void {
    this.errorMessage = '';

    // Validation
    if (!this.name.trim() || !this.email.trim() || !this.mobile.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email.trim())) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    if (!this.isValidMobile(this.mobile.trim())) {
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
      name: this.name.trim(),
      email: this.email.trim(),
      mobile: this.mobile.trim(),
      password: this.password,
      city: this.city
    }).subscribe(result => {
      this.isLoading = false;
      if (result.success) {
        const redirectUrl = this.route.snapshot.queryParamMap.get('returnUrl')
          || this.route.snapshot.queryParamMap.get('redirect')
          || localStorage.getItem('cinebook_redirect_url')
          || (this.bookingService.getSelectedSeatsValue().length > 0 ? '/checkout' : '/home');

        localStorage.removeItem('cinebook_redirect_url');
        this.router.navigateByUrl(redirectUrl);
      } else {
        this.errorMessage = result.message;
      }
    });
  }

  navigateToLogin(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/login'], { queryParams });
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

