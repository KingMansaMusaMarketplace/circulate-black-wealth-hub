import React, { useState } from 'react';
import { X, Plus, Building2, Mail, Phone, Globe, MapPin, User, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ManualLeadEntryProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const BUSINESS_CATEGORIES = [
  'Accounting & Tax',
  'Acupuncture',
  'Addiction Treatment',
  'Advertising Agency',
  'Aerospace',
  'Agriculture & Farming',
  'Air Duct Cleaning',
  'Aircraft Services',
  'Alterations & Tailoring',
  'Alternative Medicine',
  'Ambulance Services',
  'Amusement Parks',
  'Animal Hospital',
  'Antique Shop',
  'Apartment Complex',
  'Appliance Repair',
  'Appliance Store',
  'Aquarium Services',
  'Arcade',
  'Architect',
  'Art Gallery',
  'Art & Crafts',
  'Assisted Living',
  'Athletic Training',
  'Attorney',
  'Auction House',
  'Audio Visual Services',
  'Auto Body Shop',
  'Auto Detailing',
  'Auto Glass',
  'Auto Parts',
  'Auto Repair',
  'Auto Sales',
  'Automotive',
  'Bail Bonds',
  'Bakery',
  'Balloon Services',
  'Banking',
  'Bar & Lounge',
  'Barbershop',
  'Beauty & Salon',
  'Beauty Supply',
  'Bed & Breakfast',
  'Beer & Wine',
  'Bicycle Shop',
  'Billing Services',
  'Blinds & Shutters',
  'Boat Dealer',
  'Boat Repair',
  'Body Piercing',
  'Bookkeeping',
  'Bookstore',
  'Bowling Alley',
  'Boxing Gym',
  'Braiding & Natural Hair',
  'Branding Agency',
  'Brewery',
  'Bridal Shop',
  'Building Materials',
  'Bus Services',
  'Business Broker',
  'Business Consulting',
  'Butcher Shop',
  'Cabinet Maker',
  'Café & Coffee Shop',
  'Cake & Cupcakes',
  'Call Center',
  'Camera Store',
  'Candy Store',
  'Cannabis Dispensary',
  'Car Rental',
  'Car Wash',
  'Career Counseling',
  'Cargo & Freight',
  'Carpet Cleaning',
  'Carpet & Flooring',
  'Carpentry',
  'Casino',
  'Catering',
  'Cell Phone Repair',
  'Cemetery',
  'Charter Bus',
  'Check Cashing',
  'Chemical Supply',
  'Childcare',
  'Chimney Sweep',
  'Chiropractic',
  'Chocolate Shop',
  'Church & Religious',
  'Cigar Lounge',
  'Cleaning Services',
  'Clinical Lab',
  'Clock Repair',
  'Clothing & Apparel',
  'Cloud Services',
  'Coaching & Mentoring',
  'Collection Agency',
  'College & University',
  'Comedy Club',
  'Commercial Cleaning',
  'Commercial Real Estate',
  'Community Center',
  'Community Organization',
  'Computer Repair',
  'Computer Store',
  'Concrete & Paving',
  'Concierge Services',
  'Construction',
  'Consulting',
  'Content Creation',
  'Convenience Store',
  'Convention Center',
  'Copy & Print Shop',
  'Cosmetic Surgery',
  'Cosmetology School',
  'Costume Shop',
  'Counseling & Therapy',
  'Courier & Delivery',
  'Court Reporter',
  'Crane Services',
  'Credit Counseling',
  'Credit Repair',
  'Credit Union',
  'Cremation Services',
  'Crisis Center',
  'Currency Exchange',
  'Custom Clothing',
  'Cybersecurity',
  'Dance Studio',
  'Data Analytics',
  'Data Recovery',
  'Data Services',
  'Dating Services',
  'Daycare & Childcare',
  'Debt Collection',
  'Deck & Patio',
  'Demolition',
  'Dental Lab',
  'Dental Practice',
  'Dermatology',
  'Diagnostic Center',
  'Diamond & Gems',
  'Dietitian',
  'Digital Marketing',
  'Disability Services',
  'Disc Jockey (DJ)',
  'Document Shredding',
  'Dog Grooming',
  'Dog Training',
  'Donut Shop',
  'Door & Window',
  'Drain Cleaning',
  'Drapery & Curtains',
  'Driving School',
  'Drone Services',
  'Drug Testing',
  'Dry Cleaning & Laundry',
  'Drywall',
  'E-Commerce',
  'Education',
  'Elder Care',
  'Electrical',
  'Electronics',
  'Electronics Repair',
  'Embroidery',
  'Emergency Services',
  'Employment Agency',
  'Engineering',
  'Entertainment',
  'Environmental Services',
  'Equipment Rental',
  'Escape Room',
  'Estate Planning',
  'Estate Sales',
  'Event Planning',
  'Excavation',
  'Executive Coaching',
  'Eyewear & Optical',
  'Fabric Store',
  'Face Painting',
  'Family Law',
  'Farm Equipment',
  'Fashion Design',
  'Fencing',
  'Fertility Clinic',
  'Film & Video Production',
  'Financial Advisor',
  'Financial Planning',
  'Financial Services',
  'Fire Protection',
  'Fireplace & Chimney',
  'Fish Market',
  'Fishing Charter',
  'Fitness & Gym',
  'Flea Market',
  'Flooring',
  'Florist',
  'Food Manufacturing',
  'Food Truck',
  'Foot Care',
  'Foreclosure Services',
  'Forensic Services',
  'Foundation Repair',
  'Franchise',
  'Freight Forwarding',
  'Funeral Home',
  'Furniture Repair',
  'Furniture & Home Décor',
  'Furniture Store',
  'Game Store',
  'Garage Door',
  'Garden Center',
  'Gas Station',
  'General Contractor',
  'Generator Services',
  'Gift Basket',
  'Gift Shop',
  'Glass & Mirror',
  'Golf Course',
  'Government Contractor',
  'Graphic Design',
  'Greenhouse',
  'Grocery Store',
  'Gunsmith',
  'Gutter Services',
  'Hair Extensions',
  'Hair Replacement',
  'Handyman',
  'Hardware Store',
  'Hat Shop',
  'Hauling Services',
  'Headhunter',
  'Health & Wellness',
  'Health Clinic',
  'Health Food Store',
  'Health Insurance',
  'Hearing Aid',
  'Heating & Cooling',
  'Heavy Equipment',
  'Helicopter Services',
  'Herbal Medicine',
  'Historical Tours',
  'Hobby Shop',
  'Home Builder',
  'Home Health Care',
  'Home Improvement',
  'Home Inspection',
  'Home Security',
  'Home Services',
  'Home Staging',
  'Home Theater',
  'Homeless Services',
  'Hospice',
  'Hospital',
  'Hospitality',
  'Hot Tub & Spa',
  'Hotel & Motel',
  'House Flipping',
  'Human Resources',
  'HVAC',
  'Ice Cream Shop',
  'Immigration Services',
  'Import & Export',
  'Indoor Playground',
  'Industrial Equipment',
  'Industrial Supply',
  'Infusion Therapy',
  'Ink & Toner',
  'Insulation',
  'Insurance',
  'Insurance Adjuster',
  'Insurance Agent',
  'Interior Design',
  'Internet Provider',
  'Interpreting Services',
  'Investigation Services',
  'Investment & Wealth Management',
  'Irrigation',
  'IT Consulting',
  'IT Services',
  'Janitorial',
  'Jet Ski Rental',
  'Jewelry & Accessories',
  'Jewelry Repair',
  'Juice Bar',
  'Junk Removal',
  'Karate & Martial Arts',
  'Kennel',
  'Key & Locksmith',
  'Kitchen & Bath',
  'Laboratory',
  'Land Surveyor',
  'Landscape Design',
  'Landscaping & Lawn Care',
  'Language School',
  'Laser Hair Removal',
  'Laser Tag',
  'Laundromat',
  'Law Firm',
  'Lawn Equipment',
  'Leather Goods',
  'Legal Services',
  'Library',
  'Life Coach',
  'Life Insurance',
  'Lighting Store',
  'Limousine & Chauffeur',
  'Linen Services',
  'Lingerie Shop',
  'Liquidation',
  'Liquor Store',
  'Literacy Program',
  'Litigation Support',
  'Live Music Venue',
  'Loan Services',
  'Locksmith',
  'Logistics',
  'Loft & Studio',
  'Luggage Store',
  'Lumber Yard',
  'Machine Shop',
  'Magazine',
  'Maid Service',
  'Mailbox Services',
  'Makeup Artist',
  'Mall',
  'Management Consulting',
  'Manicure & Pedicure',
  'Manufacturing',
  'Marine Services',
  'Market Research',
  'Marketing & Advertising',
  'Martial Arts',
  'Masonry',
  'Massage Therapy',
  'Mattress Store',
  'Meat Market',
  'Mechanical Engineering',
  'Mediation Services',
  'Medical Billing',
  'Medical Equipment',
  'Medical Practice',
  'Medical Spa',
  'Medical Supply',
  'Medical Transportation',
  'Meditation Center',
  'Mental Health & Counseling',
  'Metal Fabrication',
  'Microblading',
  'Midwife',
  'Military Surplus',
  'Millwork',
  'Mini Golf',
  'Mini Storage',
  'Mobile App Development',
  'Mobile Car Wash',
  'Mobile Home',
  'Mobile Notary',
  'Modeling Agency',
  'Mold Remediation',
  'Money Transfer',
  'Montessori School',
  'Mortgage Broker',
  'Mortgage & Lending',
  'Mosque',
  'Motel',
  'Motorcycle Dealer',
  'Motorcycle Repair',
  'Motorsports',
  'Moving & Storage',
  'MRI Center',
  'Muffler Shop',
  'Museum',
  'Music Lessons',
  'Music Production',
  'Music Store',
  'Nail Salon',
  'Nanny Services',
  'Naturopathy',
  'Network Solutions',
  'Newspaper',
  'Nightclub',
  'Non-Profit',
  'Notary Public',
  'Nurse Practitioner',
  'Nursing Home',
  'Nutrition & Dietetics',
  'Occupational Therapy',
  'Office Cleaning',
  'Office Furniture',
  'Office Space',
  'Office Supply',
  'Oil Change',
  'Online Store',
  'Ophthalmology',
  'Optometry',
  'Oral Surgery',
  'Organic Food',
  'Orthodontics',
  'Orthopedics',
  'Osteopath',
  'Outdoor Furniture',
  'Outdoor Recreation',
  'Outlet Store',
  'Packaging & Shipping',
  'Packing Services',
  'Pain Management',
  'Paint Store',
  'Painting',
  'Pallet Services',
  'Paper Supply',
  'Paralegal',
  'Parking Lot',
  'Parkour',
  'Party Bus',
  'Party Planning',
  'Party Rentals',
  'Party Supply',
  'Passport Services',
  'Pastry Shop',
  'Patent Attorney',
  'Pawn Shop',
  'Payroll Services',
  'Pediatrics',
  'Performing Arts',
  'Permanent Makeup',
  'Personal Chef',
  'Personal Injury Attorney',
  'Personal Shopper',
  'Personal Training',
  'Pest Control',
  'Pet Boarding',
  'Pet Grooming',
  'Pet Services',
  'Pet Sitting',
  'Pet Store',
  'Pet Training',
  'Petroleum',
  'Pharmacy',
  'Phone Accessories',
  'Photo Booth',
  'Photo Lab',
  'Photography & Video',
  'Physical Therapy',
  'Piano Tuning',
  'Pilates',
  'Pizza Shop',
  'Plastics',
  'Playground Equipment',
  'Plumbing',
  'Podiatry',
  'Pool Cleaning',
  'Pool Construction',
  'Pool Supply',
  'Portrait Studio',
  'Post Office',
  'Powder Coating',
  'Power Washing',
  'PR Agency',
  'Preschool',
  'Print & Publishing',
  'Printing Services',
  'Private Equity',
  'Private Investigation',
  'Private School',
  'Process Server',
  'Product Design',
  'Professional Services',
  'Promotional Products',
  'Property Management',
  'Prosthetics',
  'Psychiatry',
  'Psychology',
  'Public Adjuster',
  'Public Relations',
  'Public Speaking',
  'Radio & Podcast',
  'Radiator Shop',
  'Radiology',
  'Radon Testing',
  'Rafting & Kayaking',
  'Real Estate',
  'Real Estate Agent',
  'Real Estate Appraiser',
  'Real Estate Attorney',
  'Real Estate Developer',
  'Real Estate Investor',
  'Record Label',
  'Recording Studio',
  'Recreation Center',
  'Recreational Vehicle',
  'Recruiter',
  'Recycling Center',
  'Reflexology',
  'Refrigeration',
  'Rehabilitation Center',
  'Reiki',
  'Religious Goods',
  'Remodeling',
  'Rental Property',
  'Repair Services',
  'Reproductive Health',
  'Research & Development',
  'Residential Care',
  'Resort',
  'Restaurant',
  'Restaurant Equipment',
  'Retail',
  'Retirement Home',
  'Retreats',
  'Rideshare',
  'Rifle Range',
  'Risk Management',
  'Roadside Assistance',
  'Robotics',
  'Roofing',
  'RV Dealer',
  'RV Park',
  'RV Repair',
  'Safety Equipment',
  'Sailing',
  'Salon Equipment',
  'Sandblasting',
  'Sanitation',
  'Satellite TV',
  'Scaffolding',
  'School',
  'School Supply',
  'Scooter Rental',
  'Scrap Metal',
  'Screen Printing',
  'Scuba Diving',
  'Seafood Market',
  'Security Guard',
  'Security Services',
  'Security Systems',
  'Self Defense',
  'Self Storage',
  'Semiconductor',
  'Senior Care',
  'Senior Center',
  'Septic Services',
  'Sewing & Alterations',
  'Sewing Machine',
  'Sharpening Services',
  'Sheet Metal',
  'Shelving',
  'Shipping & Receiving',
  'Shoe Repair',
  'Shoe Store',
  'Shopping Center',
  'Siding',
  'Sign Making',
  'Silk Screen',
  'Skating Rink',
  'Ski Resort',
  'Skincare & Esthetics',
  'Skydiving',
  'Sleep Clinic',
  'Slot Car Racing',
  'Small Engine Repair',
  'Smart Home',
  'Smoke Shop',
  'Smoothie Bar',
  'Snow Removal',
  'Social Media Management',
  'Social Services',
  'Social Worker',
  'Software Development',
  'Solar Energy',
  'Sound & Lighting',
  'Spa & Massage',
  'Speakeasy',
  'Special Education',
  'Special Effects',
  'Specialty Foods',
  'Speech Therapy',
  'Sporting Goods',
  'Sports Bar',
  'Sports Coaching',
  'Sports Medicine',
  'Staffing Agency',
  'Stained Glass',
  'Stair Lift',
  'Stationery',
  'Steel Fabrication',
  'Stock Broker',
  'Stone & Granite',
  'Storage Facility',
  'Structural Engineering',
  'Stucco',
  'Student Housing',
  'Substance Abuse',
  'Summer Camp',
  'Sunglasses',
  'Sunroom',
  'Supplements',
  'Supply Chain',
  'Surgery Center',
  'Surplus Store',
  'Surveyor',
  'Sushi Bar',
  'Swimming Lessons',
  'Synagogue',
  'T-Shirt Printing',
  'Tailoring & Alterations',
  'Talent Agency',
  'Tanning Salon',
  'Tattoo Parlor',
  'Tax Preparation',
  'Tax Attorney',
  'Taxi & Rideshare',
  'Tea Shop',
  'Tech Support',
  'Technology',
  'Teeth Whitening',
  'Telecommunications',
  'Telehealth',
  'Temp Agency',
  'Temple',
  'Tent Rental',
  'Termite Control',
  'Test Prep',
  'Textile',
  'Theater',
  'Thrift Store',
  'Tile & Grout',
  'Timber',
  'Tire Shop',
  'Title & Escrow',
  'Title Company',
  'Tool Rental',
  'Tour Operator',
  'Tow Truck',
  'Towing',
  'Toy Store',
  'Trade School',
  'Trailer Rental',
  'Trainer',
  'Training & Development',
  'Transcription',
  'Translation Services',
  'Transmission Repair',
  'Transportation',
  'Travel Agency',
  'Travel & Tourism',
  'Tree Service',
  'Trophy Shop',
  'Truck Rental',
  'Truck Stop',
  'Trucking & Freight',
  'Tutoring',
  'Tuxedo Rental',
  'Typing Services',
  'Ultrasound',
  'Umbrella',
  'Uniform Store',
  'Upholstery',
  'Urgent Care',
  'Used Car Dealer',
  'Utility Company',
  'Vacation Rental',
  'Vacuum Cleaner',
  'Valet Parking',
  'Vape Shop',
  'Vascular Surgery',
  'Vegan Restaurant',
  'Vegetarian Restaurant',
  'Vehicle Wrap',
  'Vending Machine',
  'Venetian Blinds',
  'Venue & Event Space',
  'Veterinarian',
  'Video Game Store',
  'Video Production',
  'Vintage Clothing',
  'Violin Shop',
  'Virtual Assistant',
  'Virtual Reality',
  'Vision Center',
  'Vitamin Store',
  'Vocational School',
  'Voice Lessons',
  'VoIP Services',
  'Wallpaper',
  'Warehouse',
  'Waste Management',
  'Watch Repair',
  'Water Damage',
  'Water Delivery',
  'Water Filtration',
  'Water Heater',
  'Water Sports',
  'Water Treatment',
  'Waterproofing',
  'Waxing Services',
  'Web Design',
  'Web & App Development',
  'Web Hosting',
  'Wedding Cake',
  'Wedding DJ',
  'Wedding Dress',
  'Wedding Photography',
  'Wedding Planner',
  'Wedding Services',
  'Wedding Venue',
  'Weed Control',
  'Weight Loss',
  'Welding',
  'Well Drilling',
  'Wellness Center',
  'Wheelchair Services',
  'Wholesale',
  'Wig Shop',
  'Wildlife Control',
  'Window Cleaning',
  'Window Installation',
  'Window Tinting',
  'Wine Bar',
  'Wine Shop',
  'Winery',
  'Wireless Services',
  'Women\'s Health',
  'Woodworking',
  'Workers Compensation',
  'Workout Studio',
  'Wreath Making',
  'Wrestling',
  'Writing Services',
  'X-Ray',
  'Yacht Club',
  'Yard Care',
  'Yarn Shop',
  'Yoga & Pilates',
  'Youth Center',
  'Youth Sports',
  'Zoo',
  'Zumba',
  'Other'
];

interface FormData {
  business_name: string;
  owner_name: string;
  owner_email: string;
  phone_number: string;
  website_url: string;
  category: string;
  city: string;
  state: string;
  business_description: string;
}

export const ManualLeadEntry: React.FC<ManualLeadEntryProps> = ({ onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showPasteMode, setShowPasteMode] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    owner_name: '',
    owner_email: '',
    phone_number: '',
    website_url: '',
    category: '',
    city: '',
    state: '',
    business_description: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartParse = async () => {
    if (!pasteText.trim()) {
      toast.error('Please paste some text first');
      return;
    }

    setIsParsing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-business-info', {
        body: { text: pasteText }
      });

      if (error) throw error;

      if (data?.success && data?.data) {
        const parsed = data.data;
        setFormData({
          business_name: parsed.business_name || '',
          owner_name: parsed.owner_name || '',
          owner_email: parsed.owner_email || '',
          phone_number: parsed.phone_number || '',
          website_url: parsed.website_url || '',
          category: parsed.category || '',
          city: parsed.city || '',
          state: parsed.state || '',
          business_description: parsed.business_description || ''
        });
        setShowPasteMode(false);
        toast.success('Business info extracted! Review and save.');
      } else {
        toast.error(data?.error || 'Could not extract business info');
      }
    } catch (error: any) {
      console.error('Parse error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit reached. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits exhausted. Please add funds.');
      } else {
        toast.error('Failed to parse business info');
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name.trim()) {
      toast.error('Business name is required');
      return;
    }

    if (!formData.owner_email.trim() && !formData.phone_number.trim()) {
      toast.error('Please provide at least an email or phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('b2b_external_leads')
        .insert({
          business_name: formData.business_name.trim(),
          owner_name: formData.owner_name.trim() || null,
          owner_email: formData.owner_email.trim() || null,
          phone_number: formData.phone_number.trim() || null,
          website_url: formData.website_url.trim() || null,
          category: formData.category || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          business_description: formData.business_description.trim() || null,
          source_query: 'manual_entry',
          discovered_by_user_id: user?.user?.id || null,
          validation_status: 'pending',
          is_visible_in_directory: true
        });

      if (error) throw error;

      toast.success('Business lead added successfully!');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error adding lead:', error);
      toast.error(error.message || 'Failed to add business lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-white/10 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Plus className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Add Business Lead</h2>
              <p className="text-sm text-blue-200">Paste info or enter manually</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Smart Paste Mode */}
          {showPasteMode && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-purple-300">
                <Wand2 className="w-4 h-4" />
                <span className="font-medium">Smart Paste</span>
              </div>
              <p className="text-sm text-blue-200">
                Copy contact info from a website and paste it below. AI will extract the details automatically.
              </p>
              <Textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Paste business info here...

Example:
Aura Hair Salon
Contact: Sarah Johnson
Email: info@aurahair.com
Phone: (404) 555-1234
123 Main Street, Atlanta, GA
www.aurahairsalon.com`}
                className="bg-white/5 border-white/20 text-white min-h-[120px] font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={handleSmartParse}
                  disabled={isParsing || !pasteText.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                >
                  {isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Extract Info
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasteMode(false)}
                  className="border-white/20 text-white"
                >
                  Manual Entry
                </Button>
              </div>
            </div>
          )}

          {!showPasteMode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPasteMode(true)}
              className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Use Smart Paste
            </Button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name *
              </Label>
              <Input
                value={formData.business_name}
                onChange={(e) => handleChange('business_name', e.target.value)}
                placeholder="e.g., Aura Hair Salon"
                className="bg-white/5 border-white/20 text-white"
                required
              />
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Owner Name
              </Label>
              <Input
                value={formData.owner_name}
                onChange={(e) => handleChange('owner_name', e.target.value)}
                placeholder="e.g., John Smith"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => handleChange('owner_email', e.target.value)}
                  placeholder="owner@business.com"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website
              </Label>
              <Input
                type="url"
                value={formData.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                placeholder="https://www.business.com"
                className="bg-white/5 border-white/20 text-white"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-white">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City & State Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  City
                </Label>
                <Input
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g., Atlanta"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="e.g., GA"
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white">Description (optional)</Label>
              <Textarea
                value={formData.business_description}
                onChange={(e) => handleChange('business_description', e.target.value)}
                placeholder="Brief description of the business..."
                className="bg-white/5 border-white/20 text-white min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="outline" onClick={onClose} className="border-white/20 text-white">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                {isSubmitting ? 'Adding...' : 'Add Lead'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
