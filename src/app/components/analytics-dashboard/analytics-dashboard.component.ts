import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {

  selectedView = 'year'; // year | month | day
  chartData!: ChartData<'bar'>;
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Revenue Analytics' }
    }
  };
  loading = false;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadChartData('year');
  }

  loadChartData(type: 'year' | 'month' | 'day') {
    this.loading = true;
    this.selectedView = type;

    let apiCall;
    switch (type) {
      case 'month': apiCall = this.analyticsService.getRevenuePerMonth(); break;
      case 'day': apiCall = this.analyticsService.getRevenuePerDay(); break;
      default: apiCall = this.analyticsService.getRevenuePerYear();
    }

    apiCall.subscribe({
      next: (data: any[]) => {
        this.chartData = {
          labels: data.map(d => d.label),
          datasets: [
            { label: 'Income', data: data.map(d => d.income), backgroundColor: '#4CAF50' },
            { label: 'Balance', data: data.map(d => d.balance), backgroundColor: '#FF9800' },
            { label: 'Transactions', data: data.map(d => d.transactions), backgroundColor: '#2196F3' }
          ]
        };
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
