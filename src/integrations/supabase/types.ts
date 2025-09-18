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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
          logo_url: string | null
          name: string
          owner_id: string
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
          logo_url?: string | null
          name: string
          owner_id: string
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
          logo_url?: string | null
          name?: string
          owner_id?: string
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
        Relationships: []
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          test_passed: boolean | null
          test_score: number | null
          user_id: string | null
        }
        Insert: {
          application_date?: string | null
          application_status?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          user_id?: string | null
        }
        Update: {
          application_date?: string | null
          application_status?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          test_passed?: boolean | null
          test_score?: number | null
          user_id?: string | null
        }
        Relationships: []
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
          phone: string | null
          referral_code: string
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
          phone?: string | null
          referral_code: string
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
          phone?: string | null
          referral_code?: string
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
            referencedRelation: "business_directory"
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
            referencedRelation: "business_directory"
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
    }
    Views: {
      business_directory: {
        Row: {
          average_rating: number | null
          banner_url: string | null
          business_name: string | null
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string | null
          is_verified: boolean | null
          logo_url: string | null
          review_count: number | null
          state: string | null
        }
        Insert: {
          average_rating?: number | null
          banner_url?: string | null
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          review_count?: number | null
          state?: string | null
        }
        Update: {
          average_rating?: number | null
          banner_url?: string | null
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_verified?: boolean | null
          logo_url?: string | null
          review_count?: number | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
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
      check_business_access_rate_limit: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      exec_sql: {
        Args: { query: string }
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
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
          id: string
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
      get_business_analytics_summary: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_community_impact_summary: {
        Args: Record<PropertyKey, never>
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
      get_public_sales_agents: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          referral_code: string
        }[]
      }
      get_qr_scan_metrics: {
        Args: { p_business_id: string }
        Returns: Json
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      process_pending_commissions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      record_business_metric: {
        Args: {
          p_business_id: string
          p_metric_type: string
          p_metric_value: number
        }
        Returns: undefined
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
      validate_password_complexity: {
        Args: { password: string }
        Returns: boolean
      }
    }
    Enums: {
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
      hbcu_verification_status: ["pending", "approved", "rejected"],
      subscription_tier: ["free", "paid", "business_starter"],
      user_role: ["customer", "business", "admin", "sales_agent"],
    },
  },
} as const
