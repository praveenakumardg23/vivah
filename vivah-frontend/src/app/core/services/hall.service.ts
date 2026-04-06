import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Hall, HallFormData } from '../../shared/models/hall.model';

@Injectable({ providedIn: 'root' })
export class HallService {
  constructor(private api: ApiService) {}

  getAllHalls(params?: { city?: string; location?: string; date?: string }) {
    return this.api.get<Hall[]>(API_ENDPOINTS.HALLS.LIST, params);
  }

  getHallById(id: string) {
    return this.api.get<Hall>(API_ENDPOINTS.HALLS.DETAIL(id));
  }

  getAgentHalls() {
    return this.api.get<Hall[]>(API_ENDPOINTS.HALLS.AGENT_HALLS);
  }

  getOwnerHalls() {
    return this.api.get<Hall[]>(API_ENDPOINTS.HALLS.OWNER_HALLS);
  }

  createHall(data: HallFormData) {
    return this.api.post<Hall>(API_ENDPOINTS.HALLS.CREATE, data);
  }

  updateHall(id: string, data: Partial<HallFormData>) {
    return this.api.put<Hall>(API_ENDPOINTS.HALLS.UPDATE(id), data);
  }

  deleteHall(id: string) {
    return this.api.delete<{ msg: string }>(API_ENDPOINTS.HALLS.DELETE(id));
  }

  updateBlockedDates(id: string, date: string, action: 'add' | 'remove') {
    return this.api.put<Hall>(API_ENDPOINTS.HALLS.BLOCKED_DATES(id), { date, action });
  }
}