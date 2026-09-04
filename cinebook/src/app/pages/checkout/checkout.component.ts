import { Component, OnInit } from '@angular/core';
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
export class CheckoutComponent implements OnInit {
  selectedSeats: any[] = [];
  foodCart: CartItem[] = [];
  showtime: Showtime | null = null;
  movie: Movie | null = null;
  cinema: Cinema | null = null;
  currentUser: User | null = null;
  
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
  
  // Payment
  selectedPaymentMethod = 'upi';
  upiId = 'user@okhdfcbank';
  cardNumber = '4532 8976 1234 5678';
  cardExpiry = '08/28';
  cardCvv = '345';
  selectedBank = 'HDFC Bank';
  
  isProcessing = false;
  showConfirmModal = false;

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
    this.currentUser = this.authService.getCurrentUserValue();
    if (!this.currentUser) {
      this.authService.getCurrentUser().subscribe(user => {
        this.currentUser = user;
        if (!user) {
          // Create guest/demo user if not logged in to ensure flawless checkout
          const guestUser: User = {
            id: 'user-guest-' + Date.now(),
            name: 'Cinema Guest',
            email: 'guest@cinebook.in',
            mobile: '9876543210',
            city: 'Chennai',
            preferences: { preferredLanguage: 'Tamil', preferredFormat: '2D' }
          };
          this.currentUser = guestUser;
        }
      });
    }

    this.loadBookingData();
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
        this.appliedCoupon = result.offer;
        this.couponMessage = `🎉 Coupon applied! You saved ₹${result.discount}`;
        this.calculateTotal();
      } else {
        this.couponValid = false;
        this.couponDiscount = 0;
        this.appliedCoupon = null;
        this.couponMessage = 'Invalid or expired promo code. Try FIRSTFREE or WEEKEND50';
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

  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }

  openConfirmModal(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  processPayment(): void {
    this.isProcessing = true;
    this.closeConfirmModal();

    setTimeout(() => {
      this.createBooking();
    }, 1500);
  }

  createBooking(): void {
    if (!this.showtime || !this.movie || !this.cinema) {
      this.isProcessing = false;
      alert('Missing required booking details. Please try again.');
      return;
    }

    const bookingData = {
      userId: this.currentUser ? this.currentUser.id : 'user-guest',
      movieId: this.movie.id,
      movieTitle: this.movie.title,
      moviePoster: this.movie.poster,
      cinemaId: this.cinema.id,
      cinemaName: this.cinema.name,
      showtimeId: this.showtime.id,
      date: this.showtime.date,
      time: this.showtime.time,
      foodCart: this.foodCart,
      couponCode: this.appliedCoupon?.code,
      couponDiscount: this.couponDiscount
    };

    this.bookingService.createBooking(bookingData).subscribe(booking => {
      this.isProcessing = false;
      this.foodService.clearCart();
      this.router.navigate(['/booking-success'], { 
        queryParams: { bookingId: booking.id } 
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/food']);
  }

  getPaymentMethodLabel(method: string): string {
    switch (method) {
      case 'upi': return 'Instant UPI (GPay / PhonePe / Paytm / BHIM)';
      case 'card': return 'Credit / Debit Card (Visa / Mastercard / RuPay)';
      case 'netbanking': return 'Net Banking';
      default: return method;
    }
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => s.row + s.number).join(', ');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
