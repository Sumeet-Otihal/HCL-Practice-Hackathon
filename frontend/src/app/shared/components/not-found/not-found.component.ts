import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  template: `
    <div class="not-found-container">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <button mat-raised-button color="primary" routerLink="/">Go Home</button>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      padding: 100px 20px;
    }
    h1 {
      font-size: 120px;
      margin: 0;
      color: #3f51b5;
    }
    p {
      font-size: 24px;
      margin-bottom: 30px;
    }
  `]
})
export class NotFoundComponent {}
