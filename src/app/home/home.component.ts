import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Required for routerLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Add RouterModule here
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
