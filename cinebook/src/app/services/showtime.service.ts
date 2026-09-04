import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Showtime } from '../models/showtime.model';

@Injectable({
  providedIn: 'root'
})
export class ShowtimeService {
  private showtimes: Showtime[] = [];
  private showtimesSubject = new BehaviorSubject<Showtime[]>([]);

  private standardTimings = [
    { time: '10:00 AM', format: '2D', price: 150 },
    { time: '1:30 PM', format: 'Dolby Atmos', price: 180 },
    { time: '4:30 PM', format: 'IMAX 3D', price: 250 },
    { time: '7:30 PM', format: '4DX', price: 280 },
    { time: '10:30 PM', format: 'Dolby Atmos', price: 180 }
  ];

  constructor() {
    this.generateShowtimes();
  }

  private generateShowtimes(): void {
    const movieIds = [
      'tm-1', 'tm-2', 'tm-3', 'tm-4', 'tm-5', 'tm-6', 'tm-7', 'tm-8',
      'em-1', 'em-2', 'em-3', 'em-4', 'em-5', 'em-6', 'em-7', 'em-8'
    ];
    const cinemaIds = [
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6',
      'c7', 'c8', 'c9',
      'c10', 'c11', 'c12',
      'c13', 'c14', 'c15',
      'c16', 'c17', 'c18',
      'c19', 'c20'
    ];

    const today = new Date();
    const generated: Showtime[] = [];

    // Generate for next 14 days
    for (let d = 0; d < 14; d++) {
      const showDate = new Date(today);
      showDate.setDate(today.getDate() + d);
      const dateStr = this.formatDateIso(showDate);

      movieIds.forEach(movieId => {
        cinemaIds.forEach(cinemaId => {
          this.standardTimings.forEach((slot, index) => {
            const showtime: Showtime = {
              id: `st-${movieId}-${cinemaId}-${dateStr}-${index}`,
              movieId,
              cinemaId,
              date: dateStr,
              time: slot.time,
              format: slot.format,
              price: slot.price, // ₹150, ₹180, ₹250, ₹280
              availableSeats: 45 + ((index * 7 + d * 3) % 40)
            };
            generated.push(showtime);
          });
        });
      });
    }

    this.showtimes = generated;
    this.showtimesSubject.next(this.showtimes);
  }

  private formatDateIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getShowtimes(): Observable<Showtime[]> {
    return of(this.showtimes).pipe(delay(100));
  }

  getShowtimesByMovie(movieId: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.movieId === movieId)).pipe(delay(100));
  }

  getShowtimesByCinema(cinemaId: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.cinemaId === cinemaId)).pipe(delay(100));
  }

  getShowtimesByDate(date: string): Observable<Showtime[]> {
    return of(this.showtimes.filter(s => s.date === date)).pipe(delay(100));
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
    
    return of(filtered).pipe(delay(100));
  }

  getShowtimeById(id: string): Observable<Showtime | undefined> {
    return of(this.showtimes.find(s => s.id === id)).pipe(delay(100));
  }

  updateAvailableSeats(showtimeId: string, seatsBooked: number): void {
    const showtime = this.showtimes.find(s => s.id === showtimeId);
    if (showtime) {
      showtime.availableSeats = Math.max(0, showtime.availableSeats - seatsBooked);
      this.showtimesSubject.next(this.showtimes);
    }
  }
}
