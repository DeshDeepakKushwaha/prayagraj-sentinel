import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { Tourist, RiskZone } from '@/types/tourist';
import { useTouristSimulation } from '@/hooks/useTouristSimulation';
import VerticalSOSAlert from './VerticalSOSAlert';
import CompactPoliceControls from './CompactPoliceControls';
import SOPWorkflow from './SOPWorkflow';
import riskZonesData from '@/data/riskZones.json';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Northeast India center coordinates (Guwahati)
const NORTHEAST_CENTER = [26.1445, 91.7362] as const;

// Audio context for SOS alerts
let audioContext: AudioContext | null = null;
const playSOSAlert = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Create a simple beep sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800; // High frequency beep
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn('Could not play audio alert:', error);
  }
};

const PoliceDashboard: React.FC = () => {
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.CircleMarker }>({});
  
  const {
    tourists,
    alerts,
    sosCount,
    outlierCount,
    acknowledgeAlert
  } = useTouristSimulation(50);

  const riskZones = riskZonesData.riskZones as RiskZone[];

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView(NORTHEAST_CENTER, 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add risk zones
    riskZones.forEach(zone => {
      const color = getRiskZoneColor(zone.riskLevel);
      L.polygon(zone.coordinates.map(coord => [coord[0], coord[1]]) as L.LatLngExpression[], {
        color,
        fillColor: color,
        fillOpacity: 0.2,
        weight: 2,
        opacity: 0.8
      }).bindPopup(`
        <div>
          <strong>${zone.name}</strong><br/>
          <span style="background: ${color}; color: white; padding: 2px 4px; border-radius: 3px; font-size: 10px;">
            ${zone.riskLevel} RISK
          </span><br/>
          <small>${zone.description}</small>
        </div>
      `).addTo(map);
    });

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update tourist markers
  useEffect(() => {
    if (!leafletMapRef.current) return;

    const map = leafletMapRef.current;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    tourists.forEach(tourist => {
      const marker = L.circleMarker([tourist.location.lat, tourist.location.lng], {
        color: getTouristColor(tourist),
        fillColor: getTouristColor(tourist),
        fillOpacity: tourist.status === 'SOS' ? 0.8 : 0.6,
        weight: tourist.status === 'SOS' ? 3 : 2,
        opacity: 1,
        radius: getTouristRadius(tourist),
        className: tourist.status === 'SOS' ? 'emergency-pulse' : ''
      });

      marker.bindPopup(`
        <div style="min-width: 250px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong>${tourist.name}</strong>
            <span style="background: ${getTouristColor(tourist)}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
              ${tourist.status}
            </span>
          </div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>ID:</strong> ${tourist.id}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Phone:</strong> ${tourist.phone}</div>
          <div style="font-size: 12px; margin-bottom: 4px;"><strong>Location:</strong> ${tourist.location.lat.toFixed(6)}, ${tourist.location.lng.toFixed(6)}</div>
          <div style="font-size: 12px; margin-bottom: 8px;"><strong>Last Update:</strong> ${new Date(tourist.lastUpdate).toLocaleTimeString()}</div>
          ${tourist.emergencyDetails ? `
            <div style="background: #fee2e2; border: 1px solid #fecaca; padding: 8px; border-radius: 4px; margin-bottom: 8px;">
              <div style="font-size: 11px; font-weight: bold; color: #dc2626; margin-bottom: 2px;">
                Emergency: ${tourist.emergencyDetails.type}
              </div>
              <div style="font-size: 10px; color: #6b7280;">
                ${tourist.emergencyDetails.description}
              </div>
            </div>
          ` : ''}
          <button onclick="window.selectTourist('${tourist.id}')" style="background: #2563eb; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
            Select Tourist
          </button>
        </div>
      `);

      marker.on('click', () => {
        setSelectedTourist(tourist);
      });

      marker.addTo(map);
      markersRef.current[tourist.id] = marker;
    });

    // Global function for popup buttons
    (window as any).selectTourist = (touristId: string) => {
      const tourist = tourists.find(t => t.id === touristId);
      if (tourist) setSelectedTourist(tourist);
    };

  }, [tourists]);

  const getTouristColor = (tourist: Tourist): string => {
    switch (tourist.status) {
      case 'SOS':
        return '#ef4444'; // Emergency red
      case 'OUTLIER':
        return '#f59e0b'; // Warning yellow
      case 'INACTIVE':
        return '#6b7280'; // Gray
      default:
        return '#10b981'; // Success green
    }
  };

  const getTouristRadius = (tourist: Tourist): number => {
    return tourist.status === 'SOS' ? 12 : 8;
  };

  const getRiskZoneColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="h-screen w-screen relative overflow-hidden">
      {/* Vertical SOS Alert System */}
      <VerticalSOSAlert 
        alerts={alerts}
        onAcknowledge={acknowledgeAlert}
        onPlaySound={playSOSAlert}
      />

      {/* Main Map */}
      <div 
        ref={mapRef} 
        className="h-full w-full"
        style={{ zIndex: 1 }}
      />

      {/* Compact Police Control Panel */}
      <CompactPoliceControls
        selectedTourist={selectedTourist}
        totalTourists={tourists.length}
        sosCount={sosCount}
        outlierCount={outlierCount}
      />

      {/* SOP Workflow */}
      <SOPWorkflow
        activeAlerts={alerts.filter(alert => !alert.acknowledged)}
        tourists={tourists}
        onAcknowledge={acknowledgeAlert}
      />

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t p-3 z-[1000]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="font-mono text-primary">POLICE COMMAND CENTER</span>
              <span className="ml-4 text-muted-foreground">Northeast India Tourist Monitoring System</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs">Safe: {tourists.length - sosCount - outlierCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-xs">Outliers: {outlierCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emergency rounded-full animate-pulse"></div>
              <span className="text-xs">SOS: {sosCount}</span>
            </div>
            <div className="text-muted-foreground font-mono text-xs">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;