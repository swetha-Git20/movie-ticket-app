import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    MovieCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  nowShowingMovies: Movie[] = [];
  comingSoonMovies: Movie[] = [];
  featuredMovie: Movie | null = null;
  isLoading = true;
  
  // Quick Book state
  selectedMovie = '';
  selectedCity = '';
  selectedCinema = '';
  selectedDate = '';
  selectedShowtime = '';
  
  // Filter state
  activeFilter = 'All Movies';
  filters = ['All Movies', 'English', 'IMAX', 'Action', 'Comedy', 'Sci-Fi', 'Romance', 'Horror'];
  
  // Carousel state
  currentSlide = 0;
  carouselMovies: Movie[] = [];

  constructor(
    private movieService: MovieService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getNowShowing().subscribe(movies => {
      this.nowShowingMovies = movies;
      this.carouselMovies = movies.slice(0, 5);
      this.featuredMovie = movies[0] || null;
      this.isLoading = false;
    });

    this.movieService.getComingSoon().subscribe(movies => {
      this.comingSoonMovies = movies;
    });
  }

  onBookNow(movie: Movie): void {
    this.router.navigate(['/movies', movie.id]);
  }

  navigateToMovie(movieId: string): void {
    this.router.navigate(['/movies', movieId]);
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    if (filter === 'All Movies') {
      this.loadMovies();
    } else {
      this.movieService.filterMovies({ genre: filter }).subscribe(movies => {
        this.nowShowingMovies = movies;
      });
    }
  }

  // Quick Book handlers
  onMovieChange(movieId: string): void {
    this.selectedMovie = movieId;
    this.selectedCinema = '';
    this.selectedShowtime = '';
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.selectedCinema = '';
    this.selectedShowtime = '';
  }

  onCinemaChange(cinemaId: string): void {
    this.selectedCinema = cinemaId;
    this.selectedShowtime = '';
  }

  onDateChange(date: string): void {
    this.selectedDate = date;
    this.selectedShowtime = '';
  }

  onShowtimeChange(showtime: string): void {
    this.selectedShowtime = showtime;
  }

  onQuickBook(): void {
    if (this.selectedMovie && this.selectedCity && this.selectedCinema && this.selectedDate && this.selectedShowtime) {
      this.router.navigate(['/seat-selection'], {
        queryParams: {
          movie: this.selectedMovie,
          cinema: this.selectedCinema,
          date: this.selectedDate,
          showtime: this.selectedShowtime
        }
      });
    }
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

  // Coming Soon - Notify Me
  onNotifyMe(movie: Movie): void {
    // Mock notification
    console.log(`Notify me for ${movie.title}`);
    alert(`You'll be notified when "${movie.title}" is available for booking!`);
  }

  // Helper methods for Quick Book dropdowns
  get availableCities(): string[] {
    return ['New York', 'Los Angeles', 'San Francisco', 'Chicago'];
  }

  get availableCinemas(): string[] {
    // This would normally come from cinema service based on selected city
    return ['CineBook Grand', 'Metroplex Downtown', 'Starlight Mall'];
  }

  get availableDates(): string[] {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  get availableShowtimes(): string[] {
    return ['10:00', '13:00', '16:00', '19:00', '22:00'];
  }
}
