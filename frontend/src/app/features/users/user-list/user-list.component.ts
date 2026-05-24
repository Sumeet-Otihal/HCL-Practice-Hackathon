import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { CardStatusPipe } from '../../../shared/pipes/card-status.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, CardStatusPipe],
  template: `
    <div class="page-container">
      <h1>Users</h1>

      <div class="table-container mat-elevation-z8">
        <mat-spinner *ngIf="loading"></mat-spinner>
        
        <table mat-table [dataSource]="users" *ngIf="!loading">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let user"> {{user.id}} </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let user"> {{user.name}} </td>
          </ng-container>

          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef> Email </th>
            <td mat-cell *matCellDef="let user"> {{user.email}} </td>
          </ng-container>

          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef> Role </th>
            <td mat-cell *matCellDef="let user"> {{user.role}} </td>
          </ng-container>

          <ng-container matColumnDef="cardExpiry">
            <th mat-header-cell *matHeaderCellDef> Card Expiry </th>
            <td mat-cell *matCellDef="let user"> 
              {{user.libraryCardExpiry | date}}
              <span class="status-badge" [class.expiring]="(user.libraryCardExpiry | cardStatus) === 'Expiring Soon'"
                    [class.expired]="(user.libraryCardExpiry | cardStatus) === 'Expired'">
                ({{user.libraryCardExpiry | cardStatus}})
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let user">
              <button mat-icon-button color="primary" [routerLink]="['/users', user.id]">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
              [class.highlight-expiring]="(row.libraryCardExpiry | cardStatus) === 'Expiring Soon'">
          </tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 20px; }
    table { width: 100%; }
    .highlight-expiring { background-color: #fffde7; }
    .status-badge { font-size: 12px; margin-left: 5px; }
    .expiring { color: #fbc02d; font-weight: bold; }
    .expired { color: #d32f2f; font-weight: bold; }
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  
  users: User[] = [];
  loading = true;
  displayedColumns = ['id', 'name', 'email', 'role', 'cardExpiry', 'actions'];

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
