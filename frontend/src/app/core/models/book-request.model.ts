export interface BookRequest {
  id: number;
  userId: number;
  title: string;
  author: string;
  genre: string;
  status: 'Pending' | 'Fulfilled' | 'Rejected';
  requestedAt: string;
}

export interface AddRequestDto {
  title: string;
  author: string;
  genre: string;
}
