import React, { useState } from 'react';
import { Shield, FileText, Radio, Users, MapPin, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tourist } from '@/types/tourist';

interface CompactPoliceControlsProps {
  selectedTourist: Tourist | null;
  totalTourists: number;
  sosCount: number;
  outlierCount: number;
}

const CompactPoliceControls: React.FC<CompactPoliceControlsProps> = ({
  selectedTourist,
  totalTourists,
  sosCount,
  outlierCount,
}) => {
  const [efirrDialogOpen, setEfirDialogOpen] = useState(false);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="absolute top-20 left-4 z-[1000] w-72">
      {/* Toggle Button */}
      <Button
        size="sm"
        className="w-10 h-10 mb-2 p-0 flex items-center justify-center bg-red-600 text-black rounded-full"
        onClick={() => setMinimized(!minimized)}
      >
        {minimized ? '>' : '<'}
      </Button>

      {!minimized && (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {/* Compact Stats Panel */}
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardContent className="p-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold">Command Status</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center">
                <div>
                  <div className="text-base font-bold text-primary">{totalTourists}</div>
                  <div className="text-[10px] text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-base font-bold text-success">
                    {totalTourists - sosCount - outlierCount}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Safe</div>
                </div>
                <div>
                  <div className="text-base font-bold text-emergency">{sosCount}</div>
                  <div className="text-[10px] text-muted-foreground">SOS</div>
                </div>
                <div>
                  <div className="text-base font-bold text-warning">{outlierCount}</div>
                  <div className="text-[10px] text-muted-foreground">Outliers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Tourist Info */}
          {selectedTourist && (
            <Card className="bg-card/95 backdrop-blur-sm">
              <CardContent className="p-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary" />
                    <span className="text-xs font-semibold">Selected Tourist</span>
                  </div>
                  <Badge
                    variant={
                      selectedTourist.status === 'SOS'
                        ? 'destructive'
                        : selectedTourist.status === 'OUTLIER'
                        ? 'secondary'
                        : 'default'
                    }
                    className="text-[10px]"
                  >
                    {selectedTourist.status}
                  </Badge>
                </div>

                <div className="space-y-1 mb-2">
                  <div className="text-xs font-medium">{selectedTourist.name}</div>
                  <div className="text-[10px] text-muted-foreground">ID: {selectedTourist.id}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <Dialog open={efirrDialogOpen} onOpenChange={setEfirDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="text-[10px] h-6">
                        <FileText className="h-3 w-3 mr-1" />
                        E-FIR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Generate E-FIR</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Tourist ID</label>
                            <Input value={selectedTourist?.id || ''} disabled />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Name</label>
                            <Input value={selectedTourist?.name || ''} disabled />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Phone</label>
                          <Input value={selectedTourist?.phone || ''} disabled />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Latitude</label>
                            <Input value={selectedTourist?.location.lat.toFixed(6) || ''} disabled />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Longitude</label>
                            <Input value={selectedTourist?.location.lng.toFixed(6) || ''} disabled />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Incident Type</label>
                          <Input placeholder="e.g., Medical Emergency, Theft, Lost" />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Description</label>
                          <Textarea placeholder="Detailed incident description..." rows={3} />
                        </div>
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => setEfirDialogOpen(false)}>
                            Generate E-FIR
                          </Button>
                          <Button variant="outline" onClick={() => setEfirDialogOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline" className="text-[10px] h-6">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="bg-card/95 backdrop-blur-sm">
            <CardContent className="p-2">
              <div className="flex items-center gap-1 mb-1">
                <Radio className="h-3 w-3 text-primary" />
                <span className="text-xs font-semibold">Quick Actions</span>
              </div>
              <div className="space-y-1">
                <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="w-full text-[10px] h-6">
                      <Radio className="h-3 w-3 mr-1" />
                      Broadcast
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Broadcast to Area</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm">
                      <div>
                        <label className="text-xs font-medium">Message Type</label>
                        <select className="w-full mt-1 px-2 py-1 bg-input border border-border rounded-md text-sm">
                          <option>Safety Advisory</option>
                          <option>Emergency Alert</option>
                          <option>General Information</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium">Message</label>
                        <Textarea placeholder="Type your broadcast message..." rows={3} />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => setBroadcastDialogOpen(false)}>
                          Send Broadcast
                        </Button>
                        <Button variant="outline" onClick={() => setBroadcastDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline" className="w-full text-[10px] h-6">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompactPoliceControls;