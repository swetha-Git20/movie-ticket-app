import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'movies/:id', loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent) },
  { path: 'movies', redirectTo: '/home', pathMatch: 'full' },
  { path: 'cinemas', loadComponent: () => import('./pages/cinemas/cinemas.component').then(m => m.CinemasComponent) },
  { path: 'showtimes', loadComponent: () => import('./pages/showtimes/showtimes.component').then(m => m.ShowtimesComponent) },
  { path: 'seat-selection', loadComponent: () => import('./pages/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent) },
  { path: 'food', loadComponent: () => import('./pages/food/food.component').then(m => m.FoodComponent) },
  { path: 'checkout', loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'booking-success', loadComponent: () => import('./pages/booking-success/booking-success.component').then(m => m.BookingSuccessComponent), canActivate: [authGuard] },
  { path: 'my-bookings', loadComponent: () => import('./pages/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'offers', loadComponent: () => import('./pages/offers/offers.component').then(m => m.OffersComponent) },
  { path: 'experiences', loadComponent: () => import('./pages/experiences/experiences.component').then(m => m.ExperiencesComponent) },
  { path: 'trailers', loadComponent: () => import('./pages/trailers/trailers.component').then(m => m.TrailersComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '/home' }
];
