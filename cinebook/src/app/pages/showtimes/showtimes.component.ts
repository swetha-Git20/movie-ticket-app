import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ShowtimeService } from '../../services/showtime.service';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { AuthService } from '../../services/auth.service';
import { Showtime } from '../../models/showtime.model';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LanguageSwitcherComponent } from '../../components/language-switcher/language-switcher.component';

export interface DateOption {
  fullDate: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
}

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    LanguageSwitcherComponent
  ],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  showtimes: Showtime[] = [];
  groupedShowtimes: { [cinemaId: string]: Showtime[] } = {};
  movies: Movie[] = [];
  cinemas: Cinema[] = [];
  filteredCinemas: Cinema[] = [];
  isLoading = true;
  
  // Filter state
  selectedCity = 'Chennai';
  selectedMovie = '';
  selectedCinema = '';
  selectedDate = '';
  selectedLanguage = 'All';
  
  availableDates: DateOption[] = [];
  availableCities: string[] = [];
  minDate = '';
  maxDate = '';

  constructor(
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
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

    this.minDate = this.formatDateIso(today);

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
    this.maxDate = this.formatDateIso(maxD);

    this.availableDates = dates;
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
    });

    this.cinemaService.getCities().subscribe(cities => {
      this.availableCities = cities;
    });

    this.movieService.getNowShowing().subscribe(movies => {
      this.movies = movies;
    });

    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.cinemas = cinemas;
      this.filterCinemasByCity();
      this.applyQueryParametersAndLoad();
    });
  }

  applyQueryParametersAndLoad(): void {
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.selectedCity = params['city'];
        this.authService.setSelectedCity(this.selectedCity);
      }
      if (params['cinema']) {
        this.selectedCinema = params['cinema'];
      }
      if (params['movie']) {
        this.selectedMovie = params['movie'];
      }
      if (params['date']) {
        this.selectedDate = params['date'];
      }
      if (params['language']) {
        this.selectedLanguage = params['language'];
      }
      this.filterCinemasByCity();
      this.applyFilters();
    });
  }

  filterCinemasByCity(): void {
    if (!this.selectedCity || this.selectedCity === 'All') {
      this.filteredCinemas = this.cinemas;
    } else {
      this.filteredCinemas = this.cinemas.filter(c => 
        c.city.toLowerCase() === this.selectedCity.toLowerCase()
      );
    }
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.authService.setSelectedCity(city);
    this.selectedCinema = '';
    this.filterCinemasByCity();
    this.applyFilters();
  }

  onLanguageChange(lang: string): void {
    this.selectedLanguage = lang;
    this.applyFilters();
  }

  onMovieChange(movieId: string): void {
    this.selectedMovie = movieId;
    this.applyFilters();
  }

  onCinemaChange(cinemaId: string): void {
    this.selectedCinema = cinemaId;
    this.applyFilters();
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.applyFilters();
  }

  applyFilters(): void {
    this.isLoading = true;
    const filters: any = {
      date: this.selectedDate
    };
    if (this.selectedMovie) filters.movieId = this.selectedMovie;
    if (this.selectedCinema) filters.cinemaId = this.selectedCinema;

    this.showtimeService.getFilteredShowtimes(filters).subscribe(showtimes => {
      // Filter by city cinemas
      let relevantCinemaIds = new Set(this.filteredCinemas.map(c => c.id));
      let filtered = showtimes.filter(st => relevantCinemaIds.has(st.cinemaId));

      // Filter by language if selected
      if (this.selectedLanguage && this.selectedLanguage !== 'All') {
        const allowedMovieIds = new Set(
          this.movies
            .filter(m => m.language.toLowerCase() === this.selectedLanguage.toLowerCase())
            .map(m => m.id)
        );
        filtered = filtered.filter(st => allowedMovieIds.has(st.movieId));
      }

      this.showtimes = filtered;
      this.groupShowtimes();
      this.isLoading = false;
    });
  }

  groupShowtimes(): void {
    this.groupedShowtimes = {};
    this.showtimes.forEach(showtime => {
      if (!this.groupedShowtimes[showtime.cinemaId]) {
        this.groupedShowtimes[showtime.cinemaId] = [];
      }
      this.groupedShowtimes[showtime.cinemaId].push(showtime);
    });
  }

  getGroupedCinemaIds(): string[] {
    return Object.keys(this.groupedShowtimes);
  }

  getShowtimesForCinemaByMovie(cinemaId: string): { movie: Movie | undefined; showtimes: Showtime[] }[] {
    const stList = this.groupedShowtimes[cinemaId] || [];
    const movieMap = new Map<string, Showtime[]>();

    stList.forEach(st => {
      if (!movieMap.has(st.movieId)) {
        movieMap.set(st.movieId, []);
      }
      movieMap.get(st.movieId)!.push(st);
    });

    const result: { movie: Movie | undefined; showtimes: Showtime[] }[] = [];
    movieMap.forEach((showtimes, movieId) => {
      const movie = this.movies.find(m => m.id === movieId);
      result.push({ movie, showtimes });
    });

    return result;
  }

  selectShowtime(showtime: Showtime): void {
    this.router.navigate(['/seat-selection'], {
      queryParams: {
        showtime: showtime.id
      }
    });
  }

  getCinema(cinemaId: string): Cinema | undefined {
    return this.cinemas.find(c => c.id === cinemaId);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  clearFilters(): void {
    this.selectedMovie = '';
    this.selectedCinema = '';
    this.selectedLanguage = 'All';
    this.selectedDate = this.availableDates[0].fullDate;
    this.applyFilters();
  }
}
