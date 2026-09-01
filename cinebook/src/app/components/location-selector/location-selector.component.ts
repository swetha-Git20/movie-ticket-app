import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.css']
})
export class LocationSelectorComponent {
  @Output() close = new EventEmitter<void>();
  
  isOpen = false;
  selectedCity = '';
  searchQuery = '';
  
  cities = ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Houston', 'Miami', 'Seattle', 'Boston'];
  popularCities = ['New York', 'Los Angeles', 'San Francisco', 'Chicago'];

  constructor(private authService: AuthService) {
    this.authService.getSelectedCity().subscribe(city => {
      this.selectedCity = city;
    });
  }

  open(): void {
    this.isOpen = true;
  }

  closeSelector(): void {
    this.isOpen = false;
    this.searchQuery = '';
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeSelector();
    }
  }

  selectCity(city: string): void {
    this.selectedCity = city;
    this.authService.setSelectedCity(city);
    this.closeSelector();
  }

  get filteredCities(): string[] {
    if (!this.searchQuery.trim()) {
      return this.cities;
    }
    return this.cities.filter(city => 
      city.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
