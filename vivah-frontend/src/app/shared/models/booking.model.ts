export interface Booking {
  _id: string;
  hall: {
    _id: string;
    name: string;
    location: string;
    images: string[];
    price: number;
  };
  user: {
    _id: string;
    name: string;
    phone: string;
  };
  date: string;
  guests: number;
  notes?: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  isOfflineBooking: boolean;
  offlineGuestName?: string;
  offlineGuestPhone?: string;
  createdAt: string;
}

export interface CreateBookingDTO {
  hallId: string;
  date: string;
  guests: number;
  notes?: string;
}

export interface CreateOfflineBookingDTO {
  hallId: string;
  date: string;
  guests: number;
  offlineGuestName: string;
  offlineGuestPhone: string;
  notes?: string;
}