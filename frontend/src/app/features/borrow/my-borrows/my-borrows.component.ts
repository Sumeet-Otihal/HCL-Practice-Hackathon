import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BorrowService } from '../../../core/services/borrow.service';
import { BorrowedBook } from '../../../core/models/borrow.model';

@Component({
  selector: 'app-my-borrows',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <h1>My Borrow History</h1>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="myBorrows" *ngIf="!loading">
          <ng-container matColumnDef="bookTitle">
            <th mat-header-cell *matHeaderCellDef> Book Title </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.bookTitle}} </td>
          </ng-container>

          <ng-container matColumnDef="issuingDate">
            <th mat-header-cell *matHeaderCellDef> Issuing Date </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.issuingDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="returnDate">
            <th mat-header-cell *matHeaderCellDef> Return Date </th>
            <td mat-cell *matCellDef="let borrow"> {{borrow.returnDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let borrow">
              <span [class.returned]="borrow.isReturned" [class.active]="!borrow.isReturned">
                {{borrow.isReturned ? 'Returned' : 'Active'}}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="empty-state" *ngIf="!loading && myBorrows.length === 0">
          <p>You haven't borrowed any books yet.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    table { width: 100%; }
    .returned { color: gray; }
    .active { color: green; font-weight: bold; }
    .empty-state { padding: 40px; text-align: center; }
  `]
})
export class MyBorrowsComponent implements OnInit {
  private borrowService = inject(BorrowService);
  
  myBorrows: BorrowedBook[] = [];
  loading = true;
  displayedColumns = ['bookTitle', 'issuingDate', 'returnDate', 'status'];

  ngOnInit(): void {
    this.borrowService.getMyBorrows().subscribe({
      next: (data) => {
        this.myBorrows = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
