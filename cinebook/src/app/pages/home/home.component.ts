import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';

export interface DateOption {
  fullDate: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
}

export interface CinematicStillItem {
  movieId: string;
  title: string;
  image: string;
  experience: string;
  tagline: string;
  language: string;
  formats: string[];
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
    LanguageSwitcherComponent,
    DatePickerComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  allNowShowing: Movie[] = [];
  nowShowingMovies: Movie[] = [];
  comingSoonMovies: Movie[] = [];
  featuredMovie: Movie | null = null;
  featuredPosters: Movie[] = [];
  tamilMovies: Movie[] = [];
  englishMovies: Movie[] = [];
  isLoading = true;
  
  // Tamil Nadu Cities & Cinemas
  availableCities: string[] = [];
  availableCinemas: Cinema[] = [];
  filteredCinemasForCity: Cinema[] = [];
  
  // Quick Book & Flow State: City → Date → Language → Movie → Theatre → Show Time
  selectedCity = 'Chennai';
  selectedDate = '';
  selectedLanguage = 'All';
  selectedMovie = '';
  selectedCinema = '';
  selectedShowtime = '';
  availableShowtimesForSelection: Showtime[] = [];
  
  // Date options
  dateOptions: DateOption[] = [];
  minBookingDate = '';
  maxBookingDate = '';
  
  // Filter states
  activeFilter = 'All';
  filters = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy', 'Romance', 'History'];
  
  selectedExperience = 'All';
  experienceFilters = ['All Experiences', 'IMAX', '4DX', 'Dolby Atmos', 'P[XL]'];
  
  // Hero Billboard Carousel state
  currentSlide = 0;
  carouselMovies: Movie[] = [];
  autoSlideInterval: any = null;
  isCarouselPaused = false;
  
  // Trailer Modal
  selectedTrailerMovie: Movie | null = null;
  safeTrailerUrl: SafeResourceUrl | null = null;
  isTrailerOpen = false;

  // Curated Cinematic Stills Showcase
  cinematicStills: CinematicStillItem[] = [
    {
      movieId: 'tm-2',
      title: 'Leo',
      image: 'https://image.tmdb.org/t/p/original/s3Hd8BZ8XJx8G5Yz4QfJk9L.jpg',
      experience: 'IMAX 2D & Dolby Atmos',
      tagline: 'Bloody Sweet Action in Grand Scale',
      language: 'Tamil',
      formats: ['IMAX', '4DX', 'Dolby Atmos']
    },
    {
      movieId: 'em-2',
      title: 'Deadpool & Wolverine',
      image: 'https://image.tmdb.org/t/p/original/yD3UbyWbH7j8YF3PcrVzFp37z8o.jpg',
      experience: 'IMAX 3D & 4DX',
      tagline: 'The Ultimate Multiverse Showdown',
      language: 'English',
      formats: ['IMAX 3D', '4DX', 'Dolby Atmos']
    },
    {
      movieId: 'tm-3',
      title: 'The Greatest of All Time',
      image: 'https://image.tmdb.org/t/p/original/kk9SmNt6QcP5thvSYELWvO0NWuC.jpg',
      experience: 'P[XL] & Dolby Atmos',
      tagline: 'High-Tech Espionage & Spectacle',
      language: 'Tamil',
      formats: ['IMAX', 'P[XL]', 'Dolby Atmos']
    },
    {
      movieId: 'em-4',
      title: 'Dune: Part Two',
      image: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
      experience: 'IMAX Experience',
      tagline: 'Epic Desert Warfare & Visual Brilliance',
      language: 'English',
      formats: ['IMAX', '4DX', 'Dolby Atmos']
    },
    {
      movieId: 'tm-4',
      title: 'Jailer',
      image: 'https://image.tmdb.org/t/p/original/354cwvrS6p4V41yI5cdv8xR2c6L.jpg',
      experience: 'Dolby Atmos & Laser 2D',
      tagline: 'Mass Unleashed with Superstar Rajinikanth',
      language: 'Tamil',
      formats: ['IMAX', '2D', 'Dolby Atmos']
    },
    {
      movieId: 'em-7',
      title: 'Avatar: The Way of Water',
      image: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      experience: 'IMAX 3D & P[XL] 3D',
      tagline: 'Unmatched 3D Underwater Realism',
      language: 'English',
      formats: ['IMAX 3D', '4DX 3D', 'P[XL]']
    }
  ];

