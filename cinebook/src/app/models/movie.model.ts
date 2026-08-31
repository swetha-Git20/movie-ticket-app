export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  duration: string;
  releaseDate: string;
  genre: string[];
  language: string;
  synopsis: string;
  cast: string[];
  director: string;
  price: number;
  format: string[]; // IMAX, 4DX, 2D, 3D
  trailerUrl?: string;
  isComingSoon?: boolean;
}
