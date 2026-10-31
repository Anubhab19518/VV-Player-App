import { request } from './client';
import { ApiResponse } from '../types/api';
import { CricketPosition, Sport } from '../types/domain';

export const sportsApi = {
  async getSports(): Promise<Sport[]> {
    const res = await request<ApiResponse<Sport[]>>('/sports', {
      method: 'GET',
      skipAuth: true,
    });
    return res.data || [];
  },

  async getCricketPositions(): Promise<CricketPosition[]> {
    const res = await request<ApiResponse<CricketPosition[]>>('/sports/cricket/positions', {
      method: 'GET',
      skipAuth: true,
    });
    return res.data || [];
  },
};
