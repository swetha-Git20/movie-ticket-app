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
  showtime: Showtime | null | undefined = null;
  movie: Movie | null = null;
  cinema: Cinema | null = null;
  currentUser: User | null = null;
  
  // Pricing
  seatsTotal = 0;
  foodTotal = 0;
  convenienceFee = 2.50;
  couponDiscount = 0;
  total = 0;
  
  // Coupon
  couponCode = '';
  couponValid = false;
  couponMessage = '';
  appliedCoupon: any = null;
  
  // Payment
  selectedPaymentMethod = 'upi';
  paymentMethods = ['upi', 'card', 'netbanking'];
  isProcessing = false;
  
  // Modal
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
    // Check if user is logged in
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (!user) {
        localStorage.setItem('cinebook_redirect_url', '/checkout');
        this.router.navigate(['/login']);
        return;
      }
    });

    this.loadBookingData();
  }

  loadBookingData(): void {
    this.bookingService.getSelectedSeats().subscribe(seats => {
      this.selectedSeats = seats;
      this.seatsTotal = seats.reduce((sum, seat) => sum + seat.price, 0);
      this.calculateTotal();
    });

    this.foodService.getCart().subscribe(cart => {
      this.foodCart = cart;
      this.foodTotal = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
      this.calculateTotal();
    });

    const showtimeId = this.bookingService.getCurrentShowtimeValue();
    if (showtimeId) {
      this.showtimeService.getShowtimeById(showtimeId).subscribe(showtime => {
        this.showtime = showtime;
        if (showtime) {
          this.loadMovieDetails(showtime.movieId);
          this.loadCinemaDetails(showtime.cinemaId);
        }
      });
    }
  }

  loadMovieDetails(movieId: string): void {
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.movie = movie || null;
    });
  }

  loadCinemaDetails(cinemaId: string): void {
    this.cinemaService.getCinemaById(cinemaId).subscribe(cinema => {
      this.cinema = cinema || null;
    });
  }

  calculateTotal(): void {
    const subtotal = this.seatsTotal + this.foodTotal;
    this.total = subtotal + this.convenienceFee - this.couponDiscount;
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.couponMessage = 'Please enter a coupon code';
      this.couponValid = false;
      return;
    }

    const bookingAmount = this.seatsTotal + this.foodTotal;
    this.offerService.validateCoupon(this.couponCode, bookingAmount).subscribe(result => {
      if (result.valid) {
        this.couponValid = true;
        this.couponDiscount = result.discount;
        this.appliedCoupon = result.offer;
        this.couponMessage = `Coupon applied! You saved $${result.discount}`;
        this.calculateTotal();
      } else {
        this.couponValid = false;
        this.couponDiscount = 0;
        this.appliedCoupon = null;
        this.couponMessage = 'Invalid or expired coupon code';
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

    // Simulate payment processing
    setTimeout(() => {
      this.createBooking();
    }, 2000);
  }

  createBooking(): void {
    if (!this.currentUser || !this.showtime || !this.movie || !this.cinema) {
      this.isProcessing = false;
      alert('Missing required information');
      return;
    }

    const bookingData = {
      userId: this.currentUser.id,
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
      case 'upi': return 'UPI';
      case 'card': return 'Credit/Debit Card';
      case 'netbanking': return 'Net Banking';
      default: return method;
    }
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => s.row + s.number).join(', ');
  }
}
