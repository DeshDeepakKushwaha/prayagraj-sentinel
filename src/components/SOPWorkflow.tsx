import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Phone, MapPin, Users, FileText, Radio, Siren, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertEvent, Tourist } from '@/types/tourist';

interface SOPWorkflowProps {
  activeAlerts: AlertEvent[];
  tourists: Tourist[];
  onAcknowledge: (alertId: string) => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  timeLimit: number;
  completed: boolean;
  action?: () => void;
}

const SOPWorkflow: React.FC<SOPWorkflowProps> = ({ activeAlerts, tourists, onAcknowledge }) => {
  const [activeWorkflows, setActiveWorkflows] = useState<{ [alertId: string]: WorkflowStep[] }>({});
  const [timers, setTimers] = useState<{ [alertId: string]: number }>({});
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    activeAlerts.forEach(alert => {
      if (!activeWorkflows[alert.id] && alert.type === 'SOS') {
        const tourist = tourists.find(t => t.id === alert.touristId);
        initializeWorkflow(alert, tourist);
      }
    });
  }, [activeAlerts]);

  const initializeWorkflow = (alert: AlertEvent, tourist?: Tourist) => {
    const workflow: WorkflowStep[] = [
      { id: 'log-data', title: 'Log Critical Data', description: 'Capture tourist ID, GPS, timestamp, battery level', icon: <FileText className="h-4 w-4" />, timeLimit: 5, completed: false, action: () => completeStep(alert.id, 'log-data') },
      { id: 'trigger-alarms', title: 'Trigger Dashboard Alarms', description: 'Activate audible & visual alerts', icon: <Siren className="h-4 w-4" />, timeLimit: 10, completed: false, action: () => completeStep(alert.id, 'trigger-alarms') },
      { id: 'display-context', title: 'Display Contextual Intelligence', description: 'Show tourist profile, travel history, risk zone data', icon: <Eye className="h-4 w-4" />, timeLimit: 10, completed: false, action: () => completeStep(alert.id, 'display-context') },
      { id: 'notify-contacts', title: 'Automated Notifications', description: 'SMS to emergency contacts, alert field units', icon: <Radio className="h-4 w-4" />, timeLimit: 15, completed: false, action: () => completeStep(alert.id, 'notify-contacts') },
      { id: 'acknowledge-alert', title: 'Operator Acknowledgment', description: 'Human operator must acknowledge within Golden Hour', icon: <CheckCircle className="h-4 w-4" />, timeLimit: 120, completed: false, action: () => { completeStep(alert.id, 'acknowledge-alert'); onAcknowledge(alert.id); } },
      { id: 'assess-situation', title: 'Situation Assessment', description: 'Analyze location, movement, available resources', icon: <MapPin className="h-4 w-4" />, timeLimit: 30, completed: false, action: () => completeStep(alert.id, 'assess-situation') },
      { id: 'direct-contact', title: 'Attempt Direct Contact', description: 'Call tourist mobile number and log outcome', icon: <Phone className="h-4 w-4" />, timeLimit: 60, completed: false, action: () => completeStep(alert.id, 'direct-contact') },
      { id: 'dispatch-units', title: 'Dispatch Resources', description: 'Send appropriate field units based on assessment', icon: <Users className="h-4 w-4" />, timeLimit: 180, completed: false, action: () => completeStep(alert.id, 'dispatch-units') }
    ];

    setActiveWorkflows(prev => ({ ...prev, [alert.id]: workflow }));
    setTimers(prev => ({ ...prev, [alert.id]: 0 }));

    const timer = setInterval(() => {
      setTimers(prev => ({ ...prev, [alert.id]: (prev[alert.id] || 0) + 1 }));
    }, 1000);

    // Auto-complete automated steps
    setTimeout(() => completeStep(alert.id, 'log-data'), 2000);
    setTimeout(() => completeStep(alert.id, 'trigger-alarms'), 3000);
    setTimeout(() => completeStep(alert.id, 'display-context'), 4000);
    setTimeout(() => completeStep(alert.id, 'notify-contacts'), 6000);

    return () => clearInterval(timer);
  };

  const completeStep = (alertId: string, stepId: string) => {
    setActiveWorkflows(prev => ({
      ...prev,
      [alertId]: prev[alertId]?.map(step => step.id === stepId ? { ...step, completed: true } : step) || []
    }));
  };

  const getStepStatus = (step: WorkflowStep, elapsedTime: number) => {
    if (step.completed) return 'completed';
    if (elapsedTime > step.timeLimit) return 'overdue';
    if (elapsedTime > step.timeLimit * 0.8) return 'warning';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'overdue': return 'text-emergency';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  if (Object.keys(activeWorkflows).length === 0) return null;

  return (
    <div className="fixed z-[1100]">
      {Object.entries(activeWorkflows).map(([alertId, workflow]) => {
        const alert = activeAlerts.find(a => a.id === alertId);
        const tourist = tourists.find(t => t.id === alert?.touristId);
        const elapsedTime = timers[alertId] || 0;
        const completedSteps = workflow.filter(s => s.completed).length;
        const progress = (completedSteps / workflow.length) * 100;

        return (
          <div key={alertId} className={`fixed left-4 bottom-12 z-[1100] transition-all duration-300 ${minimized ? "w-12" : "w-72"}`}>
            <Card className="bg-card/95 backdrop-blur-sm relative">
              <CardHeader className="pb-2 flex justify-between items-center">
                {!minimized && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-emergency" />
                    <CardTitle className="text-sm">SOP Workflow</CardTitle>
                  </div>
                )}
                <Button
                  className="w-8 h-8 rounded-full bg-red-600 text-black flex items-center justify-center text-sm"
                  onClick={() => setMinimized(!minimized)}
                >
                  {minimized ? ">" : "<"}
                </Button>
              </CardHeader>

              {!minimized && (
                <>
                  <div className="space-y-1 px-2 pb-1">
                    <div className="text-xs text-muted-foreground">
                      Tourist: {tourist?.name} ({alert?.touristId})
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {completedSteps}/{workflow.length} steps completed
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono">
                      <Clock className="h-3 w-3" />
                      {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, "0")}
                    </div>
                  </div>

                  <CardContent className="p-2 pt-0">
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {workflow.map((step, index) => {
                        const status = getStepStatus(step, elapsedTime);
                        const isActive = index === 0 || workflow[index - 1]?.completed;

                        return (
                          <div
                            key={step.id}
                            className={`flex items-center gap-2 p-1 rounded-md transition-colors ${
                              step.completed
                                ? "bg-success/10"
                                : status === "overdue"
                                ? "bg-emergency/10"
                                : status === "warning"
                                ? "bg-warning/10"
                                : isActive
                                ? "bg-primary/10"
                                : "bg-muted/30"
                            }`}
                          >
                            <div className={`flex-shrink-0 ${getStatusColor(status)}`}>
                              {step.completed ? <CheckCircle className="h-4 w-4" /> : step.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{step.title}</div>
                              <div className="text-xs text-muted-foreground">{step.description}</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {status !== "completed" && (
                                <Badge
                                  variant={
                                    status === "overdue"
                                      ? "destructive"
                                      : status === "warning"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {step.timeLimit}s
                                </Badge>
                              )}
                              {step.action && isActive && !step.completed && (
                                <Button
                                  size="sm"
                                  variant={status === "overdue" ? "destructive" : "default"}
                                  onClick={step.action}
                                  className="text-xs px-1 h-5"
                                >
                                  {step.id === "acknowledge-alert" ? "ACK" : "Done"}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default SOPWorkflow;