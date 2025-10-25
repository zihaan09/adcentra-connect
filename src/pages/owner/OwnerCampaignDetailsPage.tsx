import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Building2,
  Upload,
  CheckCircle,
  Clock,
  Play,
  Pause,
  FileText,
  Image,
  Eye,
  Download,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useCampaignStore, useAuthStore, useRFPStore, useProposalStore, useScreenStore } from '@/store';
import { formatCurrency, formatDate, formatDateTime, getCampaignStatusColor } from '@/lib/utils';
import { CampaignManagementModal } from '@/components/campaign/CampaignManagement';
import { ChatModal } from '@/components/chat/ChatSystem';

export default function OwnerCampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { campaigns, getCampaignsByOwner } = useCampaignStore();
  const { getRFPById } = useRFPStore();
  const { proposals } = useProposalStore();
  const { screens } = useScreenStore();
  
  const [showManagement, setShowManagement] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const userCampaigns = getCampaignsByOwner(user?.id || '');
  const campaign = userCampaigns.find(c => c.id === id);
  const rfp = campaign ? getRFPById(campaign.rfpId) : null;
  const proposal = campaign ? proposals.find(p => p.id === campaign.proposalId) : null;
  
  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Campaign Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested campaign could not be found.</p>
          <Button onClick={() => navigate('/owner/campaigns')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = () => {
    switch (campaign.status) {
      case 'draft': return <FileText className="h-5 w-5 text-muted-foreground" />;
      case 'pending_approval': return <Clock className="h-5 w-5 text-warning" />;
      case 'live': return <Play className="h-5 w-5 text-success" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'settled': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const getStatusActions = () => {
    switch (campaign.status) {
      case 'pending_approval':
        return (
          <Button
            onClick={() => setShowManagement(true)}
            className="bg-gradient-primary"
          >
            <Play className="mr-2 h-4 w-4" />
            Approve & Go Live
          </Button>
        );
      case 'live':
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => setShowManagement(true)}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Proof
            </Button>
            <Button
              onClick={() => setShowChat(true)}
              variant="outline"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Campaign Completed</span>
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
        return (
          <Button
            onClick={() => setShowManagement(true)}
            variant="outline"
          >
            <Eye className="mr-2 h-4 w-4" />
            Manage Campaign
          </Button>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/owner/campaigns')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.campaignName}</h1>
            <p className="text-muted-foreground">Campaign #{campaign.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getCampaignStatusColor(campaign.status)}>
            {getStatusIcon()}
            <span className="ml-1">{campaign.status.toUpperCase()}</span>
          </Badge>
          {getStatusActions()}
        </div>
      </div>
      
      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Campaign Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Screens</p>
                <p className="text-sm text-muted-foreground">
                  {campaign.screens.length} screens
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Value</p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(campaign.totalAmount)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Advertiser</p>
                <p className="text-sm text-muted-foreground">
                  {campaign.advertiserId}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Advance Received</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(campaign.advanceAmount)}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Balance Pending</p>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(campaign.balanceAmount)}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Revenue Progress</p>
              <p className="text-lg font-semibold">
                {Math.round((campaign.advanceAmount / campaign.totalAmount) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="screens" className="space-y-4">
        <TabsList>
          <TabsTrigger value="screens">
            Screens ({campaign.screens.length})
          </TabsTrigger>
          <TabsTrigger value="creatives">
            Creatives ({campaign.creatives?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="proof">
            Proof of Play ({campaign.proofOfPlay?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="timeline">
            Timeline
          </TabsTrigger>
        </TabsList>
        
        {/* Screens Tab */}
        <TabsContent value="screens" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.screens.map((screen, index) => {
              const screenDetails = screens.find(s => s.id === screen.screenId);
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{screen.screenName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {screenDetails && (
                      <>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{screenDetails.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{screenDetails.city}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{formatCurrency(screen.price)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Creatives Tab */}
        <TabsContent value="creatives" className="space-y-4">
          {campaign.creatives && campaign.creatives.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaign.creatives.map((creative) => (
                <Card key={creative.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{creative.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDate(creative.uploadedAt.toISOString())}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No creatives uploaded</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Proof of Play Tab */}
        <TabsContent value="proof" className="space-y-4">
          {campaign.proofOfPlay && campaign.proofOfPlay.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaign.proofOfPlay.map((proof) => (
                <Card key={proof.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{proof.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDate(proof.uploadedAt.toISOString())}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No proof of play uploaded</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Campaign Created</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(campaign.createdAt)}</p>
                  </div>
                </div>
                
                {campaign.approvedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Campaign Approved & Live</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(campaign.approvedAt)}</p>
                    </div>
                  </div>
                )}
                
                {campaign.completedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Campaign Completed</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(campaign.completedAt)}</p>
                    </div>
                  </div>
                )}
                
                {campaign.settledAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment Settled</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(campaign.settledAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {showManagement && (
        <CampaignManagementModal
          isOpen={showManagement}
          onClose={() => setShowManagement(false)}
          campaignId={campaign.id}
        />
      )}
      
      {showChat && (
        <ChatModal
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          rfpId={campaign.rfpId}
          advertiserId={campaign.advertiserId}
          ownerId={campaign.ownerId}
        />
      )}
    </div>
  );
}
