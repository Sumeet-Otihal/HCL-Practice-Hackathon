import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardStatus',
  standalone: true
})
export class CardStatusPipe implements PipeTransform {
  transform(expiryDate: string): string {
    if (!expiryDate) return 'Unknown';
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Expired';
    } else if (diffDays <= 7) {
      return 'Expiring Soon';
    } else {
      return 'Valid';
    }
  }
}
