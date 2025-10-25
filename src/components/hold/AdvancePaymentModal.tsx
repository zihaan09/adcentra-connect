import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCampaignStore, useWalletStore, useAuthStore, useNotificationStore, useProposalStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { DollarSign, Wallet, CreditCard } from "lucide-react";

interface AdvancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalId: string;
  rfpId: string;
  ownerId: string;
  totalAmount: number;
}

export function AdvancePaymentModal({ isOpen, onClose, proposalId, rfpId, ownerId, totalAmount }: AdvancePaymentModalProps) {
  const { user } = useAuthStore();
  const { createCampaign } = useCampaignStore();
  const { deductFunds, getWalletByUser } = useWalletStore();
  const { addNotification } = useNotificationStore();
  const { updateProposal } = useProposalStore();

  const [advancePercentage, setAdvancePercentage] = useState("30");
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const advanceAmount = (totalAmount * parseInt(advancePercentage)) / 100;
  const balanceAmount = totalAmount - advanceAmount;
  const wallet = user ? getWalletByUser(user.id) : undefined;

  const handlePayment = () => {
    if (!user) return;

    if (paymentMethod === "wallet") {
      const success = deductFunds(
        user.id,
        advanceAmount,
        `Advance payment for campaign - ${proposalId}`,
        rfpId
      );

      if (!success) {
        toast.error("Insufficient wallet balance");
        return;
      }
    }

    // Create campaign
    createCampaign(rfpId, proposalId, user.id, ownerId, advanceAmount);

    // Update proposal status
    updateProposal(proposalId, { status: 'accepted' });

    // Notify owner
    addNotification({
      userId: ownerId,
      type: 'campaign_created',
      title: 'Campaign Created',
      message: `Advance payment of ${formatCurrency(advanceAmount)} received. Campaign has been created.`,
      read: false,
      data: { rfpId, proposalId, advanceAmount }
    });

    toast.success("Campaign created successfully!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Advance & Create Campaign</DialogTitle>
          <DialogDescription>
            Pay the advance amount to create the campaign and lock the inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Campaign Amount</span>
              <span className="font-semibold">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-medium">Advance ({advancePercentage}%)</span>
              <span className="font-bold text-primary">{formatCurrency(advanceAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance Due</span>
              <span>{formatCurrency(balanceAmount)}</span>
            </div>
          </div>

          <div>
            <Label>Advance Percentage</Label>
            <RadioGroup value={advancePercentage} onValueChange={setAdvancePercentage}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="20" id="20" />
                <Label htmlFor="20" className="font-normal">20% - {formatCurrency((totalAmount * 20) / 100)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="30" />
                <Label htmlFor="30" className="font-normal">30% - {formatCurrency((totalAmount * 30) / 100)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="50" id="50" />
                <Label htmlFor="50" className="font-normal">50% - {formatCurrency((totalAmount * 50) / 100)}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label htmlFor="wallet" className="font-normal flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Wallet Balance: {wallet ? formatCurrency(wallet.balance) : formatCurrency(0)}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="font-normal flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "wallet" && wallet && wallet.balance < advanceAmount && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
              Insufficient balance. Please add funds to your wallet or choose another payment method.
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button 
              onClick={handlePayment} 
              className="flex-1 bg-gradient-primary"
              disabled={paymentMethod === "wallet" && wallet && wallet.balance < advanceAmount}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Pay {formatCurrency(advanceAmount)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
