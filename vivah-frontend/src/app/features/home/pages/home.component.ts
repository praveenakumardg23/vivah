import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HallCardComponent } from '../../../shared/components/hall-card/hall-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HallCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  locations = ['Bangalore', 'Mysore'];
  selectedLocation = 'Bangalore';

  featuredHalls = [
    {
      name: 'Sri Lakshmi Convention Hall',
      location: 'Bangalore',
      price: 50000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/f_auto,q_auto/culture_h9i1d8'
    },
    {
      name: 'Royal Palace Mantapa',
      location: 'Mysore',
      price: 75000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/v1773984624/r07SrimT99qHxXublRSWt8jHk6A9izJkfc-UQG3SYo_JkdsqcREMQ7hpr5j3tzdwpRyQOygk_6uNvJ0e76CBw2_IxGoGkoxdvOROoqJDwgE_dkv50k.jpg'
    },
    {
      name: 'Sri Lakshmi Convention Hall',
      location: 'Bangalore',
      price: 50000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/f_auto,q_auto/culture_h9i1d8'
    },
    {
      name: 'Royal Palace Mantapa',
      location: 'Mysore',
      price: 75000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/v1773984624/r07SrimT99qHxXublRSWt8jHk6A9izJkfc-UQG3SYo_JkdsqcREMQ7hpr5j3tzdwpRyQOygk_6uNvJ0e76CBw2_IxGoGkoxdvOROoqJDwgE_dkv50k.jpg'
    },
    {
      name: 'Sri Lakshmi Convention Hall',
      location: 'Bangalore',
      price: 50000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/f_auto,q_auto/culture_h9i1d8'
    },
    {
      name: 'Royal Palace Mantapa',
      location: 'Mysore',
      price: 75000,
      image: 'https://res.cloudinary.com/dah7ebcsg/image/upload/v1773984624/r07SrimT99qHxXublRSWt8jHk6A9izJkfc-UQG3SYo_JkdsqcREMQ7hpr5j3tzdwpRyQOygk_6uNvJ0e76CBw2_IxGoGkoxdvOROoqJDwgE_dkv50k.jpg'
    }
  ];

  search() {
    console.log('Searching...');
  }
}