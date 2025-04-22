import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './stock-chart.component.html',
  styleUrl: './stock-chart.component.css'
})
export class StockChartComponent {
  ticker = '';
  startDate: string | null = null;
  endDate: string | null = null;
  chartUrl: string | null = null;

  getChart() {
    const timestamp = new Date().getTime();
    let url = `http://localhost:5000/api/stock-chart?ticker=${this.ticker}`;

    if (this.startDate) {
      url += `&start=${this.startDate}`;
    }

    if (this.endDate) {
      url += `&end=${this.endDate}`;
    }

    url += `&_=${timestamp}`; // to avoid browser cache

    this.chartUrl = url;
  }
}

