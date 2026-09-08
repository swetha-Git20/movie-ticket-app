import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnInit {
  @Output() dateChange = new EventEmitter<string>();
  
  selectedDate: string = '';
  availableDates: string[] = [];
  currentMonth: Date = new Date();
  showCalendar = false;

  constructor() {
    this.generateAvailableDates();
    this.selectDefaultDate();
  }

  ngOnInit(): void {
    // Emit the default date on initialization
    if (this.selectedDate) {
      this.dateChange.emit(this.selectedDate);
    }
  }

  generateAvailableDates(): void {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) { // Next 14 days
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    this.availableDates = dates;
  }

  selectDefaultDate(): void {
    if (this.availableDates.length > 0) {
      this.selectedDate = this.availableDates[0];
      this.dateChange.emit(this.selectedDate);
    }
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.dateChange.emit(date);
    this.showCalendar = false;
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  }

  isTomorrow(dateStr: string): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateStr === tomorrow.toISOString().split('T')[0];
  }

  getDayLabel(dateStr: string): string {
    if (this.isToday(dateStr)) return 'Today';
    if (this.isTomorrow(dateStr)) return 'Tomorrow';
    return this.formatDate(dateStr);
  }
}
