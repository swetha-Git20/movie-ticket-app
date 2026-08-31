import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CinemaService } from '../../services/cinema.service';
import { Movie } from '../../models/movie.model';
import { Cinema } from '../../models/cinema.model';

@Component({
  selector: 'app-search-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-overlay.component.html',
  styleUrls: ['./search-overlay.component.css']
})
export class SearchOverlayComponent {
  @Output() close = new EventEmitter<void>();
  
  searchQuery = '';
  isOpen = false;
  
  results: { movies: Movie[]; cinemas: Cinema[] } = {
    movies: [],
    cinemas: []
  };
  isSearching = false;

  constructor(
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private router: Router
  ) {}

  open(): void {
    this.isOpen = true;
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  }

  closeOverlay(): void {
    this.isOpen = false;
    this.searchQuery = '';
    this.results = { movies: [], cinemas: [] };
    this.close.emit();
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.results = { movies: [], cinemas: [] };
      return;
    }

    this.isSearching = true;

    // Search movies and cinemas in parallel
    this.movieService.searchMovies(this.searchQuery).subscribe(movies => {
      this.results.movies = movies;
      this.isSearching = false;
    });

    this.cinemaService.searchCinemas(this.searchQuery).subscribe(cinemas => {
      this.results.cinemas = cinemas;
    });
  }

  navigateToMovie(movieId: string): void {
    this.closeOverlay();
    this.router.navigate(['/movies', movieId]);
  }

  navigateToCinema(cinemaId: string): void {
    this.closeOverlay();
    this.router.navigate(['/showtimes'], { queryParams: { cinema: cinemaId } });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeOverlay();
    }
  }
}
