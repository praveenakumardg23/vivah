export type UserRole = 'USER' | 'OWNER' | 'AGENT' | 'ADMIN';

export interface User {
  _id: string;
  name?: string;
  phone: string;
  email?: string;
  isEmailVerified: boolean;
  role: UserRole;
  profileCompleted: boolean;
  createdAt: string;
}