export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaId: string;
  cinemaName: string;
  showtimeId: string;
  date: string;
  time: string;
  seats: { row: string; number: number; price: number }[];
  foodItems: { name: string; quantity: number; price: number }[];
  subtotal: number;
  convenienceFee: number;
  discount: number;
  total: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  couponCode?: string;
}
