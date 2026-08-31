export interface Seat {
  row: string;
  number: number;
  price: number;
  status: 'available' | 'selected' | 'occupied';
  type: 'standard' | 'premium' | 'vip';
}

export interface SeatSelection {
  showtimeId: string;
  seats: Seat[];
}
