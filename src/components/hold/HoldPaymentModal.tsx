import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Wallet, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useWalletStore, useHoldStore, useNotificationStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

interface HoldPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  advertiserId: string;
  ownerId: string;
  screens: string[];
  proposalAmount: number;
}

export function HoldPaymentModal({
  isOpen,
  onClose,
  proposalId,
  advertiserId,
  ownerId,
  screens,
  proposalAmount
}: HoldPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  const { getWalletByUser, deductFunds } = useWalletStore();
  const { createHold } = useHoldStore();
  const { addNotification } = useNotificationStore();

  const wallet = getWalletByUser(advertiserId);
  const holdAmount = 5000; // ₹5,000
  const hasSufficientFunds = wallet && wallet.balance >= holdAmount;

  const handlePayment = async () => {
    if (!hasSufficientFunds && paymentMethod === 'wallet') {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentMethod === 'wallet') {
        // Deduct from wallet
        const success = deductFunds(
          advertiserId,
          holdAmount,
          `Hold payment for proposal ${proposalId}`,
          proposalId
        );

        if (!success) {
          throw new Error('Insufficient funds');
        }
      } else {
        // Simulate card payment
        console.log('Processing card payment...');
      }

      // Create hold
      createHold(proposalId, advertiserId, ownerId, screens);

      // Add notification to advertiser
      addNotification({
        userId: advertiserId,
        type: 'hold_request',
        title: 'Hold Request Sent',
        message: `Hold request of ${formatCurrency(holdAmount)} sent to owner`,
        read: false,
      });

      // Add notification to owner
      addNotification({
        userId: ownerId,
        type: 'hold_request',
        title: 'Hold Request Received',
        message: `You have received a hold request for ${formatCurrency(holdAmount)}`,
        read: false,
      });

      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Place Hold Request</DialogTitle>
          <DialogDescription>
            Secure the screens by placing a ₹5,000 hold. The owner has 6 hours to respond.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hold Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Hold Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hold Amount:</span>
                <span className="font-semibold">{formatCurrency(holdAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screens:</span>
                <span className="font-semibold">{screens.length} screens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Proposal Amount:</span>
                <span className="font-semibold">{formatCurrency(proposalAmount)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advance Required:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(Math.round(proposalAmount * 0.3))} (30%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                className="h-16 flex flex-col gap-2"
                onClick={() => setPaymentMethod('wallet')}
              >
                <Wallet className="h-5 w-5" />
                <span>Wallet</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrency(wallet?.balance || 0)}
                </span>
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="h-16 flex flex-col gap-2"
                onClick={() => setPaymentMethod('card')}
              >
                <CreditCard className="h-5 w-5" />
                <span>Card Payment</span>
                <span className="text-xs text-muted-foreground">Credit/Debit</span>
              </Button>
            </div>
          </div>

          {/* Wallet Balance Warning */}
          {paymentMethod === 'wallet' && !hasSufficientFunds && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Insufficient wallet balance. You need {formatCurrency(holdAmount)} but only have {formatCurrency(wallet?.balance || 0)}.
                <Button variant="link" className="p-0 ml-1 h-auto">
                  Add Funds
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any specific requirements or notes for the owner"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Terms and Conditions */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Hold Terms:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Owner has 6 hours to accept or reject your hold request</li>
                <li>• If accepted, screens are locked for 48 hours</li>
                <li>• You must pay advance (30%) within 48 hours to confirm</li>
                <li>• Hold amount will be refunded if owner rejects or expires</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
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
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Place Hold ({formatCurrency(holdAmount)})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
