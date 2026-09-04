import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/booking.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  booking: Booking | null = null;
  isLoading = true;

  constructor(
    private bookingService: BookingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.queryParamMap.get('bookingId');
    if (bookingId) {
      this.loadBooking(bookingId);
    } else {
      this.router.navigate(['/home']);
    }
  }

  loadBooking(bookingId: string): void {
    this.bookingService.getBookingById(bookingId).subscribe(booking => {
      this.booking = booking || null;
      this.isLoading = false;
      
      if (!this.booking) {
        this.router.navigate(['/home']);
      }
    });
  }

  viewMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  downloadTicket(): void {
    if (!this.booking) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const seatsList = this.booking.seats.map(s => s.row + s.number).join(', ');
      const foodList = this.booking.foodItems.length > 0 
        ? this.booking.foodItems.map(f => `${f.name} x${f.quantity}`).join(', ')
        : 'None';
      
      const ticketContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CineBook Ticket - ${this.booking.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 25px; text-align: center; background: #f8fafc; color: #0f172a; }
            .ticket { border: 2px dashed #e31c3d; background: #ffffff; padding: 25px; max-width: 440px; margin: 0 auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .logo { font-size: 26px; font-weight: 800; color: #e31c3d; margin-bottom: 6px; letter-spacing: -0.03em; }
            .tagline { font-size: 11px; color: #64748b; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
            .movie-title { font-size: 22px; font-weight: 800; margin: 15px 0 5px; color: #0f172a; }
            .details { text-align: left; margin: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; }
            .detail-row span:first-child { color: #64748b; }
            .detail-row span:last-child { font-weight: 700; color: #0f172a; }
            .total-row { font-size: 18px; color: #e31c3d; font-weight: 800; margin-top: 10px; }
            .qr-code { width: 130px; height: 130px; margin: 15px auto; border: 2px solid #0f172a; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; background: #f1f5f9; border-radius: 8px; }
            .booking-id { font-size: 13px; font-weight: 700; color: #334155; margin-top: 12px; }
            .footer-msg { font-size: 11px; color: #94a3b8; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="logo">🎬 CineBook</div>
            <div class="tagline">Official Movie E-Ticket</div>
            <div class="movie-title">${this.booking.movieTitle}</div>
            <div class="details">
              <div class="detail-row"><span>Cinema:</span><span>${this.booking.cinemaName}</span></div>
              <div class="detail-row"><span>Date:</span><span>${this.booking.date}</span></div>
              <div class="detail-row"><span>Show Timing:</span><span>${this.booking.time}</span></div>
              <div class="detail-row"><span>Seats:</span><span>${seatsList}</span></div>
              <div class="detail-row"><span>Snacks & Food:</span><span>${foodList}</span></div>
              <div class="detail-row total-row"><span>Total Paid:</span><span>₹${this.booking.total}</span></div>
            </div>
            <div class="qr-code">SCAN AT CINEMA GATE<br/>[${this.booking.id}]</div>
            <div class="booking-id">Booking ID: ${this.booking.id}</div>
            <div class="footer-msg">Please arrive 15 minutes before the showtime. Enjoy your movie!</div>
          </div>
        </body>
        </html>
      `;
      printWindow.document.write(ticketContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  getSeatsList(): string {
    return this.booking?.seats.map(s => s.row + s.number).join(', ') || '';
  }

  getFoodList(): string {
    return this.booking?.foodItems.map(f => `${f.name} x${f.quantity}`).join(', ') || '';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}
