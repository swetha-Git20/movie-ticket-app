import { Component, Input } from '@angular/core';
import { Cinema } from '../../models/cinema.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cinema-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cinema-card.component.html',
  styleUrls: ['./cinema-card.component.css']
})
export class CinemaCardComponent {
  @Input() cinema!: Cinema;

  constructor(private router: Router) {}

  navigateToShowtimes(): void {
    this.router.navigate(['/showtimes'], { 
      queryParams: { cinema: this.cinema.id } 
    });
  }
}
