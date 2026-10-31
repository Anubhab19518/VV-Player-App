import { request } from './client';
import { ApiResponse } from '../types/api';
import { Tournament } from '../types/domain';

export const tournamentsApi = {
  async getTournaments(): Promise<Tournament[]> {
    try {
      const res = await request<ApiResponse<Tournament[]>>('/tournaments', {
        method: 'GET',
        skipAuth: true,
      });
      return res.data || [];
    } catch {
      return [];
    }
  },
};
