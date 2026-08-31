import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-trailers',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    ModalComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './trailers.component.html',
  styleUrls: ['./trailers.component.css']
})
export class TrailersComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = true;
  selectedTrailer: Movie | null = null;
  showTrailerModal = false;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies.filter(m => m.trailerUrl);
      this.isLoading = false;
    });
  }

  openTrailer(movie: Movie): void {
    this.selectedTrailer = movie;
    this.showTrailerModal = true;
  }

  closeTrailer(): void {
    this.showTrailerModal = false;
    this.selectedTrailer = null;
  }
}
