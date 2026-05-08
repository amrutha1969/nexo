import { Business, QueueToken } from '../types';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'City General Hospital',
    category: 'Hospital',
    address: '123 Health Ave, Downtown',
    location: { lat: 40.7128, lng: -74.0060 },
    avgServiceTime: 15,
    currentToken: 19,
    lastToken: 45,
    ownerId: 'owner1',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d3b9a8ec817f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b2',
    name: 'Global Trust Bank',
    category: 'Bank',
    address: '456 Finance St, Midtown',
    location: { lat: 40.7306, lng: -73.9352 },
    avgServiceTime: 8,
    currentToken: 112,
    lastToken: 140,
    ownerId: 'owner2',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'b3',
    name: 'The Royal Salon',
    category: 'Salon',
    address: '789 Style Rd, Uptown',
    location: { lat: 40.7589, lng: -73.9851 },
    avgServiceTime: 30,
    currentToken: 5,
    lastToken: 12,
    ownerId: 'owner3',
    status: 'Open',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_TOKENS: QueueToken[] = [
  {
    id: 't1',
    businessId: 'b1',
    userId: 'user1',
    tokenNumber: 28,
    status: 'Waiting',
    createdAt: new Date().toISOString(),
  }
];
