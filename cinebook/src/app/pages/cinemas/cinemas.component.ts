import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CinemaService } from '../../services/cinema.service';
import { Cinema } from '../../models/cinema.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CinemaCardComponent } from '../../components/cinema-card/cinema-card.component';
import { SkeletonLoaderComponent } from '../../components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-cinemas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    CinemaCardComponent,
    SkeletonLoaderComponent
  ],
  templateUrl: './cinemas.component.html',
  styleUrls: ['./cinemas.component.css']
})
export class CinemasComponent implements OnInit {
  cinemas: Cinema[] = [];
  filteredCinemas: Cinema[] = [];
  isLoading = true;
  
  // Filter state
  selectedCity = '';
  searchQuery = '';
  availableCities: string[] = [];

  constructor(
    private cinemaService: CinemaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCinemas();
  }

  loadCinemas(): void {
    this.cinemaService.getCinemas().subscribe(cinemas => {
      this.cinemas = cinemas;
      this.filteredCinemas = cinemas;
      this.availableCities = [...new Set(cinemas.map(c => c.city))];
      this.isLoading = false;
    });
  }

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.applyFilters();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.cinemas;
    
    if (this.selectedCity) {
      filtered = filtered.filter(c => c.city === this.selectedCity);
    }
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query)
      );
    }
    
    this.filteredCinemas = filtered;
  }

  clearFilters(): void {
    this.selectedCity = '';
    this.searchQuery = '';
    this.filteredCinemas = this.cinemas;
  }
}
