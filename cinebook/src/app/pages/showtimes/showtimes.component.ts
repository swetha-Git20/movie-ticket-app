import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ShowtimeService } from '../../services/showtime.service';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { Showtime } from '../../models/showtime.model';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-showtimes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './showtimes.component.html',
  styleUrls: ['./showtimes.component.css']
})
export class ShowtimesComponent implements OnInit {
  showtimes: Showtime[] = [];
  groupedShowtimes: { [key: string]: Showtime[] } = {};
  movies: Movie[] = [];
  cinemas: Cinema[] = [];
  isLoading = true;
  
  // Filter state
  selectedMovie = '';
  selectedCinema = '';
  selectedDate = '';
  availableDates: string[] = [];
  availableCities: string[] = [];

  constructor(
    private showtimeService: ShowtimeService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.generateDateOptions();
    
    // Check for query params
    this.route.queryParams.subscribe(params => {
      if (params['cinema']) {
        this.selectedCinema = params['cinema'];
      }
      if (params['movie']) {
        this.selectedMovie = params['movie'];
      }
      this.applyFilters();
    });
  }

  loadInitialData(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });

    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.cinemas = cinemas;
      this.availableCities = [...new Set(cinemas.map(c => c.city))];
    });

    this.loadShowtimes();
  }

  loadShowtimes(): void {
    this.showtimeService.getShowtimes().subscribe(showtimes => {
      this.showtimes = showtimes;
      this.groupShowtimes();
      this.isLoading = false;
    });
  }

  generateDateOptions(): void {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    this.availableDates = dates;
    
    // Set today as default
    this.selectedDate = dates[0];
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
    const filters: any = {};
    if (this.selectedMovie) filters.movieId = this.selectedMovie;
    if (this.selectedCinema) filters.cinemaId = this.selectedCinema;
    if (this.selectedDate) filters.date = this.selectedDate;

    this.showtimeService.getFilteredShowtimes(filters).subscribe(showtimes => {
      this.showtimes = showtimes;
      this.groupShowtimes();
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

  selectShowtime(showtime: Showtime): void {
    this.router.navigate(['/seat-selection'], {
      queryParams: {
        showtime: showtime.id
      }
    });
  }

  getMovieName(movieId: string): string {
    const movie = this.movies.find(m => m.id === movieId);
    return movie ? movie.title : '';
  }

  getCinemaName(cinemaId: string): string {
    const cinema = this.cinemas.find(c => c.id === cinemaId);
    return cinema ? cinema.name : '';
  }

  getCinema(cinemaId: string): Cinema | undefined {
    return this.cinemas.find(c => c.id === cinemaId);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  clearFilters(): void {
    this.selectedMovie = '';
    this.selectedCinema = '';
    this.selectedDate = this.availableDates[0];
    this.applyFilters();
  }
}
