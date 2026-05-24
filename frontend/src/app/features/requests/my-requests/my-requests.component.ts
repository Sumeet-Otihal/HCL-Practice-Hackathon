import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestService } from '../../../core/services/request.service';
import { BookRequest } from '../../../core/models/book-request.model';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <h1>My Book Requests</h1>

      <mat-expansion-panel class="add-panel">
        <mat-expansion-panel-header>
          <mat-panel-title>Request a New Book</mat-panel-title>
        </mat-expansion-panel-header>
        
        <form [formGroup]="requestForm" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <mat-form-field appearance="outline">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Book Title">
              <mat-error *ngIf="requestForm.get('title')?.hasError('required')">Title is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Author</mat-label>
              <input matInput formControlName="author" placeholder="Author Name">
              <mat-error *ngIf="requestForm.get('author')?.hasError('required')">Author is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Genre</mat-label>
              <input matInput formControlName="genre" placeholder="Genre">
            </mat-form-field>
          </div>
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="requestForm.invalid">Submit Request</button>
          </div>
        </form>
      </mat-expansion-panel>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="myRequests" *ngIf="!loading">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef> Title </th>
            <td mat-cell *matCellDef="let req"> {{req.title}} </td>
          </ng-container>

          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef> Author </th>
            <td mat-cell *matCellDef="let req"> {{req.author}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let req">
              <mat-chip-set>
                <mat-chip [color]="getStatusColor(req.status)" selected>{{req.status}}</mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="requestedAt">
            <th mat-header-cell *matHeaderCellDef> Requested At </th>
            <td mat-cell *matCellDef="let req"> {{req.requestedAt | date}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="empty-state" *ngIf="!loading && myRequests.length === 0">
          <p>You haven't made any requests yet.</p>
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
export class MyRequestsComponent implements OnInit {
  private requestService = inject(RequestService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  myRequests: BookRequest[] = [];
  loading = true;
  displayedColumns = ['title', 'author', 'status', 'requestedAt'];

  requestForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    genre: ['']
  });

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestService.getMyRequests().subscribe({
      next: (data) => {
        this.myRequests = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSubmit(): void {
    if (this.requestForm.invalid) return;
    this.requestService.add(this.requestForm.value as any).subscribe({
      next: () => {
        this.snackBar.open('Request submitted successfully', 'Close', { duration: 3000 });
        this.requestForm.reset();
        this.loadRequests();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to submit request', 'Close', { duration: 5000 })
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Fulfilled': return 'primary';
      case 'Rejected': return 'warn';
      case 'Pending': return 'accent';
      default: return '';
    }
  }
}
