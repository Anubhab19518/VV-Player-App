import { request } from './client';
import { ApiResponse, SetPlayerSportRequest, UpdatePlayerProfileRequest, UpdateUserRequest } from '../types/api';
import { PlayerProfile, PlayerSport, User } from '../types/domain';

export const userApi = {
  async updateUser(userId: string, data: UpdateUserRequest): Promise<User> {
    const res = await request<ApiResponse<User>>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update user account');
  },

  async updatePlayerProfile(userId: string, data: UpdatePlayerProfileRequest): Promise<PlayerProfile> {
    const res = await request<ApiResponse<PlayerProfile>>(`/users/${userId}/player-profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to update player profile');
  },

  async getPlayerProfile(userId: string): Promise<PlayerProfile | null> {
    const res = await request<ApiResponse<PlayerProfile>>(`/users/${userId}/player-profile`, {
      method: 'GET',
    });
    return res.data || null;
  },

  async setPlayerSport(userId: string, data: SetPlayerSportRequest): Promise<PlayerSport> {
    const res = await request<ApiResponse<PlayerSport>>(`/users/${userId}/sports`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to register cricket sport preferences');
  },

  async getPlayerSports(userId: string): Promise<PlayerSport[]> {
    const res = await request<ApiResponse<PlayerSport[]>>(`/users/${userId}/sports`, {
      method: 'GET',
    });
    return res.data || [];
  },
};
