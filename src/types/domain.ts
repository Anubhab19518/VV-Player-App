export type SkillLevel = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface UserProfiles {
  player: boolean;
  organizer: boolean;
  umpire?: boolean;
  official?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  authProvider: 'EMAIL_OTP' | 'GOOGLE' | 'PASSWORD';
  profiles: UserProfiles;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerProfile {
  userId?: string;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  phone?: string | null;
  city?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  profilePhotoUrl?: string | null;
}

export interface PositionPreference {
  id?: string;
  positionId: string;
  priority: number;
}

export interface PlayerSport {
  id?: string;
  sportId: string;
  level: SkillLevel;
  positions?: PositionPreference[];
}

export interface UserWithDetails extends User {
  playerProfile?: PlayerProfile | null;
  sports?: PlayerSport[];
}

export interface CricketPosition {
  id: string;
  sportId: string;
  name: string;
  category: 'BATTING' | 'BOWLING' | 'ALL_ROUND';
  subRoles: string[];
}

export interface Sport {
  id: string;
  name: string;
  isActive: boolean;
  config?: Record<string, any>;
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  organizerId?: string;
  sportId: string;
  teamFormationMode?: string;
  format?: string;
  status: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxTeams?: number;
  maxPlayers?: number;
}
