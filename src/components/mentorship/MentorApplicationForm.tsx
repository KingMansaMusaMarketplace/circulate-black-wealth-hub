
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const MentorApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    years_experience: '',
    expertise_areas: [] as string[],
    industries: [] as string[],
    bio: '',
    mentoring_capacity: '',
    availability_hours: '',
    preferred_communication: [] as string[],
    previous_mentoring: '',
    why_mentor: ''
  });

  const expertiseOptions = [
    'Marketing & Advertising',
    'Financial Planning',
    'Operations Management',
    'Product Development',
    'Digital Strategy',
    'Sales & Business Development',
    'Human Resources',
    'Legal & Compliance',
    'Scaling & Growth',
    'Brand Building',
    'Customer Service',
    'Supply Chain Management',
    'Technology & IT',
    'Fundraising & Investment'
  ];

  const industryOptions = [
    'Technology',
    'E-commerce',
    'Retail',
    'Food & Beverage',
    'Beauty & Wellness',
    'Healthcare',
    'Financial Services',
    'Real Estate',
    'Education',
    'Construction',
    'Professional Services',
    'Manufacturing',
    'Transportation',
    'Agriculture'
  ];

  const communicationOptions = [
    'Video Call',
    'Phone',
    'In-Person',
    'Email',
    'Text/Messaging',
    'Group Sessions'
  ];

  const handleArrayChange = (item: string, checked: boolean, field: 'expertise_areas' | 'industries' | 'preferred_communication') => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], item]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter(i => i !== item)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to submit mentor application
      console.log('Submitting mentor application:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Mentor application submitted successfully! We\'ll review it and get back to you soon.');
      
      // Reset form
      setFormData({
        years_experience: '',
        expertise_areas: [],
        industries: [],
        bio: '',
        mentoring_capacity: '',
        availability_hours: '',
        preferred_communication: [],
        previous_mentoring: '',
        why_mentor: ''
      });
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Become a Mentor</CardTitle>
        <p className="text-gray-600">
          Share your expertise and help the next generation of Black entrepreneurs succeed.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Years of Experience */}
          <div>
            <Label htmlFor="experience">Years of business experience</Label>
            <Input
              id="experience"
              type="number"
              min="1"
              value={formData.years_experience}
              onChange={(e) => setFormData(prev => ({ ...prev, years_experience: e.target.value }))}
              placeholder="e.g., 5"
              className="mt-2"
            />
          </div>

          {/* Expertise Areas */}
          <div>
            <Label className="text-base font-medium">Areas of expertise (Select all that apply)</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {expertiseOptions.map(expertise => (
                <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.expertise_areas.includes(expertise)}
                    onCheckedChange={(checked) => handleArrayChange(expertise, checked as boolean, 'expertise_areas')}
                  />
                  <span className="text-sm">{expertise}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <Label className="text-base font-medium">Industries you have experience in</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {industryOptions.map(industry => (
                <label key={industry} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.industries.includes(industry)}
                    onCheckedChange={(checked) => handleArrayChange(industry, checked as boolean, 'industries')}
                  />
                  <span className="text-sm">{industry}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Professional bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell potential mentees about your background, achievements, and what makes you a great mentor..."
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Mentoring Capacity */}
          <div>
            <Label htmlFor="capacity">How many mentees can you work with at once?</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="10"
              value={formData.mentoring_capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, mentoring_capacity: e.target.value }))}
              placeholder="e.g., 3"
              className="mt-2"
            />
          </div>

          {/* Availability */}
          <div>
            <Label htmlFor="availability">When are you typically available?</Label>
            <Input
              id="availability"
              value={formData.availability_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, availability_hours: e.target.value }))}
              placeholder="e.g., Evenings and weekends, Weekday mornings..."
              className="mt-2"
            />
          </div>

          {/* Communication Preferences */}
          <div>
            <Label className="text-base font-medium">Preferred communication methods</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {communicationOptions.map(method => (
                <label key={method} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.preferred_communication.includes(method)}
                    onCheckedChange={(checked) => handleArrayChange(method, checked as boolean, 'preferred_communication')}
                  />
                  <span className="text-sm">{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Previous Mentoring Experience */}
          <div>
            <Label htmlFor="previous">Previous mentoring experience (if any)</Label>
            <Textarea
              id="previous"
              value={formData.previous_mentoring}
              onChange={(e) => setFormData(prev => ({ ...prev, previous_mentoring: e.target.value }))}
              placeholder="Describe any formal or informal mentoring you've done..."
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Why Mentor */}
          <div>
            <Label htmlFor="why">Why do you want to be a mentor?</Label>
            <Textarea
              id="why"
              value={formData.why_mentor}
              onChange={(e) => setFormData(prev => ({ ...prev, why_mentor: e.target.value }))}
              placeholder="What motivates you to mentor other entrepreneurs?"
              className="mt-2"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-mansablue hover:bg-mansablue-dark"
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Mentor Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MentorApplicationForm;
