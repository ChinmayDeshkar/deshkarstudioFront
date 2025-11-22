import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';
declare var bootstrap: any;

@Component({
  selector: 'app-recent-tasks',
  templateUrl: './recent-tasks.component.html',
})
export class RecentTasksComponent implements OnInit {
  tasks: any[] = [];
  loading = true;
  isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  selectedTask: any = null;
  statusType: 'payment' | 'order' = 'payment';
  newStatus: string = '';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.fetchRecentTasks();
  }

  fetchRecentTasks() {
    this.loading = true;
    this.taskService.getRecentTasks().subscribe({
      next: (res: any[]) => {
        this.tasks = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
  openPurchaseDetails(purchaseId: number) {
    this.router.navigate(['/purchase-details', purchaseId]);
  }
}
