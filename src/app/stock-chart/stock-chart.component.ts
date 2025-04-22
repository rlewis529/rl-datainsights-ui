import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';

// ✅ Define article interface
interface NewsArticle {
  headline: string;
  source: string;
  datetime: number | Date;
  url: string;
  [key: string]: any;
}

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css'
})
export class StockChartComponent {
  // Stock chart inputs
  ticker = '';
  startDate: string | null = null;
  endDate: string | null = null;
  chartUrl: string | null = null;

  // News inputs and results
  newsStartDate: string | null = null;
  newsEndDate: string | null = null;
  newsArticles: NewsArticle[] = [];

  // Pagination
  currentPage = 1;
  pageSize = 15;

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

    url += `&_=${timestamp}`; // prevent caching
    this.chartUrl = url;
  }

  getNews() {
    if (!this.ticker || !this.newsStartDate || !this.newsEndDate) {
      alert('Please enter ticker and date range for news.');
      return;
    }

    const start = this.newsStartDate.split('T')[0];
    const end = this.newsEndDate.split('T')[0];

    const url = `http://localhost:5000/api/company-news?ticker=${this.ticker}&start=${start}&end=${end}`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.newsArticles = (data.articles || []).map((article: NewsArticle) => ({
          ...article,
          datetime: new Date((article.datetime as number) * 1000)  // Convert Unix timestamp (s → ms)
        }));
        this.currentPage = 1; // Reset to first page on new search
      },
      error: (err) => {
        console.error('Error fetching news:', err);
        this.newsArticles = [];
      }
    });
  }

  get paginatedArticles(): NewsArticle[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.newsArticles.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.newsArticles.length / this.pageSize);
    return Array.from({ length: total }, (_, i) => i + 1);
  }
}
