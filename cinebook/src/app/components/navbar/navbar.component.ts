import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SearchOverlayComponent } from '../search-overlay/search-overlay.component';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, SearchOverlayComponent, LocationSelectorComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;
  selectedCity$ = this.authService.getSelectedCity();
  currentUser$ = this.authService.getCurrentUser();

  @ViewChild(SearchOverlayComponent) searchOverlay!: SearchOverlayComponent;
  @ViewChild(LocationSelectorComponent) locationSelector!: LocationSelectorComponent;

  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.selectedCity$ = this.authService.getSelectedCity();
    this.currentUser$ = this.authService.getCurrentUser();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  openLocationSelector(): void {
    this.locationSelector.open();
  }

  openSearch(): void {
    this.searchOverlay.open();
  }

  logout(): void {
    this.authService.logout();
    this.navigateTo('/login');
    this.closeMenu();
  }
}
