import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Cinema } from '../models/cinema.model';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  private cinemas: Cinema[] = [
    // --- CHENNAI ---
    {
      id: 'c1',
      name: 'Sathyam Cinemas (SPI)',
      city: 'Chennai',
      address: '8, Thiruvika Road, Royapettah, Chennai',
      facilities: ['Dolby Atmos', 'IMAX Laser', 'Recliners', 'Food Court', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.9
    },
    {
      id: 'c2',
      name: 'CineBook Grand Mall - Velachery',
      city: 'Chennai',
      address: 'Grand Square Mall, Velachery Bypass Rd, Chennai',
      facilities: ['4DX', 'Dolby Atmos', 'Playhouse', 'Parking', 'Gourmet Food'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.7
    },
    {
      id: 'c3',
      name: 'INOX Luxe - Phoenix MarketCity',
      city: 'Chennai',
      address: 'Phoenix MarketCity, Velachery Road, Chennai',
      facilities: ['IMAX Laser', 'Luxe Recliner', 'Dolby 7.1', 'Valet Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      rating: 4.8
    },
    {
      id: 'c4',
      name: 'Escape Cinemas - Express Avenue',
      city: 'Chennai',
      address: 'Express Avenue Mall, Royapettah, Chennai',
      facilities: ['Dolby Atmos', 'VIP Lounges', 'Cafe Express', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
      rating: 4.6
    },
    {
      id: 'c5',
      name: 'Mayajaal Multiplex - ECR',
      city: 'Chennai',
      address: 'East Coast Road, Kanathur, Chennai',
      facilities: ['16 Screens', 'Dolby 7.1', 'Arcade Games', 'Food Court', 'Free Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=600&q=80',
      rating: 4.5
    },
    {
      id: 'c6',
      name: 'AGS Cinemas - T. Nagar',
      city: 'Chennai',
      address: 'Gopathi Narayanaswami Chetty Rd, T. Nagar, Chennai',
      facilities: ['4K Laser Projection', 'Dolby Atmos', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      rating: 4.6
    },

    // --- PONDICHERRY ---
    {
      id: 'c7',
      name: 'CineBook Puducherry - White Town',
      city: 'Pondicherry',
      address: 'Mission Street, Heritage Town, Puducherry',
      facilities: ['Dolby Atmos', '4K Projection', 'French Cafe', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.7
    },
    {
      id: 'c8',
      name: 'Casino Theatre',
      city: 'Pondicherry',
      address: 'Gandhi Nagar, Maraimalai Adigal Salai, Pondicherry',
      facilities: ['Dolby Atmos', 'Laser 2D', 'Snack Bar', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.4
    },
    {
      id: 'c9',
      name: 'Rathna Theatre',
      city: 'Pondicherry',
      address: 'Villiyanur Main Road, Pondicherry',
      facilities: ['RGB Laser', 'Dolby 7.1', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      rating: 4.3
    },

    // --- TRICHY ---
    {
      id: 'c10',
      name: 'LA Cinemas (Maris Complex)',
      city: 'Trichy',
      address: 'Fort Station Road, Maris Theatre Complex, Trichy',
      facilities: ['Dolby Atmos', 'RGB Laser', 'Recliners', 'Cafeteria', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.8
    },
    {
      id: 'c11',
      name: 'CineBook Trichy - Srirangam',
      city: 'Trichy',
      address: 'Srirangam Trunk Road, Trichy',
      facilities: ['Dolby 7.1', '4K Projection', 'Food Court', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.5
    },
    {
      id: 'c12',
      name: 'Kaveri Cinemas',
      city: 'Trichy',
      address: 'Main Guard Gate, Teppakulam, Trichy',
      facilities: ['Dolby Atmos', 'Snack Bar', 'Two-wheeler Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
      rating: 4.3
    },

    // --- VELLORE ---
    {
      id: 'c13',
      name: 'CineBook Vellore - Arcot Road',
      city: 'Vellore',
      address: 'Arcot Road, Near Phase 2, Sathuvachari, Vellore',
      facilities: ['Dolby Atmos', '4K Laser', 'Recliner Seats', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.7
    },
    {
      id: 'c14',
      name: 'Velan Cinemas - Katpadi',
      city: 'Vellore',
      address: 'Katpadi Railway Station Road, Katpadi, Vellore',
      facilities: ['Dolby 7.1', '4K Projection', 'Snack Bar', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.4
    },
    {
      id: 'c15',
      name: 'Galaxy Multiplex - Sathuvachari',
      city: 'Vellore',
      address: 'National Highway 48, Sathuvachari, Vellore',
      facilities: ['Dolby Atmos', 'VIP Seats', 'Cafeteria', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      rating: 4.5
    },

    // --- RANIPET ---
    {
      id: 'c16',
      name: 'CineBook Ranipet - Walajapet Rd',
      city: 'Ranipet',
      address: 'Walajapet Main Road, Ranipet',
      facilities: ['Dolby Atmos 7.1', '4K Laser Projection', 'AC Lounges', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.6
    },
    {
      id: 'c17',
      name: 'SRM Cinemas - GST Road',
      city: 'Ranipet',
      address: 'GST Road, Ranipet Industrial Area, Ranipet',
      facilities: ['Dolby Surround', 'Snack Bar', 'Spacious Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.3
    },
    {
      id: 'c18',
      name: 'Sri Krishna Theatre - Arcot',
      city: 'Ranipet',
      address: 'Arcot Bypass Road, Arcot - Ranipet District',
      facilities: ['Dolby Atmos', '4K Screen', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=600&q=80',
      rating: 4.4
    },

    // --- COIMBATORE ---
    {
      id: 'c19',
      name: 'Broadway Cinemas - Coimbatore',
      city: 'Coimbatore',
      address: 'Avinashi Road, Near KMCH, Coimbatore',
      facilities: ['IMAX Laser', 'Dolby Atmos', 'Gold Class Recliners', 'Food Court'],
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      rating: 4.9
    },

    // --- MADURAI ---
    {
      id: 'c20',
      name: 'INOX Vishaal De Mall - Madurai',
      city: 'Madurai',
      address: 'Gokhale Road, Chinna Chokkikulam, Madurai',
      facilities: ['Dolby Atmos', '4K Projection', 'Food Court', 'Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      rating: 4.7
    }
  ];

  private cinemasSubject = new BehaviorSubject<Cinema[]>(this.cinemas);

  constructor() {}

  getCinemas(): Observable<Cinema[]> {
    return of(this.cinemas).pipe(delay(150));
  }

  getCinemasByCity(city: string): Observable<Cinema[]> {
    if (!city || city.toLowerCase() === 'all') {
      return of(this.cinemas).pipe(delay(100));
    }
    return of(this.cinemas.filter(c => c.city.toLowerCase() === city.toLowerCase())).pipe(delay(100));
  }

  getCinemaById(id: string): Observable<Cinema | undefined> {
    return of(this.cinemas.find(c => c.id === id)).pipe(delay(100));
  }

  getCities(): Observable<string[]> {
    const cities = ['Chennai', 'Pondicherry', 'Trichy', 'Vellore', 'Ranipet', 'Coimbatore', 'Madurai'];
    return of(cities).pipe(delay(50));
  }

  searchCinemas(query: string): Observable<Cinema[]> {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) {
      return of(this.cinemas).pipe(delay(100));
    }
    return of(this.cinemas.filter(c => 
      c.name.toLowerCase().includes(searchTerm) ||
      c.city.toLowerCase().includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm)
    )).pipe(delay(100));
  }
}
