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
    role: [{ value: '', disabled: true }]
  });

  loading = true;
  message = '';

  constructor(private auth: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.auth.getProfile().subscribe({
      next: (data: any) => {
        this.profileForm.patchValue(data);
        this.loading = false;
      },
      error: () => {
        this.message = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  onUpdate() {
    const payload = {
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone
    };

    this.auth.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.message = res.message;
      },
      error: () => {
        this.message = 'Update failed';
      }
    });
  }
}
