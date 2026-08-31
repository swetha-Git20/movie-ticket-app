import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ShowtimeService } from '../../services/showtime.service';
import { CinemaService } from '../../services/cinema.service';
import { Movie } from '../../models/movie.model';
import { Showtime } from '../../models/showtime.model';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    MovieCardComponent,
    ModalComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  isLoading = true;
  recommendedMovies: Movie[] = [];
  
  // Showtime selection
  selectedCinema = '';
  selectedDate = '';
  selectedShowtime: Showtime | null = null;
  availableShowtimes: Showtime[] = [];
  availableCinemas: Cinema[] = [];
  
  // Modal states
  showTrailerModal = false;
  
  // Date options
  availableDates: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private showtimeService: ShowtimeService,
    private cinemaService: CinemaService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieDetails(movieId);
      this.loadRecommendedMovies();
      this.generateDateOptions();
    }
  }

  loadMovieDetails(movieId: string): void {
    this.movieService.getMovieById(movieId).subscribe(movie => {
      this.movie = movie || null;
      this.isLoading = false;
      
      if (this.movie) {
        this.loadCinemas();
      }
    });
  }

  loadCinemas(): void {
    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.availableCinemas = cinemas;
    });
  }

  loadRecommendedMovies(): void {
    this.movieService.getNowShowing().subscribe(movies => {
      this.recommendedMovies = movies.slice(0, 4).filter(m => m.id !== this.route.snapshot.paramMap.get('id'));
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
    if (this.movie && this.selectedCinema && this.selectedDate) {
      this.showtimeService.getFilteredShowtimes({
        movieId: this.movie.id,
        cinemaId: this.selectedCinema,
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
    this.router.navigate(['/movies', movie.id]);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  getCinemaName(cinemaId: string): string {
    const cinema = this.availableCinemas.find(c => c.id === cinemaId);
    return cinema ? cinema.name : '';
  }
}
