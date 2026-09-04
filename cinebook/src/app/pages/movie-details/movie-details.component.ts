import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieService } from '../../services/movie.service';
import { ShowtimeService } from '../../services/showtime.service';
import { CinemaService } from '../../services/cinema.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Showtime } from '../../models/showtime.model';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { ModalComponent } from '../../components/modal/modal.component';

export interface DateOption {
  fullDate: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    MovieCardComponent,
    ModalComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = true;
  recommendedMovies: Movie[] = [];
  
  // City & Cinema & Showtime Selection
  selectedCity = 'Chennai';
  availableCities: string[] = [];
  availableCinemas: Cinema[] = [];
  filteredCinemas: Cinema[] = [];
  
  selectedCinema = '';
  selectedDate = '';
  selectedShowtime: Showtime | null = null;
  availableShowtimes: Showtime[] = [];
  
  // Date options
  dateOptions: DateOption[] = [];
  minBookingDate = '';
  maxBookingDate = '';
  
  // Modal states & Sanitized Trailer
  showTrailerModal = false;
  safeTrailerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private cinemaService: CinemaService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initDates();

    this.route.paramMap.subscribe(params => {
      const movieId = params.get('id');
      if (movieId) {
        this.loadMovieDetails(movieId);
        this.loadRecommendedMovies(movieId);
      }
    });

    this.route.queryParamMap.subscribe(qParams => {
      const city = qParams.get('city');
      if (city) {
        this.selectedCity = city;
      } else {
        this.selectedCity = this.authService.getSelectedCityValue() || 'Chennai';
      }

      const date = qParams.get('date');
      if (date) {
        this.selectedDate = date;
      }
    });

    this.loadCinemas();
  }

  initDates(): void {
    const today = new Date();
    const dates: DateOption[] = [];
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    this.minBookingDate = this.formatDateIso(today);

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = this.formatDateIso(d);
      
      dates.push({
        fullDate: iso,
        dayName: i === 0 ? 'TODAY' : i === 1 ? 'TOMORROW' : daysShort[d.getDay()],
        dayNumber: d.getDate(),
        monthName: monthsShort[d.getMonth()]
      });
    }

    const maxD = new Date(today);
    maxD.setDate(today.getDate() + 14);
    this.maxBookingDate = this.formatDateIso(maxD);

    this.dateOptions = dates;
    if (!this.selectedDate) {
      this.selectedDate = dates[0].fullDate;
    }
  }

  private formatDateIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadMovieDetails(movieId: string): void {
    this.isLoading = true;
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.movie = movie || null;
      this.isLoading = false;
      
      if (this.movie?.trailerUrl) {
        this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
      }
      
      this.filterCinemasByCity();
      this.loadShowtimes();
    });
  }

  loadCinemas(): void {
    this.cinemaService.getCities().subscribe(cities => {
      this.availableCities = cities;
    });

    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.availableCinemas = cinemas;
      this.filterCinemasByCity();
    });
  }

  loadRecommendedMovies(currentMovieId: string): void {
    this.movieService.getNowShowing().subscribe(movies => {
      this.recommendedMovies = movies.filter(m => m.id !== currentMovieId).slice(0, 4);
    });
  }

  filterCinemasByCity(): void {
    if (!this.selectedCity) {
      this.filteredCinemas = this.availableCinemas;
    } else {
      this.filteredCinemas = this.availableCinemas.filter(c => 
        c.city.toLowerCase() === this.selectedCity.toLowerCase()
      );
    }

    if (this.filteredCinemas.length > 0 && !this.selectedCinema) {
      this.selectedCinema = this.filteredCinemas[0].id;
    } else if (!this.filteredCinemas.some(c => c.id === this.selectedCinema)) {
      this.selectedCinema = this.filteredCinemas.length > 0 ? this.filteredCinemas[0].id : '';
    }

    this.loadShowtimes();
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.authService.setSelectedCity(city);
    this.selectedCinema = '';
    this.selectedShowtime = null;
    this.filterCinemasByCity();
  }

  onCinemaChange(cinemaId: string): void {
    this.selectedCinema = cinemaId;
    this.selectedShowtime = null;
    this.loadShowtimes();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.selectedShowtime = null;
    this.loadShowtimes();
  }

  loadShowtimes(): void {
    if (this.movie && this.selectedDate) {
      this.showtimeService.getFilteredShowtimes({
        movieId: this.movie.id,
        cinemaId: this.selectedCinema || undefined,
        date: this.selectedDate
      }).subscribe(showtimes => {
        this.availableShowtimes = showtimes;
      });
    }
  }

  selectShowtime(showtime: Showtime): void {
    this.selectedShowtime = showtime;
  }

  proceedToSeatSelection(): void {
    if (this.selectedShowtime) {
      this.router.navigate(['/seat-selection'], {
        queryParams: {
          showtime: this.selectedShowtime.id
        }
      });
    }
  }

  openTrailer(): void {
    this.showTrailerModal = true;
  }

  closeTrailer(): void {
    this.showTrailerModal = false;
  }

  onBookNow(movie: Movie): void {
    this.router.navigate(['/movies', movie.id], {
      queryParams: {
        city: this.selectedCity,
        date: this.selectedDate
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  getCinemaName(cinemaId: string): string {
    const cinema = this.availableCinemas.find(c => c.id === cinemaId);
    return cinema ? cinema.name : '';
  }
}
