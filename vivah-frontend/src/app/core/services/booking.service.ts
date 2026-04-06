import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Booking, CreateBookingDTO, CreateOfflineBookingDTO } from '../../shared/models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  constructor(private api: ApiService) {}

  createBooking(data: CreateBookingDTO) {
    return this.api.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, data);
  }

  getMyBookings() {
    return this.api.get<Booking[]>(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS);
  }

  getHallBookings() {
    return this.api.get<Booking[]>(API_ENDPOINTS.BOOKINGS.HALL_BOOKINGS);
  }

  updateBookingStatus(id: string, status: 'CONFIRMED' | 'REJECTED') {
    return this.api.put<Booking>(API_ENDPOINTS.BOOKINGS.STATUS(id), { status });
  }

  cancelBooking(id: string) {
    return this.api.put<{ msg: string }>(API_ENDPOINTS.BOOKINGS.CANCEL(id), {});
  }

  createOfflineBooking(data: CreateOfflineBookingDTO) {
    return this.api.post<Booking>(API_ENDPOINTS.BOOKINGS.OFFLINE, data);
  }
}