import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddRequestDto, BookRequest } from '../models/book-request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/requests`;

  getAll(): Observable<BookRequest[]> {
    return this.http.get<BookRequest[]>(this.apiUrl);
  }

  getMyRequests(): Observable<BookRequest[]> {
    return this.http.get<BookRequest[]>(`${this.apiUrl}/my-requests`);
  }

  add(dto: AddRequestDto): Observable<BookRequest> {
    return this.http.post<BookRequest>(this.apiUrl, dto);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}
