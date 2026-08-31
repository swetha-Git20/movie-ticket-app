import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() duration = 3000;

  isVisible = false;

  ngOnInit(): void {
    this.show();
  }

  show(): void {
    this.isVisible = true;
    setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  hide(): void {
    this.isVisible = false;
  }
}
