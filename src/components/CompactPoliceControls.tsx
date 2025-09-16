import React, { useState } from 'react';
import { Shield, FileText, Radio, Users, MapPin, AlertCircle, Phone, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  outlierCount 
}) => {
  const [efirrDialogOpen, setEfirDialogOpen] = useState(false);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-[1000] w-72 space-y-3">
      {/* Compact Stats Panel */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Command Status</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold text-primary">{totalTourists}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-lg font-bold text-success">{totalTourists - sosCount - outlierCount}</div>
              <div className="text-xs text-muted-foreground">Safe</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emergency">{sosCount}</div>
              <div className="text-xs text-muted-foreground">SOS</div>
            </div>
            <div>
              <div className="text-lg font-bold text-warning">{outlierCount}</div>
              <div className="text-xs text-muted-foreground">Outliers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Tourist Info */}
      {selectedTourist && (
        <Card className="bg-card/95 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Selected Tourist</span>
              </div>
              <Badge variant={
                selectedTourist.status === 'SOS' ? 'destructive' :
                selectedTourist.status === 'OUTLIER' ? 'secondary' : 'default'
              } className="text-xs">
                {selectedTourist.status}
              </Badge>
            </div>
            
            <div className="space-y-1 mb-3">
              <div className="text-sm font-medium">{selectedTourist.name}</div>
              <div className="text-xs text-muted-foreground">ID: {selectedTourist.id}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {selectedTourist.location.lat.toFixed(4)}, {selectedTourist.location.lng.toFixed(4)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Dialog open={efirrDialogOpen} onOpenChange={setEfirDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    E-FIR
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Generate E-FIR</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Tourist ID</label>
                        <Input value={selectedTourist?.id || ''} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input value={selectedTourist?.name || ''} disabled />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input value={selectedTourist?.phone || ''} disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Latitude</label>
                        <Input value={selectedTourist?.location.lat.toFixed(6) || ''} disabled />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Longitude</label>
                        <Input value={selectedTourist?.location.lng.toFixed(6) || ''} disabled />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Incident Type</label>
                      <Input placeholder="e.g., Medical Emergency, Theft, Lost" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Detailed incident description..." rows={4} />
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
              
              <Button size="sm" variant="outline" className="text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="bg-card/95 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Quick Actions</span>
          </div>
          <div className="space-y-2">
            <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full text-xs">
                  <Radio className="h-3 w-3 mr-1" />
                  Broadcast
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Broadcast to Area</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Message Type</label>
                    <select className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md">
                      <option>Safety Advisory</option>
                      <option>Emergency Alert</option>
                      <option>General Information</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Type your broadcast message..." rows={4} />
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
            
            <Button size="sm" variant="outline" className="w-full text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompactPoliceControls;