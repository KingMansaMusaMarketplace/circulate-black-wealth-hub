export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          business_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          points_involved: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          points_involved?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          points_involved?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_commissions: {
        Row: {
          amount: number
          due_date: string | null
          id: string
          paid_date: string | null
          payment_reference: string | null
          referral_id: string
          sales_agent_id: string
          status: string | null
        }
        Insert: {
          amount: number
          due_date?: string | null
          id?: string
          paid_date?: string | null
          payment_reference?: string | null
          referral_id: string
          sales_agent_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          due_date?: string | null
          id?: string
          paid_date?: string | null
          payment_reference?: string | null
          referral_id?: string
          sales_agent_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: true
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commissions_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_attempt_log: {
        Row: {
          attempt_time: string | null
          email: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          booking_date: string
          business_amount: number
          business_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string | null
          duration_minutes: number
          id: string
          notes: string | null
          payment_intent_id: string | null
          platform_fee: number
          service_id: string | null
          status: string | null
          stripe_charge_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_date: string
          business_amount: number
          business_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone?: string | null
          duration_minutes: number
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          platform_fee?: number
          service_id?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_date?: string
          business_amount?: number
          business_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          payment_intent_id?: string | null
          platform_fee?: number
          service_id?: string | null
          status?: string | null
          stripe_charge_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "business_services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          business_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          business_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          business_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_access_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_access_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_analytics: {
        Row: {
          business_id: string
          created_at: string | null
          date_recorded: string
          id: string
          metric_type: string
          metric_value: number
        }
        Insert: {
          business_id: string
          created_at?: string | null
          date_recorded?: string
          id?: string
          metric_type: string
          metric_value: number
        }
        Update: {
          business_id?: string
          created_at?: string | null
          date_recorded?: string
          id?: string
          metric_type?: string
          metric_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_availability: {
        Row: {
          business_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_availability_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_availability_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_interactions: {
        Row: {
          business_id: string
          created_at: string
          id: string
          interaction_score: number | null
          interaction_type: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          interaction_score?: number | null
          interaction_type: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          interaction_score?: number | null
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_interactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_interactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_payment_accounts: {
        Row: {
          account_status: string
          business_id: string
          charges_enabled: boolean | null
          created_at: string | null
          id: string
          payouts_enabled: boolean | null
          requirements_due: Json | null
          stripe_account_id: string
          updated_at: string | null
        }
        Insert: {
          account_status?: string
          business_id: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payouts_enabled?: boolean | null
          requirements_due?: Json | null
          stripe_account_id: string
          updated_at?: string | null
        }
        Update: {
          account_status?: string
          business_id?: string
          charges_enabled?: boolean | null
          created_at?: string | null
          id?: string
          payouts_enabled?: boolean | null
          requirements_due?: Json | null
          stripe_account_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_payment_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_payment_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_services: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_verifications: {
        Row: {
          address_document_url: string | null
          admin_notes: string | null
          business_id: string
          created_at: string
          id: string
          ownership_document_url: string | null
          ownership_percentage: number | null
          registration_document_url: string | null
          rejection_reason: string | null
          submitted_at: string
          updated_at: string
          verification_status: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          address_document_url?: string | null
          admin_notes?: string | null
          business_id: string
          created_at?: string
          id?: string
          ownership_document_url?: string | null
          ownership_percentage?: number | null
          registration_document_url?: string | null
          rejection_reason?: string | null
          submitted_at?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          address_document_url?: string | null
          admin_notes?: string | null
          business_id?: string
          created_at?: string
          id?: string
          ownership_document_url?: string | null
          ownership_percentage?: number | null
          registration_document_url?: string | null
          rejection_reason?: string | null
          submitted_at?: string
          updated_at?: string
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_verifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_verifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          average_rating: number | null
          banner_url: string | null
          business_name: string
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          is_verified: boolean | null
          location_manager_id: string | null
          location_name: string | null
          location_type: string | null
          logo_url: string | null
          name: string
          owner_id: string
          parent_business_id: string | null
          phone: string | null
          qr_code_id: string | null
          qr_code_url: string | null
          review_count: number | null
          state: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          banner_url?: string | null
          business_name: string
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name: string
          owner_id: string
          parent_business_id?: string | null
          phone?: string | null
          qr_code_id?: string | null
          qr_code_url?: string | null
          review_count?: number | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          banner_url?: string | null
          business_name?: string
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name?: string
          owner_id?: string
          parent_business_id?: string | null
          phone?: string | null
          qr_code_id?: string | null
          qr_code_url?: string | null
          review_count?: number | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      community_aggregate_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          participant_count: number | null
          period_end: string
          period_start: string
          total_value: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          participant_count?: number | null
          period_end: string
          period_start: string
          total_value?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          participant_count?: number | null
          period_end?: string
          period_start?: string
          total_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      community_events: {
        Row: {
          business_id: string | null
          created_at: string
          current_attendees: number | null
          description: string | null
          event_date: string
          id: string
          is_featured: boolean | null
          is_virtual: boolean | null
          location: string | null
          max_attendees: number | null
          organizer_id: string
          title: string
          updated_at: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          event_date: string
          id?: string
          is_featured?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          organizer_id: string
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          current_attendees?: number | null
          description?: string | null
          event_date?: string
          id?: string
          is_featured?: boolean | null
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      community_impact_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: number
          period_end: string
          period_start: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value?: number
          period_end: string
          period_start: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: number
          period_end?: string
          period_start?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          content: string
          created_at: string | null
          email_type: string
          id: string
          recipient_email: string
          sent_at: string | null
          status: string | null
          subject: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          email_type: string
          id?: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
          subject: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          email_type?: string
          id?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "community_events"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_auth_attempts: {
        Row: {
          attempt_time: string | null
          email: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      forum_likes: {
        Row: {
          created_at: string
          id: string
          reply_id: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          is_featured: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string
          user_id: string
          views_count: number | null
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string
          user_id: string
          views_count?: number | null
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hbcu_verifications: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      loyalty_points: {
        Row: {
          business_id: string
          created_at: string | null
          customer_id: string
          id: string
          points: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          points?: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          points?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          event_reminders: boolean | null
          id: string
          location_based: boolean | null
          loyalty_updates: boolean | null
          marketing_emails: boolean | null
          new_businesses: boolean | null
          point_milestones: boolean | null
          push_notifications: boolean | null
          reward_expiry: boolean | null
          sms_notifications: boolean | null
          special_offers: boolean | null
          updated_at: string | null
          user_id: string
          weekly_digest: boolean | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          location_based?: boolean | null
          loyalty_updates?: boolean | null
          marketing_emails?: boolean | null
          new_businesses?: boolean | null
          point_milestones?: boolean | null
          push_notifications?: boolean | null
          reward_expiry?: boolean | null
          sms_notifications?: boolean | null
          special_offers?: boolean | null
          updated_at?: string | null
          user_id: string
          weekly_digest?: boolean | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          event_reminders?: boolean | null
          id?: string
          location_based?: boolean | null
          loyalty_updates?: boolean | null
          marketing_emails?: boolean | null
          new_businesses?: boolean | null
          point_milestones?: boolean | null
          push_notifications?: boolean | null
          reward_expiry?: boolean | null
          sms_notifications?: boolean | null
          special_offers?: boolean | null
          updated_at?: string | null
          user_id?: string
          weekly_digest?: boolean | null
        }
        Relationships: []
      }
      personal_data_access_audit: {
        Row: {
          access_reason: string | null
          accessed_at: string | null
          accessed_by: string
          data_type: string
          id: string
          ip_address: unknown | null
          target_user_id: string
          user_agent: string | null
        }
        Insert: {
          access_reason?: string | null
          accessed_at?: string | null
          accessed_by: string
          data_type: string
          id?: string
          ip_address?: unknown | null
          target_user_id: string
          user_agent?: string | null
        }
        Update: {
          access_reason?: string | null
          accessed_at?: string | null
          accessed_by?: string
          data_type?: string
          id?: string
          ip_address?: unknown | null
          target_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      platform_transactions: {
        Row: {
          amount_business: number
          amount_platform_fee: number
          amount_total: number
          business_id: string
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          description: string | null
          id: string
          metadata: Json | null
          platform_fee_percentage: number | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string
          updated_at: string | null
        }
        Insert: {
          amount_business: number
          amount_platform_fee: number
          amount_total: number
          business_id: string
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          platform_fee_percentage?: number | null
          status: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id: string
          updated_at?: string | null
        }
        Update: {
          amount_business?: number
          amount_platform_fee?: number
          amount_total?: number
          business_id?: string
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          platform_fee_percentage?: number | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          business_id: string
          category: string | null
          compressed_size: number | null
          compression_savings: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          meta_description: string | null
          original_size: number | null
          price: string | null
          tags: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          alt_text?: string | null
          business_id: string
          category?: string | null
          compressed_size?: number | null
          compression_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          meta_description?: string | null
          original_size?: number | null
          price?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          alt_text?: string | null
          business_id?: string
          category?: string | null
          compressed_size?: number | null
          compression_savings?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          meta_description?: string | null
          original_size?: number | null
          price?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          business_category: string | null
          business_description: string | null
          business_logo_url: string | null
          business_name: string | null
          business_website: string | null
          city: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          hbcu_verification_status:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id: string
          is_hbcu_member: boolean | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_type: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          business_category?: string | null
          business_description?: string | null
          business_logo_url?: string | null
          business_name?: string | null
          business_website?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hbcu_verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id: string
          is_hbcu_member?: boolean | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_type: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          business_category?: string | null
          business_description?: string | null
          business_logo_url?: string | null
          business_name?: string | null
          business_website?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          hbcu_verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id?: string
          is_hbcu_member?: boolean | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_type?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          business_id: string
          code_type: string
          created_at: string | null
          current_scans: number | null
          discount_percentage: number | null
          expiration_date: string | null
          id: string
          is_active: boolean | null
          points_value: number | null
          qr_image_url: string | null
          scan_limit: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          code_type: string
          created_at?: string | null
          current_scans?: number | null
          discount_percentage?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          points_value?: number | null
          qr_image_url?: string | null
          scan_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          code_type?: string
          created_at?: string | null
          current_scans?: number | null
          discount_percentage?: number | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          points_value?: number | null
          qr_image_url?: string | null
          scan_limit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_scans: {
        Row: {
          business_id: string
          created_at: string | null
          customer_id: string
          discount_applied: number | null
          id: string
          location_lat: number | null
          location_lng: number | null
          points_awarded: number | null
          qr_code_id: string
          scan_date: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_id: string
          discount_applied?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          points_awarded?: number | null
          qr_code_id: string
          scan_date?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_id?: string
          discount_applied?: number | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          points_awarded?: number | null
          qr_code_id?: string
          scan_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_scans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_scans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_scans_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limit_log: {
        Row: {
          attempt_count: number | null
          blocked_until: string | null
          id: string
          ip_address: unknown | null
          operation: string
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown | null
          operation: string
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown | null
          operation?: string
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      redeemed_rewards: {
        Row: {
          business_id: string | null
          created_at: string | null
          customer_id: string
          expiration_date: string | null
          id: string
          is_used: boolean | null
          points_used: number
          redemption_date: string | null
          reward_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          customer_id: string
          expiration_date?: string | null
          id?: string
          is_used?: boolean | null
          points_used: number
          redemption_date?: string | null
          reward_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          customer_id?: string
          expiration_date?: string | null
          id?: string
          is_used?: boolean | null
          points_used?: number
          redemption_date?: string | null
          reward_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redeemed_rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeemed_rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeemed_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_clicks: {
        Row: {
          clicked_at: string | null
          converted: boolean | null
          converted_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          referral_code: string
          sales_agent_id: string
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string | null
          converted?: boolean | null
          converted_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code: string
          sales_agent_id: string
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string | null
          converted?: boolean | null
          converted_user_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          referral_code?: string
          sales_agent_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          commission_amount: number | null
          commission_status: string | null
          id: string
          payment_date: string | null
          referral_date: string | null
          referred_user_id: string
          referred_user_type: string
          sales_agent_id: string
          subscription_amount: number | null
        }
        Insert: {
          commission_amount?: number | null
          commission_status?: string | null
          id?: string
          payment_date?: string | null
          referral_date?: string | null
          referred_user_id: string
          referred_user_type: string
          sales_agent_id: string
          subscription_amount?: number | null
        }
        Update: {
          commission_amount?: number | null
          commission_status?: string | null
          id?: string
          payment_date?: string | null
          referral_date?: string | null
          referred_user_id?: string
          referred_user_type?: string
          sales_agent_id?: string
          subscription_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          created_at: string | null
          customer_id: string
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          business_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_global: boolean | null
          points_cost: number
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_global?: boolean | null
          points_cost: number
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_global?: boolean | null
          points_cost?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_audit: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_agent_applications: {
        Row: {
          application_date: string | null
          application_status: string | null
          business_experience: string | null
          id: string
          marketing_ideas: string | null
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          test_passed: boolean | null
          test_score: number | null
          updated_at: string | null
          user_id: string
          why_join: string | null
        }
        Insert: {
          application_date?: string | null
          application_status?: string | null
          business_experience?: string | null
          id?: string
          marketing_ideas?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          updated_at?: string | null
          user_id: string
          why_join?: string | null
        }
        Update: {
          application_date?: string | null
          application_status?: string | null
          business_experience?: string | null
          id?: string
          marketing_ideas?: string | null
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          updated_at?: string | null
          user_id?: string
          why_join?: string | null
        }
        Relationships: []
      }
      sales_agent_applications_personal_data: {
        Row: {
          application_id: string
          created_at: string
          data_hash: string
          encrypted_email: string
          encrypted_full_name: string
          encrypted_phone: string | null
          id: string
          last_accessed_at: string | null
          last_accessed_by: string | null
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          data_hash: string
          encrypted_email: string
          encrypted_full_name: string
          encrypted_phone?: string | null
          id?: string
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          data_hash?: string
          encrypted_email?: string
          encrypted_full_name?: string
          encrypted_phone?: string | null
          id?: string
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_application_personal_data"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "sales_agent_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_agent_test_attempts: {
        Row: {
          answers: Json | null
          attempt_date: string | null
          completed_date: string | null
          id: string
          passed: boolean
          score: number
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          attempt_date?: string | null
          completed_date?: string | null
          id?: string
          passed: boolean
          score: number
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          attempt_date?: string | null
          completed_date?: string | null
          id?: string
          passed?: boolean
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      sales_agent_tests: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          is_active: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
        }
        Relationships: []
      }
      sales_agents: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_tier_update: string | null
          lifetime_referrals: number | null
          monthly_referrals: number | null
          phone: string | null
          referral_code: string
          tier: string | null
          total_earned: number | null
          total_pending: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean | null
          last_tier_update?: string | null
          lifetime_referrals?: number | null
          monthly_referrals?: number | null
          phone?: string | null
          referral_code: string
          tier?: string | null
          total_earned?: number | null
          total_pending?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_tier_update?: string | null
          lifetime_referrals?: number | null
          monthly_referrals?: number | null
          phone?: string | null
          referral_code?: string
          tier?: string | null
          total_earned?: number | null
          total_pending?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          record_id: string | null
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          record_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_shares: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          platform: string
          share_url: string | null
          shared_at: string | null
          shared_by: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          platform: string
          share_url?: string | null
          shared_at?: string | null
          shared_by?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          platform?: string
          share_url?: string | null
          shared_at?: string | null
          shared_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_shares_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_shares_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          company_address: string | null
          company_city: string | null
          company_name: string
          company_size: string | null
          company_state: string | null
          company_website: string | null
          company_zip_code: string | null
          contact_name: string
          contact_title: string | null
          created_at: string | null
          email: string
          id: string
          industry: string | null
          message: string | null
          phone: string
          sponsorship_tier: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_address?: string | null
          company_city?: string | null
          company_name: string
          company_size?: string | null
          company_state?: string | null
          company_website?: string | null
          company_zip_code?: string | null
          contact_name: string
          contact_title?: string | null
          created_at?: string | null
          email: string
          id?: string
          industry?: string | null
          message?: string | null
          phone: string
          sponsorship_tier: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_address?: string | null
          company_city?: string | null
          company_name?: string
          company_size?: string | null
          company_state?: string | null
          company_website?: string | null
          company_zip_code?: string | null
          contact_name?: string
          contact_title?: string | null
          created_at?: string | null
          email?: string
          id?: string
          industry?: string | null
          message?: string | null
          phone?: string
          sponsorship_tier?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tenant_configurations: {
        Row: {
          accent_color: string | null
          api_key_hash: string | null
          branding_enabled: boolean | null
          business_id: string
          created_at: string | null
          custom_css: string | null
          custom_domain: string | null
          favicon_url: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          subdomain: string | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          accent_color?: string | null
          api_key_hash?: string | null
          branding_enabled?: boolean | null
          business_id: string
          created_at?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          subdomain?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          accent_color?: string | null
          api_key_hash?: string | null
          branding_enabled?: boolean | null
          business_id?: string
          created_at?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          subdomain?: string | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_configurations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_configurations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number | null
          business_id: string
          created_at: string | null
          customer_id: string
          description: string | null
          discount_applied: number | null
          discount_percentage: number | null
          id: string
          points_earned: number
          points_redeemed: number
          qr_scan_id: string | null
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          amount?: number | null
          business_id: string
          created_at?: string | null
          customer_id: string
          description?: string | null
          discount_applied?: number | null
          discount_percentage?: number | null
          id?: string
          points_earned?: number
          points_redeemed?: number
          qr_scan_id?: string | null
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number | null
          business_id?: string
          created_at?: string | null
          customer_id?: string
          description?: string | null
          discount_applied?: number | null
          discount_percentage?: number | null
          id?: string
          points_earned?: number
          points_redeemed?: number
          qr_scan_id?: string | null
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_discovery_preferences: {
        Row: {
          created_at: string
          id: string
          interests: string[] | null
          max_distance: number | null
          preferred_categories: string[] | null
          price_range_max: number | null
          price_range_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interests?: string[] | null
          max_distance?: number | null
          preferred_categories?: string[] | null
          price_range_max?: number | null
          price_range_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interests?: string[] | null
          max_distance?: number | null
          preferred_categories?: string[] | null
          price_range_max?: number | null
          price_range_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      business_locations_view: {
        Row: {
          business_name: string | null
          city: string | null
          created_at: string | null
          id: string | null
          is_verified: boolean | null
          location_manager_id: string | null
          location_name: string | null
          location_type: string | null
          owner_id: string | null
          parent_business_id: string | null
          parent_business_name: string | null
          state: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "business_locations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      access_personal_data_secure: {
        Args: {
          access_reason: string
          data_type: string
          target_user_id: string
        }
        Returns: Json
      }
      admin_approve_business_verification: {
        Args: { verification_id: string }
        Returns: undefined
      }
      admin_change_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["user_role"]
          reason?: string
          target_user_id: string
        }
        Returns: undefined
      }
      admin_reject_business_verification: {
        Args: { reason: string; verification_id: string }
        Returns: undefined
      }
      assign_admin_role: {
        Args: { user_email: string }
        Returns: undefined
      }
      calculate_user_impact_metrics: {
        Args: { p_user_id: string }
        Returns: Json
      }
      can_access_admin_features: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_auth_rate_limit_secure: {
        Args: { p_email: string; p_ip?: unknown }
        Returns: Json
      }
      check_business_access_rate_limit: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      check_function_exists: {
        Args: { function_name: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: { limit_per_minute?: number; operation_name: string }
        Returns: boolean
      }
      check_rate_limit_secure: {
        Args: {
          max_attempts?: number
          operation_name: string
          window_minutes?: number
        }
        Returns: Json
      }
      create_sales_agent_application_secure: {
        Args: {
          p_business_experience?: string
          p_email: string
          p_full_name: string
          p_marketing_ideas?: string
          p_phone?: string
          p_user_id: string
          p_why_join?: string
        }
        Returns: string
      }
      delete_user_account_immediate: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      exec_sql: {
        Args: { query: string }
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_white_label_api_key: {
        Args: { p_business_id: string }
        Returns: string
      }
      get_active_referral_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_active: boolean
          referral_code: string
        }[]
      }
      get_admin_verification_queue: {
        Args: Record<PropertyKey, never>
        Returns: {
          business_email: string
          business_id: string
          business_name: string
          owner_id: string
          owner_name: string
          ownership_percentage: number
          submitted_at: string
          verification_id: string
          verification_status: string
          verified_at: string
        }[]
      }
      get_agent_referral_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_active: boolean
          referral_code: string
        }[]
      }
      get_application_details: {
        Args: { application_id: string }
        Returns: {
          application_date: string
          application_status: string
          email: string
          full_name: string
          id: string
          notes: string
          phone: string
          reviewed_at: string
          reviewed_by: string
          test_passed: boolean
          test_score: number
          user_id: string
        }[]
      }
      get_application_details_secure: {
        Args: { p_application_id: string }
        Returns: {
          application_date: string
          application_status: string
          business_experience: string
          email: string
          full_name: string
          id: string
          marketing_ideas: string
          notes: string
          phone: string
          reviewed_at: string
          reviewed_by: string
          test_passed: boolean
          test_score: number
          user_id: string
          why_join: string
        }[]
      }
      get_application_personal_data_secure: {
        Args: { p_application_id: string }
        Returns: {
          application_id: string
          decrypted_email: string
          decrypted_full_name: string
          decrypted_phone: string
        }[]
      }
      get_applications_for_review: {
        Args: Record<PropertyKey, never>
        Returns: {
          application_date: string
          application_status: string
          id: string
          notes: string
          reviewed_at: string
          reviewed_by: string
          test_passed: boolean
          test_score: number
        }[]
      }
      get_applications_for_review_secure: {
        Args: Record<PropertyKey, never>
        Returns: {
          application_date: string
          application_status: string
          id: string
          notes: string
          reviewed_at: string
          reviewed_by: string
          test_passed: boolean
          test_score: number
        }[]
      }
      get_business_analytics_summary: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_business_locations: {
        Args: { p_parent_business_id: string }
        Returns: {
          business_name: string
          city: string
          created_at: string
          id: string
          is_verified: boolean
          location_manager_id: string
          location_name: string
          state: string
        }[]
      }
      get_business_verifications_admin_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          address_document_status: string
          admin_notes: string
          business_email: string
          business_id: string
          business_name: string
          id: string
          owner_id: string
          owner_name: string
          ownership_document_status: string
          ownership_percentage: number
          registration_document_status: string
          rejection_reason: string
          submitted_at: string
          verification_status: string
          verified_at: string
          verified_by: string
        }[]
      }
      get_community_impact_summary: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_hbcu_verification_document_url: {
        Args: { verification_id: string }
        Returns: string
      }
      get_hbcu_verifications_admin_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          document_status: string
          document_type: string
          id: string
          rejection_reason: string
          student_email: string
          student_name: string
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["hbcu_verification_status"]
          verified_at: string
          verified_by: string
        }[]
      }
      get_parent_business_analytics: {
        Args: { p_parent_business_id: string }
        Returns: Json
      }
      get_public_business_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          average_rating: number
          banner_url: string
          business_name: string
          category: string
          city: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          logo_url: string
          review_count: number
          state: string
        }[]
      }
      get_public_businesses: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          average_rating: number
          banner_url: string
          business_name: string
          category: string
          city: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          logo_url: string
          review_count: number
          state: string
          website: string
          zip_code: string
        }[]
      }
      get_public_referral_codes: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          is_active: boolean
          referral_code: string
        }[]
      }
      get_public_referral_codes_only: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          is_active: boolean
          referral_code: string
        }[]
      }
      get_qr_scan_metrics: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_safe_business_listings: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          average_rating: number
          banner_url: string
          business_name: string
          category: string
          city: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          logo_url: string
          review_count: number
          state: string
          website: string
          zip_code: string
        }[]
      }
      get_sales_agent_applications_summary: {
        Args: Record<PropertyKey, never>
        Returns: {
          application_date: string
          application_status: string
          id: string
          reviewed_at: string
          test_passed: boolean
          test_score: number
          user_id: string
        }[]
      }
      get_security_metrics: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_test_questions_for_user: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
        }[]
      }
      get_user_hbcu_status: {
        Args: { target_user_id?: string }
        Returns: Json
      }
      get_verification_document_urls: {
        Args: { verification_id: string }
        Returns: {
          address_url: string
          ownership_url: string
          registration_url: string
        }[]
      }
      handle_api_error: {
        Args: {
          error_details?: Json
          error_message: string
          operation_name: string
        }
        Returns: Json
      }
      has_role: {
        Args:
          | { _role: Database["public"]["Enums"]["app_role"]; _user_id: string }
          | { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_activity: {
        Args: {
          activity_details?: Json
          activity_type: string
          entity_id: string
          entity_type: string
        }
        Returns: undefined
      }
      log_failed_auth_attempt: {
        Args: {
          email_param: string
          ip_param?: unknown
          reason_param: string
          user_agent_param?: string
        }
        Returns: undefined
      }
      log_user_activity: {
        Args: {
          p_activity_data?: Json
          p_activity_type: string
          p_business_id?: string
          p_points_involved?: number
          p_user_id: string
        }
        Returns: string
      }
      process_pending_commissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      record_business_metric: {
        Args:
          | {
              p_business_id: string
              p_metadata?: Json
              p_metric_type: string
              p_metric_value: number
            }
          | {
              p_business_id: string
              p_metric_type: string
              p_metric_value: number
            }
        Returns: undefined
      }
      request_account_deletion: {
        Args: { deletion_reason?: string }
        Returns: Json
      }
      search_public_businesses: {
        Args: {
          p_category?: string
          p_featured?: boolean
          p_limit?: number
          p_min_rating?: number
          p_offset?: number
          p_search_term?: string
        }
        Returns: {
          average_rating: number
          banner_url: string
          business_name: string
          category: string
          city: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          logo_url: string
          review_count: number
          state: string
          total_count: number
        }[]
      }
      search_safe_businesses: {
        Args: {
          p_category?: string
          p_featured?: boolean
          p_limit?: number
          p_min_rating?: number
          p_offset?: number
          p_search_term?: string
        }
        Returns: {
          average_rating: number
          banner_url: string
          business_name: string
          category: string
          city: string
          created_at: string
          description: string
          id: string
          is_verified: boolean
          logo_url: string
          review_count: number
          state: string
          total_count: number
        }[]
      }
      secure_change_user_role: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          reason?: string
          target_user_id: string
        }
        Returns: Json
      }
      update_agent_tier: {
        Args: { p_agent_id: string }
        Returns: undefined
      }
      validate_input: {
        Args: { input_data: Json; schema_name: string }
        Returns: Json
      }
      validate_password_complexity: {
        Args: { password: string }
        Returns: boolean
      }
      validate_test_answers: {
        Args: { answer_data: Json }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "customer" | "business" | "sales_agent"
      hbcu_verification_status: "pending" | "approved" | "rejected"
      subscription_tier: "free" | "paid" | "business_starter"
      user_role: "customer" | "business" | "admin" | "sales_agent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer", "business", "sales_agent"],
      hbcu_verification_status: ["pending", "approved", "rejected"],
      subscription_tier: ["free", "paid", "business_starter"],
      user_role: ["customer", "business", "admin", "sales_agent"],
    },
  },
} as const
