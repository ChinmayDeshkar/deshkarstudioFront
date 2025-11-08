import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  profileForm = this.fb.group({
    username: [{ value: '', disabled: true }],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    role: [{ value: '', disabled: true }],
    active: [{ value: '', disabled: true }],
    dte_created: [{ value: '', disabled: true }]
  });

  loading = true;
  message = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: (data: any) => {
        console.log('Profile data:', data);
        console.log(data.User.username);
        
        // Patch only the fields we want to display
        this.profileForm.patchValue({
          username: data.User.username,
          email: data.User.email,
          phone: data.User.phone,
          role: data.User.role,
          active: data.User.active ? 'Active' : 'Inactive',
          dte_created: data.User.dte_created
        });

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  onUpdate(): void {
    if (this.profileForm.invalid) return;

    const payload = {
      email: this.profileForm.get('email')?.value,
      phone: this.profileForm.get('phone')?.value
    };

    this.auth.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Profile updated successfully!';
      },
      error: () => {
        this.message = 'Update failed';
      }
    });
  }
}
