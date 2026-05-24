import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginDto, RegisterDto, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() { }

  login(credentials: LoginDto): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        const user = this.decodeToken(response.token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, dto);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp ? (decoded.exp * 1000) < Date.now() : false;
      return !isExpired;
    } catch (e) {
      return false;
    }
  }

  getRole(): 'Librarian' | 'Reader' | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private decodeToken(token: string): User {
    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id || decoded.nameid || decoded.sub,
      name: decoded.name || decoded.unique_name,
      email: decoded.email,
      role: decoded.role,
      isActive: true,
      phoneNo: decoded.phoneNo,
      libraryCardExpiry: decoded.libraryCardExpiry
    };
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr && this.isLoggedIn()) {
      return JSON.parse(userStr);
    }
    return null;
  }
}
