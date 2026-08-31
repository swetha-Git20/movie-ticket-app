import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  selectedCity$ = this.authService.getSelectedCity();
  currentUser$ = this.authService.getCurrentUser();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

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
    // This will be implemented with a modal
    console.log('Open location selector');
  }

  openSearch(): void {
    // This will be implemented with a search overlay
    console.log('Open search');
  }

  logout(): void {
    this.authService.logout();
    this.navigateTo('/login');
    this.closeMenu();
  }
}
