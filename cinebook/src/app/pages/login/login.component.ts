import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../../services/booking.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email.trim(), password: this.password }).subscribe(result => {
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

  navigateToSignup(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.router.navigate(['/signup'], { queryParams });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

