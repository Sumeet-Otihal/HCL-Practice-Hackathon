export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Librarian' | 'Reader';
  isActive: boolean;
  phoneNo: string;
  libraryCardExpiry: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNo: string;
  libraryCardExpiry: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
