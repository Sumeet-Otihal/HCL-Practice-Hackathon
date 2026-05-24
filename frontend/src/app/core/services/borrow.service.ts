import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BorrowBookDto, BorrowedBook } from '../models/borrow.model';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/borrow`;

  getAll(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(this.apiUrl);
  }

  getOverdue(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(`${this.apiUrl}/overdue`);
  }

  getMyBorrows(): Observable<BorrowedBook[]> {
    return this.http.get<BorrowedBook[]>(`${this.apiUrl}/my-borrows`);
  }

  borrow(dto: BorrowBookDto): Observable<BorrowedBook> {
    return this.http.post<BorrowedBook>(this.apiUrl, dto);
  }

  return(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/return`, {});
  }
}
