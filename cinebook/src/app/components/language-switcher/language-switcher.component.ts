import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.css']
})
export class LanguageSwitcherComponent {
  @Input() selectedLanguage: string = 'All';
  @Output() languageChange = new EventEmitter<string>();
  
  languages = ['All', 'Tamil', 'English'];

  selectLanguage(language: string): void {
    this.selectedLanguage = language;
    this.languageChange.emit(language);
  }
}
