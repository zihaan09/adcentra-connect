import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useWalletStore } from '@/store';
import { formatCurrency } from '@/lib/utils';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function AddFundsModal({ isOpen, onClose, userId }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'amount' | 'payment'>('amount');

  const { addFunds, getWalletByUser } = useWalletStore();
  const wallet = getWalletByUser(userId);

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleNext = () => {
    if (amount && parseFloat(amount) > 0) {
      setStep('payment');
    }
  };

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Add funds to wallet
      addFunds(userId, parseFloat(amount));

      // Reset form
      setAmount('');
      setStep('amount');
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    setStep('amount');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogDescription>
            Add money to your wallet for seamless payments and holds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Balance */}
          <Card className="bg-gradient-primary text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Current Balance</p>
                  <p className="text-3xl font-bold mt-2">
                    {formatCurrency(wallet?.balance || 0)}
                  </p>
                </div>
                <Wallet className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          {/* Amount Selection */}
          {step === 'amount' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Add (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="100"
                />
              </div>

              <div className="space-y-2">
                <Label>Quick Amounts</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAmountSelect(quickAmount)}
                      className={amount === quickAmount.toString() ? 'bg-primary text-primary-foreground' : ''}
                    >
                      {formatCurrency(quickAmount)}
                    </Button>
                  ))}
                </div>
              </div>

              {amount && parseFloat(amount) > 0 && (
                <Card className="border-primary">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Amount to Add:</span>
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(parseFloat(amount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">New Balance:</span>
                      <span className="text-lg font-semibold">
                        {formatCurrency((wallet?.balance || 0) + parseFloat(amount))}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="bg-gradient-primary"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Method */}
          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Adding:</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(parseFloat(amount))}
                </span>
              </div>

              <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="upi">UPI</TabsTrigger>
                  <TabsTrigger value="netbanking">Net Banking</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-3">
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
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="upi" className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@paytm"
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to your UPI app to complete the payment
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="netbanking" className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Select Bank</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">
                        You will be redirected to your bank's net banking portal
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Payment Summary */}
              <Card className="border-primary">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Processing Fee:</span>
                      <span className="font-semibold">₹0</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(parseFloat(amount))}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
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
                      Add Funds
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
