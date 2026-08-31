import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Cinema } from '../models/cinema.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private cinemas: Cinema[] = [
    {
      id: 'c1',
      name: 'CineBook Grand',
      city: 'New York',
      address: '123 Broadway, Manhattan',
      facilities: ['IMAX', 'Dolby Atmos', '4DX', 'Parking', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema1/400/300',
      rating: 4.7
    },
    {
      id: 'c2',
      name: 'Metroplex Downtown',
      city: 'New York',
      address: '456 Park Avenue, Manhattan',
      facilities: ['IMAX', 'Dolby Atmos', 'Parking'],
      imageUrl: 'https://picsum.photos/seed/cinema2/400/300',
      rating: 4.5
    },
    {
      id: 'c3',
      name: 'Starlight Mall',
      city: 'New York',
      address: '789 Times Square, Manhattan',
      facilities: ['4DX', 'Food Court', 'Parking'],
      imageUrl: 'https://picsum.photos/seed/cinema3/400/300',
      rating: 4.3
    },
    {
      id: 'c4',
      name: 'CineBook Grand',
      city: 'Los Angeles',
      address: '321 Hollywood Blvd, Hollywood',
      facilities: ['IMAX', 'Dolby Atmos', '4DX', 'Parking', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema4/400/300',
      rating: 4.6
    },
    {
      id: 'c5',
      name: 'Sunset Cinema',
      city: 'Los Angeles',
      address: '654 Sunset Boulevard, West Hollywood',
      facilities: ['IMAX', 'Dolby Atmos', 'Parking'],
      imageUrl: 'https://picsum.photos/seed/cinema5/400/300',
      rating: 4.4
    },
    {
      id: 'c6',
      name: 'Bayview Multiplex',
      city: 'San Francisco',
      address: '987 Market Street, Downtown',
      facilities: ['IMAX', '4DX', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema6/400/300',
      rating: 4.5
    },
    {
      id: 'c7',
      name: 'Golden Gate Cinema',
      city: 'San Francisco',
      address: '159 Embarcadero, Waterfront',
      facilities: ['Dolby Atmos', 'Parking', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema7/400/300',
      rating: 4.2
    },
    {
      id: 'c8',
      name: 'CineBook Grand',
      city: 'Chicago',
      address: '456 Michigan Avenue, Loop',
      facilities: ['IMAX', 'Dolby Atmos', '4DX', 'Parking', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema8/400/300',
      rating: 4.5
    },
    {
      id: 'c9',
      name: 'Windy City Movies',
      city: 'Chicago',
      address: '789 State Street, River North',
      facilities: ['IMAX', 'Parking'],
      imageUrl: 'https://picsum.photos/seed/cinema9/400/300',
      rating: 4.3
    },
    {
      id: 'c10',
      name: 'Times Square Prime',
      city: 'New York',
      address: '100 7th Avenue, Midtown',
      facilities: ['IMAX', 'Dolby Atmos', '4DX', 'Parking', 'Food Court'],
      imageUrl: 'https://picsum.photos/seed/cinema10/400/300',
      rating: 4.8
    }
  ];

  private cinemasSubject = new BehaviorSubject<Cinema[]>(this.cinemas);

  constructor() {
    this.loadFromLocalStorage();
  }

  getCinemas(): Observable<Cinema[]> {
    return this.cinemasSubject.asObservable().pipe(delay(300));
  }

  getCinemasByCity(city: string): Observable<Cinema[]> {
    return of(this.cinemas.filter(c => c.city === city)).pipe(delay(200));
  }

  getCinemaById(id: string): Observable<Cinema | undefined> {
    return of(this.cinemas.find(c => c.id === id)).pipe(delay(200));
  }

  getCities(): Observable<string[]> {
    const cities = [...new Set(this.cinemas.map(c => c.city))];
    return of(cities).pipe(delay(200));
  }

  searchCinemas(query: string): Observable<Cinema[]> {
    const searchTerm = query.toLowerCase();
    return of(this.cinemas.filter(c => 
      c.name.toLowerCase().includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm)
    )).pipe(delay(200));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_cinemas');
    if (stored) {
      this.cinemas = JSON.parse(stored);
      this.cinemasSubject.next(this.cinemas);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cinebook_cinemas', JSON.stringify(this.cinemas));
  }
}
