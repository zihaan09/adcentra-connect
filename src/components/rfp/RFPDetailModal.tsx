import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Eye, 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  CreditCard, 
  Calendar,
  MapPin,
  DollarSign,
  User,
  FileText
} from 'lucide-react';
import { HoldPaymentModal } from '@/components/hold/HoldPaymentModal';
import { HoldDeadlineTimer, HoldExpiryTimer } from '@/components/timers/CountdownTimer';
import { useRFPStore, useProposalStore, useHoldStore, useScreenStore, useAuthStore } from '@/store';
import { formatCurrency, formatDate, getRFPStatusColor, getProposalStatusColor, getHoldStatusColor } from '@/lib/utils';
import { RFP, Proposal, Hold } from '@/types';

interface RFPDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfpId: string;
}

export function RFPDetailModal({ isOpen, onClose, rfpId }: RFPDetailModalProps) {
  const [activeTab, setActiveTab] = useState('proposals');
  const [showHoldPayment, setShowHoldPayment] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const { getRFPById } = useRFPStore();
  const { getProposalsByRFP } = useProposalStore();
  const { getHoldByProposal } = useHoldStore();
  const { getScreensByOwner } = useScreenStore();
  const { user } = useAuthStore();

  const rfp = getRFPById(rfpId);
  const proposals = rfp ? getProposalsByRFP(rfp.id) : [];

  if (!rfp) return null;

  const handleHoldRequest = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowHoldPayment(true);
  };

  const handleAdvancePayment = (proposal: Proposal) => {
    // This would open advance payment modal
    console.log('Advance payment for proposal:', proposal.id);
  };

  const handleChat = (proposal: Proposal) => {
    // This would open chat modal
    console.log('Open chat for proposal:', proposal.id);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{rfp.campaignName}</span>
              <Badge className={getRFPStatusColor(rfp.status)}>
                {rfp.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* RFP Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campaign Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Duration
                    </div>
                    <p className="font-medium">
                      {formatDate(rfp.startDate)} - {formatDate(rfp.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Budget
                    </div>
                    <p className="font-medium">
                      {rfp.type === 'normal' 
                        ? formatCurrency(rfp.budgetRange?.max || 0)
                        : 'Auto-calculated'
                      }
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Cities
                    </div>
                    <p className="font-medium">
                      {rfp.cities.length > 0 ? rfp.cities.join(', ') : 'Screenwise'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Type
                    </div>
                    <p className="font-medium">
                      {rfp.type === 'normal' ? 'Normal RFP' : 'Screenwise RFP'}
                    </p>
                  </div>
                </div>
                
                {rfp.objective && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Campaign Objective</h4>
                    <p className="text-muted-foreground">{rfp.objective}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                    <CardContent className="py-12 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No proposals received yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  proposals.map((proposal) => {
                    const hold = getHoldByProposal(proposal.id);
                    const ownerScreens = getScreensByOwner(proposal.ownerId);
                    
                    return (
                      <Card key={proposal.id} className="hover:shadow-medium transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-muted-foreground">
                                  {proposal.id}
                                </span>
                                <Badge className={getProposalStatusColor(proposal.status)}>
                                  {proposal.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                {hold && (
                                  <Badge className={getHoldStatusColor(hold.status)}>
                                    Hold: {hold.status.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              <h3 className="text-xl font-semibold">{proposal.rationale}</h3>
                              <p className="text-muted-foreground">{proposal.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                {formatCurrency(proposal.totalAmount)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {proposal.screens.length} screens
                              </p>
                            </div>
                          </div>

                          {/* Proposal Screens */}
                          <div className="space-y-3 mb-4">
                            <h4 className="font-medium">Proposed Screens</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {proposal.screens.map((screen) => (
                                <div key={screen.screenId} className="p-3 border rounded-lg">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="font-medium">{screen.screenName}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {screen.rationale}
                                      </p>
                                    </div>
                                    <p className="font-semibold text-primary">
                                      {formatCurrency(screen.price)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Hold Information */}
                          {hold && (
                            <div className="mb-4 p-3 bg-muted rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">Hold Status</p>
                                  <p className="text-sm text-muted-foreground">
                                    Amount: {formatCurrency(hold.amount)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  {hold.status === 'pending' && (
                                    <HoldDeadlineTimer 
                                      holdId={hold.id} 
                                      expiryDate={hold.expiresAt} 
                                    />
                                  )}
                                  {hold.status === 'approved' && hold.holdExpiresAt && (
                                    <HoldExpiryTimer 
                                      holdId={hold.id} 
                                      expiryDate={hold.holdExpiresAt} 
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t">
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
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No held screens</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Confirmed Screens Tab */}
              <TabsContent value="confirmed" className="space-y-4">
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No confirmed screens</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No activity yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hold Payment Modal */}
      {selectedProposal && (
        <HoldPaymentModal
          isOpen={showHoldPayment}
          onClose={() => {
            setShowHoldPayment(false);
            setSelectedProposal(null);
          }}
          proposalId={selectedProposal.id}
          advertiserId={user?.id || ''}
          ownerId={selectedProposal.ownerId}
          screens={selectedProposal.screens.map(s => s.screenId)}
          proposalAmount={selectedProposal.totalAmount}
        />
      )}
    </>
  );
}
