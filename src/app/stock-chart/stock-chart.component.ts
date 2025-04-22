import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
  CategoryScale
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, CategoryScale);

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
  averageSentiment: number | null = null;
  gaugeChart: Chart | null = null;

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
          datetime: new Date((article.datetime as number) * 1000)
        }));
        this.averageSentiment = data.average_sentiment;
        this.currentPage = 1;        
        setTimeout(() => this.renderGauge(), 0);
      },
      error: (err) => {
        console.error('Error fetching news:', err);
        this.newsArticles = [];
        this.averageSentiment = null;
      }
    });    
  }

  getSentimentColor(score: number): string {
    if (score >= 0.5) return '#4CAF50'; // green
    if (score >= 0.1) return '#CDDC39'; // lime
    if (score > -0.1) return '#FFC107'; // amber
    if (score > -0.5) return '#FF5722'; // deep orange
    return '#F44336'; // red
  }

  renderGauge() {
    const ctx = document.getElementById('sentimentGauge') as HTMLCanvasElement;
    if (!ctx) return;
  
    const score = this.averageSentiment ?? 0;
  
    // Normalize score from -1 to 1 => scale to 0–100 for nicer chart proportions
    const percent = (score + 1) * 50;
  
    const backgroundColor = score > 0.5 ? '#4CAF50' :
                            score > 0.1 ? '#CDDC39' :
                            score > -0.1 ? '#FFC107' :
                            score > -0.5 ? '#FF5722' : '#F44336';
  
    // Destroy existing chart if it exists
    if (this.gaugeChart) {
      this.gaugeChart.destroy();
    }
  
    this.gaugeChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [percent, 100 - percent],
          backgroundColor: [backgroundColor, '#eee'],
          borderWidth: 0,          
          rotation: -90,
          circumference: 180,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        }
      }
    });
  
    // Draw label manually after short delay
    setTimeout(() => {
      const centerX = ctx.width / 2;
      const centerY = ctx.height * 0.6;
      const text = `${score.toFixed(2)}`;
      const subtext = 'Sentiment';
  
      const ctx2 = ctx.getContext('2d');
      if (ctx2) {
        ctx2.font = '20px Arial';
        ctx2.fillStyle = '#333';
        ctx2.textAlign = 'center';
        ctx2.fillText(text, centerX, centerY);
        ctx2.font = '14px Arial';
        ctx2.fillText(subtext, centerX, centerY + 20);
      }
    }, 100);
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
