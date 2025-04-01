import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Prediction {
  id: string;
  description: string;
  probability: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  flaskPredictions: Prediction[] = [];
  cosmosPredictions: Prediction[] = [];
  chartUrl = 'http://localhost:5000/chart';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Prediction[]>('http://localhost:5000/predictions').subscribe({
      next: data => {
        this.flaskPredictions = data;
      },
      error: err => console.error('Error fetching from Flask:', err)
    });

    this.http.get<Prediction[]>('https://localhost:7072/predictions').subscribe({
      next: data => {
        this.cosmosPredictions = data;
      },
      error: err => console.error('Error fetching from Cosmos API:', err)
    });
  }
}
