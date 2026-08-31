import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    {
      id: '1',
      title: 'Neon Skyline Part II',
      poster: 'https://picsum.photos/seed/neon1/300/450',
      backdrop: 'https://picsum.photos/seed/neon1back/1200/600',
      rating: 4.8,
      duration: '2h 35m',
      releaseDate: '2024-08-15',
      genre: ['Sci-Fi', 'Action'],
      language: 'English',
      synopsis: 'In a dystopian future where neon lights hide dark secrets, a rogue hacker discovers a conspiracy that threatens to rewrite reality itself.',
      cast: ['Alex Chen', 'Maria Rodriguez', 'James Wilson', 'Sophie Turner'],
      director: 'Christopher Nolan',
      price: 15,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '2',
      title: 'Alien Protocol',
      poster: 'https://picsum.photos/seed/alien/300/450',
      backdrop: 'https://picsum.photos/seed/alienback/1200/600',
      rating: 4.5,
      duration: '2h 15m',
      releaseDate: '2024-07-20',
      genre: ['Sci-Fi', 'Thriller'],
      language: 'English',
      synopsis: 'When humanity receives a mysterious signal from deep space, a team of scientists must decode the message before time runs out.',
      cast: ['Emma Stone', 'Ryan Gosling', 'Oscar Isaac'],
      director: 'Denis Villeneuve',
      price: 12,
      format: ['IMAX', '2D', '3D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '3',
      title: 'Velocity Peak',
      poster: 'https://picsum.photos/seed/velocity/300/450',
      backdrop: 'https://picsum.photos/seed/velocityback/1200/600',
      rating: 4.2,
      duration: '1h 55m',
      releaseDate: '2024-08-01',
      genre: ['Action', 'Thriller'],
      language: 'English',
      synopsis: 'A former racing driver is pulled back into the criminal underworld when his brother is kidnapped by an international crime syndicate.',
      cast: ['Jason Statham', 'Gal Gadot', 'Vin Diesel'],
      director: 'Justin Lin',
      price: 15,
      format: ['4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '4',
      title: 'The Corridor',
      poster: 'https://picsum.photos/seed/corridor/300/450',
      backdrop: 'https://picsum.photos/seed/corridorback/1200/600',
      rating: 4.3,
      duration: '2h 5m',
      releaseDate: '2024-07-28',
      genre: ['Horror', 'Thriller'],
      language: 'English',
      synopsis: 'A psychological horror following a journalist who investigates a series of disappearances in an abandoned hotel with a dark past.',
      cast: ['Florence Pugh', 'Jack Reynor', 'Vera Farmiga'],
      director: 'Mike Flanagan',
      price: 10,
      format: ['2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '5',
      title: 'Midnight Serenade',
      poster: 'https://picsum.photos/seed/serenade/300/450',
      backdrop: 'https://picsum.photos/seed/serenadeback/1200/600',
      rating: 4.6,
      duration: '2h 20m',
      releaseDate: '2024-08-10',
      genre: ['Romance', 'Drama'],
      language: 'English',
      synopsis: 'Two musicians from different worlds find love through their shared passion for music in this heartwarming romantic drama.',
      cast: ['Zendaya', 'Timothée Chalamet', 'Ana de Armas'],
      director: 'Damien Chazelle',
      price: 12,
      format: ['2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '6',
      title: 'Shadow Warrior',
      poster: 'https://picsum.photos/seed/shadow/300/450',
      backdrop: 'https://picsum.photos/seed/shadowback/1200/600',
      rating: 4.1,
      duration: '2h 30m',
      releaseDate: '2024-07-15',
      genre: ['Action', 'Adventure'],
      language: 'English',
      synopsis: 'A skilled martial artist seeks revenge against the corrupt corporation that destroyed his family and village.',
      cast: ['Donnie Yen', 'Michelle Yeoh', 'Henry Golding'],
      director: 'John Woo',
      price: 14,
      format: ['IMAX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '7',
      title: 'Comedy Nights',
      poster: 'https://picsum.photos/seed/comedy/300/450',
      backdrop: 'https://picsum.photos/seed/comedyback/1200/600',
      rating: 3.9,
      duration: '1h 45m',
      releaseDate: '2024-08-05',
      genre: ['Comedy'],
      language: 'English',
      synopsis: 'A struggling comedian gets the chance of a lifetime when he accidentally becomes famous for all the wrong reasons.',
      cast: ['Kevin Hart', 'Tiffany Haddish', 'Chris Rock'],
      director: 'Tim Story',
      price: 10,
      format: ['2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '8',
      title: 'The Last Kingdom',
      poster: 'https://picsum.photos/seed/kingdom/300/450',
      backdrop: 'https://picsum.photos/seed/kingdomback/1200/600',
      rating: 4.7,
      duration: '2h 45m',
      releaseDate: '2024-07-25',
      genre: ['Action', 'Drama', 'History'],
      language: 'English',
      synopsis: 'An epic historical drama following a young warrior who must unite his people against an invading army.',
      cast: ['Alexander Skarsgård', 'Emily Blunt', 'Tom Hardy'],
      director: 'Ridley Scott',
      price: 15,
      format: ['IMAX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: '9',
      title: 'Quantum Paradox',
      poster: 'https://picsum.photos/seed/quantum/300/450',
      backdrop: 'https://picsum.photos/seed/quantumback/1200/600',
      rating: 4.4,
      duration: '2h 10m',
      releaseDate: '2024-09-01',
      genre: ['Sci-Fi', 'Mystery'],
      language: 'English',
      synopsis: 'A physicist discovers a way to communicate with parallel universes, but each message brings dangerous consequences.',
      cast: ['Cillian Murphy', 'Emily Watson', 'David Tennant'],
      director: 'Jonathan Nolan',
      price: 14,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: true
    },
    {
      id: '10',
      title: 'Ocean\'s Depths',
      poster: 'https://picsum.photos/seed/ocean/300/450',
      backdrop: 'https://picsum.photos/seed/oceanback/1200/600',
      rating: 4.0,
      duration: '1h 50m',
      releaseDate: '2024-09-15',
      genre: ['Adventure', 'Family'],
      language: 'English',
      synopsis: 'A marine biologist and her team discover an ancient civilization hidden beneath the ocean floor.',
      cast: ['Lupita Nyong\'o', 'Pedro Pascal', 'Millie Bobby Brown'],
      director: 'James Cameron',
      price: 12,
      format: ['IMAX', '3D', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: true
    }
  ];

  private moviesSubject = new BehaviorSubject<Movie[]>(this.movies);

  constructor() {
    this.loadFromLocalStorage();
  }

  getMovies(): Observable<Movie[]> {
    return this.moviesSubject.asObservable().pipe(delay(300));
  }

  getMovieById(id: string): Observable<Movie | undefined> {
    return of(this.movies.find(m => m.id === id)).pipe(delay(200));
  }

  getNowShowing(): Observable<Movie[]> {
    return of(this.movies.filter(m => !m.isComingSoon)).pipe(delay(300));
  }

  getComingSoon(): Observable<Movie[]> {
    return of(this.movies.filter(m => m.isComingSoon)).pipe(delay(300));
  }

  searchMovies(query: string): Observable<Movie[]> {
    const searchTerm = query.toLowerCase();
    return of(this.movies.filter(m => 
      m.title.toLowerCase().includes(searchTerm) ||
      m.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
      m.cast.some(c => c.toLowerCase().includes(searchTerm))
    )).pipe(delay(200));
  }

  filterMovies(filters: { genre?: string; language?: string; format?: string }): Observable<Movie[]> {
    let filtered = this.movies.filter(m => !m.isComingSoon);
    
    if (filters.genre) {
      filtered = filtered.filter(m => m.genre.includes(filters.genre));
    }
    if (filters.language) {
      filtered = filtered.filter(m => m.language === filters.language);
    }
    if (filters.format) {
      filtered = filtered.filter(m => m.format.includes(filters.format));
    }
    
    return of(filtered).pipe(delay(200));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_movies');
    if (stored) {
      this.movies = JSON.parse(stored);
      this.moviesSubject.next(this.movies);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cinebook_movies', JSON.stringify(this.movies));
  }
}
