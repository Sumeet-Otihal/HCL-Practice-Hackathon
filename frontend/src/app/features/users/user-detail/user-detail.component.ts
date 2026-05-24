import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../../core/services/user.service';
import { BorrowService } from '../../../core/services/borrow.service';
import { PaymentService } from '../../../core/services/payment.service';
import { User } from '../../../core/models/user.model';
import { BorrowedBook } from '../../../core/models/borrow.model';
import { Payment } from '../../../core/models/payment.model';
import { forkJoin } from 'rxjs';
import { CardStatusPipe } from '../../../shared/pipes/card-status.pipe';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatTableModule, MatProgressSpinnerModule, MatTabsModule, CardStatusPipe],
  template: `
    <div class="page-container">
      <mat-spinner *ngIf="loading"></mat-spinner>
      
      <div class="content" *ngIf="!loading && user">
        <mat-card class="user-info-card">
          <mat-card-header>
            <mat-card-title>{{ user.name }}</mat-card-title>
            <mat-card-subtitle>{{ user.role }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="info-grid">
              <p><strong>Email:</strong> {{ user.email }}</p>
              <p><strong>Phone:</strong> {{ user.phoneNo }}</p>
              <p><strong>Card Expiry:</strong> {{ user.libraryCardExpiry | date }} 
                ({{ user.libraryCardExpiry | cardStatus }})
              </p>
              <p><strong>Status:</strong> {{ user.isActive ? 'Active' : 'Inactive' }}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-tab-group class="history-tabs">
          <mat-tab label="Borrow History">
            <table mat-table [dataSource]="borrows" class="full-width">
              <ng-container matColumnDef="bookTitle">
                <th mat-header-cell *matHeaderCellDef> Book Title </th>
                <td mat-cell *matCellDef="let b"> {{ b.bookTitle }} </td>
              </ng-container>
              <ng-container matColumnDef="issuingDate">
                <th mat-header-cell *matHeaderCellDef> Issuing Date </th>
                <td mat-cell *matCellDef="let b"> {{ b.issuingDate | date }} </td>
              </ng-container>
              <ng-container matColumnDef="returnDate">
                <th mat-header-cell *matHeaderCellDef> Return Date </th>
                <td mat-cell *matCellDef="let b"> {{ b.returnDate | date }} </td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef> Status </th>
                <td mat-cell *matCellDef="let b"> {{ b.isReturned ? 'Returned' : 'Active' }} </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="borrowColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: borrowColumns;"></tr>
            </table>
            <p *ngIf="borrows.length === 0" class="no-data">No borrow history.</p>
          </mat-tab>
          
          <mat-tab label="Payment History">
            <table mat-table [dataSource]="payments" class="full-width">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef> ID </th>
                <td mat-cell *matCellDef="let p"> {{ p.id }} </td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef> Amount </th>
                <td mat-cell *matCellDef="let p"> {{ p.amount | currency }} </td>
              </ng-container>
              <ng-container matColumnDef="date">
                <th mat-header-cell *matHeaderCellDef> Date </th>
                <td mat-cell *matCellDef="let p"> {{ p.paymentDate | date }} </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="paymentColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: paymentColumns;"></tr>
            </table>
            <p *ngIf="payments.length === 0" class="no-data">No payment history.</p>
          </mat-tab>
        </mat-tab-group>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
    .history-tabs { margin-top: 30px; }
    .full-width { width: 100%; }
    .no-data { padding: 20px; text-align: center; color: gray; }
  `]
})
export class UserDetailComponent implements OnInit {
  private userService = inject(UserService);
  private borrowService = inject(BorrowService);
  private paymentService = inject(PaymentService);
  private route = inject(ActivatedRoute);

  user?: User;
  borrows: BorrowedBook[] = [];
  payments: Payment[] = [];
  loading = true;

  borrowColumns = ['bookTitle', 'issuingDate', 'returnDate', 'status'];
  paymentColumns = ['id', 'amount', 'date'];

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      user: this.userService.getById(userId),
      // Need a way to filter borrows/payments by user if API supports it or we filter client-side
      // Assuming for now we can get all and filter or specific endpoints exist
      borrows: this.borrowService.getAll(), 
      payments: this.paymentService.getByUser(userId)
    }).subscribe({
      next: (data) => {
        this.user = data.user;
        this.borrows = data.borrows.filter(b => b.userId === userId);
        this.payments = data.payments;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
