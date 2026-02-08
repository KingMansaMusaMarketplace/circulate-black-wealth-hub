
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { vacationRentalService } from '@/lib/services/vacation-rental-service';
import { VacationProperty, PROPERTY_TYPES, AMENITIES_LIST } from '@/types/vacation-rental';
import {
  Home,
  MapPin,
  DollarSign,
  Users,
  Bed,
  Bath,
  Clock,
  Dog,
  CheckCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Upload,
} from 'lucide-react';

type Step = 'basics' | 'location' | 'details' | 'amenities' | 'pricing' | 'photos' | 'review';

const STEPS: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: 'basics', title: 'Basics', icon: <Home className="w-5 h-5" /> },
  { id: 'location', title: 'Location', icon: <MapPin className="w-5 h-5" /> },
  { id: 'details', title: 'Details', icon: <Bed className="w-5 h-5" /> },
  { id: 'amenities', title: 'Amenities', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'pricing', title: 'Pricing', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'photos', title: 'Photos', icon: <Upload className="w-5 h-5" /> },
  { id: 'review', title: 'Review', icon: <CheckCircle className="w-5 h-5" /> },
];

const PropertyListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'house' as VacationProperty['property_type'],
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    base_nightly_rate: 100,
    cleaning_fee: 50,
    amenities: [] as string[],
    house_rules: '',
    photos: [] as string[],
    is_instant_book: false,
    min_nights: 1,
    max_nights: 30,
    check_in_time: '15:00',
    check_out_time: '11:00',
    pets_allowed: false,
    pet_fee: 0,
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleAmenity = (amenityId: string) => {
    const current = formData.amenities;
    const updated = current.includes(amenityId)
      ? current.filter(a => a !== amenityId)
      : [...current, amenityId];
    updateFormData({ amenities: updated });
  };

  const getCurrentStepIndex = () => STEPS.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please log in to list your property');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await vacationRentalService.createProperty({
        ...formData,
        latitude: null,
        longitude: null,
      });
      toast.success('Property listed successfully! It will be reviewed before going live.');
      navigate('/stays');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Home className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">List Your Property</h1>
          <p className="text-muted-foreground mb-6">
            Please log in to list your vacation rental property on Mansa Stays.
          </p>
          <Button onClick={() => navigate('/login', { state: { from: '/stays/list-property' } })}>
            Log In to Continue
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/stays')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mansa Stays
          </Button>
          <h1 className="text-3xl font-bold">List Your Property</h1>
          <p className="text-muted-foreground mt-2">
            Share your space with the community and earn income
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center"
                onClick={() => setCurrentStep(step.id)}
              >
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                    transition-colors
                    ${currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : index < getCurrentStepIndex()
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {step.icon}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-muted rounded-full w-full" />
            <div
              className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all"
              style={{ width: `${(getCurrentStepIndex() / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{STEPS.find(s => s.id === currentStep)?.title}</CardTitle>
            <CardDescription>
              {currentStep === 'basics' && 'Tell us about your property'}
              {currentStep === 'location' && 'Where is your property located?'}
              {currentStep === 'details' && 'Property details and capacity'}
              {currentStep === 'amenities' && 'What amenities do you offer?'}
              {currentStep === 'pricing' && 'Set your pricing'}
              {currentStep === 'photos' && 'Add photos of your property'}
              {currentStep === 'review' && 'Review your listing'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basics Step */}
            {currentStep === 'basics' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="Cozy Beach House with Ocean Views"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type *</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(val) => updateFormData({ property_type: val as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property, what makes it special, and the experience guests can expect..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Location Step */}
            {currentStep === 'location' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Ocean Drive"
                    value={formData.address}
                    onChange={(e) => updateFormData({ address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Atlanta"
                      value={formData.city}
                      onChange={(e) => updateFormData({ city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="GA"
                      value={formData.state}
                      onChange={(e) => updateFormData({ state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      placeholder="30301"
                      value={formData.zip_code}
                      onChange={(e) => updateFormData({ zip_code: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => updateFormData({ country: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Details Step */}
            {currentStep === 'details' && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={(e) => updateFormData({ bedrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => updateFormData({ bathrooms: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_guests">Max Guests</Label>
                    <Input
                      id="max_guests"
                      type="number"
                      min="1"
                      value={formData.max_guests}
                      onChange={(e) => updateFormData({ max_guests: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check_in_time">Check-in Time</Label>
                    <Input
                      id="check_in_time"
                      type="time"
                      value={formData.check_in_time}
                      onChange={(e) => updateFormData({ check_in_time: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="check_out_time">Check-out Time</Label>
                    <Input
                      id="check_out_time"
                      type="time"
                      value={formData.check_out_time}
                      onChange={(e) => updateFormData({ check_out_time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_nights">Minimum Nights</Label>
                    <Input
                      id="min_nights"
                      type="number"
                      min="1"
                      value={formData.min_nights}
                      onChange={(e) => updateFormData({ min_nights: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_nights">Maximum Nights</Label>
                    <Input
                      id="max_nights"
                      type="number"
                      min="1"
                      value={formData.max_nights}
                      onChange={(e) => updateFormData({ max_nights: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pets_allowed"
                      checked={formData.pets_allowed}
                      onCheckedChange={(checked) => updateFormData({ pets_allowed: !!checked })}
                    />
                    <Label htmlFor="pets_allowed" className="cursor-pointer">
                      <Dog className="w-4 h-4 inline mr-2" />
                      Pets Allowed
                    </Label>
                  </div>

                  {formData.pets_allowed && (
                    <div className="space-y-2 ml-6">
                      <Label htmlFor="pet_fee">Pet Fee (per pet)</Label>
                      <Input
                        id="pet_fee"
                        type="number"
                        min="0"
                        value={formData.pet_fee}
                        onChange={(e) => updateFormData({ pet_fee: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="house_rules">House Rules</Label>
                  <Textarea
                    id="house_rules"
                    placeholder="No smoking, quiet hours after 10pm, etc."
                    rows={4}
                    value={formData.house_rules}
                    onChange={(e) => updateFormData({ house_rules: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Amenities Step */}
            {currentStep === 'amenities' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {AMENITIES_LIST.map((amenity) => (
                  <div
                    key={amenity.id}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all
                      ${formData.amenities.includes(amenity.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={formData.amenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <span className="font-medium">{amenity.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing Step */}
            {currentStep === 'pricing' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="base_nightly_rate">Nightly Rate ($) *</Label>
                  <Input
                    id="base_nightly_rate"
                    type="number"
                    min="1"
                    value={formData.base_nightly_rate}
                    onChange={(e) => updateFormData({ base_nightly_rate: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-sm text-muted-foreground">
                    The base price per night before fees
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cleaning_fee">Cleaning Fee ($)</Label>
                  <Input
                    id="cleaning_fee"
                    type="number"
                    min="0"
                    value={formData.cleaning_fee}
                    onChange={(e) => updateFormData({ cleaning_fee: parseFloat(e.target.value) || 0 })}
                  />
                  <p className="text-sm text-muted-foreground">
                    One-time fee charged per stay
                  </p>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_instant_book"
                    checked={formData.is_instant_book}
                    onCheckedChange={(checked) => updateFormData({ is_instant_book: !!checked })}
                  />
                  <div>
                    <Label htmlFor="is_instant_book" className="cursor-pointer">
                      Enable Instant Book
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Guests can book instantly without approval
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Pricing Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Nightly rate</span>
                      <span>${formData.base_nightly_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>${formData.cleaning_fee}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform fee (7.5%)</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Photos Step */}
            {currentStep === 'photos' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Upload Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Photo upload functionality coming soon.
                    For now, you can add your property and update photos later.
                  </p>
                  <Button variant="outline" disabled>
                    Upload Photos
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tip: Properties with high-quality photos get 40% more bookings.
                  Include photos of every room, outdoor spaces, and unique features.
                </p>
              </div>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold">Property</h4>
                    <p>{formData.title || 'No title'}</p>
                    <p className="text-sm text-muted-foreground capitalize">{formData.property_type}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p>{formData.address}</p>
                    <p>{formData.city}, {formData.state} {formData.zip_code}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold">Details</h4>
                    <p>{formData.bedrooms} bedroom(s) · {formData.bathrooms} bathroom(s) · {formData.max_guests} guest(s)</p>
                    <p>Check-in: {formData.check_in_time} · Check-out: {formData.check_out_time}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold">Amenities</h4>
                    <p>{formData.amenities.length > 0 
                      ? formData.amenities.map(a => AMENITIES_LIST.find(am => am.id === a)?.label).join(', ')
                      : 'None selected'
                    }</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold">Pricing</h4>
                    <p>${formData.base_nightly_rate}/night + ${formData.cleaning_fee} cleaning fee</p>
                    {formData.is_instant_book && (
                      <p className="text-sm text-primary">✓ Instant Book enabled</p>
                    )}
                  </div>
                </div>

                <div className="bg-mansagold/10 border border-mansagold/30 rounded-lg p-4">
                  <h4 className="font-semibold text-mansagold-dark">What happens next?</h4>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Your listing will be reviewed by our team</li>
                    <li>• Once approved, it will be visible to guests</li>
                    <li>• You'll receive an email notification</li>
                    <li>• You can update your listing anytime from your dashboard</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={getCurrentStepIndex() === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep === 'review' ? (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.title || !formData.address || !formData.city || !formData.state}
              className="bg-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Listing
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={goToNextStep}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropertyListingPage;
