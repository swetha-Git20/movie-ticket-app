import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { FoodService } from '../../services/food.service';
import { OfferService } from '../../services/offer.service';
import { AuthService } from '../../services/auth.service';
import { ShowtimeService } from '../../services/showtime.service';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { CartItem } from '../../models/food.model';
import { Showtime } from '../../models/showtime.model';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    ModalComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  selectedSeats: any[] = [];
  foodCart: CartItem[] = [];
  showtime: Showtime | null = null;
  movie: Movie | null = null;
  cinema: Cinema | null = null;
  currentUser: User | null = null;
  
  // User Details & Auth State
  authTab: 'guest' | 'login' = 'guest';
  userName: string = '';
  userEmail: string = '';
  userMobile: string = '';
  saveDetails: boolean = true;
  
  // Login Form
  loginEmail: string = '';
  loginPassword: string = '';
  loginError: string = '';
  loginSuccess: string = '';
  isLoggingIn: boolean = false;
  
  // Pricing in ₹
  seatsTotal = 0;
  foodTotal = 0;
  convenienceFee = 30; // ₹30 in INR
  couponDiscount = 0;
  total = 0;
  
  // Coupon
  couponCode = '';
  couponValid = false;
  couponMessage = '';
  appliedCoupon: any = null;
  
  // Payment Options
  selectedPaymentMethod: 'upi-qr' | 'upi-id' | 'card' | 'netbanking' | 'wallet' = 'upi-qr';
  upiId: string = 'user@okhdfcbank';
  cardNumber: string = '4532 8976 1234 5678';
  cardHolder: string = '';
  cardExpiry: string = '08/28';
  cardCvv: string = '345';
  selectedBank: string = 'HDFC Bank';
  selectedWallet: string = 'Paytm Wallet';
  
  // Dynamic QR Code countdown timer
  qrTimerSeconds = 600; // 10 minutes
  qrTimerInterval: any = null;
  qrFormattedTime = '10:00';
  isQrScanned = false;
  
  // Processing & Confirmation
  isProcessing = false;
  processingStep = '';
  showConfirmModal = false;
  formError = '';

  constructor(
    private bookingService: BookingService,
    private foodService: FoodService,
    private offerService: OfferService,
    private authService: AuthService,
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.userName = user.name || '';
        this.userEmail = user.email || '';
        this.userMobile = user.mobile || '9876543210';
        this.cardHolder = user.name || '';
      } else {
        // Defaults for quick demo convenience
        if (!this.userName) this.userName = 'Swetha R';
        if (!this.userEmail) this.userEmail = 'swetha@example.com';
        if (!this.userMobile) this.userMobile = '9876543210';
        if (!this.cardHolder) this.cardHolder = 'Swetha R';
      }
    });

    this.loadBookingData();
    this.startQrTimer();
  }

  ngOnDestroy(): void {
    this.stopQrTimer();
  }

  loadBookingData(): void {
    this.bookingService.getSelectedSeats().subscribe(seats => {
      this.selectedSeats = seats;
      this.seatsTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
      this.calculateTotal();
      if (this.selectedSeats.length === 0) {
        this.router.navigate(['/showtimes']);
      }
    });

    this.foodService.getCart().subscribe(cart => {
      this.foodCart = cart;
      this.foodTotal = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
      this.calculateTotal();
    });

    const showtimeId = this.bookingService.getCurrentShowtimeValue();
    if (showtimeId) {
      this.showtimeService.getShowtimeById(showtimeId).subscribe(showtime => {
        this.showtime = showtime || null;
        if (showtime) {
          this.movieService.getMovieById(showtime.movieId).subscribe(m => this.movie = m || null);
          this.cinemaService.getCinemaById(showtime.cinemaId).subscribe(c => this.cinema = c || null);
        }
      });
    }
  }

  calculateTotal(): void {
    const subtotal = this.seatsTotal + this.foodTotal;
    this.total = Math.max(0, subtotal + this.convenienceFee - this.couponDiscount);
  }

  // QR Timer Countdown
  startQrTimer(): void {
    this.stopQrTimer();
    this.qrTimerInterval = setInterval(() => {
      if (this.qrTimerSeconds > 0) {
        this.qrTimerSeconds--;
        const mins = Math.floor(this.qrTimerSeconds / 60);
        const secs = this.qrTimerSeconds % 60;
        this.qrFormattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      } else {
        this.qrTimerSeconds = 600; // Reset
      }
    }, 1000);
  }

  stopQrTimer(): void {
    if (this.qrTimerInterval) {
      clearInterval(this.qrTimerInterval);
      this.qrTimerInterval = null;
    }
  }

  // Coupon management
  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.couponMessage = 'Please enter a valid coupon code';
      this.couponValid = false;
      return;
    }

    const bookingAmount = this.seatsTotal + this.foodTotal;
    this.offerService.validateCoupon(this.couponCode.trim().toUpperCase(), bookingAmount).subscribe(result => {
      if (result.valid) {
        this.couponValid = true;
        this.couponDiscount = result.discount;
        this.appliedCoupon = result.offer || null;
        this.couponMessage = `🎉 Coupon applied! You saved ₹${result.discount}`;
        this.calculateTotal();
      } else {
        this.couponValid = false;
        this.couponDiscount = 0;
        this.appliedCoupon = null;
        this.couponMessage = 'Invalid or expired coupon code. Try CINEFIRST or WEEKEND50';
        this.calculateTotal();
      }
    });
  }

  removeCoupon(): void {
    this.couponCode = '';
    this.couponValid = false;
    this.couponDiscount = 0;
    this.appliedCoupon = null;
    this.couponMessage = '';
    this.calculateTotal();
  }

  // Auth / Login Handler in Checkout
  onSignIn(): void {
    this.loginError = '';
    this.loginSuccess = '';

    if (!this.loginEmail.trim() || !this.loginPassword.trim()) {
      this.loginError = 'Please enter both email and password';
      return;
    }

    this.isLoggingIn = true;
    this.authService.login({
      email: this.loginEmail.trim(),
      password: this.loginPassword
    }).subscribe({
      next: (res) => {
        this.isLoggingIn = false;
        if (res.success && res.user) {
          const user = res.user;
          this.currentUser = user;
          this.userName = user.name;
          this.userEmail = user.email;
          this.userMobile = user.mobile || this.userMobile;
          this.cardHolder = user.name;
          this.loginSuccess = `Welcome back, ${user.name}! Account linked.`;
          this.authTab = 'guest';
        } else {
          this.loginError = res.message || 'Invalid credentials. Please check your email and password.';
        }
      },
      error: () => {
        this.isLoggingIn = false;
        this.loginError = 'Login failed. Please try again.';
      }
    });
  }

  // Payment Selection
  selectPaymentMethod(method: 'upi-qr' | 'upi-id' | 'card' | 'netbanking' | 'wallet'): void {
    this.selectedPaymentMethod = method;
  }

  setUpiHandle(handle: string): void {
    const base = this.upiId.split('@')[0] || 'user';
    this.upiId = `${base}${handle}`;
  }

  // Payment Verification & Modal
  openConfirmModal(): void {
    this.formError = '';

    if (!this.userName.trim()) {
      this.formError = 'Please enter your Full Name';
      return;
    }

    if (!this.userEmail.trim() || !this.userEmail.includes('@')) {
      this.formError = 'Please enter a valid Email ID for e-ticket delivery';
      return;
    }

    if (!this.userMobile.trim() || this.userMobile.length < 10) {
      this.formError = 'Please enter a valid 10-digit Mobile Number for SMS updates';
      return;
    }

    if (this.selectedPaymentMethod === 'upi-id' && !this.upiId.trim()) {
      this.formError = 'Please enter a valid UPI ID (e.g. name@upi)';
      return;
    }

    if (this.selectedPaymentMethod === 'card' && (!this.cardNumber || this.cardNumber.length < 16)) {
      this.formError = 'Please enter a valid 16-digit Card Number';
      return;
    }

    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  // Payment Execution & Ticket Generation
  processPayment(): void {
    this.closeConfirmModal();
    this.isProcessing = true;
    this.processingStep = 'Connecting to Secure Payment Gateway...';

    setTimeout(() => {
      this.processingStep = `Verifying ${this.getPaymentMethodLabel(this.selectedPaymentMethod)} transaction...`;
    }, 1200);

    setTimeout(() => {
      this.processingStep = 'Authorizing payment & booking seats...';
    }, 2400);

    setTimeout(() => {
      this.finalizeBooking();
    }, 3600);
  }

  private finalizeBooking(): void {
    if (!this.showtime || !this.movie || !this.cinema) {
      this.isProcessing = false;
      return;
    }

    // Ensure user is created or updated
    let userId = this.currentUser?.id;
    if (!userId) {
      userId = 'user-' + Date.now();
      const newUser: User = {
        id: userId,
        name: this.userName.trim(),
        email: this.userEmail.trim(),
        mobile: this.userMobile.trim(),
        city: this.cinema.city || 'Chennai',
        preferences: { preferredLanguage: this.movie.language, preferredFormat: this.showtime.format }
      };
      this.authService.setCurrentUser(newUser);
      this.currentUser = newUser;
    }

    this.bookingService.createBooking({
      userId: userId,
      movieId: this.movie.id,
      movieTitle: this.movie.title,
      moviePoster: this.movie.poster,
      cinemaId: this.cinema.id,
      cinemaName: this.cinema.name,
      showtimeId: this.showtime.id,
      date: this.showtime.date,
      time: this.showtime.time,
      foodCart: this.foodCart,
      couponCode: this.appliedCoupon ? this.appliedCoupon.code : undefined,
      couponDiscount: this.couponDiscount
    }).subscribe({
      next: (booking) => {
        this.isProcessing = false;
        this.foodService.clearCart();
        this.router.navigate(['/booking-success'], {
          queryParams: { bookingId: booking.id, id: booking.id }
        });
      },
      error: (err) => {
        this.isProcessing = false;
        console.error('Booking failed:', err);
        alert('Booking transaction failed. Please try again.');
      }
    });
  }

  // Helpers
  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => `${s.row}${s.number}`).join(', ');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'upi-qr': return 'UPI Dynamic QR Code';
      case 'upi-id': return `UPI ID (${this.upiId})`;
      case 'card': return `Credit/Debit Card ending in ${this.cardNumber.slice(-4)}`;
      case 'netbanking': return `Net Banking (${this.selectedBank})`;
      case 'wallet': return `Wallet (${this.selectedWallet})`;
      default: return 'Online Payment';
    }
  }

  goBack(): void {
    this.router.navigate(['/food']);
  }
}
