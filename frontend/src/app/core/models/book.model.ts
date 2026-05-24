export interface Book {
  id: number;
  title: string;
  authorName: string;
  publishedDate: string;
  volumes: number;
  price: number;
  noOfCopies: number;
  genre: string;
  category: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddBookDto {
  title: string;
  authorName: string;
  publishedDate: string;
  volumes: number;
  price: number;
  noOfCopies: number;
  genre: string;
  category: string;
  isAvailable: boolean;
}

export interface UpdateBookDto {
  price: number;
  category: string;
  isAvailable: boolean;
  noOfCopies: number;
}
