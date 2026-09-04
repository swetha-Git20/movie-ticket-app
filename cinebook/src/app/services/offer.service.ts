import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Offer } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private offers: Offer[] = [
    {
      id: 'o1',
      title: 'First Movie Free',
      description: 'Get 100% off on your first movie ticket booking',
      code: 'FIRSTFREE',
      discountType: 'percentage',
      discountValue: 100,
      minBookingAmount: 150,
      maxDiscount: 200,
      validUntil: '2024-12-31',
      terms: 'Valid for first-time users only. Maximum discount ₹200.',
      imageUrl: 'https://picsum.photos/seed/offer1/400/200'
    },
    {
      id: 'o2',
      title: 'Weekend Special',
      description: 'Flat ₹50 off on all weekend bookings',
      code: 'WEEKEND50',
      discountType: 'fixed',
      discountValue: 50,
      minBookingAmount: 200,
      maxDiscount: 50,
      validUntil: '2024-12-31',
      terms: 'Valid for Saturday and Sunday shows only.',
      imageUrl: 'https://picsum.photos/seed/offer2/400/200'
    },
    {
      id: 'o3',
      title: 'IMAX Experience',
      description: '20% off on all IMAX screenings',
      code: 'IMAX20',
      discountType: 'percentage',
      discountValue: 20,
      minBookingAmount: 250,
      maxDiscount: 150,
      validUntil: '2024-12-31',
      terms: 'Valid only for IMAX format screenings.',
      imageUrl: 'https://picsum.photos/seed/offer3/400/200'
    },
    {
      id: 'o4',
      title: 'Family Time',
      description: '15% off on bookings of 4+ tickets',
      code: 'FAMILY15',
      discountType: 'percentage',
      discountValue: 15,
      minBookingAmount: 500,
      maxDiscount: 250,
      validUntil: '2024-12-31',
      terms: 'Minimum 4 tickets required per booking.',
      imageUrl: 'https://picsum.photos/seed/offer4/400/200'
    }
  ];

  private offersSubject = new BehaviorSubject<Offer[]>(this.offers);

  constructor() {
    this.loadFromLocalStorage();
  }

  getOffers(): Observable<Offer[]> {
    return this.offersSubject.asObservable().pipe(delay(200));
  }

  getOfferById(id: string): Observable<Offer | undefined> {
    return of(this.offers.find(o => o.id === id)).pipe(delay(200));
  }

  validateCoupon(code: string, bookingAmount: number): Observable<{ valid: boolean; offer?: Offer; discount: number }> {
    const offer = this.offers.find(o => o.code === code);
    
    if (!offer) {
      return of({ valid: false, discount: 0 }).pipe(delay(300));
    }

    const today = new Date().toISOString().split('T')[0];
    if (offer.validUntil < today) {
      return of({ valid: false, discount: 0 }).pipe(delay(300));
    }

    if (bookingAmount < offer.minBookingAmount) {
      return of({ valid: false, discount: 0 }).pipe(delay(300));
    }

    let discount = 0;
    if (offer.discountType === 'percentage') {
      discount = (bookingAmount * offer.discountValue) / 100;
      discount = Math.min(discount, offer.maxDiscount);
    } else {
      discount = offer.discountValue;
    }

    return of({ valid: true, offer, discount }).pipe(delay(300));
  }

  private loadFromLocalStorage(): void {
    const stored = localStorage.getItem('cinebook_offers');
    if (stored) {
      this.offers = JSON.parse(stored);
      this.offersSubject.next(this.offers);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cinebook_offers', JSON.stringify(this.offers));
  }
}
