import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking } from '../../models/booking.model';
import { User } from '../../models/user.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    ModalComponent
  ],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  currentUser: User | null = null;
  isLoading = true;
  
  // Filter
  statusFilter = 'all';
  
  // Modal
  showCancelModal = false;
  bookingToCancel: Booking | null = null;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (!user) {
        localStorage.setItem('cinebook_redirect_url', '/my-bookings');
        this.router.navigate(['/login']);
        return;
      }
      this.loadBookings();
    });
  }

  loadBookings(): void {
    if (this.currentUser) {
      this.bookingService.getUserBookings(this.currentUser.id).subscribe(bookings => {
        this.bookings = bookings;
        this.isLoading = false;
      });
    }
  }

  get filteredBookings(): Booking[] {
    if (this.statusFilter === 'all') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.statusFilter);
  }

  setStatusFilter(status: string): void {
    this.statusFilter = status;
  }

  viewBooking(bookingId: string): void {
    this.router.navigate(['/booking-success'], { 
      queryParams: { bookingId } 
    });
  }

  openCancelModal(booking: Booking): void {
    if (booking.status === 'cancelled') {
      return;
    }
    this.bookingToCancel = booking;
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.bookingToCancel = null;
  }

  confirmCancel(): void {
    if (this.bookingToCancel) {
      this.bookingService.cancelBooking(this.bookingToCancel.id).subscribe(result => {
        if (result.success) {
          this.loadBookings();
          this.closeCancelModal();
          alert('Booking cancelled successfully');
        } else {
          alert(result.message);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  }

  getSeatsList(seats: any[]): string {
    return seats.map(s => s.row + s.number).join(', ');
  }
}
