import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
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
    RouterModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CardStatusPipe
  ],
  template: `
    <div class="page-container" *ngIf="currentUser">
      <div class="warning-banner" *ngIf="currentUser.role === 'Reader' && (currentUser.libraryCardExpiry | cardStatus) === 'Expired'">
        <mat-icon>warning</mat-icon>
        <p>Your library card has expired. Please update your expiry date to continue borrowing books.</p>
      </div>

      <header class="dashboard-header">
        <div>
          <h1>Welcome back, {{ currentUser.name }}</h1>
          <p class="subtitle">Here is what's happening in your library today.</p>
        </div>
      </header>

      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="50"></mat-spinner>
      </div>

      <div class="dashboard-content" *ngIf="!loading">
        <!-- Librarian View -->
        <div class="view-section" *ngIf="currentUser.role === 'Librarian'">
          <div class="stats-grid">
            <mat-card class="stat-card">
              <div class="stat-icon books"><mat-icon>library_books</mat-icon></div>
              <div class="stat-details">
                <span class="label">Total Books</span>
                <span class="value">{{ stats.totalBooks }}</span>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon borrows"><mat-icon>bookmark_added</mat-icon></div>
              <div class="stat-details">
                <span class="label">Active Borrows</span>
                <span class="value">{{ stats.activeBorrows }}</span>
              </div>
            </mat-card>

            <mat-card class="stat-card" [class.danger]="stats.overdueCount > 0">
              <div class="stat-icon overdue"><mat-icon>history_toggle_off</mat-icon></div>
              <div class="stat-details">
                <span class="label">Overdue</span>
                <span class="value">{{ stats.overdueCount }}</span>
              </div>
            </mat-card>
          </div>

          <div class="secondary-grid">
            <mat-card class="list-card expiring-cards">
              <mat-card-header>
                <mat-card-title>Cards Expiring Soon</mat-card-title>
                <mat-card-subtitle>Users whose cards expire within 7 days</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <mat-list *ngIf="expiringUsers.length > 0; else noExpiring">
                  <mat-list-item *ngFor="let user of expiringUsers">
                    <mat-icon matListItemIcon>person</mat-icon>
                    <div matListItemTitle>{{ user.name }}</div>
                    <div matListItemLine>Expires: {{ user.libraryCardExpiry | date:'mediumDate' }}</div>
                  </mat-list-item>
                </mat-list>
                <ng-template #noExpiring>
                  <div class="empty-list">
                    <mat-icon>check_circle</mat-icon>
                    <p>No cards expiring soon.</p>
                  </div>
                </ng-template>
              </mat-card-content>
            </mat-card>

            <mat-card class="actions-card">
              <mat-card-header>
                <mat-card-title>Quick Actions</mat-card-title>
              </mat-card-header>
              <mat-card-content class="actions-list">
                <button mat-stroked-button color="primary" routerLink="/books/new">
                  <mat-icon>add</mat-icon> Add New Book
                </button>
                <button mat-stroked-button color="primary" routerLink="/borrow">
                  <mat-icon>list_alt</mat-icon> View All Borrows
                </button>
                <button mat-stroked-button color="primary" routerLink="/requests">
                  <mat-icon>notifications_active</mat-icon> Pending Requests
                </button>
                <button mat-stroked-button color="primary" routerLink="/users">
                  <mat-icon>people</mat-icon> Manage Users
                </button>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <!-- Reader View -->
        <div class="view-section" *ngIf="currentUser.role === 'Reader'">
          <div class="stats-grid">
            <mat-card class="stat-card library-card-info">
              <div class="stat-icon" [ngClass]="getStatusClass(currentUser.libraryCardExpiry | cardStatus)">
                <mat-icon>badge</mat-icon>
              </div>
              <div class="stat-details">
                <span class="label">Library Card Status</span>
                <span class="value-text" [ngClass]="getStatusClass(currentUser.libraryCardExpiry | cardStatus)">
                  {{ currentUser.libraryCardExpiry | cardStatus }}
                </span>
                <span class="small-text">Expires: {{ currentUser.libraryCardExpiry | date }}</span>
              </div>
              <div class="spacer"></div>
              <button mat-icon-button (click)="showUpdateExpiry = !showUpdateExpiry" color="primary">
                <mat-icon>{{ showUpdateExpiry ? 'close' : 'edit_calendar' }}</mat-icon>
              </button>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon borrows"><mat-icon>book</mat-icon></div>
              <div class="stat-details">
                <span class="label">My Active Borrows</span>
                <span class="value">{{ readerStats.activeBorrows }}</span>
              </div>
            </mat-card>

            <mat-card class="stat-card">
              <div class="stat-icon requests"><mat-icon>pending_actions</mat-icon></div>
              <div class="stat-details">
                <span class="label">Pending Requests</span>
                <span class="value">{{ readerStats.pendingRequests }}</span>
              </div>
            </mat-card>
          </div>

          <div class="update-expiry-section" *ngIf="showUpdateExpiry">
            <mat-card class="form-card">
              <mat-card-header>
                <mat-card-title>Update Library Card Expiry</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="expiryForm" (ngSubmit)="onUpdateExpiry()" class="expiry-form">
                  <mat-form-field appearance="outline">
                    <mat-label>New Expiry Date</mat-label>
                    <input matInput [matDatepicker]="picker" formControlName="expiryDate">
                    <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
                    <mat-error *ngIf="expiryForm.get('expiryDate')?.hasError('required')">Date is required</mat-error>
                  </mat-form-field>
                  <div class="form-actions">
                    <button mat-flat-button color="primary" type="submit" [disabled]="expiryForm.invalid || updating">
                      {{ updating ? 'Updating...' : 'Save Changes' }}
                    </button>
                    <button mat-button type="button" (click)="showUpdateExpiry = false">Cancel</button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>

          <div class="quick-actions-reader">
            <h2>Recommended Actions</h2>
            <div class="reader-actions-grid">
              <mat-card class="action-card" routerLink="/books">
                <mat-icon>search</mat-icon>
                <h3>Browse Collection</h3>
                <p>Find your next great read in our catalog.</p>
              </mat-card>
              <mat-card class="action-card" routerLink="/my-borrows">
                <mat-icon>history</mat-icon>
                <h3>My Borrows</h3>
                <p>Track your currently borrowed books and history.</p>
              </mat-card>
              <mat-card class="action-card" routerLink="/my-requests">
                <mat-icon>fact_check</mat-icon>
                <h3>My Requests</h3>
                <p>Check the status of your book requests.</p>
              </mat-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header { margin-bottom: 3rem; }
    .subtitle { color: var(--color-muted); font-size: 1.1rem; }
    
    .loading-container { display: flex; justify-content: center; padding: 5rem; }

    .warning-banner {
      background-color: var(--color-danger);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .warning-banner p { margin: 0; font-weight: 500; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      padding: 1.5rem !important;
      gap: 1.5rem;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-bg);
      color: var(--color-muted);
    }
    .stat-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .stat-icon.books { background: #E0F2FE; color: #0369A1; }
    .stat-icon.borrows { background: #DCFCE7; color: #15803D; }
    .stat-icon.overdue { background: #FEE2E2; color: #B91C1C; }
    .stat-icon.requests { background: #FEF3C7; color: #B45309; }
    .stat-icon.valid { background: #DCFCE7; color: #15803D; }
    .stat-icon.expiring { background: #FEF3C7; color: #B45309; }
    .stat-icon.expired { background: #FEE2E2; color: #B91C1C; }

    .stat-details { display: flex; flex-direction: column; }
    .stat-details .label { font-size: 0.9rem; color: var(--color-muted); font-weight: 500; }
    .stat-details .value { font-size: 2rem; font-weight: 600; color: var(--color-text); line-height: 1.2; }
    .stat-details .value-text { font-size: 1.25rem; font-weight: 600; text-transform: capitalize; }
    .stat-details .small-text { font-size: 0.8rem; color: var(--color-muted); }

    .stat-card.danger { border-color: var(--color-danger) !important; }

    .secondary-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .list-card mat-card-header { margin-bottom: 1.5rem; }
    .empty-list { text-align: center; padding: 3rem; color: var(--color-muted); }
    .empty-list mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5; }

    .actions-card .actions-list { display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; }
    .actions-list button { justify-content: flex-start; gap: 0.75rem; padding: 1.25rem !important; }

    .update-expiry-section { margin-bottom: 2.5rem; }
    .expiry-form { display: flex; flex-direction: column; gap: 1rem; max-width: 400px; padding-top: 1rem; }
    .form-actions { display: flex; gap: 1rem; align-items: center; }

    .quick-actions-reader { margin-top: 3rem; }
    .quick-actions-reader h2 { margin-bottom: 1.5rem; }
    .reader-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    .action-card {
      padding: 2rem !important;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .action-card:hover { border-color: var(--color-accent) !important; background: var(--color-bg) !important; }
    .action-card mat-icon { color: var(--color-accent); font-size: 32px; width: 32px; height: 32px; margin-bottom: 1rem; }
    .action-card h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
    .action-card p { margin: 0; color: var(--color-muted); font-size: 0.95rem; }

    @media (max-width: 900px) {
      .secondary-grid { grid-template-columns: 1fr; }
    }
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
  updating = false;
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
    } else {
      this.loading = false; // Handle unknown role or no user
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
        if (data && data.libraryCardExpiry) {
          this.currentUser!.libraryCardExpiry = data.libraryCardExpiry;
        }
      }
    });
  }

  onUpdateExpiry(): void {
    if (this.expiryForm.invalid || !this.currentUser) return;
    
    this.updating = true;
    const newExpiry = this.expiryForm.value.expiryDate;
    
    // Using PUT /api/users/:id to update expiry
    // Since only Librarian can update users, this might fail for Reader
    // but the requirement implies Reader should be able to update their expiry.
    // I will check the backend for this logic.
    this.userService.update(this.currentUser.id, { libraryCardExpiry: newExpiry as any }).subscribe({
      next: (updatedUser) => {
        this.snackBar.open('Library card expiry updated successfully', 'Close', { duration: 3000 });
        this.showUpdateExpiry = false;
        this.updating = false;
        this.currentUser!.libraryCardExpiry = updatedUser.libraryCardExpiry;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to update expiry', 'Close', { duration: 5000 });
        this.updating = false;
      }
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

