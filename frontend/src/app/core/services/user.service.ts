import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  checkValidity(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/validity`);
  }

  getExpiringSoon(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/expiring-soon`);
  }
}
