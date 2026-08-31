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
    
    // Create a simple printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const ticketContent = `
        <html>
        <head>
          <title>CineBook Ticket - ${this.booking.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
            .ticket { border: 2px solid #e31c3d; padding: 20px; max-width: 400px; margin: 0 auto; }
            .logo { font-size: 24px; font-weight: bold; color: #e31c3d; margin-bottom: 20px; }
            .movie-title { font-size: 20px; font-weight: bold; margin: 10px 0; }
            .details { text-align: left; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .qr-code { width: 150px; height: 150px; background: #f0f0f0; margin: 20px auto; display: flex; align-items: center; justify-content: center; }
            .booking-id { font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="logo">CineBook</div>
            <div class="movie-title">${this.booking.movieTitle}</div>
            <div class="details">
              <div class="detail-row"><span>Cinema:</span><span>${this.booking.cinemaName}</span></div>
              <div class="detail-row"><span>Date:</span><span>${this.booking.date}</span></div>
              <div class="detail-row"><span>Time:</span><span>${this.booking.time}</span></div>
              <div class="detail-row"><span>Seats:</span><span>${this.booking.seats.map(s => s.row + s.number).join(', ')}</span></div>
              <div class="detail-row"><span>Total:</span><span>$${this.booking.total}</span></div>
            </div>
            <div class="qr-code">QR Code</div>
            <div class="booking-id">Booking ID: ${this.booking.id}</div>
          </div>
        </body>
        </html>
      `;
      printWindow.document.write(ticketContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
}
