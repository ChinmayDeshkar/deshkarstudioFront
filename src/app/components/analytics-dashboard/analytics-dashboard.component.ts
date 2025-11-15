import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
  ChartComponent
} from 'ng-apexcharts';
import { AnalyticsService } from 'src/app/services/analytics.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
};

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;

  // IMPORTANT: Initialize with valid defaults (not undefined)
  public chartOptions: ChartOptions = {
    series: [],
    chart: { type: "bar", height: 420 },
    xaxis: { categories: [] },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2 },
    title: { text: "Revenue Analytics", align: "center" },
    legend: { position: "top" }
  };

  loading = false;
  selectedView: 'year' | 'month' | 'day' = 'year';

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
        this.updateChart(data);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateChart(data: any[]) {
    this.chartOptions = {
      ...this.chartOptions, // keep other defaults

      series: [
        { name: 'Income', data: data.map(d => d.income) },
        { name: 'Balance', data: data.map(d => d.balance) },
        { name: 'Transactions', data: data.map(d => d.transactions) }
      ],

      xaxis: {
        categories: data.map(d => d.label)
      }
    };
  }

}
