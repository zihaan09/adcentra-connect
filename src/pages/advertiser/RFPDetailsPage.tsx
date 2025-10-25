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
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  MessageSquare,
  CreditCard,
  Eye,
  CheckCircle,
  AlertTriangle,
  Building2,
  FileText
} from 'lucide-react';
import { useRFPStore, useProposalStore, useHoldStore, useAuthStore } from '@/store';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { RFPDetailModal } from '@/components/rfp/RFPDetailModal';
import { HoldPaymentModal } from '@/components/hold/HoldPaymentModal';
import { AdvancePaymentModal } from '@/components/hold/AdvancePaymentModal';
import { ChatModal } from '@/components/chat/ChatSystem';

export default function RFPDetailsPage() {
  const { rfpId } = useParams<{ rfpId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getRFPById } = useRFPStore();
  const { getProposalsByRFP } = useProposalStore();
  const { getHoldByProposal } = useHoldStore();
  
  const [showRFPDetails, setShowRFPDetails] = useState(false);
  const [showHoldPayment, setShowHoldPayment] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  
  const rfp = rfpId ? getRFPById(rfpId) : null;
  const proposals = rfpId ? getProposalsByRFP(rfpId) : [];
  
  if (!rfp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">RFP Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested RFP could not be found.</p>
          <Button onClick={() => navigate('/advertiser/screens')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Screens
          </Button>
        </div>
      </div>
    );
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleHoldRequest = (proposal: any) => {
    setSelectedProposal(proposal.id);
    setShowHoldPayment(true);
  };
  
  const handleAdvancePayment = (proposal: any) => {
    setSelectedProposal(proposal.id);
    setShowAdvancePayment(true);
  };
  
  const handleChat = (proposal: any) => {
    setSelectedProposal(proposal.id);
    setShowChat(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/advertiser/screens')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{rfp.campaignName}</h1>
            <p className="text-muted-foreground">RFP #{rfp.id}</p>
          </div>
        </div>
        <Badge className={getStatusColor(rfp.status)}>
          {rfp.status.toUpperCase()}
        </Badge>
      </div>
      
      {/* RFP Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Campaign Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(rfp.startDate)} - {formatDate(rfp.endDate)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Budget</p>
                <p className="text-sm text-muted-foreground">
                  {rfp.budgetRange ? 
                    `${formatCurrency(rfp.budgetRange.min)} - ${formatCurrency(rfp.budgetRange.max)}` :
                    formatCurrency(rfp.budget)
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Cities</p>
                <p className="text-sm text-muted-foreground">
                  {rfp.cities.length > 0 ? rfp.cities.join(', ') : 'All Cities'}
                </p>
              </div>
            </div>
          </div>
          
          {rfp.objective && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Campaign Objective</p>
                <p className="text-sm text-muted-foreground">{rfp.objective}</p>
              </div>
            </>
          )}
          
          {rfp.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Additional Notes</p>
                <p className="text-sm text-muted-foreground">{rfp.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="proposals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proposals">
            Proposals ({proposals.length})
          </TabsTrigger>
          <TabsTrigger value="holds">
            Held Screens
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed Screens
          </TabsTrigger>
          <TabsTrigger value="activity">
            Activity Log
          </TabsTrigger>
        </TabsList>
        
        {/* Proposals Tab */}
        <TabsContent value="proposals" className="space-y-4">
          {proposals.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No proposals received yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            proposals.map((proposal) => {
              const hold = getHoldByProposal(proposal.id);
              
              return (
                <Card key={proposal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Proposal from {proposal.ownerId}
                      </CardTitle>
                      <Badge variant="outline">
                        {proposal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Screens ({proposal.screens.length})</p>
                        <div className="space-y-1">
                          {proposal.screens.map((screen, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{screen.screenName}</span>
                              <span>{formatCurrency(screen.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Financial Summary</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Total Amount:</span>
                            <span className="font-medium">{formatCurrency(proposal.totalAmount)}</span>
                          </div>
                          {hold && (
                            <div className="flex justify-between text-sm">
                              <span>Hold Status:</span>
                              <Badge className={hold.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {hold.status}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {proposal.description && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium mb-2">Description</p>
                          <p className="text-sm text-muted-foreground">{proposal.description}</p>
                        </div>
                      </>
                    )}
                    
                    {proposal.rationale && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium mb-2">Rationale</p>
                          <p className="text-sm text-muted-foreground">{proposal.rationale}</p>
                        </div>
                      </>
                    )}
                    
                    <Separator />
                    
                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      {proposal.status === 'pending' && !hold && (
                        <Button
                          size="sm"
                          className="bg-gradient-primary"
                          onClick={() => handleHoldRequest(proposal)}
                        >
                          <CreditCard className="mr-1 h-3 w-3" />
                          Place Hold (₹5k)
                        </Button>
                      )}
                      
                      {hold?.status === 'approved' && (
                        <Button
                          size="sm"
                          className="bg-gradient-primary"
                          onClick={() => handleAdvancePayment(proposal)}
                        >
                          <DollarSign className="mr-1 h-3 w-3" />
                          Pay Advance (30%)
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleChat(proposal)}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Chat
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
        
        {/* Held Screens Tab */}
        <TabsContent value="holds" className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No held screens</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Confirmed Screens Tab */}
        <TabsContent value="confirmed" className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No confirmed screens</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No activity logged</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {showRFPDetails && (
        <RFPDetailModal
          isOpen={showRFPDetails}
          onClose={() => setShowRFPDetails(false)}
          rfpId={rfp.id}
        />
      )}
      
      {showHoldPayment && selectedProposal && (
        <HoldPaymentModal
          isOpen={showHoldPayment}
          onClose={() => {
            setShowHoldPayment(false);
            setSelectedProposal(null);
          }}
          proposalId={selectedProposal}
          advertiserId={user?.id || ''}
          ownerId={proposals.find(p => p.id === selectedProposal)?.ownerId || ''}
          screens={proposals.find(p => p.id === selectedProposal)?.screens.map(s => s.screenId) || []}
          proposalAmount={proposals.find(p => p.id === selectedProposal)?.totalAmount || 0}
        />
      )}
      
      {showAdvancePayment && selectedProposal && (
        <AdvancePaymentModal
          isOpen={showAdvancePayment}
          onClose={() => {
            setShowAdvancePayment(false);
            setSelectedProposal(null);
          }}
          proposalId={selectedProposal}
          rfpId={rfp.id}
          ownerId={proposals.find(p => p.id === selectedProposal)?.ownerId || ''}
          totalAmount={proposals.find(p => p.id === selectedProposal)?.totalAmount || 0}
        />
      )}
      
      {showChat && selectedProposal && (
        <ChatModal
          isOpen={showChat}
          onClose={() => {
            setShowChat(false);
            setSelectedProposal(null);
          }}
          rfpId={rfp.id}
          advertiserId={user?.id || ''}
          ownerId={proposals.find(p => p.id === selectedProposal)?.ownerId || ''}
        />
      )}
    </div>
  );
}
