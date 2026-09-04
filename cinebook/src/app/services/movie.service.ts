import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies: Movie[] = [
    // --- TAMIL MOVIES ---
    {
      id: 'tm-1',
      title: 'Jananayagan',
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '2h 45m',
      releaseDate: '2025-01-14',
      genre: ['Action', 'Political', 'Drama'],
      language: 'Tamil',
      synopsis: 'A charismatic mass leader emerges from the grassroots to take down deep-rooted political corruption and fight for the voices of the common people.',
      cast: ['Thalapathy Vijay', 'Pooja Hegde', 'Prakash Raj', 'Gautham Vasudev Menon'],
      director: 'H. Vinoth',
      price: 180,
      format: ['IMAX', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-2',
      title: 'Leo',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      duration: '2h 44m',
      releaseDate: '2024-10-19',
      genre: ['Action', 'Crime', 'Thriller'],
      language: 'Tamil',
      synopsis: 'A mild-mannered café owner in Himachal Pradesh becomes the target of ruthless gangsters who suspect he is a ferocious mob enforcer from their past.',
      cast: ['Thalapathy Vijay', 'Trisha Krishnan', 'Sanjay Dutt', 'Arjun Sarja'],
      director: 'Lokesh Kanagaraj',
      price: 200,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-3',
      title: 'The Greatest of All Time (GOAT)',
      poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80',
      rating: 4.7,
      duration: '2h 58m',
      releaseDate: '2024-09-05',
      genre: ['Sci-Fi', 'Action', 'Spy Thriller'],
      language: 'Tamil',
      synopsis: 'An elite hostage negotiator and intelligence officer faces his greatest adversary when a long-forgotten mission returns with deadly high-tech consequences.',
      cast: ['Vijay', 'Prashanth', 'Prabhu Deva', 'Sneha', 'Meenakshi Chaudhary'],
      director: 'Venkat Prabhu',
      price: 190,
      format: ['IMAX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-4',
      title: 'Jailer',
      poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      duration: '2h 48m',
      releaseDate: '2024-08-10',
      genre: ['Action', 'Crime', 'Comedy'],
      language: 'Tamil',
      synopsis: 'Muthuvel Pandian, a quiet retired prison warden, unleashes unstoppable fury against an idol smuggling syndicate after his policeman son goes missing.',
      cast: ['Superstar Rajinikanth', 'Mohanlal', 'Shiva Rajkumar', 'Ramya Krishnan', 'Vinayakan'],
      director: 'Nelson Dilipkumar',
      price: 220,
      format: ['IMAX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-5',
      title: 'Vettaiyan',
      poster: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80',
      rating: 4.6,
      duration: '2h 43m',
      releaseDate: '2024-10-10',
      genre: ['Action', 'Drama', 'Investigation'],
      language: 'Tamil',
      synopsis: 'A veteran encounter specialist battles moral dilemmas and judiciary confrontations when he discovers an intricate web of educational fraud.',
      cast: ['Rajinikanth', 'Amitabh Bachchan', 'Fahadh Faasil', 'Manju Warrier', 'Rana Daggubati'],
      director: 'T.J. Gnanavel',
      price: 180,
      format: ['2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-6',
      title: 'Amaran',
      poster: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '2h 47m',
      releaseDate: '2024-10-31',
      genre: ['Biography', 'Action', 'Drama'],
      language: 'Tamil',
      synopsis: 'The inspiring true story of Major Mukund Varadarajan, an exceptional Indian Army officer awarded the Ashoka Chakra for courage in anti-terror operations.',
      cast: ['Sivakarthikeyan', 'Sai Pallavi', 'Bhuvan Arora', 'Rahul Bose'],
      director: 'Rajkumar Periasamy',
      price: 180,
      format: ['2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-7',
      title: 'Kanguva',
      poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
      rating: 4.5,
      duration: '2h 34m',
      releaseDate: '2024-11-14',
      genre: ['Fantasy', 'Period Action', 'Adventure'],
      language: 'Tamil',
      synopsis: 'A prehistoric tribal warrior chieftain and a modern-day bounty hunter are connected across centuries by an unfulfilled oath and ancient destiny.',
      cast: ['Suriya', 'Bobby Deol', 'Disha Patani', 'Yogi Babu'],
      director: 'Siva',
      price: 200,
      format: ['3D', 'IMAX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'tm-8',
      title: 'Viduthalai Part 2',
      poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      duration: '2h 38m',
      releaseDate: '2025-02-20',
      genre: ['Crime', 'Period Drama', 'Thriller'],
      language: 'Tamil',
      synopsis: 'The raw conclusion of the clash between righteous rebel leader Vaathiyar and state police force navigating human rights, duty, and conscience.',
      cast: ['Soori', 'Vijay Sethupathi', 'Manju Warrier', 'Bhavani Sre', 'Gautham Vasudev Menon'],
      director: 'Vetrimaaran',
      price: 160,
      format: ['2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: true
    },

    // --- ENGLISH MOVIES ---
    {
      id: 'em-1',
      title: 'Spider-Man: Brand New Day',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '2h 25m',
      releaseDate: '2025-05-02',
      genre: ['Action', 'Sci-Fi', 'Adventure'],
      language: 'English',
      synopsis: 'Peter Parker navigates life completely on his own in New York City, taking on new street-level threats and multiverse rifts in an all-new thrilling chapter.',
      cast: ['Tom Holland', 'Zendaya', 'Jacob Batalon', 'Vincent D\'Onofrio'],
      director: 'Destin Daniel Cretton',
      price: 250,
      format: ['IMAX 3D', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'em-2',
      title: 'Deadpool & Wolverine',
      poster: 'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      duration: '2h 08m',
      releaseDate: '2024-07-26',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      language: 'English',
      synopsis: 'The Time Variance Authority pulls the merc-with-a-mouth from his quiet life and teams him with a reluctant, battle-weary Wolverine on a mission to save the multiverse.',
      cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
      director: 'Shawn Levy',
      price: 240,
      format: ['IMAX 3D', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'em-3',
      title: 'Oppenheimer',
      poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '3h 00m',
      releaseDate: '2024-08-05',
      genre: ['Drama', 'History', 'Biography'],
      language: 'English',
      synopsis: 'The epic biographical journey of physicist J. Robert Oppenheimer and his leadership of the Manhattan Project that birthed the atomic age.',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
      director: 'Christopher Nolan',
      price: 280,
      format: ['IMAX 70mm', 'Dolby Atmos', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'em-4',
      title: 'Dune: Part Two',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '2h 46m',
      releaseDate: '2024-03-01',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      language: 'English',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his noble family.',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Javier Bardem'],
      director: 'Denis Villeneuve',
      price: 260,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'em-5',
      title: 'Gladiator II',
      poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80',
      rating: 4.7,
      duration: '2h 28m',
      releaseDate: '2024-11-15',
      genre: ['Action', 'Drama', 'History'],
      language: 'English',
      synopsis: 'Years after witnessing the death of Maximus, Lucius enters the Colosseum to restore glory and honor to the fractured Roman Empire.',
      cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
      director: 'Ridley Scott',
      price: 220,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    },
    {
      id: 'em-6',
      title: 'Mission: Impossible – The Final Reckoning',
      poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1400&q=80',
      rating: 4.8,
      duration: '2h 45m',
      releaseDate: '2025-05-23',
      genre: ['Action', 'Thriller', 'Adventure'],
      language: 'English',
      synopsis: 'Ethan Hunt and his IMF team embark on their ultimate, heart-stopping mission against a terrifying rogue AI threatening global civilization.',
      cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg', 'Vanessa Kirby'],
      director: 'Christopher McQuarrie',
      price: 250,
      format: ['IMAX', '4DX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: true
    },
    {
      id: 'em-7',
      title: 'Avatar: Fire and Ash',
      poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      rating: 4.9,
      duration: '3h 10m',
      releaseDate: '2025-12-19',
      genre: ['Sci-Fi', 'Fantasy', 'Adventure'],
      language: 'English',
      synopsis: 'Jake Sully and Neytiri encounter the Ash People, a formidable and volcanic clan of Na\'vi residing in the fiery frontiers of Pandora.',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Michelle Yeoh'],
      director: 'James Cameron',
      price: 280,
      format: ['IMAX 3D', '4DX 3D', 'Dolby Atmos 3D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: true
    },
    {
      id: 'em-8',
      title: 'Barbie',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80',
      rating: 4.4,
      duration: '1h 54m',
      releaseDate: '2024-07-25',
      genre: ['Comedy', 'Fantasy', 'Adventure'],
      language: 'English',
      synopsis: 'Barbie suffers an existential crisis that leads her to question her world and embark on a vibrant journey into the real human world.',
      cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Simu Liu', 'Will Ferrell'],
      director: 'Greta Gerwig',
      price: 180,
      format: ['IMAX', '2D'],
      trailerUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isComingSoon: false
    }
  ];

  private moviesSubject = new BehaviorSubject<Movie[]>(this.movies);

  constructor() {
    this.loadFromLocalStorage();
  }

  getMovies(): Observable<Movie[]> {
    return of(this.movies).pipe(delay(150));
  }

  getMovieById(id: string): Observable<Movie | undefined> {
    return of(this.movies.find(m => m.id === id)).pipe(delay(100));
  }

  getNowShowing(): Observable<Movie[]> {
    return of(this.movies.filter(m => !m.isComingSoon)).pipe(delay(150));
  }

  getComingSoon(): Observable<Movie[]> {
    return of(this.movies.filter(m => m.isComingSoon)).pipe(delay(150));
  }

  getMoviesByLanguage(language: string): Observable<Movie[]> {
    if (!language || language === 'All') {
      return of(this.movies.filter(m => !m.isComingSoon)).pipe(delay(150));
    }
    return of(this.movies.filter(m => m.language.toLowerCase() === language.toLowerCase() && !m.isComingSoon)).pipe(delay(150));
  }

  searchMovies(query: string): Observable<Movie[]> {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      return of(this.movies).pipe(delay(100));
    }
    return of(this.movies.filter(m => 
      m.title.toLowerCase().includes(searchTerm) ||
      m.genre.some(g => g.toLowerCase().includes(searchTerm)) ||
      m.cast.some(c => c.toLowerCase().includes(searchTerm)) ||
      m.language.toLowerCase().includes(searchTerm)
    )).pipe(delay(100));
  }

  filterMovies(filters: { genre?: string; language?: string; format?: string }): Observable<Movie[]> {
    let filtered = this.movies.filter(m => !m.isComingSoon);
    
    if (filters.genre && filters.genre !== 'All' && filters.genre !== 'All Movies') {
      filtered = filtered.filter(m => m.genre.includes(filters.genre!));
    }
    if (filters.language && filters.language !== 'All') {
      filtered = filtered.filter(m => m.language.toLowerCase() === filters.language!.toLowerCase());
    }
    if (filters.format && filters.format !== 'All') {
      filtered = filtered.filter(m => m.format.some(f => f.toLowerCase().includes(filters.format!.toLowerCase())));
    }
    
    return of(filtered).pipe(delay(150));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_movies_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.movies = parsed;
          this.moviesSubject.next(this.movies);
        }
      } catch (e) {
        console.error('Failed to parse stored movies', e);
      }
    } else {
      localStorage.setItem('cinebook_movies_v2', JSON.stringify(this.movies));
    }
  }
}
