import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="back-link">
        <button mat-button routerLink="/books">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Collection</span>
        </button>
      </div>

      <div class="loading-overlay" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <div class="detail-content" *ngIf="!loading && book">
        <div class="book-visual">
          <div class="book-cover-placeholder">
            <mat-icon>menu_book</mat-icon>
          </div>
        </div>

        <div class="book-info">
          <div class="info-header">
            <span class="category">{{ book.category }}</span>
            <span class="status-badge" [class.available]="book.isAvailable" [class.unavailable]="!book.isAvailable">
              {{ book.isAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>

          <h1 class="book-title">{{ book.title }}</h1>
          <p class="author">by {{ book.authorName }}</p>

          <div class="specs-grid">
            <div class="spec-item">
              <span class="label">Genre</span>
              <span class="value">{{ book.genre }}</span>
            </div>
            <div class="spec-item">
              <span class="label">Price</span>
              <span class="value">{{ book.price | currency }}</span>
            </div>
            <div class="spec-item">
              <span class="label">Availability</span>
              <span class="value">{{ book.noOfCopies }} copies</span>
            </div>
            <div class="spec-item">
              <span class="label">Published</span>
              <span class="value">{{ book.publishedDate | date }}</span>
            </div>
            <div class="spec-item">
              <span class="label">Volumes</span>
              <span class="value">{{ book.volumes }}</span>
            </div>
          </div>

          <div class="actions">
            <button mat-flat-button color="primary" class="large-btn" [disabled]="!book.isAvailable">
              Borrow Book
            </button>
            <button mat-stroked-button class="large-btn">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }

    .back-link {
      margin-bottom: 3rem;
    }

    .back-link button {
      padding-left: 0;
      color: var(--color-muted);
    }

    .detail-content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 5rem;
      align-items: start;
    }

    .book-cover-placeholder {
      width: 100%;
      aspect-ratio: 2/3;
      background-color: var(--color-accent-light);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
    }

    .book-cover-placeholder mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: var(--color-accent);
      opacity: 0.5;
    }

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .category {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-muted);
      font-weight: 500;
    }

    .status-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.25rem 1rem;
      border-radius: 20px;
    }

    .status-badge.available { color: var(--color-accent); background: var(--color-accent-light); }
    .status-badge.unavailable { color: var(--color-danger); background: #fdecea; }

    .book-title {
      font-size: 3.5rem;
      margin: 0 0 1rem 0;
      line-height: 1.1;
    }

    .author {
      font-size: 1.25rem;
      color: var(--color-muted);
      margin-bottom: 3.5rem;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5rem;
      margin-bottom: 4rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid var(--color-border);
    }

    .spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .spec-item .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--color-muted);
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    .spec-item .value {
      font-size: 1.1rem;
      font-weight: 400;
    }

    .actions {
      display: flex;
      gap: 1.5rem;
    }

    .large-btn {
      padding: 0.75rem 2.5rem !important;
      font-size: 1rem !important;
    }

    .loading-overlay {
      display: flex;
      justify-content: center;
      padding: 100px 0;
    }

    @media (max-width: 900px) {
      .detail-content { grid-template-columns: 1fr; gap: 3rem; }
      .book-visual { max-width: 300px; margin: 0 auto; }
      .book-title { font-size: 2.5rem; }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  
  book?: Book;
  loading = true;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getById(id).subscribe({
      next: (data) => {
        this.book = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
