import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, ChevronRight, ChevronLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertEvent } from '@/types/tourist';

interface VerticalSOSAlertProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
  onPlaySound: () => void;
}

const VerticalSOSAlert: React.FC<VerticalSOSAlertProps> = ({ alerts, onAcknowledge, onPlaySound }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    <div className={`fixed top-4 right-4 z-[1100] transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Collapsed State */}
      {isCollapsed && (
        <div className="bg-emergency text-emergency-foreground rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between">
            <Bell className="h-5 w-5 animate-bounce" />
            <span className="text-sm font-bold">{activeAlerts.length}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {!isCollapsed && (
        <div className="bg-emergency text-emergency-foreground rounded-lg shadow-2xl">
          <div className="alert-flash p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
                <div>
                  <h3 className="text-lg font-bold">SOS ALERTS</h3>
                  <p className="text-xs opacity-90">
                    {activeAlerts.length} active emergency{activeAlerts.length > 1 ? ' alerts' : ' alert'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(true)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => activeAlerts.forEach(alert => onAcknowledge(alert.id))}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Alert List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activeAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="bg-white/10 rounded-md p-3">
                  <div className="text-sm font-medium mb-1 line-clamp-2">
                    {alert.message.replace('SOS ALERT: ', '')}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-75">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAcknowledge(alert.id)}
                      className="h-6 text-xs px-2 text-white hover:bg-white/20"
                    >
                      ACK
                    </Button>
                  </div>
                </div>
              ))}
              {activeAlerts.length > 5 && (
                <div className="text-center text-sm opacity-75 py-2">
                  +{activeAlerts.length - 5} more alerts...
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/20">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Dispatch Unit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Call Tourist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerticalSOSAlert;