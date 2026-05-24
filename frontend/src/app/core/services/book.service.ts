import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddBookDto, Book, UpdateBookDto } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/books`;

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  search(params: any): Observable<Book[]> {
    let httpParams = new HttpParams();
    if (params.title) httpParams = httpParams.set('title', params.title);
    if (params.author) httpParams = httpParams.set('author', params.author);
    if (params.genre) httpParams = httpParams.set('genre', params.genre);
    if (params.category) httpParams = httpParams.set('category', params.category);
    
    return this.http.get<Book[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  add(dto: AddBookDto): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateBookDto): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
