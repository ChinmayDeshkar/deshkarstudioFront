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
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { RestrictedPageComponent } from './components/restricted-page/restricted-page.component';
import { TaskpageComponent } from './components/taskpage/taskpage.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'admin', component: AdminComponent, canActivate:[AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: 'employee', component: EmployeeComponent, canActivate:[AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: '', component: HomeComponent, canActivate:[AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard] },
    { path: 'add-purchase', component: AddPurchaseComponent, canActivate:[AuthGuard] },
    { path: 'purchase-report', component: PurchaseReportComponent, canActivate:[AuthGuard], data: { roles: ['ROLE_ADMIN'] } },
    { path: 'reset', component: ResetPasswordComponent },
    { path: 'restricted', component: RestrictedPageComponent },
    { path: 'task-page', component: TaskpageComponent, canActivate:[AuthGuard], data: { roles: ['ROLE_ADMIN', 'ROLE_EMPLOYEE'] } },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
