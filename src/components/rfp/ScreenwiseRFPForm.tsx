import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Upload, X, Plus, MapPin, ShoppingCart, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRFPStore, useScreenStore } from '@/store';
import { useAuthStore } from '@/store';
import { ScreenwiseRFPFormData, Screen } from '@/types';
import { formatCurrency } from '@/lib/utils';

const screenwiseRFPSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  notes: z.string().optional(),
});

interface ScreenCartItem {
  screen: Screen;
  quantity: number;
}

interface ScreenwiseRFPFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ScreenwiseRFPForm({ onSuccess, onCancel }: ScreenwiseRFPFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [cart, setCart] = useState<ScreenCartItem[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const { createRFP } = useRFPStore();
  const { getAvailableScreens } = useScreenStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ScreenwiseRFPFormData>({
    resolver: zodResolver(screenwiseRFPSchema),
  });

  const campaignName = watch('campaignName');

  const availableScreens = getAvailableScreens();

  const addToCart = (screen: Screen) => {
    setCart(prev => {
      const existing = prev.find(item => item.screen.id === screen.id);
      if (existing) {
        return prev.map(item =>
          item.screen.id === screen.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { screen, quantity: 1 }];
    });
  };

  const removeFromCart = (screenId: string) => {
    setCart(prev => prev.filter(item => item.screen.id !== screenId));
  };

  const updateQuantity = (screenId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(screenId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.screen.id === screenId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const getTotalBudget = () => {
    return cart.reduce((total, item) => total + (item.screen.discountedRate * item.quantity), 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ScreenwiseRFPFormData) => {
    if (!user || cart.length === 0) return;

    const formData: ScreenwiseRFPFormData = {
      ...data,
      selectedScreens: cart.map(item => item.screen.id),
      attachments,
    };

    createRFP(formData, user.id);
    onSuccess?.();
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return campaignName && startDate && endDate && endDate > startDate;
      case 2:
        return cart.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Create Screenwise RFP</CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                step <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {step}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Campaign Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  placeholder="Enter campaign name"
                  {...register('campaignName')}
                />
                {errors.campaignName && (
                  <p className="text-sm text-destructive">{errors.campaignName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !endDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) => date < (startDate || new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Screen Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Screens</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" />
                    {cart.length} screens
                  </Badge>
                  <Badge variant="secondary">
                    Total: {formatCurrency(getTotalBudget())}
                  </Badge>
                </div>
              </div>

              <Tabs value={view} onValueChange={(v) => setView(v as 'grid' | 'map')}>
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="map">Map View</TabsTrigger>
                </TabsList>

                <TabsContent value="grid" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableScreens.map((screen) => (
                      <Card key={screen.id} className="overflow-hidden hover:shadow-medium transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-200 relative">
                          <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                            {screen.status}
                          </Badge>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-purple-300" />
                          </div>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <h3 className="font-semibold text-lg">{screen.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {screen.location}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <p className="font-medium">{screen.type}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Format:</span>
                              <p className="font-medium">{screen.format}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Size:</span>
                              <p className="font-medium">{screen.size}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Light:</span>
                              <p className="font-medium">{screen.illumination}</p>
                            </div>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex items-end justify-between">
                              <div>
                                <p className="text-xs text-muted-foreground line-through">
                                  {formatCurrency(screen.baseRate)}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  {formatCurrency(screen.discountedRate)}
                                </p>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-gradient-primary"
                                onClick={() => addToCart(screen)}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="map">
                  <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>Map view coming soon</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Screens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.screen.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.screen.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.screen.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.screen.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.screen.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.screen.discountedRate * item.quantity)}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.screen.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Budget:</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(getTotalBudget())}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes to Owners</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any specific requirements or notes for screen owners"
                  rows={4}
                  {...register('notes')}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachments</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload creative brief or other documents
                    </span>
                  </label>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Final Summary */}
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Campaign Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Campaign:</span>
                      <span className="font-medium">{campaignName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">
                        {startDate && endDate ? `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd')}` : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Screens:</span>
                      <span className="font-medium">{cart.length} screens</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Budget:</span>
                      <span className="font-medium text-primary">{formatCurrency(getTotalBudget())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : prevStep}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!isStepValid()}>
                Create Screenwise RFP
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
