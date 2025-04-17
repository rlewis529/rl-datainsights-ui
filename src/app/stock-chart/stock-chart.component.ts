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
  chartUrl: string | null = null;

  getChart() {
    const timestamp = new Date().getTime();
    this.chartUrl = `http://localhost:5000/api/stock-chart?ticker=${this.ticker}&_=${timestamp}`;
  }
}
