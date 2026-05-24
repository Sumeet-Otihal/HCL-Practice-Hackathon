import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookService } from '../../../core/services/book.service';

function notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const date = new Date(control.value);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date <= today ? null : { futureDate: true };
}

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-spinner *ngIf="loading"></mat-spinner>
          
          <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
            <div class="form-grid">
              <!-- Shared fields or specific ones based on mode -->
              <mat-form-field appearance="outline" *ngIf="!isEditMode">
                <mat-label>Title</mat-label>
                <input matInput formControlName="title" placeholder="Enter book title">
                <mat-error *ngIf="bookForm.get('title')?.hasError('required')">Title is required</mat-error>
                <mat-error *ngIf="bookForm.get('title')?.hasError('maxlength')">Max 200 characters</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="!isEditMode">
                <mat-label>Author Name</mat-label>
                <input matInput formControlName="authorName" placeholder="Enter author name">
                <mat-error *ngIf="bookForm.get('authorName')?.hasError('required')">Author is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="!isEditMode">
                <mat-label>Published Date</mat-label>
                <input matInput [matDatepicker]="pubPicker" formControlName="publishedDate">
                <mat-datepicker-toggle matIconSuffix [for]="pubPicker"></mat-datepicker-toggle>
                <mat-datepicker #pubPicker></mat-datepicker>
                <mat-error *ngIf="bookForm.get('publishedDate')?.hasError('required')">Published date is required</mat-error>
                <mat-error *ngIf="bookForm.get('publishedDate')?.hasError('futureDate')">Date cannot be in the future</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="!isEditMode">
                <mat-label>Volumes</mat-label>
                <input matInput type="number" formControlName="volumes">
                <mat-error *ngIf="bookForm.get('volumes')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="bookForm.get('volumes')?.hasError('min')">Min 1</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input matInput type="number" formControlName="price">
                <mat-error *ngIf="bookForm.get('price')?.hasError('required')">Price is required</mat-error>
                <mat-error *ngIf="bookForm.get('price')?.hasError('min')">Must be > 0</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>No. of Copies</mat-label>
                <input matInput type="number" formControlName="noOfCopies">
                <mat-error *ngIf="bookForm.get('noOfCopies')?.hasError('required')">Required</mat-error>
                <mat-error *ngIf="bookForm.get('noOfCopies')?.hasError('min')">Min value {{ isEditMode ? 0 : 1 }}</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" *ngIf="!isEditMode">
                <mat-label>Genre</mat-label>
                <input matInput formControlName="genre">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <input matInput formControlName="category">
              </mat-form-field>

              <div class="toggle-container">
                <mat-slide-toggle formControlName="isAvailable">Is Available</mat-slide-toggle>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" routerLink="/books">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid">
                {{ isEditMode ? 'Update Book' : 'Add Book' }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    mat-card {
      width: 100%;
      max-width: 800px;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 20px;
    }
    .full-width {
      grid-column: span 2;
    }
    .toggle-container {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    @media (max-width: 600px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  bookForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    authorName: ['', Validators.required],
    publishedDate: ['', [Validators.required, notFutureDateValidator]],
    volumes: [1, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(1)]],
    noOfCopies: [1, [Validators.required, Validators.min(1)]],
    genre: [''],
    category: [''],
    isAvailable: [true]
  });

  isEditMode = false;
  bookId?: number;
  loading = false;

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBook();
      // Adjust validators for Edit mode
      this.bookForm.get('noOfCopies')?.setValidators([Validators.required, Validators.min(0)]);
    }
  }

  loadBook(): void {
    this.loading = true;
    this.bookService.getById(this.bookId!).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          title: book.title,
          authorName: book.authorName,
          publishedDate: book.publishedDate as any,
          volumes: book.volumes,
          price: book.price,
          noOfCopies: book.noOfCopies,
          genre: book.genre,
          category: book.category,
          isAvailable: book.isAvailable
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Error loading book', 'Close', { duration: 3000 });
        this.router.navigate(['/books']);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) return;

    const data = this.bookForm.value;
    if (this.isEditMode) {
      const updateDto = {
        price: data.price!,
        category: data.category!,
        isAvailable: data.isAvailable!,
        noOfCopies: data.noOfCopies!
      };
      this.bookService.update(this.bookId!, updateDto as any).subscribe({
        next: () => {
          this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Update failed', 'Close', { duration: 5000 })
      });
    } else {
      this.bookService.add(data as any).subscribe({
        next: () => {
          this.snackBar.open('Book added successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/books']);
        },
        error: (err) => this.snackBar.open(err.error?.message || 'Creation failed', 'Close', { duration: 5000 })
      });
    }
  }
}
