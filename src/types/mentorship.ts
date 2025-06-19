
export interface MentorProfile {
  id: string;
  user_id: string;
  business_id?: string;
  expertise_areas: string[];
  industries: string[];
  years_experience: number;
  mentoring_capacity: number;
  current_mentees: number;
  bio: string;
  availability_hours: string;
  preferred_communication: string[];
  is_active: boolean;
  rating: number;
  total_mentees: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  user_name?: string;
  user_email?: string;
  business_name?: string;
  profile_image?: string;
}

export interface MenteeApplication {
  id: string;
  user_id: string;
  business_stage: 'idea' | 'startup' | 'early' | 'growth';
  industry_interest: string;
  goals: string[];
  specific_help_needed: string;
  experience_level: string;
  time_commitment: string;
  preferred_mentor_type: string;
  application_status: 'pending' | 'approved' | 'matched' | 'rejected';
  created_at: string;
  updated_at: string;
  
  // Joined data
  user_name?: string;
  user_email?: string;
  profile_image?: string;
}

export interface MentorshipMatch {
  id: string;
  mentor_id: string;
  mentee_id: string;
  match_status: 'pending' | 'active' | 'completed' | 'paused';
  match_score: number;
  start_date: string;
  end_date?: string;
  goals_set: string[];
  progress_notes: string;
  mentor_rating?: number;
  mentee_rating?: number;
  created_at: string;
  updated_at: string;
  
  // Joined data
  mentor_name?: string;
  mentee_name?: string;
  mentor_business?: string;
}

export interface MentorshipSession {
  id: string;
  match_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: 'video' | 'phone' | 'in-person' | 'email';
  topics_discussed: string[];
  action_items: string[];
  mentor_notes?: string;
  mentee_notes?: string;
  created_at: string;
}
