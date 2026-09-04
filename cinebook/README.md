# CineBook - Movie Ticket Booking Application

A complete frontend-only Angular movie ticket booking application with a dark cinematic theme, built as a college project.

![CineBook](https://img.shields.io/badge/CineBook-Angular-red) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎬 Features

### Core Functionality
- **Complete Booking Flow**: Home → Movie Details → Showtimes → Seat Selection → Food → Checkout → Booking Success
- **Dark Cinematic Theme**: Matches Stitch design specifications with crimson-red branding
- **Mock Data Services**: Complete mock data for movies, cinemas, showtimes, food, and offers
- **localStorage Persistence**: All user data, bookings, and preferences are stored locally
- **Authentication**: Mock login/signup with route guards

### Pages & Routes
- **Home**: Hero carousel, Quick Book cascading selectors, Now Showing grid, Coming Soon section
- **Movie Details**: Movie information, cast, trailer modal, cinema/date/showtime picker
- **Cinemas**: City selector, cinema search, cinema cards with facilities
- **Showtimes**: Filter by city/movie/date/cinema, showtime results grouped by cinema
- **Seat Selection**: Realistic seat grid (rows A-H), three price tiers, max 6 seats, live price summary
- **Food & Beverages**: Category tabs, quantity steppers, running total, cart persistence
- **Checkout**: Booking summary, coupon validation, mock payment (UPI/Card/Net Banking)
- **Booking Success**: Digital ticket card, booking ID generation, downloadable ticket
- **My Bookings**: View bookings, status badges, cancellation functionality
- **Login/Signup**: Form validation, mock authentication
- **Offers**: Offer cards with copy code functionality
- **Experiences**: Static experience cards (IMAX, 4DX, Dolby Atmos, etc.)
- **Trailers**: Trailer grid with video modal
- **Profile**: User profile management, preferences, logout

### Global Features
- **Global Search Overlay**: Live search over movies, cinemas, actors, and genres
- **Location Selector**: City selection with persistence
- **Toast Notifications**: Feedback for user actions
- **Animated Modals**: Reusable modal components
- **Mobile Navigation**: Hamburger menu with responsive design
- **Route Guards**: Protected routes for authenticated users
- **Responsive Design**: Optimized for mobile (375px), tablet (768px), and desktop (1440px)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Angular CLI (v17 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swetha-Git20/Smart-job-Application-Tracker.git
   cd Smart-job-Application-Tracker/cinebook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Quick Start with Batch File

For Windows users, simply double-click the `start-cinebook.bat` file to:
- Install dependencies (if needed)
- Start the Angular development server
- Open the application in your browser
- Keep the server running until you press any key to stop

## 📁 Project Structure

```
cinebook/
├── src/
│   ├── app/
│   │   ├── components/          # Shared components
│   │   │   ├── navbar/         # Navigation bar with search/location
│   │   │   ├── footer/         # Application footer
│   │   │   ├── movie-card/     # Movie card component
│   │   │   ├── cinema-card/    # Cinema card component
│   │   │   ├── modal/          # Reusable modal
│   │   │   ├── toast/          # Toast notifications
│   │   │   ├── search-overlay/ # Global search overlay
│   │   │   ├── location-selector/ # City selector
│   │   │   └── skeleton-loader/ # Loading skeleton
│   │   ├── pages/              # Page components
│   │   │   ├── home/           # Home page
│   │   │   ├── movie-details/  # Movie details page
│   │   │   ├── cinemas/        # Cinemas listing
│   │   │   ├── showtimes/      # Showtimes listing
│   │   │   ├── seat-selection/ # Seat selection grid
│   │   │   ├── food/           # Food & beverages
│   │   │   ├── checkout/       # Checkout & payment
│   │   │   ├── booking-success/ # Booking confirmation
│   │   │   ├── my-bookings/    # User bookings
│   │   │   ├── login/          # Login page
│   │   │   ├── signup/         # Signup page
│   │   │   ├── offers/         # Offers page
│   │   │   ├── experiences/     # Experiences page
│   │   │   ├── trailers/       # Trailers page
│   │   │   └── profile/        # User profile
│   │   ├── services/           # Data services
│   │   │   ├── auth.service.ts         # Authentication
│   │   │   ├── booking.service.ts      # Booking management
│   │   │   ├── movie.service.ts        # Movie data
│   │   │   ├── cinema.service.ts       # Cinema data
│   │   │   ├── showtime.service.ts     # Showtime data
│   │   │   ├── food.service.ts         # Food & beverages
│   │   │   ├── offer.service.ts        # Offers data
│   │   │   └── local-storage.service.ts # localStorage wrapper
│   │   ├── models/             # TypeScript models
│   │   │   ├── movie.model.ts
│   │   │   ├── cinema.model.ts
│   │   │   ├── showtime.model.ts
│   │   │   ├── seat.model.ts
│   │   │   ├── food.model.ts
│   │   │   ├── booking.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── offer.model.ts
│   │   ├── guards/             # Route guards
│   │   │   └── auth.guard.ts   # Authentication guard
│   │   ├── app.component.ts    # Root component
│   │   ├── app.routes.ts       # Routing configuration
│   │   └── app.config.ts       # App configuration
│   ├── index.html              # HTML entry point
│   ├── main.ts                 # Application bootstrap
│   └── styles.css              # Global styles
├── public/                     # Static assets
├── angular.json               # Angular configuration
├── package.json               # Node dependencies
├── tsconfig.json              # TypeScript configuration
├── start-cinebook.bat         # Quick start batch file
└── README.md                  # This file
```

## 🎨 Design & Theme

### Color Palette
- **Primary**: `#E31C3D` (Crimson Red)
- **Background**: `#131315` (Dark Charcoal)
- **Secondary**: `#1b1b1d`, `#201f21`, `#2a2a2c`, `#353437`
- **Text**: `#e5e1e4` (Light Gray)
- **Accent**: `#ffb3b2` (Soft Pink)

### Typography
- **Primary Font**: Inter
- **Secondary Font**: Plus Jakarta Sans
- **Icons**: Material Symbols Outlined

## 🔧 Configuration

### Mock Data
The application uses realistic mock data:
- **Movies**: 10+ movies with genres, languages, formats
- **Cinemas**: 4-5 cities with 2-3 cinemas each
- **Showtimes**: Varied by city, cinema, movie, and date
- **Food**: 6+ food items across categories
- **Offers**: 3-4 active coupons

### localStorage Keys
- `cinebook_user` - User authentication data
- `cinebook_city` - Selected city
- `cinebook_seats` - Selected seats
- `cinebook_food_cart` - Food cart
- `cinebook_bookings` - User bookings
- `cinebook_redirect_url` - Post-login redirect

## 🧪 Testing the Application

### Manual Testing Checklist

1. **Home Page**
   - [ ] Hero carousel autoplay and manual controls
   - [ ] Quick Book cascading selectors work correctly
   - [ ] Now Showing grid displays movies
   - [ ] Filter and sort functionality
   - [ ] Coming Soon section with "Notify Me"

2. **Movie Details**
   - [ ] Movie information displays correctly
   - [ ] Cast information shows
   - [ ] Trailer modal opens and plays
   - [ ] Cinema/date/showtime selection works
   - [ ] "Book Tickets" button navigates correctly

3. **Booking Flow**
   - [ ] Seat selection grid shows correct layout
   - [ ] Price tiers display correctly
   - [ ] Max 6 seats enforcement
   - [ ] Food cart adds/updates/removes items
   - [ ] Checkout displays correct totals
   - [ ] Coupon validation works
   - [ ] Mock payment simulation completes
   - [ ] Booking success page shows correct data

4. **Authentication**
   - [ ] Login with valid credentials
   - [ ] Login validation errors
   - [ ] Signup with validation
   - [ ] Logout functionality
   - [ ] Route guards protect pages

5. **My Bookings**
   - [ ] Bookings display correctly
   - [ ] Status badges show correct states
   - [ ] Cancellation works
   - [ ] Booking details are accurate

6. **Responsive Design**
   - [ ] Mobile (375px) layout works
   - [ ] Tablet (768px) layout works
   - [ ] Desktop (1440px) layout works
   - [ ] Navigation works on all sizes

## 🐛 Troubleshooting

### Common Issues

**Issue**: Port 4200 already in use
```bash
# Kill the process on port 4200
npx kill-port 4200
# Or use a different port
ng serve --port 4201
```

**Issue**: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**Issue**: Build errors
```bash
# Ensure Angular CLI is up to date
ng update @angular/core @angular/cli
# Check TypeScript errors
ng build
```

## 📝 API Integration Notes

This is a frontend-only application with mock data. To integrate with a real backend:

1. Replace mock services with HTTP calls to your API
2. Update authentication to use real JWT/session tokens
3. Implement real payment gateway integration
4. Add proper error handling and loading states
5. Implement real-time seat availability updates

## 🤝 Contributing

This is a college project built for educational purposes. Contributions are welcome but not actively maintained.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built as a college project by Swetha using Angular and modern web technologies.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Material Design for inspiration
- Stitch UI design system for the design specifications

---

**Note**: This is a frontend-only demonstration project. For production use, implement proper backend integration, security measures, and performance optimizations.
