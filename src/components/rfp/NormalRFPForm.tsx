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
import { CalendarIcon, Upload, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRFPStore } from '@/store';
import { useAuthStore } from '@/store';
import { NormalRFPFormData } from '@/types';

const normalRFPSchema = z.object({
  campaignName: z.string().min(1, 'Campaign name is required'),
  budgetRange: z.object({
    min: z.number().min(10000, 'Minimum budget should be ₹10,000'),
    max: z.number().min(10000, 'Maximum budget should be ₹10,000'),
  }),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  cities: z.array(z.string()).min(1, 'At least one city is required'),
  mediaTypes: z.array(z.string()).min(1, 'At least one media type is required'),
  objective: z.string().optional(),
  notes: z.string().optional(),
});

const cities = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Kolkata', 
  'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat'
];

const mediaTypes = [
  { value: 'digital', label: 'Digital' },
  { value: 'static', label: 'Static' },
  { value: 'transit', label: 'Transit' },
  { value: 'mall', label: 'Mall' },
];

interface NormalRFPFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NormalRFPForm({ onSuccess, onCancel }: NormalRFPFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { createRFP } = useRFPStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<NormalRFPFormData>({
    resolver: zodResolver(normalRFPSchema),
  });

  const budgetMin = watch('budgetRange.min');
  const budgetMax = watch('budgetRange.max');

  const handleCityToggle = (city: string) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const handleMediaTypeToggle = (type: string) => {
    setSelectedMediaTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: NormalRFPFormData) => {
    if (!user) return;

    const formData: NormalRFPFormData = {
      ...data,
      cities: selectedCities,
      mediaTypes: selectedMediaTypes,
      attachments,
    };

    createRFP(formData, user.id);
    onSuccess?.();
  };

  const nextStep = () => {
    if (currentStep < 4) {
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
        return watch('campaignName') && budgetMin && budgetMax && budgetMax >= budgetMin;
      case 2:
        return startDate && endDate && endDate > startDate;
      case 3:
        return selectedCities.length > 0 && selectedMediaTypes.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Normal RFP</CardTitle>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4].map((step) => (
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
                  <Label htmlFor="budgetMin">Minimum Budget (₹) *</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    placeholder="100000"
                    {...register('budgetRange.min', { valueAsNumber: true })}
                  />
                  {errors.budgetRange?.min && (
                    <p className="text-sm text-destructive">{errors.budgetRange.min.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Maximum Budget (₹) *</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    placeholder="500000"
                    {...register('budgetRange.max', { valueAsNumber: true })}
                  />
                  {errors.budgetRange?.max && (
                    <p className="text-sm text-destructive">{errors.budgetRange.max.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective">Campaign Objective</Label>
                <Textarea
                  id="objective"
                  placeholder="Describe your campaign goals and objectives"
                  rows={3}
                  {...register('objective')}
                />
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {currentStep === 2 && (
            <div className="space-y-4">
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

          {/* Step 3: Location & Media Type */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Cities *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city) => (
                    <Button
                      key={city}
                      type="button"
                      variant={selectedCities.includes(city) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCityToggle(city)}
                    >
                      {city}
                    </Button>
                  ))}
                </div>
                {selectedCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCities.map((city) => (
                      <Badge key={city} variant="secondary">
                        {city}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => handleCityToggle(city)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label>Media Types *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {mediaTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={selectedMediaTypes.includes(type.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMediaTypeToggle(type.value)}
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
                {selectedMediaTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedMediaTypes.map((type) => (
                      <Badge key={type} variant="secondary">
                        {mediaTypes.find(t => t.value === type)?.label}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => handleMediaTypeToggle(type)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes / POI / Demographics</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any specific targeting notes, points of interest, or demographic requirements"
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
            
            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={!isStepValid()}>
                Create RFP
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
