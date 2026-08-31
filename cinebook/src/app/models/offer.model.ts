export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount: number;
  validUntil: string;
  terms: string;
  imageUrl: string;
}
