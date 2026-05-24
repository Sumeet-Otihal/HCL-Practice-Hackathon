import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowedBook } from '../../../core/models/borrow.model';

@Component({
  selector: 'app-overdue-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <h1>Overdue Borrows</h1>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="overdueBorrows" *ngIf="!loading">
          <ng-container matColumnDef="bookTitle">
            <th mat-header-cell *matHeaderCellDef> Book Title </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.bookTitle}} </td>
          </ng-container>

          <ng-container matColumnDef="readerName">
            <th mat-header-cell *matHeaderCellDef> Reader Name </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.userName}} </td>
          </ng-container>

          <ng-container matColumnDef="issuingDate">
            <th mat-header-cell *matHeaderCellDef> Issuing Date </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.issuingDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="returnDate">
            <th mat-header-cell *matHeaderCellDef> Return Date </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.returnDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="daysOverdue">
            <th mat-header-cell *matHeaderCellDef> Days Overdue </th>
            <td mat-cell *matCellDef="let borrow">
              <span class="overdue-text">{{ getDaysOverdue(borrow.returnDate) }} days</span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" [class.overdue-row]="true"></tr>
        </table>

        <div class="empty-state" *ngIf="!loading && overdueBorrows.length === 0">
          <p>No overdue borrows found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    table { width: 100%; }
    .overdue-row { background-color: #ffebee; }
    .overdue-text { color: #d32f2f; font-weight: bold; }
    .empty-state { padding: 40px; text-align: center; }
  `]
})
export class OverdueListComponent implements OnInit {
  private borrowService = inject(BorrowService);
  
  overdueBorrows: BorrowedBook[] = [];
  loading = true;
  displayedColumns = ['bookTitle', 'readerName', 'issuingDate', 'returnDate', 'daysOverdue'];

  ngOnInit(): void {
    this.borrowService.getOverdue().subscribe({
      next: (data) => {
        this.overdueBorrows = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  getDaysOverdue(returnDate: string): number {
    const retDate = new Date(returnDate);
    const today = new Date();
    const diffTime = today.getTime() - retDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  }
}
