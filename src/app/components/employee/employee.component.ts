import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  newEmployee = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salary: ""
  };
  showAddModal = false;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  filterStatus: string = 'all';
  selectedEmployee: any = null;
  message: string = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.applyFilter();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilter() {
    this.filteredEmployees = this.employees.filter(emp => {
      const matchesStatus = 
        this.filterStatus === 'all' ||
        (this.filterStatus === 'active' && emp.active) ||
        (this.filterStatus === 'inactive' && !emp.active);

      const matchesSearch = this.searchTerm === '' ||
        emp.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }

  editEmployee(emp: any) {
    this.selectedEmployee = { ...emp };
  }

  saveEmployee() {
    this.employeeService.updateEmployee(this.selectedEmployee).subscribe({
      next: () => {
        this.message = 'Employee updated successfully!';
        this.selectedEmployee = null;
        this.loadEmployees();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Error updating employee.';
      }
    });
  }

  cancelEdit() {
    this.selectedEmployee = null;
  }

  openAddEmployeeModal() {
  this.showAddModal = true;
}

closeAddEmployeeModal() {
  this.showAddModal = false;
  this.newEmployee = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    salary: ""
  };
}

createEmployee() {
  this.employeeService.addEmployee(this.newEmployee).subscribe({
    next: () => {
      this.closeAddEmployeeModal();
      this.loadEmployees();
    }
  });
}
}
