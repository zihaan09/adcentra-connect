import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Upload, 
  Plus, 
  Minus, 
  CheckCircle,
  AlertCircle,
  Building2,
  Clock
} from 'lucide-react';
import { useRFPStore, useProposalStore, useScreenStore, useAuthStore, useNotificationStore } from '@/store';
import { formatCurrency, formatDate, formatDateTime, getRFPStatusColor } from '@/lib/utils';
import { RFP, Screen, Proposal } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const proposalFormSchema = z.object({
  campaignName: z.string().min(1, "Campaign name is required"),
  screens: z.array(z.object({
    screenId: z.string(),
    price: z.coerce.number().min(0, "Price must be positive"),
    rationale: z.string().optional(),
  })).min(1, "At least one screen must be selected"),
  totalAmount: z.coerce.number().min(0, "Total amount must be positive"),
  description: z.string().optional(),
  attachments: z.any().optional(),
});

type ProposalFormValues = z.infer<typeof proposalFormSchema>;

interface ProposalBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
}

export function ProposalBuilderModal({ isOpen, onClose, rfpId }: ProposalBuilderModalProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { getRFPById } = useRFPStore();
  const { createProposal } = useProposalStore();
  const { getScreensByOwner } = useScreenStore();
  const { addNotification } = useNotificationStore();

  const rfp = getRFPById(rfpId);
  const availableScreens = user ? getScreensByOwner(user.id) : [];

  const [selectedScreens, setSelectedScreens] = useState<Array<{
    screenId: string;
    price: number;
    rationale: string;
  }>>([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      campaignName: rfp?.campaignName || '',
      screens: [],
      totalAmount: 0,
      description: '',
    },
  });

  // Filter screens based on RFP requirements
  const filteredScreens = availableScreens.filter(screen => {
    if (!rfp) return false;
    
    // Check if screen is in the required cities
    const cityMatch = rfp.cities.includes(screen.city);
    
    // Check if screen type matches RFP media types
    const typeMatch = rfp.mediaTypes.includes(screen.type);
    
    // Check if screen is available (not booked for the RFP dates)
    const dateMatch = !isScreenBooked(screen.id, new Date(rfp.startDate), new Date(rfp.endDate));
    
    return cityMatch && typeMatch && dateMatch;
  });

  function isScreenBooked(screenId: string, startDate: Date, endDate: Date): boolean {
    // This would check against existing campaigns/holds
    // For now, we'll simulate some screens being booked
    const bookedScreens = ['SCREEN001', 'SCREEN003']; // Simulated booked screens
    return bookedScreens.includes(screenId);
  }

  const handleScreenToggle = (screen: Screen) => {
    const isSelected = selectedScreens.some(s => s.screenId === screen.id);
    
    if (isSelected) {
      setSelectedScreens(prev => prev.filter(s => s.screenId !== screen.id));
    } else {
      setSelectedScreens(prev => [...prev, {
        screenId: screen.id,
        price: screen.pricePerDay,
        rationale: '',
      }]);
    }
  };

  const handlePriceChange = (screenId: string, price: number) => {
    setSelectedScreens(prev => prev.map(s => 
      s.screenId === screenId ? { ...s, price } : s
    ));
  };

  const handleRationaleChange = (screenId: string, rationale: string) => {
    setSelectedScreens(prev => prev.map(s => 
      s.screenId === screenId ? { ...s, rationale } : s
    ));
  };

  useEffect(() => {
    const total = selectedScreens.reduce((sum, screen) => {
      const days = rfp ? Math.ceil((new Date(rfp.endDate).getTime() - new Date(rfp.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 1;
      return sum + (screen.price * days);
    }, 0);
    
    setTotalAmount(total);
    form.setValue('totalAmount', total);
    form.setValue('screens', selectedScreens);
  }, [selectedScreens, rfp, form]);

  const onSubmit = async (data: ProposalFormValues) => {
    if (!user || !rfp) return;

    setIsSubmitting(true);
    
    try {
      const proposalData = {
        screens: selectedScreens.map(s => {
          const screen = availableScreens.find(as => as.id === s.screenId);
          return {
            screenId: s.screenId,
            screenName: screen?.name || '',
            price: s.price,
            rationale: s.rationale || '',
          };
        }),
        rationale: data.description || 'Competitive pricing for selected screens',
        description: data.description || '',
      };

      createProposal(proposalData, rfp.id, user.id, rfp.advertiserId, data.campaignName);

      // Notify advertiser
      addNotification({
        userId: rfp.advertiserId,
        title: "New Proposal Received",
        message: `Media owner ${user.companyName || user.name} has submitted a proposal for your RFP "${rfp.campaignName}".`,
        type: 'proposal_received',
        read: false,
      });

      toast({
        title: "Proposal Submitted",
        description: `Your proposal for ${rfp.campaignName} has been submitted successfully.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!rfp) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Create Proposal for {rfp.campaignName}
          </DialogTitle>
          <DialogDescription>
            RFP ID: {rfp.id} | Submit your proposal with available screens
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* RFP Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RFP Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium">{rfp.type === 'normal' ? 'Brief-Based' : 'Screenwise'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={getRFPStatusColor(rfp.status)}>
                    {rfp.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Budget Range:</span>
                  <p className="font-medium">
                    {rfp.budgetRange 
                      ? `${formatCurrency(rfp.budgetRange.min)} - ${formatCurrency(rfp.budgetRange.max)}`
                      : 'Not specified'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Campaign Dates:</span>
                  <p className="font-medium">
                    {formatDate(rfp.dates.start)} to {formatDate(rfp.dates.end)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Cities:</span>
                  <p className="font-medium">{rfp.cities.join(', ')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Media Types:</span>
                  <p className="font-medium">{rfp.mediaTypes.join(', ')}</p>
                </div>
              </div>
              {rfp.objective && (
                <div>
                  <span className="text-muted-foreground">Objective:</span>
                  <p className="font-medium">{rfp.objective}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaignName">Campaign Name</Label>
            <Input
              id="campaignName"
              {...form.register('campaignName')}
              placeholder="Enter campaign name"
            />
            {form.formState.errors.campaignName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.campaignName.message}
              </p>
            )}
          </div>

          {/* Screen Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Screens</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose from your available screens that match the RFP requirements
              </p>
            </CardHeader>
            <CardContent>
              {filteredScreens.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No screens available that match the RFP requirements. 
                    Check your screen inventory and ensure screens are in the required cities and media types.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-64 pr-4">
                  <div className="space-y-3">
                    {filteredScreens.map(screen => {
                      const isSelected = selectedScreens.some(s => s.screenId === screen.id);
                      const selectedScreen = selectedScreens.find(s => s.screenId === screen.id);
                      
                      return (
                        <div key={screen.id} className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleScreenToggle(screen)}
                            />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">{screen.name}</h4>
                                <Badge variant="outline">{screen.type}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {screen.city}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {screen.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {formatCurrency(screen.pricePerDay)}/day
                                </div>
                              </div>
                              
                              {isSelected && (
                                <div className="space-y-2 pt-2 border-t">
                                  <div className="flex items-center gap-2">
                                    <Label htmlFor={`price-${screen.id}`} className="text-sm">
                                      Custom Price (per day):
                                    </Label>
                                    <Input
                                      id={`price-${screen.id}`}
                                      type="number"
                                      value={selectedScreen?.price || screen.pricePerDay}
                                      onChange={(e) => handlePriceChange(screen.id, parseFloat(e.target.value) || screen.pricePerDay)}
                                      className="w-32"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`rationale-${screen.id}`} className="text-sm">
                                      Rationale (optional):
                                    </Label>
                                    <Textarea
                                      id={`rationale-${screen.id}`}
                                      value={selectedScreen?.rationale || ''}
                                      onChange={(e) => handleRationaleChange(screen.id, e.target.value)}
                                      placeholder="Why this screen is perfect for this campaign..."
                                      className="mt-1"
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Selected Screens Summary */}
          {selectedScreens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proposal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedScreens.map(screen => {
                    const screenData = filteredScreens.find(s => s.id === screen.screenId);
                    const days = Math.ceil((new Date(rfp.endDate).getTime() - new Date(rfp.startDate).getTime()) / (1000 * 60 * 60 * 24));
                    const total = screen.price * days;
                    
                    return (
                      <div key={screen.screenId} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{screenData?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(screen.price)}/day × {days} days
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(total)}</p>
                      </div>
                    );
                  })}
                  <Separator />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Add any additional information about your proposal..."
              rows={3}
            />
          </div>

          {/* File Upload Placeholder */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Upload supporting documents, images, or specifications
              </p>
              <Button variant="outline" size="sm" className="mt-2" disabled>
                Choose Files
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedScreens.length === 0 || isSubmitting}
              className="bg-gradient-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
