export interface Cinema {
  id: string;
  name: string;
  city: string;
  address: string;
  facilities: string[]; // IMAX, Dolby Atmos, 4DX, Parking, Food Court
  imageUrl: string;
  rating: number;
}
