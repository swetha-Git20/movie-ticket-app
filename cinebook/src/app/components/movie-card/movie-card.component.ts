import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() showPrice = true;
  @Output() bookNow = new EventEmitter<Movie>();

  constructor(private router: Router) {}

  onBookNow(): void {
    this.bookNow.emit(this.movie);
  }

  navigateToMovie(): void {
    this.router.navigate(['/movies', this.movie.id]);
  }
}
