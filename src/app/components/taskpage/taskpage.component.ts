import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-task-page',
  templateUrl: './taskpage.component.html',
  styleUrls: ['./taskpage.component.css'],
})
export class TaskpageComponent implements OnInit {
  tasks: any[] = [];
  loading = false;
  isAdmin = localStorage.getItem('role') === 'ROLE_ADMIN';

  selectedTask: any = null;
  statusType: 'payment' | 'order' = 'payment';
  newStatus: string = '';

  constructor(
    private http: HttpClient,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load tasks when component initializes
    this.loadTasks();
  }

  // Fetch tasks from the backend
  loadTasks() {
    this.loading = true;
    this.http
      .get<any[]>(`${environment.apiUrl}/purchases/pending-tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .subscribe({
        next: (res) => {
          // Sort tasks by creation date in descending order
          this.tasks = res.sort(
            (a: any, b: any) =>
              new Date(b.dte_created).getTime() -
              new Date(a.dte_created).getTime()
          );
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  // Redirect to purchase details page
  openPurchaseDetails(purchaseId: number) {
    this.router.navigate(['/purchase-details', purchaseId]);
  }
}
