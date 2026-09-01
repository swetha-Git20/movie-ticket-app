import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {
  offers: Offer[] = [];
  isLoading = true;

  constructor(private offerService: OfferService) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.offerService.getOffers().subscribe(offers => {
      this.offers = offers;
      this.isLoading = false;
    });
  }

  copyCouponCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      alert(`Coupon code "${code}" copied to clipboard!`);
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`Coupon code "${code}" copied to clipboard!`);
    });
  }
}
