import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Building2,
  CreditCard,
  Wallet,
  FileText,
  Image
} from 'lucide-react';
import { useCampaignStore, useWalletStore, useAuthStore, useNotificationStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Campaign } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface FinalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
}

export function FinalPaymentModal({ isOpen, onClose, campaign }: FinalPaymentModalProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { settleFinalPayment } = useCampaignStore();
  const { getWalletByUser } = useWalletStore();
  const { addNotification } = useNotificationStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  
  const wallet = user ? getWalletByUser(user.id) : undefined;
  const hasSufficientFunds = wallet && wallet.balance >= campaign.balanceAmount;
  
  const handleFinalPayment = async () => {
    if (!user) return;
    
    if (paymentMethod === 'wallet' && !hasSufficientFunds) {
      toast({
        title: "Insufficient Funds",
        description: "You don't have sufficient balance in your wallet.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (paymentMethod === 'wallet') {
        const success = settleFinalPayment(campaign.id, user.id, campaign.ownerId);
        
        if (!success) {
          throw new Error('Payment processing failed');
        }
      } else {
        // Simulate card payment
        console.log('Processing card payment...');
        // In real implementation, integrate with payment gateway
      }
      
      toast({
        title: "Payment Successful",
        description: `Final payment of ${formatCurrency(campaign.balanceAmount)} has been processed successfully.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to process final payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'settled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Final Payment Settlement
          </DialogTitle>
          <DialogDescription>
            Complete the final payment for campaign "{campaign.campaignName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Campaign Summary</span>
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status.toUpperCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Campaign Value:</span>
                  <span className="font-medium">{formatCurrency(campaign.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Advance Paid:</span>
                  <span className="font-medium text-green-600">
                    -{formatCurrency(campaign.advanceAmount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Balance Amount:</span>
                  <span className="text-primary">{formatCurrency(campaign.balanceAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('wallet')}
                  className="h-auto p-4"
                >
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Wallet</p>
                      <p className="text-sm text-muted-foreground">
                        Balance: {formatCurrency(wallet?.balance || 0)}
                      </p>
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="h-auto p-4"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">
                        Secure payment
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
              
              {paymentMethod === 'wallet' && !hasSufficientFunds && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Insufficient wallet balance. Please add funds or use a different payment method.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {/* Proof of Performance */}
          {campaign.proofOfPlay && campaign.proofOfPlay.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Proof of Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {campaign.proofOfPlay.map((proof) => (
                    <div key={proof.id} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{proof.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(proof.uploadedAt.toISOString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleFinalPayment}
            disabled={isProcessing || (paymentMethod === 'wallet' && !hasSufficientFunds)}
            className="bg-gradient-primary"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Pay {formatCurrency(campaign.balanceAmount)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
