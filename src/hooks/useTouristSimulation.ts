import { useState, useEffect, useCallback } from 'react';
import { Tourist, AlertEvent } from '@/types/tourist';

// Northeast India bounds (approximate)
const NORTHEAST_INDIA_BOUNDS = {
  north: 26.2000,
  south: 26.1000,
  east: 91.8000,
  west: 91.7000
};

const TOURIST_NAMES = [
  'Rahul Sharma', 'Priya Singh', 'Amit Kumar', 'Sunita Devi', 'Vikash Gupta',
  'Meera Joshi', 'Suresh Yadav', 'Kavita Mishra', 'Rajesh Pandey', 'Neha Verma',
  'Anil Tiwari', 'Pooja Agarwal', 'Mahesh Singh', 'Shanti Dubey', 'Ravi Chandra',
  'Sushma Rao', 'Dinesh Kumar', 'Rekha Sinha', 'Manoj Tripathi', 'Seema Gupta',
  'Ajay Shukla', 'Geeta Sharma', 'Vinod Jain', 'Kiran Devi', 'Deepak Rastogi',
  'Usha Pal', 'Santosh Kumar', 'Madhuri Singh', 'Naresh Mishra', 'Sarita Bajpai',
  'Ramesh Yadav', 'Nirmala Tiwari', 'Ashok Gupta', 'Manju Devi', 'Subhash Jha',
  'Purnima Singh', 'Lakhan Prasad', 'Kamala Soni', 'Bharat Kumar', 'Anita Sharma',
  'Jitendra Pal', 'Vandana Mishra', 'Mohan Lal', 'Pushpa Devi', 'Satish Rao',
  'Sunanda Verma', 'Krishna Kumar', 'Lata Singh', 'Hari Om', 'Sudha Joshi'
];

const generateRandomLocation = () => ({
  lat: NORTHEAST_INDIA_BOUNDS.south + Math.random() * (NORTHEAST_INDIA_BOUNDS.north - NORTHEAST_INDIA_BOUNDS.south),
  lng: NORTHEAST_INDIA_BOUNDS.west + Math.random() * (NORTHEAST_INDIA_BOUNDS.east - NORTHEAST_INDIA_BOUNDS.west)
});

const generatePhoneNumber = () => {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 90000000) + 10000000;
  return `+91 ${prefix}${remaining.toString().substring(0, 8)}`;
};

const generateInitialTourists = (count: number): Tourist[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `T${String(i + 1).padStart(3, '0')}`,
    name: TOURIST_NAMES[i % TOURIST_NAMES.length],
    phone: generatePhoneNumber(),
    location: generateRandomLocation(),
    status: 'SAFE' as const,
    lastUpdate: new Date().toISOString(),
    flaggedByAI: Math.random() < 0.1
  }));
};

export const useTouristSimulation = (initialCount: number = 50) => {
  const [tourists, setTourists] = useState<Tourist[]>(() => generateInitialTourists(initialCount));
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  const moveRandomly = useCallback((tourist: Tourist): Tourist => {
    const maxMovement = 0.0005; // Small movement per update
    const newLat = Math.max(NORTHEAST_INDIA_BOUNDS.south, 
      Math.min(NORTHEAST_INDIA_BOUNDS.north, 
        tourist.location.lat + (Math.random() - 0.5) * maxMovement));
    const newLng = Math.max(NORTHEAST_INDIA_BOUNDS.west,
      Math.min(NORTHEAST_INDIA_BOUNDS.east,
        tourist.location.lng + (Math.random() - 0.5) * maxMovement));

    return {
      ...tourist,
      location: { lat: newLat, lng: newLng },
      lastUpdate: new Date().toISOString()
    };
  }, []);

  const generateSOSAlert = useCallback((tourist: Tourist): AlertEvent => ({
    id: `alert-${Date.now()}-${tourist.id}`,
    touristId: tourist.id,
    type: 'SOS',
    message: `SOS ALERT: ${tourist.name} (${tourist.id}) requires immediate assistance at ${tourist.location.lat.toFixed(4)}, ${tourist.location.lng.toFixed(4)}`,
    timestamp: new Date().toISOString(),
    acknowledged: false
  }), []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTourists(prevTourists => {
        const updatedTourists = prevTourists.map(tourist => {
          // Move all tourists randomly
          let updatedTourist = moveRandomly(tourist);

          // Random chance to change status
          const rand = Math.random();
          
          if (tourist.status === 'SOS') {
            // SOS tourists have a chance to become safe again
            if (rand < 0.3) {
              updatedTourist.status = 'SAFE';
            }
          } else if (tourist.status === 'OUTLIER') {
            // Outliers have a chance to become safe
            if (rand < 0.4) {
              updatedTourist.status = 'SAFE';
            }
          } else if (tourist.status === 'SAFE') {
            // Safe tourists have small chances to become outliers or SOS
            if (rand < 0.005) { // 0.5% chance for SOS
              updatedTourist.status = 'SOS';
              updatedTourist.emergencyDetails = {
                type: ['Medical Emergency', 'Theft', 'Lost', 'Harassment', 'Accident'][Math.floor(Math.random() * 5)],
                reportedAt: new Date().toISOString(),
                description: 'Tourist requested immediate assistance'
              };
              
              // Generate alert
              setTimeout(() => {
                setAlerts(prev => [...prev, generateSOSAlert(updatedTourist)]);
              }, 100);
            } else if (rand < 0.01) { // 1% chance for outlier
              updatedTourist.status = 'OUTLIER';
              updatedTourist.flaggedByAI = true;
            }
          }

          return updatedTourist;
        });

        return updatedTourists;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isRunning, moveRandomly, generateSOSAlert]);

  const sosCount = tourists.filter(t => t.status === 'SOS').length;
  const outlierCount = tourists.filter(t => t.status === 'OUTLIER').length;

  return {
    tourists,
    alerts,
    sosCount,
    outlierCount,
    isRunning,
    setIsRunning,
    acknowledgeAlert
  };
};