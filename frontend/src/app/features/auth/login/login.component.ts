import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <h1>Welcome back.</h1>
        <p class="subtitle">Manage your books and borrows with ease.</p>
        <div class="vertical-line"></div>
      </div>
      <div class="auth-right">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="Enter your email">
            <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="loginForm.get('email')?.hasError('email')">Invalid email format</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" placeholder="Enter your password">
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="loginForm.invalid" class="full-width submit-btn">
            Sign In
          </button>
          
          <p class="auth-footer">Don't have an account? <a routerLink="/register">Register here</a></p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      min-height: calc(100vh - 60px);
      background-color: var(--color-bg);
    }

    .auth-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 4rem;
    }

    .auth-left h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    .auth-left .subtitle {
      font-size: 1.2rem;
      color: var(--color-muted);
      margin-bottom: 2rem;
    }

    .vertical-line {
      width: 1px;
      height: 100px;
      background-color: var(--color-border);
    }

    .auth-right {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .login-form {
      width: 100%;
      max-width: 400px;
      background: var(--color-surface);
      padding: 3rem;
      border: 1px solid var(--color-border);
      border-radius: 8px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }

    .submit-btn {
      padding: 1.5rem !important;
      margin-top: 1rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.9rem;
      color: var(--color-muted);
    }

    .auth-footer a {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: 500;
    }

    @media (max-width: 1024px) {
      .auth-left h1 { font-size: 2.5rem; }
      .auth-left { padding: 0 2rem; }
    }

    @media (max-width: 640px) {
      .auth-page { flex-direction: column; }
      .auth-left { padding: 4rem 2rem 2rem; text-align: center; align-items: center; }
      .auth-left h1 { font-size: 2.5rem; }
      .vertical-line { display: none; }
      .auth-right { padding: 2rem 1rem; }
      .login-form { padding: 2rem; border: none; background: transparent; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
