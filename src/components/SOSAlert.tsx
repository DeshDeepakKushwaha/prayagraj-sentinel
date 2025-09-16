import React, { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertEvent } from "@/types/tourist";

interface SOSAlertProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
  onClose: () => void; // new close handler
}

const SOSAlert: React.FC<SOSAlertProps> = ({
  alerts,
  onAcknowledge,
  onClose,
}) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);

  // live clock
  useEffect(() => {
    const interval = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <div className="rounded-2xl bg-emergency text-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold tracking-wide">SOS Alerts</h2>
              <p className="text-xs opacity-80">
                {activeAlerts.length} active alert
                {activeAlerts.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono opacity-80">{time}</span>
            {/* Close Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-transparent border-white text-white hover:bg-white hover:text-emergency rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="px-5 py-4 space-y-3">
          {activeAlerts.slice(0, 3).map((alert) => (
            <div
              key={alert.id}
              className="flex justify-between items-center rounded-lg bg-white/10 px-4 py-2"
            >
              <p className="text-sm font-medium">{alert.message}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAcknowledge(alert.id)}
                className="bg-transparent border-white text-white hover:bg-white hover:text-emergency rounded-lg"
              >
                ACK
              </Button>
            </div>
          ))}

          {activeAlerts.length > 3 && (
            <p className="text-center text-xs opacity-70">
              +{activeAlerts.length - 3} more alerts...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-3 border-t border-white/20 bg-white/5">
          <Button
            size="sm"
            className="bg-white text-emergency font-medium hover:bg-gray-100 rounded-lg"
          >
            Dispatch Unit
          </Button>
          <Button
            size="sm"
            className="bg-white text-emergency font-medium hover:bg-gray-100 rounded-lg"
          >
            Call Tourist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SOSAlert;
