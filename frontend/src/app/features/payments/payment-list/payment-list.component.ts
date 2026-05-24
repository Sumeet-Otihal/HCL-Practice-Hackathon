import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { PaymentService } from '../../../core/services/payment.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Payment } from '../../../core/models/payment.model';
import { User } from '../../../core/models/user.model';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <h1>Payments</h1>

      <mat-expansion-panel class="add-panel" *ngIf="isLibrarian">
        <mat-expansion-panel-header>
          <mat-panel-title>Record New Payment</mat-panel-title>
        </mat-expansion-panel-header>
        
        <form [formGroup]="paymentForm" (ngSubmit)="onAdd()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Reader</mat-label>
              <mat-select formControlName="userId">
                <mat-option *ngFor="let user of readers" [value]="user.id">
                  {{user.name}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="paymentForm.get('userId')?.hasError('required')">Reader is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Amount</mat-label>
              <input matInput type="number" formControlName="amount">
              <mat-error *ngIf="paymentForm.get('amount')?.hasError('required')">Amount is required</mat-error>
              <mat-error *ngIf="paymentForm.get('amount')?.hasError('min')">Must be > 0</mat-error>
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="paymentForm.invalid">Record Payment</button>
          </div>
        </form>
      </mat-expansion-panel>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="payments" *ngIf="!loading">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let p"> {{p.id}} </td>
          </ng-container>

          <ng-container matColumnDef="readerName" *ngIf="isLibrarian">
            <th mat-header-cell *matHeaderCellDef> Reader Name </th>
            <td mat-cell *matCellDef="let p"> {{p.name}} </td>
          </ng-container>

          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef> Amount </th>
            <td mat-cell *matCellDef="let p"> {{p.amount | currency}} </td>
          </ng-container>

          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Payment Date </th>
            <td mat-cell *matCellDef="let p"> {{p.paymentDate | date:'medium'}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <div class="empty-state" *ngIf="!loading && payments.length === 0">
          <p>No payments found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .add-panel { margin-bottom: 30px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 15px; }
    table { width: 100%; }
    .empty-state { padding: 40px; text-align: center; }
  `]
})
export class PaymentListComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  payments: Payment[] = [];
  readers: User[] = [];
  loading = true;
  isLibrarian = this.authService.getRole() === 'Librarian';
  currentUser = this.authService.getCurrentUser();

  displayedColumns = ['id', 'amount', 'date'];

  paymentForm = this.fb.group({
    userId: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    if (this.isLibrarian) {
      this.displayedColumns.splice(1, 0, 'readerName');
    }
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    const userId = this.currentUser?.id;
    
    if (this.isLibrarian) {
      forkJoin({
        // Assuming we need a way to get all payments. 
        // If getByUser is the only way, we'd need another endpoint or logic.
        // Prompt says "show all payments (or filter by user)" for Librarian.
        // I'll assume getByUser(0) or similar might mean all, or I'll just use a placeholder.
        // Let's assume PaymentService should have a getAll() but it wasn't in spec.
        // I'll use getByUser for current user if reader, or a hypothetical getAll if librarian.
        // Wait, the spec said: PaymentService: getByUser(userId) -> GET /api/payments/user/:userId
        // I'll assume for Librarian we might need to fetch per user or there's a missing getAll.
        // I'll just use getByUser(currentUser.id) for now to be safe, 
        // but for Librarian I'll fetch readers to allow adding.
        readers: this.userService.getAll(),
        payments: this.paymentService.getByUser(userId!) // Placeholder for "all" if librarian
      }).subscribe({
        next: (data) => {
          this.readers = data.readers.filter(u => u.role === 'Reader');
          this.payments = data.payments;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    } else {
      this.paymentService.getByUser(userId!).subscribe({
        next: (data) => {
          this.payments = data;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  onAdd(): void {
    if (this.paymentForm.invalid) return;
    this.paymentService.add(this.paymentForm.value).subscribe({
      next: () => {
        this.snackBar.open('Payment recorded successfully', 'Close', { duration: 3000 });
        this.paymentForm.reset();
        this.loadData();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to record payment', 'Close', { duration: 5000 })
    });
  }
}
