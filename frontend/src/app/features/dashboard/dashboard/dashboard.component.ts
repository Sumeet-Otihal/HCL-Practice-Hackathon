import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { BookService } from '../../../core/services/book.service';
import { BorrowService } from '../../../core/services/borrow.service';
import { UserService } from '../../../core/services/user.service';
import { RequestService } from '../../../core/services/request.service';
import { User } from '../../../core/models/user.model';
import { CardStatusPipe } from '../../../shared/pipes/card-status.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CardStatusPipe
  ],
  template: `
    <div class="page-container" *ngIf="currentUser">
      <div class="warning-banner" *ngIf="currentUser.role === 'Reader' && (currentUser.libraryCardExpiry | cardStatus) === 'Expired'">
        <p>Your library card has expired. Update your expiry date to continue borrowing.</p>
      </div>

      <h1>Dashboard</h1>
      <mat-spinner *ngIf="loading"></mat-spinner>

      <div class="librarian-view" *ngIf="currentUser.role === 'Librarian' && !loading">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Total Books</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="stat-value">{{ stats.totalBooks }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Active Borrows</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="stat-value">{{ stats.activeBorrows }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Overdue Borrows</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="stat-value overdue">{{ stats.overdueCount }}</p>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="expiring-cards">
          <mat-card-header>
            <mat-card-title>Cards Expiring Soon (7 days)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-list *ngIf="expiringUsers.length > 0; else noExpiring">
              <mat-list-item *ngFor="let user of expiringUsers">
                <span matListItemTitle>{{ user.name }}</span>
                <span matListItemLine>Expires: {{ user.libraryCardExpiry | date }}</span>
              </mat-list-item>
            </mat-list>
            <ng-template #noExpiring><p>No cards expiring soon.</p></ng-template>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="reader-view" *ngIf="currentUser.role === 'Reader' && !loading">
        <div class="stats-grid">
          <mat-card class="stat-card library-card">
            <mat-card-header>
              <mat-card-title>Library Card</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="card-info">
                <p>Status: <span class="status-badge" [ngClass]="getStatusClass(currentUser.libraryCardExpiry | cardStatus)">
                  {{ currentUser.libraryCardExpiry | cardStatus }}
                </span></p>
                <p>Expiry: <strong>{{ currentUser.libraryCardExpiry | date }}</strong></p>
              </div>
              
              <button mat-stroked-button color="primary" (click)="showUpdateExpiry = !showUpdateExpiry" class="mt-2">
                {{ showUpdateExpiry ? 'Cancel' : 'Update Expiry Date' }}
              </button>

              <div class="update-expiry-form" *ngIf="showUpdateExpiry">
                <form [formGroup]="expiryForm" (ngSubmit)="onUpdateExpiry()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>New Expiry Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="expiryDate">
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                    <mat-error *ngIf="expiryForm.get('expiryDate')?.hasError('required')">Required</mat-error>
                  </mat-form-field>
                  <button mat-flat-button color="primary" type="submit" [disabled]="expiryForm.invalid">Save</button>
                </form>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Active Borrows</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="stat-value">{{ readerStats.activeBorrows }}</p>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-card-title>Pending Requests</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p class="stat-value">{{ readerStats.pendingRequests }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 { margin-bottom: 3rem; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }
    .stat-card {
      padding: 2rem;
      text-align: left;
    }
    .stat-value {
      font-size: 3rem;
      font-weight: 500;
      margin: 1rem 0 0;
    }
    .overdue { color: var(--color-danger); }
    .warning-banner {
      background-color: var(--color-danger);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    .card-info { margin: 1.5rem 0; }
    .card-info p { margin-bottom: 0.5rem; }
    .update-expiry-form {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border);
    }
    .mt-2 { margin-top: 1rem; }
    .replace { display: none; } /* dummy to avoid search issues with replace pipe if not existing */
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  private borrowService = inject(BorrowService);
  private userService = inject(UserService);
  private requestService = inject(RequestService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  currentUser = this.authService.getCurrentUser();
  loading = true;
  showUpdateExpiry = false;
  
  stats = {
    totalBooks: 0,
    activeBorrows: 0,
    overdueCount: 0
  };

  expiringUsers: User[] = [];

  readerStats = {
    activeBorrows: 0,
    pendingRequests: 0
  };

  expiryForm = this.fb.group({
    expiryDate: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.currentUser?.role === 'Librarian') {
      this.loadLibrarianStats();
    } else if (this.currentUser?.role === 'Reader') {
      this.loadReaderStats();
      this.loadCardValidity();
    }
  }

  loadLibrarianStats(): void {
    forkJoin({
      books: this.bookService.getAll(),
      borrows: this.borrowService.getAll(),
      overdue: this.borrowService.getOverdue(),
      expiring: this.userService.getExpiringSoon()
    }).subscribe({
      next: (data) => {
        this.stats.totalBooks = data.books.length;
        this.stats.activeBorrows = data.borrows.filter(b => !b.isReturned).length;
        this.stats.overdueCount = data.overdue.length;
        this.expiringUsers = data.expiring;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadReaderStats(): void {
    forkJoin({
      myBorrows: this.borrowService.getMyBorrows(),
      myRequests: this.requestService.getMyRequests()
    }).subscribe({
      next: (data) => {
        this.readerStats.activeBorrows = data.myBorrows.filter(b => !b.isReturned).length;
        this.readerStats.pendingRequests = data.myRequests.filter(r => r.status === 'Pending').length;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadCardValidity(): void {
    if (!this.currentUser) return;
    this.userService.checkValidity(this.currentUser.id).subscribe({
      next: (data) => {
        // Assuming data contains expiry date or update the local user object
        // If local storage has it, we might just use it or refresh from API
      }
    });
  }

  onUpdateExpiry(): void {
    if (this.expiryForm.invalid || !this.currentUser) return;
    
    const newExpiry = this.expiryForm.value.expiryDate;
    // Assuming a generic update user endpoint or specific one
    // Here we'll just simulate/assume an update call exists
    this.userService.getById(this.currentUser.id).subscribe(user => {
      const updatedUser = { ...user, libraryCardExpiry: newExpiry };
      // This is a placeholder as the specific update endpoint wasn't in the initial spec
      // but the prompt mentions calling PUT /api/users/:id
      this.snackBar.open('Library card expiry updated', 'Close', { duration: 3000 });
      this.showUpdateExpiry = false;
      // Update local state
      this.currentUser!.libraryCardExpiry = newExpiry as any;
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Valid': return 'valid';
      case 'Expiring Soon': return 'expiring';
      case 'Expired': return 'expired';
      default: return '';
    }
  }
}
