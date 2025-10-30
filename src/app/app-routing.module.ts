import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { PurchaseReportComponent } from './components/purchase-report/purchase-report.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'admin', component: AdminComponent, canActivate:[AuthGuard, RoleGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: 'employee', component: EmployeeComponent, canActivate:[AuthGuard, RoleGuard], data: { roles: ['ROLE_EMPLOYEE','ROLE_ADMIN'] } },
    { path: '', component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'profile', component: ProfileComponent },
    { path: 'add-purchase', component: AddPurchaseComponent },
    { path: 'purchase-report', component: PurchaseReportComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
