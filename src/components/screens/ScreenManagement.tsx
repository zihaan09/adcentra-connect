import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Building2, 
  DollarSign, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Monitor,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useScreenStore, useAuthStore } from '@/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Screen } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const screenFormSchema = z.object({
  name: z.string().min(1, "Screen name is required"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  type: z.string().min(1, "Media type is required"),
  size: z.string().min(1, "Size is required"),
  illumination: z.string().min(1, "Illumination type is required"),
  format: z.string().min(1, "Format is required"),
  pricePerDay: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  specifications: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ScreenFormValues = z.infer<typeof screenFormSchema>;

interface AddScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  screen?: Screen; // For editing existing screen
}

export function AddScreenModal({ isOpen, onClose, screen }: AddScreenModalProps) {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { createScreen, updateScreen } = useScreenStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const form = useForm<ScreenFormValues>({
    resolver: zodResolver(screenFormSchema),
    defaultValues: {
      name: screen?.name || '',
      city: screen?.city || '',
      location: screen?.location || '',
      type: screen?.type || '',
      size: screen?.size || '',
      illumination: screen?.illumination || '',
      format: screen?.format || '',
      pricePerDay: screen?.pricePerDay || 0,
      description: screen?.description || '',
      specifications: screen?.specifications || '',
      imageUrl: screen?.imageUrl || '',
    },
  });

  const onSubmit = async (data: ScreenFormValues) => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      const screenData = {
        name: data.name,
        city: data.city,
        location: data.location,
        type: data.type as 'digital' | 'static',
        environment: 'outdoor' as const,
        format: data.format,
        size: data.size,
        illumination: data.illumination,
        baseRate: data.pricePerDay,
        discountedRate: data.pricePerDay,
      };

      if (screen) {
        updateScreen(screen.id, {
          ...screenData,
          pricePerDay: data.pricePerDay,
          description: data.description || '',
          specifications: data.specifications || '',
          imageUrl: data.imageUrl || '',
        });
        toast({
          title: "Screen Updated",
          description: `Screen "${data.name}" has been updated successfully.`,
        });
      } else {
        createScreen(screenData, user.id);
        toast({
          title: "Screen Added",
          description: `Screen "${data.name}" has been added to your inventory.`,
        });
      }

      onClose();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save screen. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      // For now, we'll create a local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            {screen ? 'Edit Screen' : 'Add New Screen'}
          </DialogTitle>
          <DialogDescription>
            {screen ? 'Update screen details and specifications' : 'Add a new screen to your inventory'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Screen Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="e.g., Times Square Billboard"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...form.register('city')}
                    placeholder="e.g., Mumbai"
                  />
                  {form.formState.errors.city && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="e.g., Bandra Kurla Complex, Mumbai"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Media Type *</Label>
                <Select onValueChange={(value) => form.setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="billboard">Billboard</SelectItem>
                    <SelectItem value="digital_display">Digital Display</SelectItem>
                    <SelectItem value="transit">Transit</SelectItem>
                    <SelectItem value="mall">Mall</SelectItem>
                    <SelectItem value="airport">Airport</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="bus_shelter">Bus Shelter</SelectItem>
                    <SelectItem value="street_furniture">Street Furniture</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size *</Label>
                  <Input
                    id="size"
                    {...form.register('size')}
                    placeholder="e.g., 20ft x 10ft"
                  />
                  {form.formState.errors.size && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.size.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="illumination">Illumination *</Label>
                  <Select onValueChange={(value) => form.setValue('illumination', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select illumination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="led">LED</SelectItem>
                      <SelectItem value="lcd">LCD</SelectItem>
                      <SelectItem value="projection">Projection</SelectItem>
                      <SelectItem value="static">Static</SelectItem>
                      <SelectItem value="backlit">Backlit</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.illumination && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.illumination.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Format *</Label>
                <Select onValueChange={(value) => form.setValue('format', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                    <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                    <SelectItem value="square">Square (1:1)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.format && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.format.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Additional Specifications</Label>
                <Textarea
                  id="specifications"
                  {...form.register('specifications')}
                  placeholder="Resolution, brightness, viewing distance, etc."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                <Input
                  id="pricePerDay"
                  type="number"
                  {...form.register('pricePerDay')}
                  placeholder="e.g., 5000"
                  min="0"
                />
                {form.formState.errors.pricePerDay && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.pricePerDay.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Screen Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload an image of your screen
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Choose Image
                  </Button>
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Screen preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Describe your screen, its visibility, footfall, etc."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-primary"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {screen ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {screen ? 'Update Screen' : 'Add Screen'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ScreenManagementProps {
  screens: Screen[];
  onEdit: (screen: Screen) => void;
  onDelete: (screenId: string) => void;
}

export function ScreenManagement({ screens, onEdit, onDelete }: ScreenManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const filteredScreens = screens.filter(screen => {
    const matchesSearch = screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         screen.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || screen.status === statusFilter;
    const matchesCity = cityFilter === 'all' || screen.city === cityFilter;

    return matchesSearch && matchesStatus && matchesCity;
  });

  const cities = Array.from(new Set(screens.map(s => s.city)));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input
            placeholder="Search screens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map(city => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Screens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScreens.map(screen => (
          <Card key={screen.id} className="overflow-hidden">
            <div className="aspect-video bg-muted relative">
              {screen.imageUrl ? (
                <img
                  src={screen.imageUrl}
                  alt={screen.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Monitor className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <Badge 
                className={`absolute top-2 right-2 ${
                  screen.status === 'active' ? 'bg-success text-success-foreground' :
                  screen.status === 'inactive' ? 'bg-muted text-muted-foreground' :
                  'bg-warning text-warning-foreground'
                }`}
              >
                {screen.status}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{screen.name}</h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {screen.city}, {screen.location}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {screen.type} • {screen.size}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  {formatCurrency(screen.pricePerDay)}/day
                </div>
                
                {screen.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {screen.description}
                  </p>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-muted-foreground">
                  Added {formatDate(screen.createdAt)}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(screen)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(screen.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScreens.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Monitor className="h-12 w-12 mx-auto mb-4" />
          <p>No screens found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
