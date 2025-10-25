import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { HoldDeadlineTimer, HoldExpiryTimer } from '@/components/timers/CountdownTimer';
import { useHoldStore, useNotificationStore, useAuthStore } from '@/store';
import { formatCurrency, getHoldStatusColor } from '@/lib/utils';

interface HoldManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  holdId: string;
}

export function HoldManagementModal({ isOpen, onClose, holdId }: HoldManagementModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { holds, approveHold, rejectHold } = useHoldStore();
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  const hold = holds.find(h => h.id === holdId);
  
  if (!hold) return null;

  const handleApprove = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      approveHold(holdId);
      
      // Notify advertiser
      addNotification({
        userId: hold.advertiserId,
        type: 'hold_approved',
        title: 'Hold Approved',
        message: `Your hold request has been approved. Screens are locked for 48 hours.`,
        read: false,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to approve hold:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      rejectHold(holdId);
      
      // Notify advertiser
      addNotification({
        userId: hold.advertiserId,
        type: 'hold_rejected',
        title: 'Hold Rejected',
        message: `Your hold request has been rejected. Amount will be refunded.`,
        read: false,
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to reject hold:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (hold.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (hold.status) {
      case 'pending':
        return 'Waiting for your response. You have 6 hours to accept or reject this hold request.';
      case 'approved':
        return 'Hold approved. Screens are locked for 48 hours. Advertiser must pay advance within this time.';
      case 'rejected':
        return 'Hold rejected. Advertiser has been refunded and screens are available again.';
      case 'expired':
        return 'Hold expired. Advertiser has been refunded and screens are available again.';
      default:
        return 'Unknown status';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Hold Request - {hold.id}
          </DialogTitle>
          <DialogDescription>
            Manage hold request from advertiser
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hold Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Hold Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hold Amount:</span>
                <span className="font-semibold">{formatCurrency(hold.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Screens:</span>
                <span className="font-semibold">{hold.screens.length} screens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested At:</span>
                <span className="font-semibold">
                  {new Date(hold.requestedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getHoldStatusColor(hold.status)}>
                  {hold.status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timer Information */}
          {hold.status === 'pending' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Response Deadline</p>
                  <HoldDeadlineTimer 
                    holdId={hold.id} 
                    expiryDate={hold.expiresAt} 
                  />
                  <p className="text-sm text-muted-foreground">
                    You must respond within 6 hours or the hold will be auto-rejected.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {hold.status === 'approved' && hold.holdExpiresAt && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Hold Expiry</p>
                  <HoldExpiryTimer 
                    holdId={hold.id} 
                    expiryDate={hold.holdExpiresAt} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Advertiser must pay advance within 48 hours or hold will be released.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Status Message */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {getStatusMessage()}
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          {hold.status === 'pending' && (
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Hold
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
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
                      Approve Hold
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {hold.status !== 'pending' && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
