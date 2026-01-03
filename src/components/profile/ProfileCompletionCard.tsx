import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, Phone, MapPin, Camera, Gift, ChevronRight, 
  CheckCircle, Sparkles, X 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileField {
  key: string;
  label: string;
  icon: React.ElementType;
  points: number;
  type: 'text' | 'tel' | 'file';
  placeholder: string;
}

const PROFILE_FIELDS: ProfileField[] = [
  { key: 'full_name', label: 'Full Name', icon: User, points: 10, type: 'text', placeholder: 'Enter your full name' },
  { key: 'phone', label: 'Phone Number', icon: Phone, points: 15, type: 'tel', placeholder: 'Enter your phone number' },
  { key: 'address', label: 'Address', icon: MapPin, points: 25, type: 'text', placeholder: 'Enter your address' },
];

interface ProfileCompletionCardProps {
  profile: {
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
    avatar_url?: string | null;
  } | null;
  onUpdate?: () => void;
  compact?: boolean;
}

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({ 
  profile, 
  onUpdate,
  compact = false 
}) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');

  // Calculate completion
  const completedFields = PROFILE_FIELDS.filter(
    field => profile?.[field.key as keyof typeof profile]
  );
  const completionPercentage = Math.round((completedFields.length / PROFILE_FIELDS.length) * 100);
  const totalPossiblePoints = PROFILE_FIELDS.reduce((sum, f) => sum + f.points, 0);
  const earnedPoints = completedFields.reduce((sum, f) => sum + f.points, 0);
  const remainingPoints = totalPossiblePoints - earnedPoints;

  // Don't show if profile is complete
  if (completionPercentage === 100) {
    return null;
  }

  const handleSaveField = async (fieldKey: string) => {
    if (!user || !fieldValue.trim()) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [fieldKey]: fieldValue.trim() })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Profile updated! +${PROFILE_FIELDS.find(f => f.key === fieldKey)?.points} points earned!`);
      setEditingField(null);
      setFieldValue('');
      onUpdate?.();
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div 
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-mansagold/10 to-amber-500/10 border border-mansagold/20 cursor-pointer hover:border-mansagold/40 transition-colors"
      >
        <div className="relative">
          <Progress value={completionPercentage} className="w-12 h-12 rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {completionPercentage}%
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">Complete your profile</p>
          <p className="text-xs text-muted-foreground">Earn {remainingPoints} bonus points</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="border-2 border-mansagold/30 bg-gradient-to-br from-mansagold/5 to-amber-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-mansagold" />
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-mansagold" />
            <span className="text-sm font-bold text-mansagold">+{remainingPoints} pts available</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile completion</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Fields List */}
        <div className="space-y-2">
          {PROFILE_FIELDS.map((field) => {
            const isCompleted = !!profile?.[field.key as keyof typeof profile];
            const isEditing = editingField === field.key;
            const Icon = field.icon;

            return (
              <div
                key={field.key}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                    : 'bg-background border-border hover:border-mansagold/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        type={field.type}
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        placeholder={field.placeholder}
                        className="flex-1"
                        autoFocus
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveField(field.key)}
                        disabled={isLoading || !fieldValue.trim()}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => {
                          setEditingField(null);
                          setFieldValue('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-sm">{field.label}</p>
                      {isCompleted ? (
                        <p className="text-xs text-green-600">+{field.points} points earned!</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">+{field.points} points</p>
                      )}
                    </>
                  )}
                </div>

                {!isCompleted && !isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingField(field.key)}
                    className="border-mansagold/50 text-mansagold hover:bg-mansagold/10"
                  >
                    Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCompletionCard;
