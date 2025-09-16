import React, { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertEvent } from '@/types/tourist';

interface SOSAlertProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
  onPlaySound: () => void;
}

const SOSAlert: React.FC<SOSAlertProps> = ({ alerts, onAcknowledge, onPlaySound }) => {
  const [isVisible, setIsVisible] = useState(false);
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  useEffect(() => {
    if (activeAlerts.length > 0) {
      setIsVisible(true);
      onPlaySound();
    } else {
      setIsVisible(false);
    }
  }, [activeAlerts.length, onPlaySound]);

  if (!isVisible || activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-emergency text-emergency-foreground shadow-2xl">
      <div className="alert-flash px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 animate-bounce" />
            <div>
              <h2 className="text-xl font-bold">EMERGENCY ALERT</h2>
              <p className="text-sm opacity-90">
                {activeAlerts.length} active SOS alert{activeAlerts.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono">
              {new Date().toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => activeAlerts.forEach(alert => onAcknowledge(alert.id))}
              className="bg-transparent border-white text-white hover:bg-white hover:text-emergency"
            >
              <X className="h-4 w-4 mr-1" />
              Acknowledge All
            </Button>
          </div>
        </div>
        
        <div className="mt-3 space-y-2">
          {activeAlerts.slice(0, 3).map(alert => (
            <div key={alert.id} className="bg-white/10 rounded px-3 py-2 flex justify-between items-center">
              <span className="font-mono text-sm">{alert.message}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAcknowledge(alert.id)}
                className="bg-transparent border-white text-white hover:bg-white hover:text-emergency"
              >
                ACK
              </Button>
            </div>
          ))}
          {activeAlerts.length > 3 && (
            <p className="text-center text-sm opacity-75">
              +{activeAlerts.length - 3} more alerts...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SOSAlert;