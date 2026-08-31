import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Showtime } from '../models/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {
  private showtimes: Showtime[] = [];
  private showtimesSubject = new BehaviorSubject<Showtime[]>(this.showtimes);

  constructor() {
    this.generateMockShowtimes();
    this.loadFromLocalStorage();
  }

  private generateMockShowtimes(): void {
    const times = ['10:00', '13:00', '16:00', '19:00', '22:00'];
    const formats = ['2D', 'IMAX', '4DX', '3D'];
    const movieIds = ['1', '2', '3', '4', '5', '6', '7', '8'];
    const cinemaIds = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
    
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      movieIds.forEach(movieId => {
        cinemaIds.forEach(cinemaId => {
          const numShowtimes = Math.floor(Math.random() * 3) + 2; // 2-4 showtimes per day
          const shuffledTimes = [...times].sort(() => Math.random() - 0.5);
          
          for (let j = 0; j < numShowtimes; j++) {
            const showtime: Showtime = {
              id: `st-${movieId}-${cinemaId}-${dateStr}-${j}`,
              movieId,
              cinemaId,
              date: dateStr,
              time: shuffledTimes[j],
              format: formats[Math.floor(Math.random() * formats.length)],
              price: Math.floor(Math.random() * 8) + 10, // $10-$18
              availableSeats: Math.floor(Math.random() * 50) + 30
            };
            this.showtimes.push(showtime);
          }
        });
      });
    }
  }

  getShowtimes(): Observable<Showtime[]> {
    return this.showtimesSubject.asObservable().pipe(delay(300));
  }

  getShowtimesByMovie(movieId: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.movieId === movieId)).pipe(delay(200));
  }

  getShowtimesByCinema(cinemaId: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.cinemaId === cinemaId)).pipe(delay(200));
  }

  getShowtimesByDate(date: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.date === date)).pipe(delay(200));
  }

  getFilteredShowtimes(filters: { movieId?: string; cinemaId?: string; date?: string }): Observable<Showtime[]> {
    let filtered = this.showtimes;
    
    if (filters.movieId) {
      filtered = filtered.filter(s => s.movieId === filters.movieId);
    }
    if (filters.cinemaId) {
      filtered = filtered.filter(s => s.cinemaId === filters.cinemaId);
    }
    if (filters.date) {
      filtered = filtered.filter(s => s.date === filters.date);
    }
    
    return of(filtered).pipe(delay(200));
  }

  getShowtimeById(id: string): Observable<Showtime | undefined> {
    return of(this.showtimes.find(s => s.id === id)).pipe(delay(200));
  }

  updateAvailableSeats(showtimeId: string, seatsBooked: number): void {
    const showtime = this.showtimes.find(s => s.id === showtimeId);
    if (showtime) {
      showtime.availableSeats -= seatsBooked;
      this.showtimesSubject.next(this.showtimes);
      this.saveToLocalStorage();
    }
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_showtimes');
    if (stored) {
      this.showtimes = JSON.parse(stored);
      this.showtimesSubject.next(this.showtimes);
    } else {
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cinebook_showtimes', JSON.stringify(this.showtimes));
  }
}
