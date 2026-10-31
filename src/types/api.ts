import { User } from './domain';

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  code?: string;
  statusCode?: number;
}

export interface SendOtpRequest {
  email: string;
}

export interface SendOtpResponseData {
  message: string;
  email: string;
  otp?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  name?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  token?: string;
}

export interface VerifyOtpResponseData extends AuthTokens {
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type RefreshTokenResponseData = AuthTokens;

export interface UpdateUserRequest {
  name: string;
  email?: string;
}

export interface UpdatePlayerProfileRequest {
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  phone?: string | null;
  city?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  profilePhotoUrl?: string | null;
}

export interface SetPlayerSportRequest {
  sportId: string;
  positions: {
    positionId: string;
    priority: number;
  }[];
}
