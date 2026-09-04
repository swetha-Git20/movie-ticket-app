import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Booking } from '../models/booking.model';
import { Seat } from '../models/seat.model';
import { CartItem } from '../models/food.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [];
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  private selectedSeats: Seat[] = [];
  private selectedSeatsSubject = new BehaviorSubject<Seat[]>([]);
  private currentShowtimeId: string | null = null;
  private currentShowtimeIdSubject = new BehaviorSubject<string | null>(null);

  // Convenience fee in Indian Rupees
  private readonly CONVENIENCE_FEE = 30;

  constructor() {
    this.loadFromLocalStorage();
  }

  getConvenienceFee(): number {
    return this.CONVENIENCE_FEE;
  }

  // Seat selection management
  selectSeat(seat: Seat): void {
    if (this.selectedSeats.length >= 6) {
      return; // Max 6 seats
    }
    
    if (!this.selectedSeats.find(s => s.row === seat.row && s.number === seat.number)) {
      this.selectedSeats.push(seat);
      this.selectedSeatsSubject.next(this.selectedSeats);
      this.saveSeatSelectionToStorage();
    }
  }

  deselectSeat(seat: Seat): void {
    this.selectedSeats = this.selectedSeats.filter(s => !(s.row === seat.row && s.number === seat.number));
    this.selectedSeatsSubject.next(this.selectedSeats);
    this.saveSeatSelectionToStorage();
  }

  getSelectedSeats(): Observable<Seat[]> {
    return this.selectedSeatsSubject.asObservable();
  }

  getSelectedSeatsValue(): Seat[] {
    return this.selectedSeats;
  }

  clearSelectedSeats(): void {
    this.selectedSeats = [];
    this.selectedSeatsSubject.next(this.selectedSeats);
    this.currentShowtimeId = null;
    this.currentShowtimeIdSubject.next(null);
    this.saveSeatSelectionToStorage();
  }

  setCurrentShowtime(showtimeId: string): void {
    this.currentShowtimeId = showtimeId;
    this.currentShowtimeIdSubject.next(showtimeId);
    this.saveSeatSelectionToStorage();
  }

  getCurrentShowtime(): Observable<string | null> {
    return this.currentShowtimeIdSubject.asObservable();
  }

  getCurrentShowtimeValue(): string | null {
    return this.currentShowtimeId;
  }

  // Calculate total price
  calculateTotal(seatPrice: number, foodCart: CartItem[], couponDiscount: number = 0): number {
    const seatsTotal = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const foodTotal = foodCart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
    const subtotal = seatsTotal + foodTotal;
    const total = subtotal + this.CONVENIENCE_FEE - couponDiscount;
    return Math.max(0, total);
  }

  // Booking management
  createBooking(bookingData: {
    userId: string;
    movieId: string;
    movieTitle: string;
    moviePoster: string;
    cinemaId: string;
    cinemaName: string;
    showtimeId: string;
    date: string;
    time: string;
    foodCart: CartItem[];
    couponCode?: string;
    couponDiscount: number;
  }): Observable<Booking> {
    const seatsTotal = this.selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const foodTotal = bookingData.foodCart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
    const subtotal = seatsTotal + foodTotal;
    const total = Math.max(0, subtotal + this.CONVENIENCE_FEE - bookingData.couponDiscount);

    const booking: Booking = {
      id: this.generateBookingId(),
      userId: bookingData.userId,
      movieId: bookingData.movieId,
      movieTitle: bookingData.movieTitle,
      moviePoster: bookingData.moviePoster,
      cinemaId: bookingData.cinemaId,
      cinemaName: bookingData.cinemaName,
      showtimeId: bookingData.showtimeId,
      date: bookingData.date,
      time: bookingData.time,
      seats: this.selectedSeats.map(s => ({ row: s.row, number: s.number, price: s.price })),
      foodItems: bookingData.foodCart.map(item => ({
        name: item.foodItem.name,
        quantity: item.quantity,
        price: item.foodItem.price
      })),
      subtotal,
      convenienceFee: this.CONVENIENCE_FEE,
      discount: bookingData.couponDiscount,
      total,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      couponCode: bookingData.couponCode
    };

    this.bookings.unshift(booking);
    this.bookingsSubject.next(this.bookings);
    this.saveToLocalStorage();

    // Clear seat selection after booking
    this.clearSelectedSeats();

    return of(booking).pipe(delay(400));
  }

  getUserBookings(userId: string): Observable<Booking[]> {
    const userBookings = this.bookings.filter(b => b.userId === userId);
    return of(userBookings.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())).pipe(delay(200));
  }

  getBookingById(bookingId: string): Observable<Booking | undefined> {
    return of(this.bookings.find(b => b.id === bookingId)).pipe(delay(150));
  }

  cancelBooking(bookingId: string): Observable<{ success: boolean; message: string }> {
    const booking = this.bookings.find(b => b.id === bookingId);
    
    if (!booking) {
      return of({ success: false, message: 'Booking not found' }).pipe(delay(200));
    }

    if (booking.status === 'cancelled') {
      return of({ success: false, message: 'Booking already cancelled' }).pipe(delay(200));
    }

    booking.status = 'cancelled';
    this.bookingsSubject.next(this.bookings);
    this.saveToLocalStorage();

    return of({ success: true, message: 'Booking cancelled successfully' }).pipe(delay(200));
  }

  // Seat generation for showtime
  generateSeatLayout(): Seat[] {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats: Seat[] = [];

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let type: 'standard' | 'premium' | 'vip' = 'standard';
        let price = 150; // Standard price ₹150

        if (rowIndex <= 1) {
          type = 'vip';
          price = 280; // VIP Recliner ₹280
        } else if (rowIndex <= 4) {
          type = 'premium';
          price = 220; // Premium ₹220
        } else {
          type = 'standard';
          price = 150; // Standard ₹150
        }

        // Randomly occupy some seats realistically (~18%)
        const isOccupied = (rowIndex * 13 + i * 7) % 6 === 0;

        seats.push({
          row,
          number: i,
          price,
          status: isOccupied ? 'occupied' : 'available',
          type
        });
      }
    });

    return seats;
  }

  private generateBookingId(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `CBK-${date}-${random}`;
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_bookings_v2');
    if (stored) {
      try {
        this.bookings = JSON.parse(stored);
        this.bookingsSubject.next(this.bookings);
      } catch (e) {
        this.bookings = [];
      }
    }

    this.loadSeatSelectionFromStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cinebook_bookings_v2', JSON.stringify(this.bookings));
  }

  private saveSeatSelectionToStorage(): void {
    const selectionData = {
      seats: this.selectedSeats,
      showtimeId: this.currentShowtimeId
    };
    localStorage.setItem('cinebook_seat_selection_v2', JSON.stringify(selectionData));
  }

  private loadSeatSelectionFromStorage(): void {
    const stored = localStorage.getItem('cinebook_seat_selection_v2');
    if (stored) {
      try {
        const selectionData = JSON.parse(stored);
        this.selectedSeats = selectionData.seats || [];
        this.currentShowtimeId = selectionData.showtimeId || null;
        this.selectedSeatsSubject.next(this.selectedSeats);
        this.currentShowtimeIdSubject.next(this.currentShowtimeId);
      } catch (e) {
        this.selectedSeats = [];
      }
    }
  }
}
