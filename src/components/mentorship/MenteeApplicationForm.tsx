
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { MenteeApplication } from '@/types/mentorship';

const MenteeApplicationForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_stage: '',
    industry_interest: '',
    goals: [] as string[],
    specific_help_needed: '',
    experience_level: '',
    time_commitment: '',
    preferred_mentor_type: ''
  });

  const businessStages = [
    { value: 'idea', label: 'Just an idea - need help getting started' },
    { value: 'startup', label: 'Recently started (0-1 year)' },
    { value: 'early', label: 'Early stage (1-3 years)' },
    { value: 'growth', label: 'Growth stage (3+ years)' }
  ];

  const goalOptions = [
    'Develop a business plan',
    'Secure funding',
    'Build a marketing strategy',
    'Improve operations',
    'Scale the business',
    'Financial planning',
    'Team building',
    'Product development',
    'Legal guidance',
    'Network building'
  ];

  const experienceLevels = [
    'Complete beginner',
    'Some business knowledge',
    'Previous startup experience',
    'Serial entrepreneur'
  ];

  const timeCommitments = [
    '1-2 hours per month',
    '3-4 hours per month',
    '1 hour per week',
    '2+ hours per week'
  ];

  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goal]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        goals: prev.goals.filter(g => g !== goal)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement API call to submit mentee application
      console.log('Submitting mentee application:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Application submitted successfully! We\'ll review it and get back to you soon.');
      
      // Reset form
      setFormData({
        business_stage: '',
        industry_interest: '',
        goals: [],
        specific_help_needed: '',
        experience_level: '',
        time_commitment: '',
        preferred_mentor_type: ''
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
        <CardTitle className="text-2xl">Apply to be a Mentee</CardTitle>
        <p className="text-gray-600">
          Tell us about your business and goals so we can match you with the right mentor.
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Stage */}
          <div>
            <Label className="text-base font-medium">What stage is your business in?</Label>
            <div className="mt-3 space-y-2">
              {businessStages.map(stage => (
                <label key={stage.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="business_stage"
                    value={stage.value}
                    checked={formData.business_stage === stage.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_stage: e.target.value }))}
                    className="text-mansablue focus:ring-mansablue"
                  />
                  <span>{stage.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry Interest */}
          <div>
            <Label htmlFor="industry">What industry are you interested in?</Label>
            <Input
              id="industry"
              value={formData.industry_interest}
              onChange={(e) => setFormData(prev => ({ ...prev, industry_interest: e.target.value }))}
              placeholder="e.g., Technology, Food & Beverage, Retail..."
              className="mt-2"
            />
          </div>

          {/* Goals */}
          <div>
            <Label className="text-base font-medium">What are your main goals? (Select all that apply)</Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {goalOptions.map(goal => (
                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={formData.goals.includes(goal)}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Specific Help */}
          <div>
            <Label htmlFor="help">What specific help do you need?</Label>
            <Textarea
              id="help"
              value={formData.specific_help_needed}
              onChange={(e) => setFormData(prev => ({ ...prev, specific_help_needed: e.target.value }))}
              placeholder="Describe the challenges you're facing and what kind of guidance would be most valuable..."
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Experience Level */}
          <div>
            <Label className="text-base font-medium">What's your experience level?</Label>
            <div className="mt-3 space-y-2">
              {experienceLevels.map(level => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="experience_level"
                    value={level}
                    checked={formData.experience_level === level}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="text-mansablue focus:ring-mansablue"
                  />
                  <span>{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Commitment */}
          <div>
            <Label className="text-base font-medium">How much time can you commit to mentorship?</Label>
            <div className="mt-3 space-y-2">
              {timeCommitments.map(time => (
                <label key={time} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="time_commitment"
                    value={time}
                    checked={formData.time_commitment === time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_commitment: e.target.value }))}
                    className="text-mansablue focus:ring-mansablue"
                  />
                  <span>{time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Mentor Type */}
          <div>
            <Label htmlFor="mentor-type">What type of mentor are you looking for?</Label>
            <Textarea
              id="mentor-type"
              value={formData.preferred_mentor_type}
              onChange={(e) => setFormData(prev => ({ ...prev, preferred_mentor_type: e.target.value }))}
              placeholder="Describe your ideal mentor (industry experience, communication style, specific expertise, etc.)"
              className="mt-2"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-mansablue hover:bg-mansablue-dark"
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MenteeApplicationForm;
