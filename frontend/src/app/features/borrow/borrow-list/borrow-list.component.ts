import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { BorrowService } from '../../../core/services/borrow.service';
import { BookService } from '../../../core/services/book.service';
import { UserService } from '../../../core/services/user.service';
import { BorrowedBook } from '../../../core/models/borrow.model';
import { Book } from '../../../core/models/book.model';
import { User } from '../../../core/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-borrow-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <h1>Borrow Management</h1>

      <mat-expansion-panel class="issue-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>Issue New Book</mat-panel-title>
        </mat-expansion-panel-header>
        
        <form [formGroup]="issueForm" (ngSubmit)="onIssue()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Book</mat-label>
              <mat-select formControlName="bookId">
                <mat-option *ngFor="let book of availableBooks" [value]="book.id">
                  {{book.title}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="issueForm.get('bookId')?.hasError('required')">Book is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Reader</mat-label>
              <mat-select formControlName="userId">
                <mat-option *ngFor="let user of readers" [value]="user.id">
                  {{user.name}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="issueForm.get('userId')?.hasError('required')">Reader is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Return Date</mat-label>
              <input matInput [matDatepicker]="retPicker" formControlName="returnDate">
              <mat-datepicker-toggle matIconSuffix [for]="retPicker"></mat-datepicker-toggle>
              <mat-datepicker #retPicker></mat-datepicker>
              <mat-error *ngIf="issueForm.get('returnDate')?.hasError('required')">Return date is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Phone No.</mat-label>
              <input matInput formControlName="phoneNo">
              <mat-error *ngIf="issueForm.get('phoneNo')?.hasError('required')">Phone is required</mat-error>
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="issueForm.invalid">Issue Book</button>
          </div>
        </form>
      </mat-expansion-panel>

      <div class="filter-actions">
        <button mat-button (click)="loadBorrows('all')">All</button>
        <button mat-button (click)="loadBorrows('active')">Active Only</button>
      </div>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="filteredBorrows" *ngIf="!loading">
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

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let borrow">
              <span [class.returned]="borrow.isReturned" [class.active]="!borrow.isReturned">
                {{borrow.isReturned ? 'Returned' : 'Active'}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let borrow">
              <button mat-raised-button color="accent" *ngIf="!borrow.isReturned" (click)="returnBook(borrow.id)">
                Return
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    .issue-panel { margin-bottom: 30px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 15px; }
    .filter-actions { margin-bottom: 15px; }
    table { width: 100%; }
    .returned { color: gray; }
    .active { color: green; font-weight: bold; }
  `]
})
export class BorrowListComponent implements OnInit {
  private borrowService = inject(BorrowService);
  private bookService = inject(BookService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  borrows: BorrowedBook[] = [];
  filteredBorrows: BorrowedBook[] = [];
  availableBooks: Book[] = [];
  readers: User[] = [];
  loading = true;

  displayedColumns = ['bookTitle', 'readerName', 'issuingDate', 'returnDate', 'status', 'actions'];

  issueForm = this.fb.group({
    bookId: ['', Validators.required],
    userId: ['', Validators.required],
    returnDate: ['', Validators.required],
    phoneNo: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      borrows: this.borrowService.getAll(),
      books: this.bookService.getAll(),
      users: this.userService.getAll()
    }).subscribe({
      next: (data) => {
        this.borrows = data.borrows;
        this.filteredBorrows = data.borrows;
        this.availableBooks = data.books.filter(b => b.isAvailable && b.noOfCopies > 0);
        this.readers = data.users.filter(u => u.role === 'Reader');
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadBorrows(filter: 'all' | 'active'): void {
    if (filter === 'active') {
      this.filteredBorrows = this.borrows.filter(b => !b.isReturned);
    } else {
      this.filteredBorrows = this.borrows;
    }
  }

  onIssue(): void {
    if (this.issueForm.invalid) return;
    this.borrowService.borrow(this.issueForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Book issued successfully', 'Close', { duration: 3000 });
        this.issueForm.reset();
        this.loadData();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to issue book', 'Close', { duration: 5000 })
    });
  }

  returnBook(id: number): void {
    this.borrowService.return(id).subscribe({
      next: () => {
        this.snackBar.open('Book returned successfully', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to return book', 'Close', { duration: 5000 })
    });
  }
}
