import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { ShowtimeService } from '../../services/showtime.service';
import { AuthService } from '../../services/auth.service';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';
import { Showtime } from '../../models/showtime.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

export interface DateOption {
  fullDate: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    MovieCardComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allNowShowing: Movie[] = [];
  nowShowingMovies: Movie[] = [];
  comingSoonMovies: Movie[] = [];
  featuredMovie: Movie | null = null;
  isLoading = true;
  
  // Language switcher
  selectedLanguage = 'All';
  
  // Tamil Nadu Cities & Cinemas
  availableCities: string[] = [];
  availableCinemas: Cinema[] = [];
  filteredCinemasForCity: Cinema[] = [];
  
  // Quick Book & Flow State
  selectedCity = 'Chennai';
  selectedDate = '';
  selectedMovie = '';
  selectedCinema = '';
  selectedShowtime = '';
  availableShowtimesForSelection: Showtime[] = [];
  
  // Date options
  dateOptions: DateOption[] = [];
  minBookingDate = '';
  maxBookingDate = '';
  
  // Genre Filter state
  activeFilter = 'All';
  filters = ['All', 'Action', 'Drama', 'Sci-Fi', 'Crime', 'Comedy', 'Fantasy', 'Biography'];
  
  // Carousel state
  currentSlide = 0;
  carouselMovies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private showtimeService: ShowtimeService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.initDates();
    this.loadInitialData();
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
        monthName: monthsShort[d.getMonth()],
        isToday: i === 0
      });
    }

    const maxD = new Date(today);
    maxD.setDate(today.getDate() + 14);
    this.maxBookingDate = this.formatDateIso(maxD);

    this.dateOptions = dates;
    this.selectedDate = dates[0].fullDate;
  }

  private formatDateIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadInitialData(): void {
    this.authService.getSelectedCity().subscribe(city => {
      this.selectedCity = city || 'Chennai';
      this.filterCinemasByCity();
    });

    this.cinemaService.getCities().subscribe(cities => {
      this.availableCities = cities;
    });

    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.availableCinemas = cinemas;
      this.filterCinemasByCity();
    });

    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getNowShowing().subscribe(movies => {
      this.allNowShowing = movies;
      this.applyFiltersAndLanguage();
      this.carouselMovies = movies.slice(0, 5);
      this.featuredMovie = movies[0] || null;
      this.isLoading = false;
    });

    this.movieService.getComingSoon().subscribe(movies => {
      this.comingSoonMovies = movies;
    });
  }

  onLanguageChanged(language: string): void {
    this.selectedLanguage = language;
    this.applyFiltersAndLanguage();
    
    // If selected movie doesn't match language, reset it
    if (this.selectedMovie) {
      const movie = this.allNowShowing.find(m => m.id === this.selectedMovie);
      if (movie && language !== 'All' && movie.language.toLowerCase() !== language.toLowerCase()) {
        this.selectedMovie = '';
        this.selectedShowtime = '';
      }
    }
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFiltersAndLanguage();
  }

  applyFiltersAndLanguage(): void {
    let result = [...this.allNowShowing];

    if (this.selectedLanguage && this.selectedLanguage !== 'All') {
      result = result.filter(m => m.language.toLowerCase() === this.selectedLanguage.toLowerCase());
    }

    if (this.activeFilter && this.activeFilter !== 'All') {
      result = result.filter(m => m.genre.includes(this.activeFilter));
    }

    this.nowShowingMovies = result;
  }

  filterCinemasByCity(): void {
    if (!this.selectedCity) {
      this.filteredCinemasForCity = this.availableCinemas;
    } else {
      this.filteredCinemasForCity = this.availableCinemas.filter(c => 
        c.city.toLowerCase() === this.selectedCity.toLowerCase()
      );
    }

    if (this.selectedCinema) {
      const exists = this.filteredCinemasForCity.some(c => c.id === this.selectedCinema);
      if (!exists) {
        this.selectedCinema = '';
        this.selectedShowtime = '';
      }
    }
  }

  // Quick Book Handlers
  onCityChange(city: string): void {
    this.selectedCity = city;
    this.authService.setSelectedCity(city);
    this.filterCinemasByCity();
    this.updateAvailableShowtimes();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.updateAvailableShowtimes();
  }

  onMovieChange(movieId: string): void {
    this.selectedMovie = movieId;
    this.updateAvailableShowtimes();
  }

  onCinemaChange(cinemaId: string): void {
    this.selectedCinema = cinemaId;
    this.updateAvailableShowtimes();
  }

  onShowtimeChange(showtimeId: string): void {
    this.selectedShowtime = showtimeId;
  }

  updateAvailableShowtimes(): void {
    this.selectedShowtime = '';
    if (this.selectedMovie && this.selectedCinema && this.selectedDate) {
      this.showtimeService.getFilteredShowtimes({
        movieId: this.selectedMovie,
        cinemaId: this.selectedCinema,
        date: this.selectedDate
      }).subscribe(showtimes => {
        this.availableShowtimesForSelection = showtimes;
      });
    } else {
      this.availableShowtimesForSelection = [];
    }
  }

  onQuickBook(): void {
    if (this.selectedShowtime) {
      this.router.navigate(['/seat-selection'], {
        queryParams: {
          showtime: this.selectedShowtime
        }
      });
    } else if (this.selectedMovie) {
      this.router.navigate(['/movies', this.selectedMovie], {
        queryParams: {
          city: this.selectedCity,
          date: this.selectedDate
        }
      });
    } else {
      this.router.navigate(['/showtimes'], {
        queryParams: {
          city: this.selectedCity,
          date: this.selectedDate,
          language: this.selectedLanguage !== 'All' ? this.selectedLanguage : undefined
        }
      });
    }
  }

  onBookNow(movie: Movie): void {
    this.router.navigate(['/movies', movie.id], {
      queryParams: {
        city: this.selectedCity,
        date: this.selectedDate
      }
    });
  }

  navigateToMovie(movieId: string): void {
    this.router.navigate(['/movies', movieId], {
      queryParams: {
        city: this.selectedCity,
        date: this.selectedDate
      }
    });
  }

  // Carousel controls
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselMovies.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.carouselMovies.length) % this.carouselMovies.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onNotifyMe(movie: Movie): void {
    alert(`Thank you! You'll be alerted as soon as advance booking opens for "${movie.title}".`);
  }
}
