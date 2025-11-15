import { Component, OnInit } from '@angular/core';
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

  constructor(private taskService: TaskService) {}

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
      }
    });
  }

  openStatusModal(task: any, type: 'payment' | 'order') {
    this.selectedTask = task;
    this.statusType = type;
    this.newStatus = type === 'payment' ? task.paymentStatus : task.orderStatus;

    const modalEl = document.getElementById('statusModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }

  confirmChangeStatus() {
    if (!this.selectedTask) return;

    const purchaseId = this.selectedTask.purchaseId;

    if (this.statusType === 'payment') {
      this.taskService.updatePaymentStatus(purchaseId, this.newStatus).subscribe({
        next: () => {
          this.selectedTask.paymentStatus = this.newStatus;
          this.closeModal();
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.taskService.updateOrderStatus(purchaseId, this.newStatus).subscribe({
        next: () => {
          this.selectedTask.orderStatus = this.newStatus;
          this.closeModal();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  closeModal() {
    const modalEl = document.getElementById('statusModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }
}
