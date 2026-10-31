import { request } from './client';
import { ApiResponse, SendOtpResponseData, VerifyOtpResponseData } from '../types/api';
import { UserWithDetails } from '../types/domain';

export const authApi = {
  async sendOtp(email: string): Promise<SendOtpResponseData> {
    const res = await request<ApiResponse<SendOtpResponseData>>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to send OTP');
  },

  async verifyOtp(email: string, otp: string, name?: string): Promise<VerifyOtpResponseData> {
    const body: Record<string, any> = { email, otp };
    if (name && name.trim().length > 0) {
      body.name = name.trim();
    }
    const res = await request<ApiResponse<VerifyOtpResponseData>>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(body),
      skipAuth: true,
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to verify OTP');
  },

  async getMe(): Promise<UserWithDetails> {
    const res = await request<ApiResponse<UserWithDetails>>('/me', {
      method: 'GET',
    });
    if (res.status === 'success' && res.data) {
      return res.data;
    }
    throw new Error(res.message || 'Failed to fetch current user session');
  },
};
