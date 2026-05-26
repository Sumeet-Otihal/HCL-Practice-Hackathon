import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <header class="main-header">
      <div class="header-container">
        <div class="brand" routerLink="/">
          Library Management
        </div>

        <nav class="desktop-nav" *ngIf="authService.currentUser$ | async as user; else guestNav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/books" routerLinkActive="active">Books</a>
          
          <ng-container *ngIf="user.role === 'Librarian'">
            <a routerLink="/borrow" routerLinkActive="active">Borrow</a>
            <a routerLink="/users" routerLinkActive="active">Users</a>
            <a routerLink="/payments" routerLinkActive="active">Payments</a>
            <a routerLink="/requests" routerLinkActive="active">Requests</a>
          </ng-container>
          
          <ng-container *ngIf="user.role === 'Reader'">
            <a routerLink="/my-borrows" routerLinkActive="active">My Borrows</a>
            <a routerLink="/my-requests" routerLinkActive="active">My Requests</a>
          </ng-container>

          <div class="user-menu">
            <span class="user-name">{{ user.name }}</span>
            <button class="sign-out-btn" (click)="logout()">Sign out</button>
          </div>
        </nav>

        <ng-template #guestNav>
          <nav class="desktop-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/books" routerLinkActive="active">Books</a>
            <a routerLink="/login" routerLinkActive="active">Login</a>
            <a routerLink="/register" routerLinkActive="active">Register</a>
          </nav>
        </ng-template>

        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <mat-icon>{{ isMobileMenuOpen ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>

      <!-- Mobile Nav -->
      <div class="mobile-nav" [class.open]="isMobileMenuOpen" (click)="toggleMobileMenu()">
        <nav *ngIf="authService.currentUser$ | async as user; else guestMobileNav">
          <a routerLink="/">Home</a>
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/books">Books</a>
          <a routerLink="/borrow" *ngIf="user.role === 'Librarian'">Borrow</a>
          <a routerLink="/users" *ngIf="user.role === 'Librarian'">Users</a>
          <a routerLink="/payments" *ngIf="user.role === 'Librarian'">Payments</a>
          <a routerLink="/requests" *ngIf="user.role === 'Librarian'">Requests</a>
          <a routerLink="/my-borrows" *ngIf="user.role === 'Reader'">My Borrows</a>
          <a routerLink="/my-requests" *ngIf="user.role === 'Reader'">My Requests</a>
          <button class="sign-out-btn" (click)="logout()">Sign out</button>
        </nav>
        <ng-template #guestMobileNav>
          <nav>
            <a routerLink="/">Home</a>
            <a routerLink="/books">Books</a>
            <a routerLink="/login">Login</a>
            <a routerLink="/register">Register</a>
          </nav>
        </ng-template>
      </div>
    </header>
  `,
  styles: [`
    .main-header {
      height: 60px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .header-container {
      max-width: 1200px;
      height: 100%;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-family: 'DM Serif Display', serif;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--color-text);
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .desktop-nav a {
      text-decoration: none;
      color: var(--color-text);
      font-size: 0.9rem;
      font-weight: 400;
      position: relative;
      padding: 0.5rem 0;
    }

    .desktop-nav a.active {
      color: var(--color-accent);
    }

    .desktop-nav a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: var(--color-accent);
    }

    .desktop-nav a:hover {
      color: var(--color-accent);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-left: 1rem;
      padding-left: 1.5rem;
      border-left: 1px solid var(--color-border);
    }

    .user-name {
      color: var(--color-muted);
      font-size: 0.9rem;
    }

    .sign-out-btn {
      background: none;
      border: none;
      color: var(--color-text);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      cursor: pointer;
      padding: 0;
    }

    .sign-out-btn:hover {
      color: var(--color-accent);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
    }

    .mobile-nav {
      display: none;
      position: fixed;
      top: 60px;
      left: 0;
      width: 100%;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      padding: 2rem;
      transform: translateY(-100%);
      transition: transform 0.3s ease-in-out;
    }

    .mobile-nav.open {
      display: block;
      transform: translateY(0);
    }

    .mobile-nav nav {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .mobile-nav a {
      text-decoration: none;
      color: var(--color-text);
      font-size: 1.1rem;
    }

    @media (max-width: 1024px) {
      .desktop-nav { display: none; }
      .mobile-menu-btn { display: block; }
      .header-container { padding: 0 1.5rem; }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  isMobileMenuOpen = false;

  logout(): void {
    this.authService.logout();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
