import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-experiences',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.css']
})
export class ExperiencesComponent {
  experiences = [
    {
      id: 1,
      name: 'IMAX',
      description: 'Experience movies on the biggest screens with crystal-clear images and powerful sound.',
      icon: 'theaters',
      color: '#e31c3d'
    },
    {
      id: 2,
      name: '4DX',
      description: 'Immersive cinema experience with moving seats, wind, fog, and scent effects.',
      icon: '4k',
      color: '#75d6d4'
    },
    {
      id: 3,
      name: 'Dolby Atmos',
      description: 'Revolutionary spatial audio technology that places sound all around you.',
      icon: 'surround_sound',
      color: '#ffb3b2'
    },
    {
      id: 4,
      name: 'Dolby Cinema',
      description: 'Premium large format experience with Dolby Vision and Dolby Atmos.',
      icon: 'movie_filter',
      color: '#c8c6c9'
    },
    {
      id: 5,
      name: 'RealD 3D',
      description: 'Crystal-clear 3D experience with comfortable lightweight glasses.',
      icon: 'view_in_ar',
      color: '#e5e1e4'
    },
    {
      id: 6,
      name: 'Premium Large Format',
      description: 'Extra-large screens with premium sound and comfortable seating.',
      icon: 'zoom_out_map',
      color: '#757575'
    }
  ];
}
