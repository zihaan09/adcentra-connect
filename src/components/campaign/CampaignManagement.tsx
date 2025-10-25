import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle, 
  Clock, 
  Play, 
  Pause, 
  FileText, 
  Image, 
  DollarSign,
  Calendar,
  MapPin,
  Building2,
  Eye,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useCampaignStore, useAuthStore, useRFPStore, useProposalStore, useScreenStore, useNotificationStore } from '@/store';
import { formatCurrency, formatDate, formatDateTime, getCampaignStatusColor } from '@/lib/utils';
import { Campaign, CampaignStatus } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { CampaignDaysLeft } from '@/components/timers/CountdownTimer';
import { FinalPaymentModal } from './FinalPaymentModal';

interface CampaignManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

export function CampaignManagementModal({ isOpen, onClose, campaignId }: CampaignManagementModalProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { campaigns, updateCampaign, approveCampaign, completeCampaign } = useCampaignStore();
  const { addNotification } = useNotificationStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreativeUpload, setShowCreativeUpload] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [showFinalPayment, setShowFinalPayment] = useState(false);

  const campaign = campaigns.find(c => c.id === campaignId);
  
  if (!campaign) return null;

  const handleStatusChange = async (newStatus: CampaignStatus) => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (newStatus) {
        case 'live':
          approveCampaign(campaignId);
          break;
        case 'completed':
          completeCampaign(campaignId);
          break;
        default:
          updateCampaign(campaignId, { status: newStatus });
      }
      
      // Notify relevant parties
      addNotification({
        userId: campaign.advertiserId,
        type: 'campaign_update',
        title: `Campaign ${newStatus}`,
        message: `Your campaign "${campaign.campaignName}" status has been updated to ${newStatus}.`,
        read: false,
      });
      
      toast({
        title: "Campaign Updated",
        description: `Campaign status changed to ${newStatus}.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreativeUpload = (files: FileList) => {
    // Simulate file upload
    const uploadedFiles = Array.from(files).map(file => ({
      id: `creative_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // In real app, this would be server URL
      uploadedAt: new Date(),
    }));

    updateCampaign(campaignId, { 
      creatives: [...campaign.creatives, ...uploadedFiles] 
    });

    toast({
      title: "Creatives Uploaded",
      description: `${uploadedFiles.length} creative files uploaded successfully.`,
    });
    
    setShowCreativeUpload(false);
  };

  const handleProofUpload = (files: FileList) => {
    // Simulate proof upload
    const uploadedProofs = Array.from(files).map(file => ({
      id: `proof_${Date.now()}_${Math.random()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date(),
    }));

    updateCampaign(campaignId, { 
      proofOfPlay: [...campaign.proofOfPlay, ...uploadedProofs] 
    });

    toast({
      title: "Proof Uploaded",
      description: `${uploadedProofs.length} proof files uploaded successfully.`,
    });
    
    setShowProofUpload(false);
  };

  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'draft': return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'pending_approval': return <Clock className="h-5 w-5 text-warning" />;
      case 'live': return <Play className="h-5 w-5 text-success" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusActions = () => {
    switch (campaign.status) {
      case 'draft':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreativeUpload(true)}
              className="bg-gradient-primary"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Creatives
            </Button>
          </div>
        );
      case 'pending_approval':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusChange('live')}
              disabled={isProcessing}
              className="bg-success"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Approve & Go Live
                </>
              )}
            </Button>
          </div>
        );
      case 'live':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowProofUpload(true)}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Proof
            </Button>
            <Button
              onClick={() => handleStatusChange('completed')}
              disabled={isProcessing}
              className="bg-primary"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowFinalPayment(true)}
              className="bg-gradient-primary"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Settle Final Payment
            </Button>
          </div>
        );
      case 'settled':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Payment Settled</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Campaign: {campaign.campaignName}
          </DialogTitle>
          <DialogDescription>
            ID: {campaign.id} | Status: <Badge className={getCampaignStatusColor(campaign.status)}>
              {campaign.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <p className="font-medium">{formatCurrency(campaign.budget)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {formatDate(campaign.startDate)} to {formatDate(campaign.endDate)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Screens:</span>
                  <p className="font-medium">{campaign.screens.length} screens</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Days Left:</span>
                  <CampaignDaysLeft endDate={campaign.endDate} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screens */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Screens</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-32 pr-4">
                <div className="space-y-2">
                  {campaign.screens.map((screen, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Screen {index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(screen.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Creatives */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creatives</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.creatives.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4" />
                  <p>No creatives uploaded yet</p>
                  {campaign.status === 'draft' && (
                    <Button
                      onClick={() => setShowCreativeUpload(true)}
                      className="mt-4"
                      variant="outline"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Creatives
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {campaign.creatives.map(creative => (
                    <div key={creative.id} className="border rounded-lg p-3">
                      <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                        {creative.type.startsWith('image/') ? (
                          <img
                            src={creative.url}
                            alt={creative.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{creative.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(creative.uploadedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Proof of Play */}
          {campaign.status === 'live' || campaign.status === 'completed' ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Proof of Play</CardTitle>
              </CardHeader>
              <CardContent>
                {campaign.proofOfPlay.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-4" />
                    <p>No proof uploaded yet</p>
                    {campaign.status === 'live' && (
                      <Button
                        onClick={() => setShowProofUpload(true)}
                        className="mt-4"
                        variant="outline"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Proof
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {campaign.proofOfPlay.map(proof => (
                      <div key={proof.id} className="border rounded-lg p-3">
                        <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                          {proof.type.startsWith('image/') ? (
                            <img
                              src={proof.url}
                              alt={proof.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{proof.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(proof.uploadedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {getStatusActions()}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>

        {/* Creative Upload Modal */}
        {showCreativeUpload && (
          <Dialog open={showCreativeUpload} onOpenChange={setShowCreativeUpload}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Creatives</DialogTitle>
                <DialogDescription>
                  Upload your campaign creative files (images, videos, etc.)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files && handleCreativeUpload(e.target.files)}
                    className="hidden"
                    id="creative-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('creative-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Proof Upload Modal */}
        {showProofUpload && (
          <Dialog open={showProofUpload} onOpenChange={setShowProofUpload}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Proof of Play</DialogTitle>
                <DialogDescription>
                  Upload proof that your campaign is running as expected
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop proof files here, or click to select
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files && handleProofUpload(e.target.files)}
                    className="hidden"
                    id="proof-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('proof-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Final Payment Modal */}
        {showFinalPayment && (
          <FinalPaymentModal
            isOpen={showFinalPayment}
            onClose={() => setShowFinalPayment(false)}
            campaign={campaign}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CampaignListProps {
  campaigns: Campaign[];
  onManage: (campaignId: string) => void;
}

export function CampaignList({ campaigns, onManage }: CampaignListProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
          <option value="settled">Settled</option>
        </select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map(campaign => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
                <Badge className={getCampaignStatusColor(campaign.status)}>
                  {campaign.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screens:</span>
                  <span className="font-medium">{campaign.screens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                  </span>
                </div>
                {campaign.status === 'live' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Left:</span>
                    <CampaignDaysLeft endDate={campaign.endDate} />
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="text-xs text-muted-foreground">
                  Created {formatDate(campaign.createdAt)}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManage(campaign.id)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p>No campaigns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
