export type UserRole = 'Customer' | 'BusinessOwner';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  fcmToken?: string;
}

export type BusinessCategory = 'Hospital' | 'Bank' | 'Salon' | 'Temple' | 'Government';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  avgServiceTime: number;
  currentToken: number;
  lastToken: number;
  ownerId: string;
  status: 'Open' | 'Closed';
  imageUrl?: string;
}

export type TokenStatus = 'Waiting' | 'Called' | 'Completed' | 'Cancelled';

export interface QueueToken {
  id: string;
  businessId: string;
  userId: string;
  tokenNumber: number;
  status: TokenStatus;
  createdAt: string;
  estimatedServiceTime?: string;
  departureTime?: string;
}
