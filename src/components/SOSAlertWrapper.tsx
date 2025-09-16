import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertEvent } from "@/types/tourist";
import SOSAlert from "./SOSAlert";

interface SOSAlertWrapperProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
  onPlaySound: () => void;
}

const SOSAlertWrapper: React.FC<SOSAlertWrapperProps> = ({
  alerts,
  onAcknowledge,
  onPlaySound,
}) => {
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged);
  const [showPanel, setShowPanel] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show toast if new alert comes in while panel is closed
  useEffect(() => {
    if (activeAlerts.length > 0 && !showPanel) {
      setShowToast(true);
      onPlaySound();
    } else {
      setShowToast(false);
    }
  }, [activeAlerts.length, showPanel, onPlaySound]);

  return (
    <>
      {/* Small notification toast */}
      {showToast && activeAlerts[0] && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-emergency text-white rounded-lg shadow-lg p-4 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm">
              We got an alert:{" "}
              <span className="font-semibold">{activeAlerts[0].message}</span>
            </p>
          </div>
          <Button
            size="sm"
            className="ml-3 bg-white text-emergency hover:bg-gray-100"
            onClick={() => {
              setShowPanel(true);
              setShowToast(false);
            }}
          >
            View
          </Button>
        </div>
      )}

      {/* Full SOS Panel */}
      {showPanel && (
        <SOSAlert
          alerts={alerts}
          onAcknowledge={onAcknowledge}
          onClose={() => setShowPanel(false)}
        />
      )}
    </>
  );
};

export default SOSAlertWrapper;
