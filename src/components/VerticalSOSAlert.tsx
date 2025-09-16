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
  const activeAlerts = alerts.filter(alert => !alert.acknowledged);

  const [collapsedState, setCollapsedState] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (activeAlerts.length > 0) {
      onPlaySound();
    }
  }, [activeAlerts.length, onPlaySound]);

  if (activeAlerts.length === 0) return null;

  const colors = [
    "bg-red-600/90",
    "bg-green-600/90",
    "bg-blue-600/90",
    "bg-purple-600/90",
    "bg-yellow-600/90",
    "bg-pink-600/90",
    "bg-teal-600/90",
  ];

  return (
    <div className="fixed top-4 right-4 z-[1100]">
      {/* Scrollable Wrapper */}
      <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2">
        {activeAlerts.map((alert, index) => {
          const isCollapsed = collapsedState[alert.id] || false;
          const colorClass = colors[index % colors.length];

          return (
            <div
              key={alert.id}
              className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}
            >
              {/* Collapsed State */}
              {isCollapsed && (
                <div className="bg-black text-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <Bell className="h-5 w-5 animate-bounce" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setCollapsedState(prev => ({ ...prev, [alert.id]: false }))
                      }
                      className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Expanded State */}
              {!isCollapsed && (
                <div className="bg-black text-white rounded-lg shadow-2xl">
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 animate-bounce text-red-500" />
                        <div>
                          <h3 className="text-lg font-bold">SOS ALERT</h3>
                          <p className="text-xs opacity-90">Emergency reported</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCollapsedState(prev => ({ ...prev, [alert.id]: true }))
                          }
                          className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAcknowledge(alert.id)}
                          className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Alert Info */}
                    <div className={`${colorClass} rounded-md p-3 text-white`}>
                      <div className="text-sm font-medium mb-1 line-clamp-2">
                        {alert.message.replace('SOS ALERT: ', '')}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs opacity-90">
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
        })}
      </div>
    </div>
  );
};

export default VerticalSOSAlert;