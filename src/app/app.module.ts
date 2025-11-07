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

@NgModule({
  declarations: [AppComponent, LoginComponent, SignupComponent, AdminComponent, EmployeeComponent, HomeComponent, ProfileComponent, NavbarComponent, AddPurchaseComponent, PurchaseReportComponent, ResetPasswordComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule,],
  bootstrap: [AppComponent]
})
export class AppModule {}
