import { Component, OnInit } from '@angular/core';
import { PredictionService, Prediction } from './services/prediction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true, 
  templateUrl: './app.component.html',
  imports: [CommonModule]
})
export class AppComponent implements OnInit {
  predictions: Prediction[] = [];

  constructor(private predictionService: PredictionService) {}

  ngOnInit() {
    this.predictionService.getPredictions().subscribe({
      next: (data) => {
        console.log('Predictions:', data);
        this.predictions = data;
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }  
}
