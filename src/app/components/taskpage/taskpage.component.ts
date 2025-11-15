import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-task-page',
  templateUrl: './taskpage.component.html',
  styleUrls: ['./taskpage.component.css']
})
export class TaskpageComponent implements OnInit {
  tasks: any[] = [];
  loading = false;
  isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  selectedTask: any = null;
  statusType: 'payment' | 'order' = 'payment';
  newStatus: string = '';
  constructor(private http: HttpClient, private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/purchases/pending-tasks`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
    }).subscribe({
      next: (res) => {
        console.log(res);
        
        this.tasks = res;
        this.loading = false;
      },
      error: (err) => {
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
        next: (res) => {
          this.selectedTask.paymentStatus = this.newStatus;
          this.closeModal();
          console.log(res.Message);
        },
        error: (err) => console.error('Error updating payment status', err)
      });
    } else {
      this.taskService.updateOrderStatus(purchaseId, this.newStatus).subscribe({
        next: (res) => {
          this.selectedTask.orderStatus = this.newStatus;
          this.closeModal();
          console.log(res.Message);
        },
        error: (err) => console.error('Error updating order status', err)
      });
    }
  }

  closeModal() {
    const modalEl = document.getElementById('statusModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  }


  openPurchaseDetails(purchaseId: number) {
    console.log(purchaseId + "Navigating now");
    
    this.router.navigate(['/purchase-details', purchaseId]);
  }

}
