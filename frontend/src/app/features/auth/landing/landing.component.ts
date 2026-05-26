import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="landing-page">
      <!-- Section 1: Hero -->
      <section class="hero-section">
        <div class="hero-bg-overlay"></div>
        <div class="hero-content">
          <h1>Every book.<br><span class="accent-text">Always found.</span></h1>
          <p class="subtitle">A clean, simple system for managing your library — borrowing, tracking, and requesting, all in one place.</p>
          <div class="hero-actions">
            <button mat-stroked-button routerLink="/books" class="large-btn secondary">Browse Books</button>
            <ng-container *ngIf="!authService.isLoggedIn(); else loggedInHero">
              <button mat-flat-button color="primary" routerLink="/login" class="large-btn">Sign In</button>
            </ng-container>
            <ng-template #loggedInHero>
              <button mat-flat-button color="primary" routerLink="/dashboard" class="large-btn">Go to Dashboard</button>
            </ng-template>
          </div>
        </div>
        <div class="bottom-divider"></div>
      </section>

      <!-- Section 2: Features -->
      <section class="features-section">
        <div class="container">
          <div class="features-grid">
            <div class="feature-card color-1">
              <div class="icon-wrapper">
                <mat-icon class="material-symbols-outlined">menu_book</mat-icon>
              </div>
              <h3>Browse the collection</h3>
              <p>Search and filter books by title, author, genre, or category with our intuitive interface.</p>
            </div>
            <div class="feature-card color-2">
              <div class="icon-wrapper">
                <mat-icon class="material-symbols-outlined">swap_horiz</mat-icon>
              </div>
              <h3>Borrow with ease</h3>
              <p>Request books and track your borrowing history. We handle the logistics so you can focus on reading.</p>
            </div>
            <div class="feature-card color-3">
              <div class="icon-wrapper">
                <mat-icon class="material-symbols-outlined">notifications_active</mat-icon>
              </div>
              <h3>Stay reminded</h3>
              <p>Get timely notifications before your library card expires or a book is overdue. Never miss a deadline.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: CTA -->
      <section class="cta-section">
        <div class="cta-container">
          <h2>Ready to get started?</h2>
          <p>Join thousands of readers and start your journey today.</p>
          
          <ng-container *ngIf="!authService.isLoggedIn(); else loggedInCta">
            <div class="cta-actions">
              <button mat-flat-button color="primary" routerLink="/register" class="large-btn">Create an account</button>
            </div>
            <p class="muted">Already have an account? <a routerLink="/login">Sign in</a></p>
          </ng-container>
          
          <ng-template #loggedInCta>
            <div class="cta-actions">
              <button mat-flat-button color="primary" routerLink="/dashboard" class="large-btn">Go to My Dashboard</button>
            </div>
          </ng-template>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      display: flex;
      flex-direction: column;
    }

    /* Hero Section */
    .hero-section {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: var(--color-bg);
      background-image: radial-gradient(circle at 50% 50%, #f1f0ec 0%, var(--color-bg) 100%);
      position: relative;
      text-align: center;
      padding: 0 2rem;
      overflow: hidden;
    }

    .hero-bg-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIgZmlsbD0iI2UwZGVkOCIvPgo8L3N2Zz4=');
      opacity: 0.5;
      pointer-events: none;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .hero-content h1 {
      font-size: 5.5rem;
      line-height: 1;
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
    }

    .accent-text {
      color: var(--color-accent);
      font-style: italic;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--color-muted);
      max-width: 650px;
      margin: 0 auto 3.5rem;
      line-height: 1.6;
    }

    .hero-actions {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }

    .bottom-divider {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-border);
    }

    /* Features Section */
    .features-section {
      background-color: var(--color-surface);
      padding: 10rem 2rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5rem;
    }

    .feature-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
    }

    .icon-wrapper {
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      margin-bottom: 2rem;
      transition: transform 0.3s ease;
    }

    .feature-card:hover .icon-wrapper {
      transform: translateY(-5px);
    }

    .color-1 .icon-wrapper { background-color: var(--color-accent-light); color: var(--color-accent); }
    .color-2 .icon-wrapper { background-color: var(--color-secondary-light); color: var(--color-secondary); }
    .color-3 .icon-wrapper { background-color: var(--color-info-light); color: var(--color-info); }

    .icon-wrapper mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .feature-card h3 {
      font-size: 1.6rem;
      margin-bottom: 1.25rem;
      letter-spacing: -0.01em;
    }

    .feature-card p {
      font-size: 1rem;
      color: var(--color-muted);
      line-height: 1.7;
    }

    /* CTA Section */
    .cta-section {
      background-color: var(--color-bg);
      padding: 8rem 2rem;
      text-align: center;
    }

    .cta-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-section h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .cta-section p {
      color: var(--color-muted);
      margin-bottom: 2.5rem;
    }

    .cta-actions {
      margin-bottom: 2rem;
    }

    .muted {
      font-size: 0.95rem;
      color: var(--color-muted);
    }

    .muted a {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: 500;
    }

    .large-btn {
      padding: 0.8rem 2.5rem !important;
      font-size: 1.05rem !important;
      font-weight: 500 !important;
    }

    .large-btn.secondary {
      border-color: var(--color-text) !important;
      color: var(--color-text) !important;
    }

    /* Responsiveness */
    @media (max-width: 1024px) {
      .hero-content h1 { font-size: 4.5rem; }
      .features-grid { gap: 3rem; }
    }

    @media (max-width: 768px) {
      .features-grid { grid-template-columns: 1fr; gap: 4rem; }
      .feature-card { align-items: center; text-align: center; }
      .hero-content h1 { font-size: 3.5rem; }
    }

    @media (max-width: 640px) {
      .hero-section { height: auto; padding: 8rem 1rem; }
      .hero-content h1 { font-size: 2.8rem; }
      .hero-actions { flex-direction: column; width: 100%; max-width: 300px; margin: 0 auto; gap: 1rem; }
      .cta-section { padding: 6rem 1.5rem; }
    }
  `]
})
export class LandingComponent {
  authService = inject(AuthService);
}