  constructor(
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private showtimeService: ShowtimeService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    public router: Router
  ) {
    this.initDates();
  }

  ngOnInit(): void {
    this.initDates();
    this.loadInitialData();
    this.startCarouselAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopCarouselAutoSlide();
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
      this.availableCities = cities.length > 0 ? cities : ['Chennai', 'Pondicherry', 'Trichy', 'Vellore', 'Ranipet'];
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
      // Select top 6 high-impact movies for hero widescreen stills carousel
      this.carouselMovies = movies.slice(0, 6);
      this.featuredMovie = movies[0] || null;
      this.featuredPosters = movies.slice(0, 8);
      this.separateMoviesByLanguage(movies);
      this.isLoading = false;
    });

    this.movieService.getComingSoon().subscribe(movies => {
      this.comingSoonMovies = movies;
    });
  }

  separateMoviesByLanguage(movies: Movie[]): void {
    this.tamilMovies = movies.filter(m => m.language.toLowerCase() === 'tamil');
    this.englishMovies = movies.filter(m => m.language.toLowerCase() === 'english');
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFiltersAndLanguage();
  }

  setExperienceFilter(exp: string): void {
    this.selectedExperience = exp;
    this.applyFiltersAndLanguage();
  }

  onLanguageChanged(language: string): void {
    this.selectedLanguage = language;
    this.applyFiltersAndLanguage();
    
    // Reset movie selection when language changes
    this.selectedMovie = '';
    this.selectedCinema = '';
    this.selectedShowtime = '';
  }

  applyFiltersAndLanguage(): void {
    let result = [...this.allNowShowing];

    if (this.selectedLanguage && this.selectedLanguage !== 'All') {
      result = result.filter(m => m.language.toLowerCase() === this.selectedLanguage.toLowerCase());
    }

    if (this.activeFilter && this.activeFilter !== 'All') {
      result = result.filter(m => m.genre.includes(this.activeFilter));
    }

    if (this.selectedExperience && this.selectedExperience !== 'All' && this.selectedExperience !== 'All Experiences') {
      result = result.filter(m => m.format.some(f => f.toLowerCase().includes(this.selectedExperience.toLowerCase())));
    }

    this.nowShowingMovies = result;
    this.separateMoviesByLanguage(result);
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
    this.selectedMovie = '';
    this.selectedCinema = '';
    this.selectedShowtime = '';
    this.updateAvailableShowtimes();
  }

  onMovieChange(movieId: string): void {
    this.selectedMovie = movieId;
    this.selectedCinema = '';
    this.selectedShowtime = '';
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

  // Hero Carousel controls
  startCarouselAutoSlide(): void {
    this.stopCarouselAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      if (!this.isCarouselPaused && this.carouselMovies.length > 0) {
        this.nextSlide();
      }
    }, 5500);
  }

  stopCarouselAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  pauseCarousel(): void {
    this.isCarouselPaused = true;
  }

  resumeCarousel(): void {
    this.isCarouselPaused = false;
  }

  nextSlide(): void {
    if (this.carouselMovies.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.carouselMovies.length;
    }
  }

  prevSlide(): void {
    if (this.carouselMovies.length > 0) {
      this.currentSlide = (this.currentSlide - 1 + this.carouselMovies.length) % this.carouselMovies.length;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Trailer Modal
  openTrailer(movie: Movie, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedTrailerMovie = movie;
    if (movie.trailerUrl) {
      const embedUrl = movie.trailerUrl.includes('embed') 
        ? movie.trailerUrl 
        : movie.trailerUrl.replace('watch?v=', 'embed/');
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl + '?autoplay=1');
      this.isTrailerOpen = true;
    }
  }

  closeTrailer(): void {
    this.isTrailerOpen = false;
    this.selectedTrailerMovie = null;
    this.safeTrailerUrl = null;
  }

  onNotifyMe(movie: Movie): void {
    alert(`Thank you! You'll be alerted as soon as advance booking opens for "${movie.title}".`);
  }
}
