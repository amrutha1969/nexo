/**
 * NEXO Smart Arrival Engine
 * Calculates the optimal departure time based on queue status, traffic, and distance.
 */

export interface ArrivalEngineInput {
  currentToken: number;
  userToken: number;
  avgServiceTime: number; // in minutes
  travelTimeMinutes: number; // from Maps API (Distance + Traffic)
  safetyBufferMinutes: number; // user preference or default
}

export interface ArrivalEngineOutput {
  expectedTokenTime: Date;
  suggestedDepartureTime: Date;
  peopleAhead: number;
  waitTimeMinutes: number;
}

export const calculateSmartArrival = (input: ArrivalEngineInput): ArrivalEngineOutput => {
  const { currentToken, userToken, avgServiceTime, travelTimeMinutes, safetyBufferMinutes } = input;

  const peopleAhead = Math.max(0, userToken - currentToken);
  const waitTimeMinutes = peopleAhead * avgServiceTime;
  
  const now = new Date();
  const expectedTokenTime = new Date(now.getTime() + waitTimeMinutes * 60000);
  
  // Suggested Departure Time = Expected Token Time - Travel Time - Safety Buffer
  const totalLeadTimeMinutes = travelTimeMinutes + safetyBufferMinutes;
  const suggestedDepartureTime = new Date(expectedTokenTime.getTime() - totalLeadTimeMinutes * 60000);

  return {
    expectedTokenTime,
    suggestedDepartureTime,
    peopleAhead,
    waitTimeMinutes
  };
};

/**
 * Mock function to simulate traffic-aware travel time
 * In a real app, this would call Google Distance Matrix API
 */
export const getMockTravelTime = (distanceKm: number, trafficLevel: 'low' | 'medium' | 'high'): number => {
  const baseSpeed = 40; // km/h
  const baseTime = (distanceKm / baseSpeed) * 60;
  
  const multipliers = {
    low: 1.0,
    medium: 1.3,
    high: 1.8
  };
  
  return Math.round(baseTime * multipliers[trafficLevel]);
};
