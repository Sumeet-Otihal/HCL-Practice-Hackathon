import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { BookService } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book } from '../../../core/models/book.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <header class="page-header">
        <div class="title-section">
          <h1>Collection</h1>
          <p class="subtitle">Explore our curated selection of books.</p>
        </div>
        <button mat-flat-button color="primary" *ngIf="isLibrarian" routerLink="/books/new" class="add-btn">
          <mat-icon class="material-symbols-outlined">add</mat-icon>
          <span>Add New Book</span>
        </button>
      </header>

      <div class="search-section">
        <form [formGroup]="searchForm" class="search-form">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix class="material-symbols-outlined">search</mat-icon>
            <mat-label>Search by title, author, or genre</mat-label>
            <input matInput formControlName="query" placeholder="e.g. The Great Gatsby">
          </mat-form-field>
        </form>
      </div>

      <div class="content-area">
        <div class="loading-overlay" *ngIf="loading">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div class="books-grid" *ngIf="!loading && books.length > 0">
          <mat-card class="book-card" *ngFor="let book of books">
            <div class="card-header">
              <span class="category-tag">{{ book.category }}</span>
              <span class="status-indicator" [class.available]="book.isAvailable" [class.unavailable]="!book.isAvailable">
                {{ book.isAvailable ? 'Available' : 'Unavailable' }}
              </span>
            </div>
            
            <mat-card-content class="card-body">
              <h2 class="book-title">{{ book.title }}</h2>
              <p class="author-name">by {{ book.authorName }}</p>
              
              <div class="book-meta">
                <span class="genre"><mat-icon class="material-symbols-outlined">label</mat-icon> {{ book.genre }}</span>
                <span class="price"><mat-icon class="material-symbols-outlined">payments</mat-icon> {{ book.price | currency }}</span>
              </div>
            </mat-card-content>

            <mat-card-actions class="card-actions">
              <button mat-button color="primary" [routerLink]="['/books', book.id]">View Details</button>
              <div class="spacer"></div>
              <ng-container *ngIf="isLibrarian">
                <button mat-icon-button color="accent" [routerLink]="['/books', book.id, 'edit']" title="Edit">
                  <mat-icon class="material-symbols-outlined">edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteBook(book)" title="Delete">
                  <mat-icon class="material-symbols-outlined">delete</mat-icon>
                </button>
              </ng-container>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="empty-state" *ngIf="!loading && books.length === 0">
          <mat-icon class="material-symbols-outlined large-icon">search_off</mat-icon>
          <h3>No books found</h3>
          <p>We couldn't find any books matching your search.</p>
          <button mat-stroked-button (click)="loadBooks()">Clear Search</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 4rem;
    }

    .page-header h1 {
      font-size: 3rem;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: var(--color-muted);
      font-size: 1.1rem;
      margin: 0;
    }

    .add-btn {
      height: 48px;
      padding: 0 1.5rem !important;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-section {
      margin-bottom: 4rem;
    }

    .search-form {
      max-width: 600px;
    }

    .search-field {
      width: 100%;
    }

    .content-area {
      position: relative;
      min-height: 400px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      padding-top: 100px;
      z-index: 10;
      background: rgba(248, 247, 244, 0.7);
    }

    .books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2.5rem;
    }

    .book-card {
      transition: transform 0.3s ease, border-color 0.3s ease;
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
    }

    .book-card:hover {
      transform: translateY(-5px);
      border-color: var(--color-accent) !important;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .category-tag {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-muted);
      font-weight: 500;
    }

    .status-indicator {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }

    .status-indicator.available {
      color: var(--color-accent);
      background: var(--color-accent-light);
    }

    .status-indicator.unavailable {
      color: var(--color-danger);
      background: #fdecea;
    }

    .card-body {
      padding: 2rem 1.5rem !important;
      flex-grow: 1;
    }

    .book-title {
      font-family: 'DM Serif Display', serif;
      font-size: 1.75rem;
      margin: 0 0 0.5rem 0;
      line-height: 1.2;
    }

    .author-name {
      color: var(--color-muted);
      font-size: 1rem;
      margin-bottom: 2rem;
    }

    .book-meta {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .book-meta span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--color-text);
    }

    .book-meta mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--color-muted);
    }

    .card-actions {
      padding: 1rem 1.5rem !important;
      border-top: 1px solid var(--color-border);
    }

    .empty-state {
      text-align: center;
      padding: 6rem 2rem;
      color: var(--color-muted);
    }

    .large-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 1.5rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--color-text);
      margin-bottom: 0.5rem;
    }

    @media (max-width: 640px) {
      .page-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
      .page-header h1 { font-size: 2.5rem; }
      .books-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  books: Book[] = [];
  loading = true;
  isLibrarian = this.authService.getRole() === 'Librarian';
  
  searchForm = this.fb.group({
    query: ['']
  });

  ngOnInit(): void {
    this.loadBooks();

    this.searchForm.get('query')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchBooks(query || '');
    });
  }

  loadBooks(): void {
    this.loading = true;
    this.bookService.getAll().subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  searchBooks(query: string): void {
    if (!query) {
      this.loadBooks();
      return;
    }
    this.loading = true;
    this.bookService.search({ title: query }).subscribe({
      next: (data) => {
        this.books = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteBook(book: Book): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to delete "${book.title}"?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bookService.delete(book.id).subscribe({
          next: () => {
            this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
            this.loadBooks();
          },
          error: (err) => {
            this.snackBar.open(err.error?.message || 'Failed to delete book', 'Close', { duration: 5000 });
          }
        });
      }
    });
  }
}
