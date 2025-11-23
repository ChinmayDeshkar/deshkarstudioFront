import { Component, OnInit } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Filler, Tooltip, Legend } from 'chart.js';

// Register all required controllers, elements, scales, and plugins
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);
import { IncomeService } from 'src/app/services/income.service';

@Component({
  selector: 'app-income-dashboard',
  templateUrl: './income-dashboard.component.html',
  styleUrls: ['./income-dashboard.component.css'],
})
export class IncomeDashboardComponent implements OnInit {
  todayIncome: number = 0;
  weeklyIncome: number = 0;
  monthlyIncome: number = 0;
  last7DaysIncome: { date: string; total: number }[] = [];

  chart: any;

  constructor(private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.loadIncomes();
    this.loadLast7DaysIncome();
  }

  loadIncomes(): void {
    this.incomeService
      .getTodayIncome()
      .subscribe((res) => (this.todayIncome = res));
    this.incomeService
      .getWeeklyIncome()
      .subscribe((res) => (this.weeklyIncome = res));
    this.incomeService
      .getMonthlyIncome()
      .subscribe((res) => (this.monthlyIncome = res));
  }

  loadLast7DaysIncome(): void {
    this.incomeService.getLast7DaysDailyIncome().subscribe((res) => {
      const labels = Object.keys(res);
      const data = Object.values(res);

      this.chart = new Chart('last7daysChart', {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Daily Income',
              data: data,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.3, // smooth line
              pointHoverRadius: 7, // make points bigger on hover
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true, // show legend
              position: 'top',
            },
            tooltip: {
              enabled: true, // show tooltip on hover
              callbacks: {
                label: function (context) {
                  let value = context.raw;
                  return `₹ ${value}`; // show rupee symbol
                },
              },
            },
            title: {
              display: true,
              text: 'Last 7 Days Daily Income',
            },
          },
          hover: {
            mode: 'nearest',
            intersect: true,
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }
}
