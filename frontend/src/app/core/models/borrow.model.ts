export interface BorrowedBook {
  id: number;
  bookId: number;
  bookTitle: string;
  userId: number;
  userName: string;
  issuingDate: string;
  returnDate: string;
  isReturned: boolean;
  phoneNo: string;
}

export interface BorrowBookDto {
  bookId: number;
  userId: number;
  returnDate: string;
  phoneNo: string;
}
