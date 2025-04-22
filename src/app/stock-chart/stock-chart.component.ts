import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css'
})
export class StockChartComponent {
  ticker = '';
  startDate: string | null = null;
  endDate: string | null = null;
  chartUrl: string | null = null;

  newsStartDate: string | null = null;
  newsEndDate: string | null = null;
  newsArticles: any[] = [];

  constructor(private http: HttpClient) {}

  getChart() {
    const timestamp = new Date().getTime();
    let url = `http://localhost:5000/api/stock-chart?ticker=${this.ticker}`;

    if (this.startDate) {
      url += `&start=${this.startDate}`;
    }

    if (this.endDate) {
      url += `&end=${this.endDate}`;
    }

    url += `&_=${timestamp}`; // avoid cache

    this.chartUrl = url;
  }

  getNews() {
    if (!this.ticker || !this.newsStartDate || !this.newsEndDate) {
      alert('Please enter ticker and date range for news.');
      return;
    }

    const url = `http://localhost:5000/api/company-news?ticker=${this.ticker}&start=${this.newsStartDate}&end=${this.newsEndDate}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.newsArticles = data.articles || [];
      },
      error: (err) => {
        console.error('Error fetching news:', err);
        this.newsArticles = [];
      }
    });
  }
}
