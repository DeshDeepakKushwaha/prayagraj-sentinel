export interface Tourist {
  id: string;
  name: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'SAFE' | 'SOS' | 'OUTLIER' | 'INACTIVE';
  lastUpdate: string;
  flaggedByAI?: boolean;
  emergencyDetails?: {
    type: string;
    reportedAt: string;
    description: string;
  };
}

export interface RiskZone {
  id: string;
  name: string;
  coordinates: number[][];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface AlertEvent {
  id: string;
  touristId: string;
  type: 'SOS' | 'OUTLIER' | 'ZONE_BREACH';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}