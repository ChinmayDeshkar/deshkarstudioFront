import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminComponent } from './components/admin/admin.component';
import { EmployeeComponent } from './components/employee/employee.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddPurchaseComponent } from './components/add-purchase/add-purchase.component';
import { PurchaseReportComponent } from './components/purchase-report/purchase-report.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { RestrictedPageComponent } from './components/restricted-page/restricted-page.component';
import { TaskpageComponent } from './components/taskpage/taskpage.component';
import { RecentTasksComponent } from './components/recent-tasks/recent-tasks.component';
import { PurchaseDetailsComponent } from './components/purchase-details/purchase-details.component';
import { SearchComponent } from './components/search/search.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddProductComponent } from './components/add-product/add-product.component';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AdminComponent,
    EmployeeComponent,
    HomeComponent,
    ProfileComponent,
    NavbarComponent,
    AddPurchaseComponent,
    PurchaseReportComponent,
    ResetPasswordComponent,
    AnalyticsDashboardComponent,
    RestrictedPageComponent,
    TaskpageComponent,
    RecentTasksComponent,
    PurchaseDetailsComponent,
    SearchComponent,
    AddProductComponent,
    VerifyOtpComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NgSelectModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
