import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { ShowtimeService } from '../../services/showtime.service';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { Seat } from '../../models/seat.model';
import { Showtime } from '../../models/showtime.model';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  seats: Seat[] = [];
  selectedSeats: Seat[] = [];
  isLoading = true;
  
  showtime: Showtime | null = null;
  movie: Movie | null = null;
  cinema: Cinema | null = null;
  
  totalPrice = 0;
  maxSeats = 6;

  constructor(
    private bookingService: BookingService,
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const showtimeId = params['showtime'];
      if (showtimeId) {
        this.loadShowtime(showtimeId);
      } else {
        this.router.navigate(['/showtimes']);
      }
    });

    this.bookingService.getSelectedSeats().subscribe(seats => {
      this.selectedSeats = seats;
      this.updateTotal();
    });
  }

  loadShowtime(showtimeId: string): void {
    this.showtimeService.getShowtimeById(showtimeId).subscribe(showtime => {
      this.showtime = showtime || null;
      if (this.showtime) {
        this.bookingService.setCurrentShowtime(showtimeId);
        this.loadMovieDetails(this.showtime.movieId);
        this.loadCinemaDetails(this.showtime.cinemaId);
        this.generateSeats();
      }
    });
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

  generateSeats(): void {
    this.seats = this.bookingService.generateSeatLayout();
    this.isLoading = false;
  }

  toggleSeat(seat: Seat): void {
    if (seat.status === 'occupied') return;

    const isSelected = this.selectedSeats.some(s => s.row === seat.row && s.number === seat.number);
    
    if (isSelected) {
      this.bookingService.deselectSeat(seat);
    } else {
      if (this.selectedSeats.length >= this.maxSeats) {
        alert(`You can only select up to ${this.maxSeats} seats`);
        return;
      }
      this.bookingService.selectSeat(seat);
    }
  }

  isSeatSelected(seat: Seat): boolean {
    return this.selectedSeats.some(s => s.row === seat.row && s.number === seat.number);
  }

  updateTotal(): void {
    this.totalPrice = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }

  proceedToFood(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    this.router.navigate(['/food']);
  }

  goBack(): void {
    this.bookingService.clearSelectedSeats();
    this.router.navigate(['/showtimes']);
  }

  getSeatPriceLabel(type: string): string {
    switch (type) {
      case 'vip': return '$18';
      case 'premium': return '$14';
      default: return '$10';
    }
  }

  getSeatTypeLabel(type: string): string {
    switch (type) {
      case 'vip': return 'VIP';
      case 'premium': return 'Premium';
      default: return 'Standard';
    }
  }

  getSelectedSeatsList(): string {
    return this.selectedSeats.map(s => s.row + s.number).join(', ');
  }
}
