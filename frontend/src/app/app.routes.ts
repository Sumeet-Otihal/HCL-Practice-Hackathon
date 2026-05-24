import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/auth/landing/landing.component').then(m => m.LandingComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'books', 
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/books/book-list/book-list.component').then(m => m.BookListComponent) 
      },
      { 
        path: 'new', 
        loadComponent: () => import('./features/books/book-form/book-form.component').then(m => m.BookFormComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      },
      { 
        path: ':id', 
        loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent) 
      },
      { 
        path: ':id/edit', 
        loadComponent: () => import('./features/books/book-form/book-form.component').then(m => m.BookFormComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      }
    ]
  },
  { 
    path: 'borrow', 
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/borrow/borrow-list/borrow-list.component').then(m => m.BorrowListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      },
      { 
        path: 'overdue', 
        loadComponent: () => import('./features/borrow/overdue-list/overdue-list.component').then(m => m.OverdueListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      }
    ]
  },
  { 
    path: 'my-borrows', 
    loadComponent: () => import('./features/borrow/my-borrows/my-borrows.component').then(m => m.MyBorrowsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Reader'] }
  },
  { 
    path: 'users', 
    children: [
      { 
        path: '', 
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      },
      { 
        path: ':id', 
        loadComponent: () => import('./features/users/user-detail/user-detail.component').then(m => m.UserDetailComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['Librarian'] }
      }
    ]
  },
  { 
    path: 'payments', 
    loadComponent: () => import('./features/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Librarian'] }
  },
  { 
    path: 'requests', 
    loadComponent: () => import('./features/requests/request-list/request-list.component').then(m => m.RequestListComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Librarian'] }
  },
  { 
    path: 'my-requests', 
    loadComponent: () => import('./features/requests/my-requests/my-requests.component').then(m => m.MyRequestsComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Reader'] }
  },
  { 
    path: '**', 
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) 
  }
];
