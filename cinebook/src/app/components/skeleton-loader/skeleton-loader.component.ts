import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'text' | 'avatar' | 'banner' = 'card';
  @Input() count = 1;

  get skeletonArray(): number[] {
    return Array(this.count);
  }
}
