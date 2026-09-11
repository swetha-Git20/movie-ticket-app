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
      poster: 'https://upload.wikimedia.org/wikipedia/en/c/c8/Jana_Nayagan.jpg',
      backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
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
      trailerUrl: 'https://www.youtube.com/embed/tK7Y2sJ8mNk',
      isComingSoon: false
    },
    {
      id: 'tm-2',
      title: 'Leo',
      poster: 'https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/s3Hd8BZ8XJx8G5Yz4QfJk9L.jpg',
      rating: 4.8,
      duration: '2h 44m',
      releaseDate: '2024-10-19',
      genre: ['Action', 'Crime', 'Thriller'],
      language: 'Tamil',
      synopsis: 'A mild-mannered café owner in Himachal Pradesh becomes the target of ruthless gangsters who suspect he is a ferocious mob enforcer from their past.',
      cast: ['Thalapathy Vijay', 'Trisha Krishnan', 'Sanjay Dutt', 'Arjun Sarja'],
      director: 'Lokesh Kanagaraj',
      price: 200,
      format: ['IMAX', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/XR4EfaBk5E0',
      isComingSoon: false
    },
    {
      id: 'tm-3',
      title: 'The Greatest of All Time (GOAT)',
      poster: 'https://upload.wikimedia.org/wikipedia/en/1/1e/The_Greatest_of_All_Time.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/kk9SmNt6QcP5thvSYELWvO0NWuC.jpg',
      rating: 4.7,
      duration: '2h 58m',
      releaseDate: '2024-09-05',
      genre: ['Sci-Fi', 'Action', 'Spy Thriller'],
      language: 'Tamil',
      synopsis: 'An elite hostage negotiator and intelligence officer faces his greatest adversary when a long-forgotten mission returns with deadly high-tech consequences.',
      cast: ['Vijay', 'Prashanth', 'Prabhu Deva', 'Sneha', 'Meenakshi Chaudhary'],
      director: 'Venkat Prabhu',
      price: 190,
      format: ['IMAX', '2D', 'Dolby Atmos', 'P[XL]'],
      trailerUrl: 'https://www.youtube.com/embed/QBkXF7Qnq5Q',
      isComingSoon: false
    },
    {
      id: 'tm-4',
      title: 'Jailer',
      poster: 'https://upload.wikimedia.org/wikipedia/ta/3/3f/Jailer_film_poster.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/354cwvrS6p4V41yI5cdv8xR2c6L.jpg',
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
      trailerUrl: 'https://www.youtube.com/embed/5BPCJjN7fCg',
      isComingSoon: false
    },
    {
      id: 'tm-5',
      title: 'Vettaiyan',
      poster: 'https://upload.wikimedia.org/wikipedia/en/6/68/Vettaiyan_poster.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/b3AeMIsXPm6wvGp9E7mGmRZ6528.jpg',
      rating: 4.6,
      duration: '2h 43m',
      releaseDate: '2024-10-10',
      genre: ['Action', 'Drama', 'Investigation'],
      language: 'Tamil',
      synopsis: 'A veteran encounter specialist battles moral dilemmas and judiciary confrontations when he discovers an intricate web of educational fraud.',
      cast: ['Rajinikanth', 'Amitabh Bachchan', 'Fahadh Faasil', 'Manju Warrier', 'Rana Daggubati'],
      director: 'T.J. Gnanavel',
      price: 180,
      format: ['2D', 'Dolby Atmos', '4DX'],
      trailerUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg',
      isComingSoon: false
    },
    {
      id: 'tm-6',
      title: 'Amaran',
      poster: 'https://upload.wikimedia.org/wikipedia/en/5/54/Amaran_2024_poster.jpg',
      backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      rating: 4.9,
      duration: '2h 47m',
      releaseDate: '2024-10-31',
      genre: ['Biography', 'Action', 'Drama'],
      language: 'Tamil',
      synopsis: 'The inspiring true story of Major Mukund Varadarajan, an exceptional Indian Army officer awarded the Ashoka Chakra for courage in anti-terror operations.',
      cast: ['Sivakarthikeyan', 'Sai Pallavi', 'Bhuvan Arora', 'Rahul Bose'],
      director: 'Rajkumar Periasamy',
      price: 180,
      format: ['2D', 'Dolby Atmos', 'P[XL]'],
      trailerUrl: 'https://www.youtube.com/embed/dqKc9x1x5g4',
      isComingSoon: false
    },
    {
      id: 'tm-7',
      title: 'Kanguva',
      poster: 'https://upload.wikimedia.org/wikipedia/en/e/e8/Kanguva_poster.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/mU9D017zFv61t3J4S6L4yXJ8qW2.jpg',
      rating: 4.5,
      duration: '2h 34m',
      releaseDate: '2024-11-14',
      genre: ['Fantasy', 'Period Action', 'Adventure'],
      language: 'Tamil',
      synopsis: 'A prehistoric tribal warrior chieftain and a modern-day bounty hunter are connected across centuries by an unfulfilled oath and ancient destiny.',
      cast: ['Suriya', 'Bobby Deol', 'Disha Patani', 'Yogi Babu'],
      director: 'Siva',
      price: 200,
      format: ['3D', 'IMAX', '2D', '4DX 3D'],
      trailerUrl: 'https://www.youtube.com/embed/vhI4Vn1x1xg',
      isComingSoon: false
    },
    {
      id: 'tm-8',
      title: 'Viduthalai Part 2',
      poster: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Viduthalai_Part_2.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/tD1qHnE5a3e9nQ0v9p8m7k6l5j4.jpg',
      rating: 4.8,
      duration: '2h 38m',
      releaseDate: '2025-02-20',
      genre: ['Crime', 'Period Drama', 'Thriller'],
      language: 'Tamil',
      synopsis: 'The raw conclusion of the clash between righteous rebel leader Vaathiyar and state police force navigating human rights, duty, and conscience.',
      cast: ['Soori', 'Vijay Sethupathi', 'Manju Warrier', 'Bhavani Sre', 'Gautham Vasudev Menon'],
      director: 'Vetrimaaran',
      price: 160,
      format: ['2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/m5x1z8q7g4g',
      isComingSoon: true
    },

    // --- ENGLISH MOVIES ---
    {
      id: 'em-1',
      title: 'Spider-Man: No Way Home',
      poster: 'https://image.tmdb.org/t/p/w780/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg',
      rating: 4.9,
      duration: '2h 28m',
      releaseDate: '2024-12-17',
      genre: ['Action', 'Sci-Fi', 'Adventure'],
      language: 'English',
      synopsis: 'Peter Parker seeks Doctor Strange\'s help to make everyone forget he is Spider-Man, but a spell goes wrong, bringing villains from other universes.',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch', 'Tobey Maguire', 'Andrew Garfield'],
      director: 'Jon Watts',
      price: 250,
      format: ['IMAX 3D', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/JfVOs4VSpmA',
      isComingSoon: false
    },
    {
      id: 'em-2',
      title: 'Deadpool & Wolverine',
      poster: 'https://image.tmdb.org/t/p/w780/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/yD3UbyWbH7j8YF3PcrVzFp37z8o.jpg',
      rating: 4.8,
      duration: '2h 08m',
      releaseDate: '2024-07-26',
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      language: 'English',
      synopsis: 'The Time Variance Authority pulls the merc-with-a-mouth from his quiet life and teams him with a reluctant, battle-weary Wolverine on a mission to save the multiverse.',
      cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
      director: 'Shawn Levy',
      price: 240,
      format: ['IMAX 3D', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/EX1TwXU8MYg',
      isComingSoon: false
    },
    {
      id: 'em-3',
      title: 'Oppenheimer',
      poster: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      rating: 4.9,
      duration: '3h 00m',
      releaseDate: '2024-08-05',
      genre: ['Drama', 'History', 'Biography'],
      language: 'English',
      synopsis: 'The epic biographical journey of physicist J. Robert Oppenheimer and his leadership of the Manhattan Project that birthed the atomic age.',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
      director: 'Christopher Nolan',
      price: 280,
      format: ['IMAX 70mm', 'Dolby Atmos', '2D', 'P[XL]'],
      trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
      isComingSoon: false
    },
    {
      id: 'em-4',
      title: 'Dune: Part Two',
      poster: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s520QIq.jpg',
      rating: 4.9,
      duration: '2h 46m',
      releaseDate: '2024-03-01',
      genre: ['Sci-Fi', 'Adventure', 'Drama'],
      language: 'English',
      synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his noble family.',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler', 'Javier Bardem'],
      director: 'Denis Villeneuve',
      price: 260,
      format: ['IMAX', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
      isComingSoon: false
    },
    {
      id: 'em-5',
      title: 'Gladiator II',
      poster: 'https://image.tmdb.org/t/p/w780/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnXvufEmbL6ovhA.jpg',
      rating: 4.7,
      duration: '2h 28m',
      releaseDate: '2024-11-15',
      genre: ['Action', 'Drama', 'History'],
      language: 'English',
      synopsis: 'Years after witnessing the death of Maximus, Lucius enters the Colosseum to restore glory and honor to the fractured Roman Empire.',
      cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
      director: 'Ridley Scott',
      price: 220,
      format: ['IMAX', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/g5iZ1R0X6z0',
      isComingSoon: false
    },
    {
      id: 'em-6',
      title: 'Mission: Impossible – Dead Reckoning',
      poster: 'https://image.tmdb.org/t/p/w780/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
      rating: 4.8,
      duration: '2h 43m',
      releaseDate: '2024-07-12',
      genre: ['Action', 'Thriller', 'Adventure'],
      language: 'English',
      synopsis: 'Ethan Hunt and his IMF team track down a dangerous weapon before it falls into the wrong hands in this high-stakes global mission.',
      cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg', 'Vanessa Kirby'],
      director: 'Christopher McQuarrie',
      price: 250,
      format: ['IMAX', '4DX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/sR6i5q7v8k0',
      isComingSoon: false
    },
    {
      id: 'em-7',
      title: 'Avatar: The Way of Water',
      poster: 'https://image.tmdb.org/t/p/w780/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg',
      rating: 4.9,
      duration: '3h 12m',
      releaseDate: '2024-12-16',
      genre: ['Sci-Fi', 'Fantasy', 'Adventure'],
      language: 'English',
      synopsis: 'Jake Sully and Neytiri start a family and must protect their people when familiar threats return to wage war on Pandora.',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Michelle Yeoh'],
      director: 'James Cameron',
      price: 280,
      format: ['IMAX 3D', '4DX 3D', 'Dolby Atmos 3D', 'P[XL]'],
      trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
      isComingSoon: false
    },
    {
      id: 'em-8',
      title: 'Barbie',
      poster: 'https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
      backdrop: 'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg',
      rating: 4.4,
      duration: '1h 54m',
      releaseDate: '2024-07-25',
      genre: ['Comedy', 'Fantasy', 'Adventure'],
      language: 'English',
      synopsis: 'Barbie suffers an existential crisis that leads her to question her world and embark on a vibrant journey into the real human world.',
      cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera', 'Simu Liu', 'Will Ferrell'],
      director: 'Greta Gerwig',
      price: 180,
      format: ['IMAX', '2D', 'Dolby Atmos'],
      trailerUrl: 'https://www.youtube.com/embed/guB0Ih3m2S8',
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
    const stored = localStorage.getItem('cinebook_movies_v4');
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
      localStorage.setItem('cinebook_movies_v4', JSON.stringify(this.movies));
    }
  }
}
