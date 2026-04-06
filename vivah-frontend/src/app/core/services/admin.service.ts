import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  getAllUsers() {
    return this.api.get<User[]>(API_ENDPOINTS.ADMIN.USERS);
  }

  registerAgent(phone: string, name?: string) {
    return this.api.post<{ msg: string; user: User }>(
      API_ENDPOINTS.ADMIN.REGISTER_AGENT,
      { phone, name }
    );
  }

  registerOwner(phone: string, name?: string) {
    return this.api.post<{ msg: string; user: User }>(
      API_ENDPOINTS.ADMIN.REGISTER_OWNER,
      { phone, name }
    );
  }

  updateUserRole(id: string, role: string) {
    return this.api.put<User>(API_ENDPOINTS.ADMIN.UPDATE_ROLE(id), { role });
  }

  getAllAgents() {
    return this.api.get<User[]>(API_ENDPOINTS.ADMIN.AGENTS);
  }

  getAllOwners() {
    return this.api.get<User[]>(API_ENDPOINTS.ADMIN.OWNERS);
  }
}