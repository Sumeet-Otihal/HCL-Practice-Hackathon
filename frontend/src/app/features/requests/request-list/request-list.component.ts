import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RequestService } from '../../../core/services/request.service';
import { BookRequest } from '../../../core/models/book-request.model';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatChipsModule, MatSnackBarModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <h1>Book Requests</h1>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="requests" *ngIf="!loading">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let req"> {{req.id}} </td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef> Title </th>
            <td mat-cell *matCellDef="let req"> {{req.title}} </td>
          </ng-container>

          <ng-container matColumnDef="author">
            <th mat-header-cell *matHeaderCellDef> Author </th>
            <td mat-cell *matCellDef="let req"> {{req.author}} </td>
          </ng-container>

          <ng-container matColumnDef="genre">
            <th mat-header-cell *matHeaderCellDef> Genre </th>
            <td mat-cell *matCellDef="let req"> {{req.genre}} </td>
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
            <td mat-cell *matCellDef="let req"> {{req.requestedAt | date:'medium'}} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let req">
              <ng-container *ngIf="req.status === 'Pending'">
                <button mat-button color="primary" (click)="updateStatus(req.id, 'Fulfilled')">Fulfill</button>
                <button mat-button color="warn" (click)="updateStatus(req.id, 'Rejected')">Reject</button>
              </ng-container>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        
        <div class="empty-state" *ngIf="!loading && requests.length === 0">
          <p>No book requests found.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    table { width: 100%; }
    .empty-state { padding: 40px; text-align: center; }
  `]
})
export class RequestListComponent implements OnInit {
  private requestService = inject(RequestService);
  private snackBar = inject(MatSnackBar);

  requests: BookRequest[] = [];
  loading = true;
  displayedColumns = ['id', 'title', 'author', 'genre', 'status', 'requestedAt', 'actions'];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.requestService.getAll().subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateStatus(id: number, status: string): void {
    this.requestService.updateStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open(`Request marked as ${status}`, 'Close', { duration: 3000 });
        this.loadRequests();
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Failed to update status', 'Close', { duration: 5000 })
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
