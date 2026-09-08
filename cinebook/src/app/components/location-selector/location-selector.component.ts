import { Component, Output, EventEmitter, OnInit } from '@angular/core';
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
export class LocationSelectorComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() citySelected = new EventEmitter<string>();
  
  isOpen = false;
  selectedCity = 'Chennai';
  searchQuery = '';
  
  cities = ['Chennai', 'Pondicherry', 'Trichy', 'Vellore', 'Ranipet'];
  popularCities = ['Chennai', 'Pondicherry', 'Trichy', 'Vellore', 'Ranipet'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getSelectedCity().subscribe(city => {
      this.selectedCity = city || 'Chennai';
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
    this.citySelected.emit(city);
    this.closeSelector();
  }

  get filteredCities(): string[] {
    if (!this.searchQuery.trim()) {
      return this.cities;
    }
    return this.cities.filter(city => 
      city.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
    );
  }
}
