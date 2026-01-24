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
      account_suspensions: {
        Row: {
          business_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          lift_reason: string | null
          lifted_at: string | null
          lifted_by: string | null
          reason: string
          suspended_at: string
          suspended_by: string
          suspension_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason: string
          suspended_at?: string
          suspended_by: string
          suspension_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          lift_reason?: string | null
          lifted_at?: string | null
          lifted_by?: string | null
          reason?: string
          suspended_at?: string
          suspended_by?: string
          suspension_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_suspensions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_suspensions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "account_suspensions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          business_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          points_involved?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notification_preferences: {
        Row: {
          admin_user_id: string
          agent_milestone_enabled: boolean | null
          batch_window_minutes: number | null
          business_verification_enabled: boolean | null
          created_at: string | null
          digest_time: string | null
          enable_batching: boolean | null
          id: string
          milestone_conversion_enabled: boolean | null
          milestone_earnings_enabled: boolean | null
          milestone_referrals_enabled: boolean | null
          min_batch_size: number | null
          min_conversion_milestone: number | null
          min_earnings_milestone: number | null
          min_referral_milestone: number | null
          notification_email: string
          send_daily_digest: boolean | null
          send_immediate: boolean | null
          send_to_multiple_emails: string[] | null
          send_weekly_digest: boolean | null
          updated_at: string | null
        }
        Insert: {
          admin_user_id: string
          agent_milestone_enabled?: boolean | null
          batch_window_minutes?: number | null
          business_verification_enabled?: boolean | null
          created_at?: string | null
          digest_time?: string | null
          enable_batching?: boolean | null
          id?: string
          milestone_conversion_enabled?: boolean | null
          milestone_earnings_enabled?: boolean | null
          milestone_referrals_enabled?: boolean | null
          min_batch_size?: number | null
          min_conversion_milestone?: number | null
          min_earnings_milestone?: number | null
          min_referral_milestone?: number | null
          notification_email: string
          send_daily_digest?: boolean | null
          send_immediate?: boolean | null
          send_to_multiple_emails?: string[] | null
          send_weekly_digest?: boolean | null
          updated_at?: string | null
        }
        Update: {
          admin_user_id?: string
          agent_milestone_enabled?: boolean | null
          batch_window_minutes?: number | null
          business_verification_enabled?: boolean | null
          created_at?: string | null
          digest_time?: string | null
          enable_batching?: boolean | null
          id?: string
          milestone_conversion_enabled?: boolean | null
          milestone_earnings_enabled?: boolean | null
          milestone_referrals_enabled?: boolean | null
          min_batch_size?: number | null
          min_conversion_milestone?: number | null
          min_earnings_milestone?: number | null
          min_referral_milestone?: number | null
          notification_email?: string
          send_daily_digest?: boolean | null
          send_immediate?: boolean | null
          send_to_multiple_emails?: string[] | null
          send_weekly_digest?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_permissions: {
        Row: {
          admin_role: string
          created_at: string | null
          id: string
          permission: string
        }
        Insert: {
          admin_role: string
          created_at?: string | null
          id?: string
          permission: string
        }
        Update: {
          admin_role?: string
          created_at?: string | null
          id?: string
          permission?: string
        }
        Relationships: []
      }
      agent_badges: {
        Row: {
          category: Database["public"]["Enums"]["badge_category"]
          created_at: string | null
          description: string
          icon_name: string
          id: string
          is_active: boolean | null
          name: string
          points: number | null
          threshold_value: number
          tier: Database["public"]["Enums"]["badge_tier"]
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["badge_category"]
          created_at?: string | null
          description: string
          icon_name: string
          id?: string
          is_active?: boolean | null
          name: string
          points?: number | null
          threshold_value: number
          tier: Database["public"]["Enums"]["badge_tier"]
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["badge_category"]
          created_at?: string | null
          description?: string
          icon_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          points?: number | null
          threshold_value?: number
          tier?: Database["public"]["Enums"]["badge_tier"]
          updated_at?: string | null
        }
        Relationships: []
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
      agent_earned_badges: {
        Row: {
          badge_id: string
          earned_at: string | null
          id: string
          progress: number | null
          sales_agent_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          sales_agent_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string | null
          id?: string
          progress?: number | null
          sales_agent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_earned_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "agent_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_earned_badges_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_recruitment_bonuses: {
        Row: {
          bonus_amount: number
          created_at: string
          earned_date: string
          id: string
          paid_date: string | null
          payment_reference: string | null
          recruited_agent_id: string
          recruiter_agent_id: string
          status: string
          updated_at: string
        }
        Insert: {
          bonus_amount?: number
          created_at?: string
          earned_date?: string
          id?: string
          paid_date?: string | null
          payment_reference?: string | null
          recruited_agent_id: string
          recruiter_agent_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          bonus_amount?: number
          created_at?: string
          earned_date?: string
          id?: string
          paid_date?: string | null
          payment_reference?: string | null
          recruited_agent_id?: string
          recruiter_agent_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_recruitment_bonuses_recruited_agent_id_fkey"
            columns: ["recruited_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_recruitment_bonuses_recruiter_agent_id_fkey"
            columns: ["recruiter_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_team_overrides: {
        Row: {
          base_commission_amount: number
          created_at: string
          earned_date: string
          id: string
          override_amount: number
          override_percentage: number
          paid_date: string | null
          payment_reference: string | null
          recruited_agent_id: string
          recruiter_agent_id: string
          referral_id: string
          status: string
        }
        Insert: {
          base_commission_amount: number
          created_at?: string
          earned_date?: string
          id?: string
          override_amount: number
          override_percentage?: number
          paid_date?: string | null
          payment_reference?: string | null
          recruited_agent_id: string
          recruiter_agent_id: string
          referral_id: string
          status?: string
        }
        Update: {
          base_commission_amount?: number
          created_at?: string
          earned_date?: string
          id?: string
          override_amount?: number
          override_percentage?: number
          paid_date?: string | null
          payment_reference?: string | null
          recruited_agent_id?: string
          recruiter_agent_id?: string
          referral_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_team_overrides_recruited_agent_id_fkey"
            columns: ["recruited_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_team_overrides_recruiter_agent_id_fkey"
            columns: ["recruiter_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_team_overrides_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_assistant_rate_limits: {
        Row: {
          created_at: string
          id: string
          request_count: number
          updated_at: string
          user_id: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id: string
          window_start?: string
        }
        Update: {
          created_at?: string
          id?: string
          request_count?: number
          updated_at?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          business_id: string
          clicked: boolean | null
          clicked_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          recommendation_reason: string | null
          recommendation_score: number
          shown_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          clicked?: boolean | null
          clicked_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_reason?: string | null
          recommendation_score: number
          shown_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          clicked?: boolean | null
          clicked_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          recommendation_reason?: string | null
          recommendation_score?: number
          shown_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_recommendations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      ambassador_marketing_materials: {
        Row: {
          created_at: string | null
          description: string | null
          download_count: number | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          is_active: boolean | null
          material_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          is_active?: boolean | null
          material_type: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          is_active?: boolean | null
          material_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ambassador_training_content: {
        Row: {
          category: string
          content_type: string
          content_url: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          external_url: string | null
          id: string
          is_active: boolean | null
          is_required: boolean | null
          sort_order: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          content_type: string
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          external_url?: string | null
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          sort_order?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      ambassador_training_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          progress_percent: number | null
          sales_agent_id: string
          started_at: string | null
          status: string
          training_content_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          sales_agent_id: string
          started_at?: string | null
          status?: string
          training_content_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          progress_percent?: number | null
          sales_agent_id?: string
          started_at?: string | null
          status?: string
          training_content_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ambassador_training_progress_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ambassador_training_progress_training_content_id_fkey"
            columns: ["training_content_id"]
            isOneToOne: false
            referencedRelation: "ambassador_training_content"
            referencedColumns: ["id"]
          },
        ]
      }
      apple_subscriptions: {
        Row: {
          auto_renew_status: boolean | null
          cancellation_date: string | null
          created_at: string
          environment: string
          expires_date: string | null
          id: string
          is_in_intro_offer_period: boolean | null
          is_trial_period: boolean | null
          original_transaction_id: string
          product_id: string
          purchase_date: string
          receipt_data: string
          status: string
          transaction_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew_status?: boolean | null
          cancellation_date?: string | null
          created_at?: string
          environment: string
          expires_date?: string | null
          id?: string
          is_in_intro_offer_period?: boolean | null
          is_trial_period?: boolean | null
          original_transaction_id: string
          product_id: string
          purchase_date: string
          receipt_data: string
          status?: string
          transaction_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew_status?: boolean | null
          cancellation_date?: string | null
          created_at?: string
          environment?: string
          expires_date?: string | null
          id?: string
          is_in_intro_offer_period?: boolean | null
          is_trial_period?: boolean | null
          original_transaction_id?: string
          product_id?: string
          purchase_date?: string
          receipt_data?: string
          status?: string
          transaction_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      auth_attempt_log: {
        Row: {
          attempt_time: string | null
          email: string | null
          failure_reason: string | null
          id: string
          ip_address: unknown
          success: boolean | null
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean | null
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          success?: boolean | null
          user_agent?: string | null
        }
        Relationships: []
      }
      b2b_connections: {
        Row: {
          actual_value: number | null
          buyer_business_id: string
          capability_id: string | null
          connection_type: string | null
          created_at: string | null
          estimated_value: number | null
          id: string
          initial_need_id: string | null
          initiated_by: string | null
          match_score: number | null
          notes: string | null
          status: string | null
          supplier_business_id: string
          updated_at: string | null
        }
        Insert: {
          actual_value?: number | null
          buyer_business_id: string
          capability_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          initial_need_id?: string | null
          initiated_by?: string | null
          match_score?: number | null
          notes?: string | null
          status?: string | null
          supplier_business_id: string
          updated_at?: string | null
        }
        Update: {
          actual_value?: number | null
          buyer_business_id?: string
          capability_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          estimated_value?: number | null
          id?: string
          initial_need_id?: string | null
          initiated_by?: string | null
          match_score?: number | null
          notes?: string | null
          status?: string | null
          supplier_business_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_connections_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_capability_id_fkey"
            columns: ["capability_id"]
            isOneToOne: false
            referencedRelation: "business_capabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_initial_need_id_fkey"
            columns: ["initial_need_id"]
            isOneToOne: false
            referencedRelation: "business_needs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_connections_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_external_leads: {
        Row: {
          business_description: string | null
          business_name: string
          category: string | null
          city: string | null
          claim_status: string | null
          claim_token: string | null
          claim_token_expires_at: string | null
          claimed_at: string | null
          claimed_by_user_id: string | null
          confidence_score: number | null
          contact_info: Json | null
          converted_business_id: string | null
          created_at: string | null
          data_quality_score: number | null
          discovered_by_business_id: string | null
          discovered_by_user_id: string | null
          email_status: string | null
          id: string
          import_job_id: string | null
          invitation_clicked_at: string | null
          invitation_count: number | null
          invitation_opened_at: string | null
          invitation_token: string | null
          invited_at: string | null
          is_converted: boolean | null
          is_invited: boolean | null
          is_visible_in_directory: boolean | null
          last_campaign_id: string | null
          last_enriched_at: string | null
          last_invited_at: string | null
          last_validated_at: string | null
          lead_score: number | null
          location: string | null
          owner_email: string | null
          owner_name: string | null
          phone_number: string | null
          phone_valid: boolean | null
          priority_rank: string | null
          social_profiles: Json | null
          source_citations: string[] | null
          source_id: string | null
          source_query: string
          state: string | null
          updated_at: string | null
          validation_notes: string | null
          validation_status: string | null
          verification_method: string | null
          website_url: string | null
          website_valid: boolean | null
          zip_code: string | null
        }
        Insert: {
          business_description?: string | null
          business_name: string
          category?: string | null
          city?: string | null
          claim_status?: string | null
          claim_token?: string | null
          claim_token_expires_at?: string | null
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          confidence_score?: number | null
          contact_info?: Json | null
          converted_business_id?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          discovered_by_business_id?: string | null
          discovered_by_user_id?: string | null
          email_status?: string | null
          id?: string
          import_job_id?: string | null
          invitation_clicked_at?: string | null
          invitation_count?: number | null
          invitation_opened_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          is_converted?: boolean | null
          is_invited?: boolean | null
          is_visible_in_directory?: boolean | null
          last_campaign_id?: string | null
          last_enriched_at?: string | null
          last_invited_at?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          location?: string | null
          owner_email?: string | null
          owner_name?: string | null
          phone_number?: string | null
          phone_valid?: boolean | null
          priority_rank?: string | null
          social_profiles?: Json | null
          source_citations?: string[] | null
          source_id?: string | null
          source_query: string
          state?: string | null
          updated_at?: string | null
          validation_notes?: string | null
          validation_status?: string | null
          verification_method?: string | null
          website_url?: string | null
          website_valid?: boolean | null
          zip_code?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string
          category?: string | null
          city?: string | null
          claim_status?: string | null
          claim_token?: string | null
          claim_token_expires_at?: string | null
          claimed_at?: string | null
          claimed_by_user_id?: string | null
          confidence_score?: number | null
          contact_info?: Json | null
          converted_business_id?: string | null
          created_at?: string | null
          data_quality_score?: number | null
          discovered_by_business_id?: string | null
          discovered_by_user_id?: string | null
          email_status?: string | null
          id?: string
          import_job_id?: string | null
          invitation_clicked_at?: string | null
          invitation_count?: number | null
          invitation_opened_at?: string | null
          invitation_token?: string | null
          invited_at?: string | null
          is_converted?: boolean | null
          is_invited?: boolean | null
          is_visible_in_directory?: boolean | null
          last_campaign_id?: string | null
          last_enriched_at?: string | null
          last_invited_at?: string | null
          last_validated_at?: string | null
          lead_score?: number | null
          location?: string | null
          owner_email?: string | null
          owner_name?: string | null
          phone_number?: string | null
          phone_valid?: boolean | null
          priority_rank?: string | null
          social_profiles?: Json | null
          source_citations?: string[] | null
          source_id?: string | null
          source_query?: string
          state?: string | null
          updated_at?: string | null
          validation_notes?: string | null
          validation_status?: string | null
          verification_method?: string | null
          website_url?: string | null
          website_valid?: boolean | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_external_leads_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_discovered_by_business_id_fkey"
            columns: ["discovered_by_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_discovered_by_business_id_fkey"
            columns: ["discovered_by_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_discovered_by_business_id_fkey"
            columns: ["discovered_by_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "business_import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_last_campaign_id_fkey"
            columns: ["last_campaign_id"]
            isOneToOne: false
            referencedRelation: "bulk_invitation_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_external_leads_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_import_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_messages: {
        Row: {
          attachments: Json | null
          connection_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          sender_business_id: string
        }
        Insert: {
          attachments?: Json | null
          connection_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          sender_business_id: string
        }
        Update: {
          attachments?: Json | null
          connection_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          sender_business_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "b2b_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "b2b_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_messages_sender_business_id_fkey"
            columns: ["sender_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_messages_sender_business_id_fkey"
            columns: ["sender_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_messages_sender_business_id_fkey"
            columns: ["sender_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_reviews: {
        Row: {
          communication_rating: number | null
          connection_id: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          quality_rating: number | null
          rating: number | null
          review_text: string | null
          reviewed_business_id: string
          reviewer_business_id: string
          timeliness_rating: number | null
          value_rating: number | null
          would_recommend: boolean | null
        }
        Insert: {
          communication_rating?: number | null
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          quality_rating?: number | null
          rating?: number | null
          review_text?: string | null
          reviewed_business_id: string
          reviewer_business_id: string
          timeliness_rating?: number | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Update: {
          communication_rating?: number | null
          connection_id?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          quality_rating?: number | null
          rating?: number | null
          review_text?: string | null
          reviewed_business_id?: string
          reviewer_business_id?: string
          timeliness_rating?: number | null
          value_rating?: number | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_reviews_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "b2b_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewed_business_id_fkey"
            columns: ["reviewed_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewed_business_id_fkey"
            columns: ["reviewed_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewed_business_id_fkey"
            columns: ["reviewed_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewer_business_id_fkey"
            columns: ["reviewer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewer_business_id_fkey"
            columns: ["reviewer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_reviews_reviewer_business_id_fkey"
            columns: ["reviewer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_transactions: {
        Row: {
          amount: number
          buyer_business_id: string
          connection_id: string | null
          created_at: string | null
          description: string | null
          id: string
          invoice_reference: string | null
          supplier_business_id: string
          transaction_date: string | null
        }
        Insert: {
          amount: number
          buyer_business_id: string
          connection_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_reference?: string | null
          supplier_business_id: string
          transaction_date?: string | null
        }
        Update: {
          amount?: number
          buyer_business_id?: string
          connection_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_reference?: string | null
          supplier_business_id?: string
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "b2b_transactions_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_buyer_business_id_fkey"
            columns: ["buyer_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "b2b_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "b2b_transactions_supplier_business_id_fkey"
            columns: ["supplier_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      b2b_web_search_cache: {
        Row: {
          category: string | null
          citations: string[] | null
          created_at: string | null
          expires_at: string | null
          id: string
          location: string | null
          query_hash: string
          query_text: string
          results: Json
        }
        Insert: {
          category?: string | null
          citations?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          query_hash: string
          query_text: string
          results?: Json
        }
        Update: {
          category?: string | null
          citations?: string[] | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          location?: string | null
          query_hash?: string
          query_text?: string
          results?: Json
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_name: string
          account_number_last4: string | null
          account_type: string
          bank_name: string | null
          business_id: string
          created_at: string | null
          currency: string | null
          current_balance: number | null
          id: string
          is_active: boolean | null
          opening_balance: number | null
          opening_balance_date: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number_last4?: string | null
          account_type: string
          bank_name?: string | null
          business_id: string
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          opening_balance?: number | null
          opening_balance_date?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number_last4?: string | null
          account_type?: string
          bank_name?: string | null
          business_id?: string
          created_at?: string | null
          currency?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          opening_balance?: number | null
          opening_balance_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string
          business_id: string
          category: string | null
          created_at: string | null
          description: string
          id: string
          is_reconciled: boolean | null
          matched_expense_id: string | null
          matched_invoice_id: string | null
          notes: string | null
          reconciled_at: string | null
          reconciled_by: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_id: string
          business_id: string
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_reconciled?: boolean | null
          matched_expense_id?: string | null
          matched_invoice_id?: string | null
          notes?: string | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string
          business_id?: string
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_reconciled?: boolean | null
          matched_expense_id?: string | null
          matched_invoice_id?: string | null
          notes?: string | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_expense_id_fkey"
            columns: ["matched_expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_transactions_matched_invoice_id_fkey"
            columns: ["matched_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
      broadcast_announcements: {
        Row: {
          announcement_type: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
          message: string
          priority: number
          starts_at: string
          target_audience: string
          title: string
          updated_at: string
        }
        Insert: {
          announcement_type?: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message: string
          priority?: number
          starts_at?: string
          target_audience?: string
          title: string
          updated_at?: string
        }
        Update: {
          announcement_type?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          message?: string
          priority?: number
          starts_at?: string
          target_audience?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          budget_name: string
          business_id: string
          category: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          period_type: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          budget_name: string
          business_id: string
          category: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          period_type: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          budget_name?: string
          business_id?: string
          category?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          period_type?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budgets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_invitation_campaigns: {
        Row: {
          bounced_count: number | null
          claimed_count: number | null
          clicked_count: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          exclude_previously_invited: boolean | null
          id: string
          min_days_between_invites: number | null
          name: string
          opened_count: number | null
          scheduled_at: string | null
          send_rate_per_hour: number | null
          sent_count: number | null
          started_at: string | null
          status: string | null
          target_categories: string[] | null
          target_cities: string[] | null
          target_criteria: Json | null
          target_states: string[] | null
          template_id: string | null
          total_targets: number | null
          updated_at: string | null
        }
        Insert: {
          bounced_count?: number | null
          claimed_count?: number | null
          clicked_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          exclude_previously_invited?: boolean | null
          id?: string
          min_days_between_invites?: number | null
          name: string
          opened_count?: number | null
          scheduled_at?: string | null
          send_rate_per_hour?: number | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          target_categories?: string[] | null
          target_cities?: string[] | null
          target_criteria?: Json | null
          target_states?: string[] | null
          template_id?: string | null
          total_targets?: number | null
          updated_at?: string | null
        }
        Update: {
          bounced_count?: number | null
          claimed_count?: number | null
          clicked_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          exclude_previously_invited?: boolean | null
          id?: string
          min_days_between_invites?: number | null
          name?: string
          opened_count?: number | null
          scheduled_at?: string | null
          send_rate_per_hour?: number | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          target_categories?: string[] | null
          target_cities?: string[] | null
          target_criteria?: Json | null
          target_states?: string[] | null
          template_id?: string | null
          total_targets?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_invitation_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invitation_templates"
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
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          business_id?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          business_id?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_access_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_access_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_access_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_analytics_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_availability_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_availability_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_capabilities: {
        Row: {
          business_id: string
          capability_type: string
          category: string
          certifications: string[] | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          lead_time_days: number | null
          maximum_capacity: string | null
          minimum_order_value: number | null
          price_range_max: number | null
          price_range_min: number | null
          pricing_model: string | null
          service_area: string[] | null
          subcategory: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          capability_type: string
          category: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          maximum_capacity?: string | null
          minimum_order_value?: number | null
          price_range_max?: number | null
          price_range_min?: number | null
          pricing_model?: string | null
          service_area?: string[] | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          capability_type?: string
          category?: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          lead_time_days?: number | null
          maximum_capacity?: string | null
          minimum_order_value?: number | null
          price_range_max?: number | null
          price_range_min?: number | null
          pricing_model?: string | null
          service_area?: string[] | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_capabilities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_capabilities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_capabilities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_contact_requests: {
        Row: {
          business_id: string
          created_at: string
          id: string
          message: string
          read_at: string | null
          replied_at: string | null
          sender_email: string
          sender_name: string
          sender_phone: string | null
          status: string
          subject: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          replied_at?: string | null
          sender_email: string
          sender_name: string
          sender_phone?: string | null
          status?: string
          subject: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          replied_at?: string | null
          sender_email?: string
          sender_name?: string
          sender_phone?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_contact_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_contact_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_contact_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_import_jobs: {
        Row: {
          businesses_found: number | null
          businesses_imported: number | null
          completed_at: string | null
          created_at: string | null
          duplicates_skipped: number | null
          error_details: Json | null
          errors_count: number | null
          field_mapping: Json | null
          id: string
          initiated_by: string
          job_name: string | null
          progress_percent: number | null
          query_params: Json | null
          source_file_url: string | null
          source_id: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          businesses_found?: number | null
          businesses_imported?: number | null
          completed_at?: string | null
          created_at?: string | null
          duplicates_skipped?: number | null
          error_details?: Json | null
          errors_count?: number | null
          field_mapping?: Json | null
          id?: string
          initiated_by: string
          job_name?: string | null
          progress_percent?: number | null
          query_params?: Json | null
          source_file_url?: string | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          businesses_found?: number | null
          businesses_imported?: number | null
          completed_at?: string | null
          created_at?: string | null
          duplicates_skipped?: number | null
          error_details?: Json | null
          errors_count?: number | null
          field_mapping?: Json | null
          id?: string
          initiated_by?: string
          job_name?: string | null
          progress_percent?: number | null
          query_params?: Json | null
          source_file_url?: string | null
          source_id?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_import_jobs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "business_import_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      business_import_sources: {
        Row: {
          api_endpoint: string | null
          api_key_secret_name: string | null
          created_at: string | null
          description: string | null
          field_mapping: Json | null
          id: string
          is_active: boolean | null
          last_import_at: string | null
          source_name: string
          source_type: string
          total_converted: number | null
          total_imported: number | null
          updated_at: string | null
        }
        Insert: {
          api_endpoint?: string | null
          api_key_secret_name?: string | null
          created_at?: string | null
          description?: string | null
          field_mapping?: Json | null
          id?: string
          is_active?: boolean | null
          last_import_at?: string | null
          source_name: string
          source_type: string
          total_converted?: number | null
          total_imported?: number | null
          updated_at?: string | null
        }
        Update: {
          api_endpoint?: string | null
          api_key_secret_name?: string | null
          created_at?: string | null
          description?: string | null
          field_mapping?: Json | null
          id?: string
          is_active?: boolean | null
          last_import_at?: string | null
          source_name?: string
          source_type?: string
          total_converted?: number | null
          total_imported?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_insights: {
        Row: {
          business_id: string
          created_at: string | null
          description: string
          id: string
          insight_type: string
          metrics: Json | null
          priority: string | null
          recommendations: Json | null
          title: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description: string
          id?: string
          insight_type: string
          metrics?: Json | null
          priority?: string | null
          recommendations?: Json | null
          title: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string
          id?: string
          insight_type?: string
          metrics?: Json | null
          priority?: string | null
          recommendations?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_insights_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_insights_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_insights_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_interactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_interactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invitations: {
        Row: {
          converted_business_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          invitation_token: string
          invitee_business_name: string | null
          invitee_email: string
          inviter_business_id: string | null
          inviter_user_id: string
          message: string | null
          opened_at: string | null
          points_awarded: number | null
          signed_up_at: string | null
          status: string | null
        }
        Insert: {
          converted_business_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invitee_business_name?: string | null
          invitee_email: string
          inviter_business_id?: string | null
          inviter_user_id: string
          message?: string | null
          opened_at?: string | null
          points_awarded?: number | null
          signed_up_at?: string | null
          status?: string | null
        }
        Update: {
          converted_business_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          invitation_token?: string
          invitee_business_name?: string | null
          invitee_email?: string
          inviter_business_id?: string | null
          inviter_user_id?: string
          message?: string | null
          opened_at?: string | null
          points_awarded?: number | null
          signed_up_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_invitations_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_converted_business_id_fkey"
            columns: ["converted_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_inviter_business_id_fkey"
            columns: ["inviter_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_inviter_business_id_fkey"
            columns: ["inviter_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invitations_inviter_business_id_fkey"
            columns: ["inviter_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_needs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          business_id: string
          category: string
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          need_type: string
          preferred_location: string[] | null
          quantity: string | null
          status: string | null
          subcategory: string | null
          title: string
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          business_id: string
          category: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          need_type: string
          preferred_location?: string[] | null
          quantity?: string | null
          status?: string | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          business_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          need_type?: string
          preferred_location?: string[] | null
          quantity?: string | null
          status?: string | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_needs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_needs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_needs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_payment_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_payment_accounts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_sentiment_trends: {
        Row: {
          ai_insights: string | null
          average_sentiment_score: number | null
          business_id: string
          created_at: string | null
          id: string
          negative_count: number | null
          neutral_count: number | null
          period_end: string
          period_start: string
          positive_count: number | null
          recurring_complaints: Json | null
          top_negative_themes: Json | null
          top_positive_themes: Json | null
          total_reviews: number | null
          urgent_issues_count: number | null
        }
        Insert: {
          ai_insights?: string | null
          average_sentiment_score?: number | null
          business_id: string
          created_at?: string | null
          id?: string
          negative_count?: number | null
          neutral_count?: number | null
          period_end: string
          period_start: string
          positive_count?: number | null
          recurring_complaints?: Json | null
          top_negative_themes?: Json | null
          top_positive_themes?: Json | null
          total_reviews?: number | null
          urgent_issues_count?: number | null
        }
        Update: {
          ai_insights?: string | null
          average_sentiment_score?: number | null
          business_id?: string
          created_at?: string | null
          id?: string
          negative_count?: number | null
          neutral_count?: number | null
          period_end?: string
          period_start?: string
          positive_count?: number | null
          recurring_complaints?: Json | null
          top_negative_themes?: Json | null
          top_positive_themes?: Json | null
          total_reviews?: number | null
          urgent_issues_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_sentiment_trends_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_sentiment_trends_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_sentiment_trends_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_services: {
        Row: {
          buffer_minutes: number | null
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
          buffer_minutes?: number | null
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
          buffer_minutes?: number | null
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_tax_rates: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          is_default: boolean | null
          tax_name: string
          tax_rate: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          tax_name: string
          tax_rate: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          tax_name?: string
          tax_rate?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_tax_rates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_tax_rates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_tax_rates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      business_verifications: {
        Row: {
          address_document_url: string | null
          admin_notes: string | null
          badge_tier: string | null
          business_id: string
          business_license_url: string | null
          certificate_number: string | null
          certification_agreement_accepted: boolean | null
          certification_agreement_date: string | null
          certification_expires_at: string | null
          created_at: string
          id: string
          identity_document_url: string | null
          ownership_document_url: string | null
          ownership_percentage: number | null
          phone_verification_number: string | null
          phone_verified: boolean | null
          phone_verified_at: string | null
          registration_document_url: string | null
          rejection_reason: string | null
          social_verification_links: Json | null
          submitted_at: string
          updated_at: string
          verification_method: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          video_verification_notes: string | null
          video_verification_url: string | null
          video_verified: boolean | null
          video_verified_at: string | null
        }
        Insert: {
          address_document_url?: string | null
          admin_notes?: string | null
          badge_tier?: string | null
          business_id: string
          business_license_url?: string | null
          certificate_number?: string | null
          certification_agreement_accepted?: boolean | null
          certification_agreement_date?: string | null
          certification_expires_at?: string | null
          created_at?: string
          id?: string
          identity_document_url?: string | null
          ownership_document_url?: string | null
          ownership_percentage?: number | null
          phone_verification_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          registration_document_url?: string | null
          rejection_reason?: string | null
          social_verification_links?: Json | null
          submitted_at?: string
          updated_at?: string
          verification_method?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          video_verification_notes?: string | null
          video_verification_url?: string | null
          video_verified?: boolean | null
          video_verified_at?: string | null
        }
        Update: {
          address_document_url?: string | null
          admin_notes?: string | null
          badge_tier?: string | null
          business_id?: string
          business_license_url?: string | null
          certificate_number?: string | null
          certification_agreement_accepted?: boolean | null
          certification_agreement_date?: string | null
          certification_expires_at?: string | null
          created_at?: string
          id?: string
          identity_document_url?: string | null
          ownership_document_url?: string | null
          ownership_percentage?: number | null
          phone_verification_number?: string | null
          phone_verified?: boolean | null
          phone_verified_at?: string | null
          registration_document_url?: string | null
          rejection_reason?: string | null
          social_verification_links?: Json | null
          submitted_at?: string
          updated_at?: string
          verification_method?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          video_verification_notes?: string | null
          video_verification_url?: string | null
          video_verified?: boolean | null
          video_verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_verifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_verifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_verifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
          founding_joined_at: string | null
          founding_order: number | null
          founding_sponsor_since: string | null
          id: string
          is_founding_member: boolean | null
          is_founding_sponsor: boolean | null
          is_verified: boolean | null
          listing_status: string | null
          location_manager_id: string | null
          location_name: string | null
          location_type: string | null
          logo_url: string | null
          name: string
          onboarding_completed_at: string | null
          owner_id: string
          parent_business_id: string | null
          phone: string | null
          qr_code_id: string | null
          qr_code_url: string | null
          referral_code_used: string | null
          referral_commission_paid: boolean | null
          referred_at: string | null
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
          founding_joined_at?: string | null
          founding_order?: number | null
          founding_sponsor_since?: string | null
          id?: string
          is_founding_member?: boolean | null
          is_founding_sponsor?: boolean | null
          is_verified?: boolean | null
          listing_status?: string | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name: string
          onboarding_completed_at?: string | null
          owner_id: string
          parent_business_id?: string | null
          phone?: string | null
          qr_code_id?: string | null
          qr_code_url?: string | null
          referral_code_used?: string | null
          referral_commission_paid?: boolean | null
          referred_at?: string | null
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
          founding_joined_at?: string | null
          founding_order?: number | null
          founding_sponsor_since?: string | null
          id?: string
          is_founding_member?: boolean | null
          is_founding_sponsor?: boolean | null
          is_verified?: boolean | null
          listing_status?: string | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name?: string
          onboarding_completed_at?: string | null
          owner_id?: string
          parent_business_id?: string | null
          phone?: string | null
          qr_code_id?: string | null
          qr_code_url?: string | null
          referral_code_used?: string | null
          referral_commission_paid?: boolean | null
          referred_at?: string | null
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses_private: {
        Row: {
          business_id: string
          created_at: string
          email: string | null
          id: string
          owner_contact_notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          email?: string | null
          id?: string
          owner_contact_notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          email?: string | null
          id?: string
          owner_contact_notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_private_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_private_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_private_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_activities: {
        Row: {
          activity_type: string
          activity_value: number
          challenge_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          activity_value: number
          challenge_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          activity_value?: number
          challenge_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_activities_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "group_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          contribution_value: number | null
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          contribution_value?: number | null
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          contribution_value?: number | null
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "group_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      coalition_members: {
        Row: {
          business_id: string
          contribution_rate: number | null
          id: string
          is_active: boolean | null
          joined_at: string | null
          redemption_rate: number | null
          total_points_generated: number | null
          total_points_redeemed: number | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          contribution_rate?: number | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          redemption_rate?: number | null
          total_points_generated?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          contribution_rate?: number | null
          id?: string
          is_active?: boolean | null
          joined_at?: string | null
          redemption_rate?: number | null
          total_points_generated?: number | null
          total_points_redeemed?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coalition_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      coalition_points: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          lifetime_earned: number | null
          points: number | null
          tier: string | null
          tier_updated_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          lifetime_earned?: number | null
          points?: number | null
          tier?: string | null
          tier_updated_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          lifetime_earned?: number | null
          points?: number | null
          tier?: string | null
          tier_updated_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      coalition_redemptions: {
        Row: {
          business_id: string | null
          created_at: string | null
          customer_id: string
          expires_at: string | null
          id: string
          points_spent: number
          redeemed_at: string | null
          redemption_code: string
          reward_id: string
          status: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          customer_id: string
          expires_at?: string | null
          id?: string
          points_spent: number
          redeemed_at?: string | null
          redemption_code: string
          reward_id: string
          status?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          customer_id?: string
          expires_at?: string | null
          id?: string
          points_spent?: number
          redeemed_at?: string | null
          redemption_code?: string
          reward_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coalition_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "coalition_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      coalition_rewards: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_redemptions: number | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_redemptions: number | null
          points_cost: number
          reward_type: string | null
          specific_business_ids: string[] | null
          title: string
          updated_at: string | null
          valid_at_all_businesses: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_redemptions?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          points_cost: number
          reward_type?: string | null
          specific_business_ids?: string[] | null
          title: string
          updated_at?: string | null
          valid_at_all_businesses?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_redemptions?: number | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_redemptions?: number | null
          points_cost?: number
          reward_type?: string | null
          specific_business_ids?: string[] | null
          title?: string
          updated_at?: string | null
          valid_at_all_businesses?: boolean | null
        }
        Relationships: []
      }
      coalition_transactions: {
        Row: {
          created_at: string | null
          customer_id: string
          description: string | null
          id: string
          metadata: Json | null
          points: number
          redeem_business_id: string | null
          source_business_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points: number
          redeem_business_id?: string | null
          source_business_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          points?: number
          redeem_business_id?: string | null
          source_business_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "coalition_transactions_redeem_business_id_fkey"
            columns: ["redeem_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_transactions_redeem_business_id_fkey"
            columns: ["redeem_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_transactions_redeem_business_id_fkey"
            columns: ["redeem_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_transactions_source_business_id_fkey"
            columns: ["source_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_transactions_source_business_id_fkey"
            columns: ["source_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coalition_transactions_source_business_id_fkey"
            columns: ["source_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_payments: {
        Row: {
          amount: number
          batch_id: string | null
          commission_id: string | null
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          payment_method: string
          sales_agent_id: string
          status: string
          stripe_payout_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          batch_id?: string | null
          commission_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string
          sales_agent_id: string
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          batch_id?: string | null
          commission_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string
          sales_agent_id?: string
          status?: string
          stripe_payout_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_payments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "payment_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_commission_id_fkey"
            columns: ["commission_id"]
            isOneToOne: false
            referencedRelation: "agent_commissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_payments_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_transactions: {
        Row: {
          booking_id: string | null
          business_id: string
          commission_amount: number
          commission_rate: number
          created_at: string
          id: string
          metadata: Json | null
          net_commission: number
          platform_fee: number
          processed_at: string | null
          status: string
          transaction_amount: number
          transaction_id: string | null
          transaction_type: string
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          business_id: string
          commission_amount: number
          commission_rate?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          net_commission: number
          platform_fee: number
          processed_at?: string | null
          status?: string
          transaction_amount: number
          transaction_id?: string | null
          transaction_type: string
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          business_id?: string
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          net_commission?: number
          platform_fee?: number
          processed_at?: string | null
          status?: string
          transaction_amount?: number
          transaction_id?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_transactions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_events_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
      community_investments: {
        Row: {
          business_id: string
          created_at: string | null
          current_amount: number | null
          description: string | null
          end_date: string | null
          equity_offered: number | null
          goal_amount: number
          id: string
          investor_count: number | null
          min_investment: number | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          equity_offered?: number | null
          goal_amount: number
          id?: string
          investor_count?: number | null
          min_investment?: number | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          current_amount?: number | null
          description?: string | null
          end_date?: string | null
          equity_offered?: number | null
          goal_amount?: number
          id?: string
          investor_count?: number | null
          min_investment?: number | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_investments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_investments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_investments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string | null
          message: string
          name: string
          responded_at: string | null
          responded_by: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          name: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          name?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      content_moderation_queue: {
        Row: {
          action_taken: string | null
          content_id: string
          content_type: string
          created_at: string | null
          details: string | null
          id: string
          reason: string
          reported_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
        }
        Insert: {
          action_taken?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason: string
          reported_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Update: {
          action_taken?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          details?: string | null
          id?: string
          reason?: string
          reported_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      corporate_subscriptions: {
        Row: {
          admin_notes: string | null
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          cancel_at_period_end: boolean | null
          company_name: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          display_priority: number | null
          featured_until: string | null
          id: string
          is_founding_sponsor: boolean | null
          is_visible: boolean | null
          logo_approved: boolean | null
          logo_url: string | null
          placement_override: Json | null
          rejected_at: string | null
          rejection_reason: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          cancel_at_period_end?: boolean | null
          company_name: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          display_priority?: number | null
          featured_until?: string | null
          id?: string
          is_founding_sponsor?: boolean | null
          is_visible?: boolean | null
          logo_approved?: boolean | null
          logo_url?: string | null
          placement_override?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          cancel_at_period_end?: boolean | null
          company_name?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          display_priority?: number | null
          featured_until?: string | null
          id?: string
          is_founding_sponsor?: boolean | null
          is_visible?: boolean | null
          logo_approved?: boolean | null
          logo_url?: string | null
          placement_override?: Json | null
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      email_events: {
        Row: {
          created_at: string
          email_id: string
          event_type: string
          from_email: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          recipient_email: string
          subject: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          email_id: string
          event_type: string
          from_email?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          recipient_email: string
          subject?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          email_id?: string
          event_type?: string
          from_email?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          subject?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "b2b_external_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "b2b_external_leads_public"
            referencedColumns: ["id"]
          },
        ]
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
      email_subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          source: string
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string | null
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
      expenses: {
        Row: {
          amount: number
          business_id: string
          category: string
          created_at: string | null
          description: string | null
          expense_date: string
          id: string
          is_recurring: boolean | null
          receipt_url: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          business_id: string
          category: string
          created_at?: string | null
          description?: string | null
          expense_date: string
          id?: string
          is_recurring?: boolean | null
          receipt_url?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          business_id?: string
          category?: string
          created_at?: string | null
          description?: string | null
          expense_date?: string
          id?: string
          is_recurring?: boolean | null
          receipt_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          flag_key: string
          flag_name: string
          id: string
          is_enabled: boolean | null
          rollout_percentage: number | null
          target_user_types: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flag_key: string
          flag_name: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_user_types?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flag_key?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_user_types?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_audit_log: {
        Row: {
          action: string
          business_id: string
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string
        }
        Insert: {
          action: string
          business_id: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          business_id?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      fixed_assets: {
        Row: {
          accumulated_depreciation: number | null
          asset_category: string
          asset_name: string
          business_id: string
          created_at: string | null
          current_book_value: number | null
          depreciation_method: string
          disposal_date: string | null
          disposal_value: number | null
          id: string
          is_disposed: boolean | null
          notes: string | null
          purchase_date: string
          purchase_price: number
          salvage_value: number | null
          updated_at: string | null
          useful_life_years: number
        }
        Insert: {
          accumulated_depreciation?: number | null
          asset_category: string
          asset_name: string
          business_id: string
          created_at?: string | null
          current_book_value?: number | null
          depreciation_method: string
          disposal_date?: string | null
          disposal_value?: number | null
          id?: string
          is_disposed?: boolean | null
          notes?: string | null
          purchase_date: string
          purchase_price: number
          salvage_value?: number | null
          updated_at?: string | null
          useful_life_years: number
        }
        Update: {
          accumulated_depreciation?: number | null
          asset_category?: string
          asset_name?: string
          business_id?: string
          created_at?: string | null
          current_book_value?: number | null
          depreciation_method?: string
          disposal_date?: string | null
          disposal_value?: number | null
          id?: string
          is_disposed?: boolean | null
          notes?: string | null
          purchase_date?: string
          purchase_price?: number
          salvage_value?: number | null
          updated_at?: string | null
          useful_life_years?: number
        }
        Relationships: [
          {
            foreignKeyName: "fixed_assets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_assets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixed_assets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
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
      fraud_alerts: {
        Row: {
          ai_confidence_score: number | null
          alert_type: string
          business_id: string | null
          created_at: string | null
          description: string
          evidence: Json
          id: string
          investigated_at: string | null
          investigated_by: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          resolution_notes: string | null
          severity: string
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_confidence_score?: number | null
          alert_type: string
          business_id?: string | null
          created_at?: string | null
          description: string
          evidence: Json
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          resolution_notes?: string | null
          severity: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_confidence_score?: number | null
          alert_type?: string
          business_id?: string | null
          created_at?: string | null
          description?: string
          evidence?: Json
          id?: string
          investigated_at?: string | null
          investigated_by?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          resolution_notes?: string | null
          severity?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_alerts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_detection_logs: {
        Row: {
          alerts_generated: number | null
          analysis_duration_ms: number | null
          analysis_type: string
          business_id: string | null
          created_at: string | null
          id: string
          patterns_analyzed: Json
          user_id: string | null
        }
        Insert: {
          alerts_generated?: number | null
          analysis_duration_ms?: number | null
          analysis_type: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          patterns_analyzed: Json
          user_id?: string | null
        }
        Update: {
          alerts_generated?: number | null
          analysis_duration_ms?: number | null
          analysis_type?: string
          business_id?: string | null
          created_at?: string | null
          id?: string
          patterns_analyzed?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      fraud_prevention_actions: {
        Row: {
          action_details: Json | null
          action_type: string
          alert_id: string
          auto_triggered: boolean | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          reversal_reason: string | null
          reversed_at: string | null
          reversed_by: string | null
          triggered_by: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          alert_id: string
          auto_triggered?: boolean | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          triggered_by?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          alert_id?: string
          auto_triggered?: boolean | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          reversal_reason?: string | null
          reversed_at?: string | null
          reversed_by?: string | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fraud_prevention_actions_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "fraud_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          accepted_at: string | null
          created_at: string
          friend_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          friend_id: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      group_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          created_by: string | null
          current_value: number | null
          description: string
          end_date: string
          goal_value: number
          id: string
          max_participants: number | null
          participant_count: number | null
          reward_points: number
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description: string
          end_date: string
          goal_value: number
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          reward_points: number
          start_date?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          created_by?: string | null
          current_value?: number | null
          description?: string
          end_date?: string
          goal_value?: number
          id?: string
          max_participants?: number | null
          participant_count?: number | null
          reward_points?: number
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
      impersonation_sessions: {
        Row: {
          admin_id: string
          ended_at: string | null
          id: string
          reason: string | null
          started_at: string | null
          target_user_id: string
        }
        Insert: {
          admin_id: string
          ended_at?: string | null
          id?: string
          reason?: string | null
          started_at?: string | null
          target_user_id: string
        }
        Update: {
          admin_id?: string
          ended_at?: string | null
          id?: string
          reason?: string | null
          started_at?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      invitation_templates: {
        Row: {
          body: string
          click_count: number | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          open_count: number | null
          send_count: number | null
          subject: string | null
          template_type: string | null
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          open_count?: number | null
          send_count?: number | null
          subject?: string | null
          template_type?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          click_count?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          open_count?: number | null
          send_count?: number | null
          subject?: string | null
          template_type?: string | null
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          booking_id: string | null
          business_id: string
          created_at: string | null
          customer_email: string
          customer_name: string
          due_date: string
          id: string
          invoice_number: string
          line_items: Json | null
          notes: string | null
          paid_date: string | null
          status: string
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id?: string | null
          business_id: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          due_date: string
          id?: string
          invoice_number: string
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string | null
          business_id?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          due_date?: string
          id?: string
          invoice_number?: string
          line_items?: Json | null
          notes?: string | null
          paid_date?: string | null
          status?: string
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      karma_transactions: {
        Row: {
          change_amount: number
          change_reason: string
          created_at: string | null
          id: string
          new_karma: number
          previous_karma: number
          user_id: string
        }
        Insert: {
          change_amount: number
          change_reason: string
          created_at?: string | null
          id?: string
          new_karma: number
          previous_karma: number
          user_id: string
        }
        Update: {
          change_amount?: number
          change_reason?: string
          created_at?: string | null
          id?: string
          new_karma?: number
          previous_karma?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "karma_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          category: string
          id: string
          metadata: Json | null
          period: string | null
          rank: number | null
          score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          metadata?: Json | null
          period?: string | null
          rank?: number | null
          score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          metadata?: Json | null
          period?: string | null
          rank?: number | null
          score?: number | null
          updated_at?: string | null
          user_id?: string
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_material_downloads: {
        Row: {
          created_at: string | null
          downloaded_at: string | null
          id: string
          material_id: string
          sales_agent_id: string
        }
        Insert: {
          created_at?: string | null
          downloaded_at?: string | null
          id?: string
          material_id: string
          sales_agent_id: string
        }
        Update: {
          created_at?: string | null
          downloaded_at?: string | null
          id?: string
          material_id?: string
          sales_agent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_material_downloads_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_materials: {
        Row: {
          category: Database["public"]["Enums"]["marketing_material_category"]
          created_at: string | null
          created_by: string | null
          description: string | null
          download_count: number | null
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          tags: string[] | null
          thumbnail_path: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["marketing_material_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_path?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["marketing_material_category"]
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      material_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      material_category_assignments: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          material_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          material_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          material_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      material_downloads: {
        Row: {
          agent_id: string
          downloaded_at: string | null
          id: string
          ip_address: unknown
          material_id: string
          user_agent: string | null
        }
        Insert: {
          agent_id: string
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          material_id: string
          user_agent?: string | null
        }
        Update: {
          agent_id?: string
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          material_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_downloads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_downloads_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "marketing_materials"
            referencedColumns: ["id"]
          },
        ]
      }
      material_tag_assignments: {
        Row: {
          created_at: string | null
          id: string
          material_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          material_id: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          material_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "material_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      material_tags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      media_kit_requests: {
        Row: {
          admin_notes: string | null
          company: string | null
          created_at: string
          document_type: string
          download_count: number | null
          download_token: string | null
          email: string
          full_name: string
          id: string
          last_downloaded_at: string | null
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          role: string | null
          status: string
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          document_type: string
          download_count?: number | null
          download_token?: string | null
          email: string
          full_name: string
          id?: string
          last_downloaded_at?: string | null
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string | null
          status?: string
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          created_at?: string
          document_type?: string
          download_count?: number | null
          download_token?: string | null
          email?: string
          full_name?: string
          id?: string
          last_downloaded_at?: string | null
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role?: string | null
          status?: string
        }
        Relationships: []
      }
      notification_batch_queue: {
        Row: {
          batch_id: string | null
          batch_key: string
          created_at: string
          event_data: Json
          id: string
          notification_type: string
          processed_at: string | null
        }
        Insert: {
          batch_id?: string | null
          batch_key: string
          created_at?: string
          event_data: Json
          id?: string
          notification_type: string
          processed_at?: string | null
        }
        Update: {
          batch_id?: string | null
          batch_key?: string
          created_at?: string
          event_data?: Json
          id?: string
          notification_type?: string
          processed_at?: string | null
        }
        Relationships: []
      }
      notification_batches: {
        Row: {
          batch_key: string
          created_at: string
          event_count: number
          events: Json
          id: string
          notification_type: string
          recipients: string[]
          sent_at: string
        }
        Insert: {
          batch_key: string
          created_at?: string
          event_count?: number
          events?: Json
          id?: string
          notification_type: string
          recipients: string[]
          sent_at?: string
        }
        Update: {
          batch_key?: string
          created_at?: string
          event_count?: number
          events?: Json
          id?: string
          notification_type?: string
          recipients?: string[]
          sent_at?: string
        }
        Relationships: []
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
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_batches: {
        Row: {
          batch_number: string
          created_at: string
          id: string
          notes: string | null
          payment_date: string
          processed_at: string | null
          processed_by: string | null
          status: string
          total_amount: number
          total_commissions: number
          updated_at: string
        }
        Insert: {
          batch_number: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          total_amount?: number
          total_commissions?: number
          updated_at?: string
        }
        Update: {
          batch_number?: string
          created_at?: string
          id?: string
          notes?: string | null
          payment_date?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          total_amount?: number
          total_commissions?: number
          updated_at?: string
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
          ip_address: unknown
          target_user_id: string
          user_agent: string | null
        }
        Insert: {
          access_reason?: string | null
          accessed_at?: string | null
          accessed_by: string
          data_type: string
          id?: string
          ip_address?: unknown
          target_user_id: string
          user_agent?: string | null
        }
        Update: {
          access_reason?: string | null
          accessed_at?: string | null
          accessed_by?: string
          data_type?: string
          id?: string
          ip_address?: unknown
          target_user_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      phone_verification_otps: {
        Row: {
          attempts: number | null
          business_id: string
          created_at: string
          expires_at: string
          id: string
          max_attempts: number | null
          otp_code: string
          phone_number: string
          user_id: string
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          business_id: string
          created_at?: string
          expires_at?: string
          id?: string
          max_attempts?: number | null
          otp_code: string
          phone_number: string
          user_id: string
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          business_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          max_attempts?: number | null
          otp_code?: string
          phone_number?: string
          user_id?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phone_verification_otps_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_verification_otps_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_verification_otps_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
          economic_karma: number | null
          email: string | null
          founding_member_since: string | null
          full_name: string | null
          hbcu_verification_status:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id: string
          is_founding_member: boolean | null
          is_hbcu_member: boolean | null
          karma_last_decay_at: string | null
          onboarding_completed_at: string | null
          phone: string | null
          profile_completion_percentage: number | null
          referral_code: string | null
          referral_tier: number | null
          referred_by: string | null
          referred_by_agent_id: string | null
          signup_device_info: string | null
          signup_platform: string | null
          state: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string | null
          user_type: string
          wallet_balance: number
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
          economic_karma?: number | null
          email?: string | null
          founding_member_since?: string | null
          full_name?: string | null
          hbcu_verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id: string
          is_founding_member?: boolean | null
          is_hbcu_member?: boolean | null
          karma_last_decay_at?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          referral_code?: string | null
          referral_tier?: number | null
          referred_by?: string | null
          referred_by_agent_id?: string | null
          signup_device_info?: string | null
          signup_platform?: string | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_type: string
          wallet_balance?: number
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
          economic_karma?: number | null
          email?: string | null
          founding_member_since?: string | null
          full_name?: string | null
          hbcu_verification_status?:
            | Database["public"]["Enums"]["hbcu_verification_status"]
            | null
          id?: string
          is_founding_member?: boolean | null
          is_hbcu_member?: boolean | null
          karma_last_decay_at?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          profile_completion_percentage?: number | null
          referral_code?: string | null
          referral_tier?: number | null
          referred_by?: string | null
          referred_by_agent_id?: string | null
          signup_device_info?: string | null
          signup_platform?: string | null
          state?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string | null
          user_type?: string
          wallet_balance?: number
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_agent_id_fkey"
            columns: ["referred_by_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_redemptions: {
        Row: {
          business_id: string | null
          id: string
          promo_code_id: string | null
          redeemed_at: string | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          id?: string
          promo_code_id?: string | null
          redeemed_at?: string | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          id?: string
          promo_code_id?: string | null
          redeemed_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_redemptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applies_to: string | null
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          name: string
          uses_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applies_to?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          name: string
          uses_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applies_to?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          name?: string
          uses_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      prospect_sequence_enrollments: {
        Row: {
          completed_at: string | null
          current_step: number | null
          emails_clicked: number | null
          emails_opened: number | null
          emails_sent: number | null
          enrolled_at: string | null
          enrolled_by: string | null
          id: string
          last_sent_at: string | null
          next_send_at: string | null
          prospect_id: string
          sequence_id: string
          status: string | null
          stopped_reason: string | null
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          prospect_id: string
          sequence_id: string
          status?: string | null
          stopped_reason?: string | null
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          emails_clicked?: number | null
          emails_opened?: number | null
          emails_sent?: number | null
          enrolled_at?: string | null
          enrolled_by?: string | null
          id?: string
          last_sent_at?: string | null
          next_send_at?: string | null
          prospect_id?: string
          sequence_id?: string
          status?: string | null
          stopped_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospect_sequence_enrollments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "sponsor_prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_sequence_enrollments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sponsor_email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_code_scans: {
        Row: {
          converted: boolean | null
          converted_at: string | null
          converted_user_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          referral_code: string
          sales_agent_id: string | null
          scan_source: string | null
          scanned_at: string
          user_agent: string | null
        }
        Insert: {
          converted?: boolean | null
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          referral_code: string
          sales_agent_id?: string | null
          scan_source?: string | null
          scanned_at?: string
          user_agent?: string | null
        }
        Update: {
          converted?: boolean | null
          converted_at?: string | null
          converted_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          referral_code?: string
          sales_agent_id?: string | null
          scan_source?: string | null
          scanned_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_code_scans_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_scans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_scans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
          ip_address: unknown
          operation: string
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown
          operation: string
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          attempt_count?: number | null
          blocked_until?: string | null
          id?: string
          ip_address?: unknown
          operation?: string
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      recurring_invoices: {
        Row: {
          business_id: string
          created_at: string | null
          customer_email: string
          customer_name: string
          frequency: string
          id: string
          is_active: boolean | null
          last_generated_at: string | null
          line_items: Json
          next_invoice_date: string
          notes: string | null
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_email: string
          customer_name: string
          frequency: string
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          line_items: Json
          next_invoice_date: string
          notes?: string | null
          subtotal: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_generated_at?: string | null
          line_items?: Json
          next_invoice_date?: string
          notes?: string | null
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recurring_invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeemed_rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redeemed_rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
      referral_campaign_participants: {
        Row: {
          campaign_id: string
          cash_earned: number | null
          id: string
          joined_at: string | null
          last_referral_at: string | null
          points_earned: number | null
          rank: number | null
          referrals_during_campaign: number | null
          user_id: string
        }
        Insert: {
          campaign_id: string
          cash_earned?: number | null
          id?: string
          joined_at?: string | null
          last_referral_at?: string | null
          points_earned?: number | null
          rank?: number | null
          referrals_during_campaign?: number | null
          user_id: string
        }
        Update: {
          campaign_id?: string
          cash_earned?: number | null
          id?: string
          joined_at?: string | null
          last_referral_at?: string | null
          points_earned?: number | null
          rank?: number | null
          referrals_during_campaign?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "referral_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_campaigns: {
        Row: {
          banner_color: string | null
          banner_image_url: string | null
          bonus_cash: number | null
          bonus_multiplier: number | null
          bonus_points: number | null
          bonus_type: string | null
          campaign_type: string
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          max_participants: number | null
          name: string
          requirements: Json | null
          rewards: Json | null
          start_date: string
          target_referrals: number | null
          updated_at: string | null
        }
        Insert: {
          banner_color?: string | null
          banner_image_url?: string | null
          bonus_cash?: number | null
          bonus_multiplier?: number | null
          bonus_points?: number | null
          bonus_type?: string | null
          campaign_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_participants?: number | null
          name: string
          requirements?: Json | null
          rewards?: Json | null
          start_date: string
          target_referrals?: number | null
          updated_at?: string | null
        }
        Update: {
          banner_color?: string | null
          banner_image_url?: string | null
          bonus_cash?: number | null
          bonus_multiplier?: number | null
          bonus_points?: number | null
          bonus_type?: string | null
          campaign_type?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          max_participants?: number | null
          name?: string
          requirements?: Json | null
          rewards?: Json | null
          start_date?: string
          target_referrals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          clicked_at: string | null
          converted: boolean | null
          converted_user_id: string | null
          created_at: string | null
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      referral_milestones: {
        Row: {
          badge_color: string | null
          badge_icon: string | null
          badge_name: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          milestone_count: number
          milestone_name: string
          reward_cash: number | null
          reward_points: number | null
          reward_type: string | null
        }
        Insert: {
          badge_color?: string | null
          badge_icon?: string | null
          badge_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          milestone_count: number
          milestone_name: string
          reward_cash?: number | null
          reward_points?: number | null
          reward_type?: string | null
        }
        Update: {
          badge_color?: string | null
          badge_icon?: string | null
          badge_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          milestone_count?: number
          milestone_name?: string
          reward_cash?: number | null
          reward_points?: number | null
          reward_type?: string | null
        }
        Relationships: []
      }
      referral_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          referral_id: string | null
          reward_description: string
          reward_type: string
          reward_value: number
          status: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referral_id?: string | null
          reward_description: string
          reward_type: string
          reward_value?: number
          status?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          referral_id?: string | null
          reward_description?: string
          reward_type?: string
          reward_value?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_rewards_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "user_referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_stats: {
        Row: {
          badges_earned: string[] | null
          campaign_wins: number | null
          created_at: string | null
          current_streak: number | null
          current_tier: string | null
          id: string
          last_referral_date: string | null
          longest_streak: number | null
          milestones_unlocked: number | null
          pending_referrals: number | null
          rank: number | null
          successful_referrals: number | null
          total_campaigns_joined: number | null
          total_cash_earned: number | null
          total_points_earned: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          campaign_wins?: number | null
          created_at?: string | null
          current_streak?: number | null
          current_tier?: string | null
          id?: string
          last_referral_date?: string | null
          longest_streak?: number | null
          milestones_unlocked?: number | null
          pending_referrals?: number | null
          rank?: number | null
          successful_referrals?: number | null
          total_campaigns_joined?: number | null
          total_cash_earned?: number | null
          total_points_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          campaign_wins?: number | null
          created_at?: string | null
          current_streak?: number | null
          current_tier?: string | null
          id?: string
          last_referral_date?: string | null
          longest_streak?: number | null
          milestones_unlocked?: number | null
          pending_referrals?: number | null
          rank?: number | null
          successful_referrals?: number | null
          total_campaigns_joined?: number | null
          total_cash_earned?: number | null
          total_points_earned?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referral_streaks: {
        Row: {
          current_streak: number | null
          freeze_count: number | null
          id: string
          last_referral_date: string | null
          longest_streak: number | null
          streak_frozen_until: string | null
          streak_started_at: string | null
          total_streak_days: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          current_streak?: number | null
          freeze_count?: number | null
          id?: string
          last_referral_date?: string | null
          longest_streak?: number | null
          streak_frozen_until?: string | null
          streak_started_at?: string | null
          total_streak_days?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          current_streak?: number | null
          freeze_count?: number | null
          id?: string
          last_referral_date?: string | null
          longest_streak?: number | null
          streak_frozen_until?: string | null
          streak_started_at?: string | null
          total_streak_days?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referral_tiers: {
        Row: {
          cash_bonus: number
          created_at: string | null
          id: string
          max_referrals: number | null
          min_referrals: number
          points_per_referral: number
          special_perks: Json | null
          tier_color: string | null
          tier_name: string
          updated_at: string | null
        }
        Insert: {
          cash_bonus?: number
          created_at?: string | null
          id?: string
          max_referrals?: number | null
          min_referrals?: number
          points_per_referral?: number
          special_perks?: Json | null
          tier_color?: string | null
          tier_name: string
          updated_at?: string | null
        }
        Update: {
          cash_bonus?: number
          created_at?: string | null
          id?: string
          max_referrals?: number | null
          min_referrals?: number
          points_per_referral?: number
          special_perks?: Json | null
          tier_color?: string | null
          tier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          commission_amount: number | null
          commission_status: string | null
          id: string
          parent_referral_id: string | null
          payment_date: string | null
          referral_date: string | null
          referred_user_id: string
          referred_user_type: string
          sales_agent_id: string
          subscription_amount: number | null
          tier: number | null
        }
        Insert: {
          commission_amount?: number | null
          commission_status?: string | null
          id?: string
          parent_referral_id?: string | null
          payment_date?: string | null
          referral_date?: string | null
          referred_user_id: string
          referred_user_type: string
          sales_agent_id: string
          subscription_amount?: number | null
          tier?: number | null
        }
        Update: {
          commission_amount?: number | null
          commission_status?: string | null
          id?: string
          parent_referral_id?: string | null
          payment_date?: string | null
          referral_date?: string | null
          referred_user_id?: string
          referred_user_type?: string
          sales_agent_id?: string
          subscription_amount?: number | null
          tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_parent_referral_id_fkey"
            columns: ["parent_referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_sales_agent_id_fkey"
            columns: ["sales_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      review_requests: {
        Row: {
          booking_id: string
          business_id: string
          created_at: string | null
          customer_email: string
          customer_id: string
          id: string
          review_submitted: boolean | null
          review_submitted_at: string | null
          sent_at: string | null
        }
        Insert: {
          booking_id: string
          business_id: string
          created_at?: string | null
          customer_email: string
          customer_id: string
          id?: string
          review_submitted?: boolean | null
          review_submitted_at?: string | null
          sent_at?: string | null
        }
        Update: {
          booking_id?: string
          business_id?: string
          created_at?: string | null
          customer_email?: string
          customer_id?: string
          id?: string
          review_submitted?: boolean | null
          review_submitted_at?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      review_sentiment_analysis: {
        Row: {
          ai_summary: string | null
          business_id: string
          confidence_score: number
          created_at: string | null
          emotions: Json | null
          extracted_topics: Json | null
          id: string
          key_themes: Json | null
          review_id: string
          sentiment: string
          sentiment_score: number
          updated_at: string | null
          urgency_level: string | null
        }
        Insert: {
          ai_summary?: string | null
          business_id: string
          confidence_score: number
          created_at?: string | null
          emotions?: Json | null
          extracted_topics?: Json | null
          id?: string
          key_themes?: Json | null
          review_id: string
          sentiment: string
          sentiment_score: number
          updated_at?: string | null
          urgency_level?: string | null
        }
        Update: {
          ai_summary?: string | null
          business_id?: string
          confidence_score?: number
          created_at?: string | null
          emotions?: Json | null
          extracted_topics?: Json | null
          id?: string
          key_themes?: Json | null
          review_id?: string
          sentiment?: string
          sentiment_score?: number
          updated_at?: string | null
          urgency_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_sentiment_analysis_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_sentiment_analysis_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_sentiment_analysis_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_sentiment_analysis_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          created_at: string | null
          customer_id: string
          flag_reason: string | null
          id: string
          is_flagged: boolean | null
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          customer_id: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          customer_id?: string
          flag_reason?: string | null
          id?: string
          is_flagged?: boolean | null
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rewards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
          encryption_algorithm: string | null
          encryption_key_id: string | null
          id: string
          is_encrypted: boolean | null
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
          encryption_algorithm?: string | null
          encryption_key_id?: string | null
          id?: string
          is_encrypted?: boolean | null
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
          encryption_algorithm?: string | null
          encryption_key_id?: string | null
          id?: string
          is_encrypted?: boolean | null
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
          recruited_by_agent_id: string | null
          recruitment_date: string | null
          referral_code: string
          team_override_end_date: string | null
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
          recruited_by_agent_id?: string | null
          recruitment_date?: string | null
          referral_code: string
          team_override_end_date?: string | null
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
          recruited_by_agent_id?: string | null
          recruitment_date?: string | null
          referral_code?: string
          team_override_end_date?: string | null
          tier?: string | null
          total_earned?: number | null
          total_pending?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_agents_recruited_by_agent_id_fkey"
            columns: ["recruited_by_agent_id"]
            isOneToOne: false
            referencedRelation: "sales_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_circle_members: {
        Row: {
          circle_id: string
          has_received_payout: boolean | null
          id: string
          join_date: string | null
          payout_date: string | null
          payout_position: number | null
          status: string | null
          total_contributed: number | null
          user_id: string
        }
        Insert: {
          circle_id: string
          has_received_payout?: boolean | null
          id?: string
          join_date?: string | null
          payout_date?: string | null
          payout_position?: number | null
          status?: string | null
          total_contributed?: number | null
          user_id: string
        }
        Update: {
          circle_id?: string
          has_received_payout?: boolean | null
          id?: string
          join_date?: string | null
          payout_date?: string | null
          payout_position?: number | null
          status?: string | null
          total_contributed?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "savings_circles"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_circles: {
        Row: {
          circle_name: string
          contribution_amount: number
          created_at: string | null
          creator_id: string
          current_members: number | null
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          max_members: number | null
          start_date: string | null
          status: string | null
          target_amount: number
          updated_at: string | null
        }
        Insert: {
          circle_name: string
          contribution_amount: number
          created_at?: string | null
          creator_id: string
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          max_members?: number | null
          start_date?: string | null
          status?: string | null
          target_amount: number
          updated_at?: string | null
        }
        Update: {
          circle_name?: string
          contribution_amount?: number
          created_at?: string | null
          creator_id?: string
          current_members?: number | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          max_members?: number | null
          start_date?: string | null
          status?: string | null
          target_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      scheduled_discovery_searches: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          frequency: string
          id: string
          is_active: boolean
          last_run_at: string | null
          leads_found_total: number
          location: string | null
          next_run_at: string | null
          query: string
          search_name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          leads_found_total?: number
          location?: string | null
          next_run_at?: string | null
          query: string
          search_name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          leads_found_total?: number
          location?: string | null
          next_run_at?: string | null
          query?: string
          search_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_reports: {
        Row: {
          config: Json | null
          created_at: string | null
          created_by: string | null
          frequency: string
          id: string
          is_active: boolean | null
          last_run_at: string | null
          next_run_at: string
          recipients: string[]
          report_name: string
          report_type: string
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at: string
          recipients: string[]
          report_name: string
          report_type: string
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          next_run_at?: string
          recipients?: string[]
          report_name?: string
          report_type?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown
          record_id: string | null
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shared_shopping_lists: {
        Row: {
          created_at: string
          creator_id: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          added_by: string
          business_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          list_id: string
          notes: string | null
        }
        Insert: {
          added_by: string
          business_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          list_id: string
          notes?: string | null
        }
        Update: {
          added_by?: string
          business_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          list_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shared_shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_list_members: {
        Row: {
          id: string
          joined_at: string
          list_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          list_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          list_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_members_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "shared_shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      social_activity_feed: {
        Row: {
          activity_type: string
          business_id: string | null
          created_at: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          business_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          business_id?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_activity_feed_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_activity_feed_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_activity_feed_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_shares_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_shares_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_admin_audit: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          sponsor_id: string
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          sponsor_id: string
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_admin_audit_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_benefits: {
        Row: {
          benefit_type: string
          benefit_value: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          subscription_id: string
          updated_at: string
        }
        Insert: {
          benefit_type: string
          benefit_value?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          subscription_id: string
          updated_at?: string
        }
        Update: {
          benefit_type?: string
          benefit_value?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_benefits_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_communications: {
        Row: {
          admin_user_id: string | null
          communication_type: string
          content: string
          created_at: string | null
          email_template: string | null
          id: string
          sent_at: string | null
          sponsor_id: string
          subject: string | null
        }
        Insert: {
          admin_user_id?: string | null
          communication_type: string
          content: string
          created_at?: string | null
          email_template?: string | null
          id?: string
          sent_at?: string | null
          sponsor_id: string
          subject?: string | null
        }
        Update: {
          admin_user_id?: string | null
          communication_type?: string
          content?: string
          created_at?: string | null
          email_template?: string | null
          id?: string
          sent_at?: string | null
          sponsor_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_communications_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_documents: {
        Row: {
          created_at: string | null
          document_data: Json | null
          document_type: string
          document_url: string | null
          generated_by: string | null
          id: string
          sponsor_id: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          created_at?: string | null
          document_data?: Json | null
          document_type: string
          document_url?: string | null
          generated_by?: string | null
          id?: string
          sponsor_id: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          created_at?: string | null
          document_data?: Json | null
          document_type?: string
          document_url?: string | null
          generated_by?: string | null
          id?: string
          sponsor_id?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_documents_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_email_sequences: {
        Row: {
          avg_reply_rate: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json
          target_industry: string | null
          target_tier: string | null
          total_completed: number | null
          total_converted: number | null
          total_enrolled: number | null
          updated_at: string | null
        }
        Insert: {
          avg_reply_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json
          target_industry?: string | null
          target_tier?: string | null
          total_completed?: number | null
          total_converted?: number | null
          total_enrolled?: number | null
          updated_at?: string | null
        }
        Update: {
          avg_reply_rate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json
          target_industry?: string | null
          target_tier?: string | null
          total_completed?: number | null
          total_converted?: number | null
          total_enrolled?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sponsor_email_templates: {
        Row: {
          body: string
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          reply_rate: number | null
          subject: string
          updated_at: string | null
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          reply_rate?: number | null
          subject: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          reply_rate?: number | null
          subject?: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      sponsor_impact_metrics: {
        Row: {
          businesses_supported: number | null
          community_reach: number | null
          created_at: string
          economic_impact: number | null
          id: string
          metric_date: string
          subscription_id: string
          total_transactions: number | null
        }
        Insert: {
          businesses_supported?: number | null
          community_reach?: number | null
          created_at?: string
          economic_impact?: number | null
          id?: string
          metric_date?: string
          subscription_id: string
          total_transactions?: number | null
        }
        Update: {
          businesses_supported?: number | null
          community_reach?: number | null
          created_at?: string
          economic_impact?: number | null
          id?: string
          metric_date?: string
          subscription_id?: string
          total_transactions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_impact_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_outreach_activities: {
        Row: {
          activity_type: string
          attachments: Json | null
          body: string | null
          completed_at: string | null
          created_at: string | null
          duration_minutes: number | null
          email_clicked: boolean | null
          email_clicked_at: string | null
          email_message_id: string | null
          email_opened: boolean | null
          email_opened_at: string | null
          id: string
          is_completed: boolean | null
          meeting_link: string | null
          meeting_recording_url: string | null
          outcome: string | null
          outcome_notes: string | null
          performed_by: string | null
          prospect_id: string
          scheduled_at: string | null
          subject: string | null
        }
        Insert: {
          activity_type: string
          attachments?: Json | null
          body?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          email_clicked?: boolean | null
          email_clicked_at?: string | null
          email_message_id?: string | null
          email_opened?: boolean | null
          email_opened_at?: string | null
          id?: string
          is_completed?: boolean | null
          meeting_link?: string | null
          meeting_recording_url?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          performed_by?: string | null
          prospect_id: string
          scheduled_at?: string | null
          subject?: string | null
        }
        Update: {
          activity_type?: string
          attachments?: Json | null
          body?: string | null
          completed_at?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          email_clicked?: boolean | null
          email_clicked_at?: string | null
          email_message_id?: string | null
          email_opened?: boolean | null
          email_opened_at?: string | null
          id?: string
          is_completed?: boolean | null
          meeting_link?: string | null
          meeting_recording_url?: string | null
          outcome?: string | null
          outcome_notes?: string | null
          performed_by?: string | null
          prospect_id?: string
          scheduled_at?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_outreach_activities_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "sponsor_prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_prospects: {
        Row: {
          annual_revenue: string | null
          assigned_to: string | null
          company_name: string
          company_size: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          deal_currency: string | null
          deal_value: number | null
          employee_count: string | null
          expected_close_date: string | null
          expected_tier: string | null
          follow_up_notes: string | null
          headquarters_city: string | null
          headquarters_state: string | null
          id: string
          industry: string | null
          last_contact_at: string | null
          linkedin_url: string | null
          lost_reason: string | null
          next_follow_up: string | null
          notes: string | null
          pipeline_stage: string | null
          primary_contact_email: string | null
          primary_contact_linkedin: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          primary_contact_title: string | null
          priority: string | null
          probability: number | null
          secondary_contacts: Json | null
          source: string | null
          source_details: string | null
          stage_changed_at: string | null
          tags: string[] | null
          twitter_url: string | null
          updated_at: string | null
          website: string | null
          weighted_value: number | null
        }
        Insert: {
          annual_revenue?: string | null
          assigned_to?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          deal_currency?: string | null
          deal_value?: number | null
          employee_count?: string | null
          expected_close_date?: string | null
          expected_tier?: string | null
          follow_up_notes?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          last_contact_at?: string | null
          linkedin_url?: string | null
          lost_reason?: string | null
          next_follow_up?: string | null
          notes?: string | null
          pipeline_stage?: string | null
          primary_contact_email?: string | null
          primary_contact_linkedin?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          priority?: string | null
          probability?: number | null
          secondary_contacts?: Json | null
          source?: string | null
          source_details?: string | null
          stage_changed_at?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          website?: string | null
          weighted_value?: number | null
        }
        Update: {
          annual_revenue?: string | null
          assigned_to?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          deal_currency?: string | null
          deal_value?: number | null
          employee_count?: string | null
          expected_close_date?: string | null
          expected_tier?: string | null
          follow_up_notes?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          id?: string
          industry?: string | null
          last_contact_at?: string | null
          linkedin_url?: string | null
          lost_reason?: string | null
          next_follow_up?: string | null
          notes?: string | null
          pipeline_stage?: string | null
          primary_contact_email?: string | null
          primary_contact_linkedin?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          primary_contact_title?: string | null
          priority?: string | null
          probability?: number | null
          secondary_contacts?: Json | null
          source?: string | null
          source_details?: string | null
          stage_changed_at?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          updated_at?: string | null
          website?: string | null
          weighted_value?: number | null
        }
        Relationships: []
      }
      sponsor_reminders: {
        Row: {
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_completed: boolean | null
          message: string | null
          reminder_date: string
          reminder_type: string
          sponsor_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_completed?: boolean | null
          message?: string | null
          reminder_date: string
          reminder_type: string
          sponsor_id: string
        }
        Update: {
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_completed?: boolean | null
          message?: string | null
          reminder_date?: string
          reminder_type?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_reminders_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_social_posts: {
        Row: {
          created_at: string | null
          id: string
          platform: string | null
          post_content: string | null
          post_url: string | null
          posted_date: string | null
          reminder_sent_at: string | null
          scheduled_date: string
          status: string
          subscription_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform?: string | null
          post_content?: string | null
          post_url?: string | null
          posted_date?: string | null
          reminder_sent_at?: string | null
          scheduled_date: string
          status?: string
          subscription_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string | null
          post_content?: string | null
          post_url?: string | null
          posted_date?: string | null
          reminder_sent_at?: string | null
          scheduled_date?: string
          status?: string
          subscription_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_social_posts_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "corporate_subscriptions"
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
      success_stories: {
        Row: {
          business_id: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          metrics: Json | null
          story_type: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          metrics?: Json | null
          story_type: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          metrics?: Json | null
          story_type?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_stories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "success_stories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      support_ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal_note: boolean | null
          message: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal_note?: boolean | null
          message: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal_note?: boolean | null
          message?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          ticket_number: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          ticket_number: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          ticket_number?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      susu_circles: {
        Row: {
          contribution_amount: number
          created_at: string | null
          creator_id: string
          current_round: number | null
          description: string | null
          frequency: string
          id: string
          max_members: number
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contribution_amount: number
          created_at?: string | null
          creator_id: string
          current_round?: number | null
          description?: string | null
          frequency?: string
          id?: string
          max_members?: number
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contribution_amount?: number
          created_at?: string | null
          creator_id?: string
          current_round?: number | null
          description?: string | null
          frequency?: string
          id?: string
          max_members?: number
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "susu_circles_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      susu_escrow: {
        Row: {
          amount: number
          circle_id: string
          contributor_id: string
          created_at: string | null
          held_at: string | null
          id: string
          platform_fee: number
          recipient_id: string | null
          released_at: string | null
          round_number: number
          status: string | null
          stripe_transfer_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          circle_id: string
          contributor_id: string
          created_at?: string | null
          held_at?: string | null
          id?: string
          platform_fee?: number
          recipient_id?: string | null
          released_at?: string | null
          round_number: number
          status?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          circle_id?: string
          contributor_id?: string
          created_at?: string | null
          held_at?: string | null
          id?: string
          platform_fee?: number
          recipient_id?: string | null
          released_at?: string | null
          round_number?: number
          status?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "susu_escrow_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "susu_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "susu_escrow_contributor_id_fkey"
            columns: ["contributor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "susu_escrow_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      susu_memberships: {
        Row: {
          circle_id: string
          id: string
          joined_at: string | null
          payout_position: number
          status: string | null
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string | null
          payout_position: number
          status?: string | null
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string | null
          payout_position?: number
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "susu_memberships_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "susu_circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "susu_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key: string
          setting_type?: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_configurations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_configurations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          business_id: string | null
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          rating: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          icon: string | null
          id: string
          points_awarded: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          icon?: string | null
          id?: string
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          icon?: string | null
          id?: string
          points_awarded?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      user_investments: {
        Row: {
          amount: number
          equity_percentage: number | null
          id: string
          invested_at: string | null
          investment_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          equity_percentage?: number | null
          id?: string
          invested_at?: string | null
          investment_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          equity_percentage?: number | null
          id?: string
          invested_at?: string | null
          investment_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_investments_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "community_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_milestone_progress: {
        Row: {
          claimed_at: string | null
          id: string
          milestone_id: string
          reward_claimed: boolean | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          milestone_id: string
          reward_claimed?: boolean | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          id?: string
          milestone_id?: string
          reward_claimed?: boolean | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestone_progress_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "referral_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_onboarding: {
        Row: {
          completed_at: string | null
          created_at: string | null
          features_viewed: Json | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          features_viewed?: Json | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          features_viewed?: Json | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          business_type_preference: string[] | null
          created_at: string | null
          distance_preference: number | null
          id: string
          last_updated: string | null
          preferred_categories: string[] | null
          preferred_locations: string[] | null
          price_range: string | null
          user_id: string
        }
        Insert: {
          business_type_preference?: string[] | null
          created_at?: string | null
          distance_preference?: number | null
          id?: string
          last_updated?: string | null
          preferred_categories?: string[] | null
          preferred_locations?: string[] | null
          price_range?: string | null
          user_id: string
        }
        Update: {
          business_type_preference?: string[] | null
          created_at?: string | null
          distance_preference?: number | null
          id?: string
          last_updated?: string | null
          preferred_categories?: string[] | null
          preferred_locations?: string[] | null
          price_range?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          cash_awarded: number | null
          converted_at: string | null
          created_at: string | null
          id: string
          points_awarded: number | null
          referral_code: string
          referred_email: string | null
          referred_id: string | null
          referrer_id: string
          status: string | null
        }
        Insert: {
          cash_awarded?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          referral_code: string
          referred_email?: string | null
          referred_id?: string | null
          referrer_id: string
          status?: string | null
        }
        Update: {
          cash_awarded?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          points_awarded?: number | null
          referral_code?: string
          referred_email?: string | null
          referred_id?: string | null
          referrer_id?: string
          status?: string | null
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
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      verification_certificates: {
        Row: {
          business_id: string
          certificate_number: string
          created_at: string
          embed_code: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          issued_at: string
          pdf_url: string | null
          revoked_at: string | null
          revoked_reason: string | null
          updated_at: string
          verification_id: string
        }
        Insert: {
          business_id: string
          certificate_number: string
          created_at?: string
          embed_code?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          issued_at?: string
          pdf_url?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          updated_at?: string
          verification_id: string
        }
        Update: {
          business_id?: string
          certificate_number?: string
          created_at?: string
          embed_code?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          issued_at?: string
          pdf_url?: string | null
          revoked_at?: string | null
          revoked_reason?: string | null
          updated_at?: string
          verification_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_certificates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_certificates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_certificates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_certificates_verification_id_fkey"
            columns: ["verification_id"]
            isOneToOne: false
            referencedRelation: "business_verifications"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          reference_type: string | null
          source: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          source: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          source?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      b2b_external_leads_public: {
        Row: {
          business_description: string | null
          business_name: string | null
          category: string | null
          city: string | null
          confidence_score: number | null
          created_at: string | null
          data_quality_score: number | null
          id: string | null
          is_converted: boolean | null
          is_visible_in_directory: boolean | null
          location: string | null
          state: string | null
          website_url: string | null
          zip_code: string | null
        }
        Insert: {
          business_description?: string | null
          business_name?: string | null
          category?: string | null
          city?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          id?: string | null
          is_converted?: boolean | null
          is_visible_in_directory?: boolean | null
          location?: string | null
          state?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Update: {
          business_description?: string | null
          business_name?: string | null
          category?: string | null
          city?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          id?: string | null
          is_converted?: boolean | null
          is_visible_in_directory?: boolean | null
          location?: string | null
          state?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      businesses_full_details: {
        Row: {
          address: string | null
          average_rating: number | null
          banner_url: string | null
          business_name: string | null
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string | null
          is_verified: boolean | null
          location_manager_id: string | null
          location_name: string | null
          location_type: string | null
          logo_url: string | null
          name: string | null
          owner_contact_notes: string | null
          owner_email: string | null
          owner_id: string | null
          owner_phone: string | null
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
        Relationships: [
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses_public_safe: {
        Row: {
          address: string | null
          average_rating: number | null
          banner_url: string | null
          business_name: string | null
          category: string | null
          city: string | null
          created_at: string | null
          description: string | null
          founding_joined_at: string | null
          founding_order: number | null
          founding_sponsor_since: string | null
          id: string | null
          is_founding_member: boolean | null
          is_founding_sponsor: boolean | null
          is_verified: boolean | null
          listing_status: string | null
          location_manager_id: string | null
          location_name: string | null
          location_type: string | null
          logo_url: string | null
          name: string | null
          onboarding_completed_at: string | null
          owner_id: string | null
          parent_business_id: string | null
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
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          founding_joined_at?: string | null
          founding_order?: number | null
          founding_sponsor_since?: string | null
          id?: string | null
          is_founding_member?: boolean | null
          is_founding_sponsor?: boolean | null
          is_verified?: boolean | null
          listing_status?: string | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name?: string | null
          onboarding_completed_at?: string | null
          owner_id?: string | null
          parent_business_id?: string | null
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
          business_name?: string | null
          category?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          founding_joined_at?: string | null
          founding_order?: number | null
          founding_sponsor_since?: string | null
          id?: string | null
          is_founding_member?: boolean | null
          is_founding_sponsor?: boolean | null
          is_verified?: boolean | null
          listing_status?: string | null
          location_manager_id?: string | null
          location_name?: string | null
          location_type?: string | null
          logo_url?: string | null
          name?: string | null
          onboarding_completed_at?: string | null
          owner_id?: string | null
          parent_business_id?: string | null
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_full_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "businesses_parent_business_id_fkey"
            columns: ["parent_business_id"]
            isOneToOne: false
            referencedRelation: "businesses_public_safe"
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
      approve_corporate_subscription: {
        Args: { p_admin_notes?: string; p_subscription_id: string }
        Returns: Json
      }
      approve_verification_with_certificate: {
        Args: {
          p_admin_id: string
          p_admin_notes?: string
          p_badge_tier?: string
          p_verification_id: string
        }
        Returns: {
          certificate_number: string
          expires_at: string
          verification_id: string
        }[]
      }
      assign_admin_role: { Args: { user_email: string }; Returns: undefined }
      award_coalition_points: {
        Args: {
          p_base_points: number
          p_business_id: string
          p_customer_id: string
          p_description?: string
        }
        Returns: Json
      }
      award_review_points_secure: {
        Args: {
          p_business_id: string
          p_customer_id: string
          p_review_id: string
        }
        Returns: Json
      }
      calculate_asset_depreciation: {
        Args: { p_as_of_date?: string; p_asset_id: string }
        Returns: number
      }
      calculate_coalition_tier: {
        Args: { lifetime_points: number }
        Returns: string
      }
      calculate_commission: {
        Args: { p_amount: number; p_commission_rate?: number }
        Returns: Json
      }
      calculate_override_end_date: {
        Args: { recruitment_date: string }
        Returns: string
      }
      calculate_profile_completion: {
        Args: { profile_row: Database["public"]["Tables"]["profiles"]["Row"] }
        Returns: number
      }
      calculate_team_bonus: { Args: { tier1_points: number }; Returns: number }
      calculate_user_impact_metrics: {
        Args: { p_user_id: string }
        Returns: Json
      }
      can_access_admin_features: { Args: never; Returns: boolean }
      can_view_business_contact: {
        Args: { business_id_param: string }
        Returns: boolean
      }
      check_ai_assistant_rate_limit: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_and_award_badges: {
        Args: { p_sales_agent_id: string }
        Returns: undefined
      }
      check_and_update_agent_tier: {
        Args: { agent_id_param: string }
        Returns: undefined
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
      claim_business_lead: {
        Args: { p_token: string; p_user_id: string }
        Returns: Json
      }
      cleanup_expired_search_cache: { Args: never; Returns: undefined }
      cleanup_old_audit_logs: { Args: never; Returns: undefined }
      cleanup_old_batch_queue: { Args: never; Returns: undefined }
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
      create_user_referral: { Args: { p_user_id: string }; Returns: string }
      credit_wallet: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_reference_type?: string
          p_source: string
          p_user_id: string
        }
        Returns: string
      }
      debit_wallet: {
        Args: {
          p_amount: number
          p_description?: string
          p_reference_id?: string
          p_reference_type?: string
          p_source: string
          p_user_id: string
        }
        Returns: string
      }
      delete_user_account: { Args: { user_id: string }; Returns: undefined }
      delete_user_account_immediate: { Args: never; Returns: Json }
      expire_challenges: { Args: never; Returns: undefined }
      generate_batch_number: { Args: never; Returns: string }
      generate_certificate_number: { Args: never; Returns: string }
      generate_claim_token: { Args: { lead_id: string }; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_referral_code: { Args: never; Returns: string }
      generate_ticket_number: { Args: never; Returns: string }
      generate_white_label_api_key: {
        Args: { p_business_id: string }
        Returns: string
      }
      get_active_campaigns: {
        Args: never
        Returns: {
          bonus_multiplier: number
          campaign_type: string
          description: string
          end_date: string
          id: string
          is_joined: boolean
          my_rank: number
          my_referrals: number
          name: string
          participant_count: number
          start_date: string
        }[]
      }
      get_active_referral_codes: {
        Args: never
        Returns: {
          is_active: boolean
          referral_code: string
        }[]
      }
      get_admin_notification_preferences: {
        Args: { p_admin_id: string }
        Returns: {
          admin_user_id: string
          agent_milestone_enabled: boolean | null
          batch_window_minutes: number | null
          business_verification_enabled: boolean | null
          created_at: string | null
          digest_time: string | null
          enable_batching: boolean | null
          id: string
          milestone_conversion_enabled: boolean | null
          milestone_earnings_enabled: boolean | null
          milestone_referrals_enabled: boolean | null
          min_batch_size: number | null
          min_conversion_milestone: number | null
          min_earnings_milestone: number | null
          min_referral_milestone: number | null
          notification_email: string
          send_daily_digest: boolean | null
          send_immediate: boolean | null
          send_to_multiple_emails: string[] | null
          send_weekly_digest: boolean | null
          updated_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "admin_notification_preferences"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_admin_verification_queue: {
        Args: never
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
      get_agent_badges_with_progress: {
        Args: { p_sales_agent_id: string }
        Returns: {
          badge_id: string
          category: Database["public"]["Enums"]["badge_category"]
          description: string
          earned_at: string
          icon_name: string
          is_earned: boolean
          name: string
          points: number
          progress: number
          progress_percentage: number
          threshold_value: number
          tier: Database["public"]["Enums"]["badge_tier"]
        }[]
      }
      get_agent_leaderboard: {
        Args: { p_limit?: number; p_time_period?: string }
        Returns: {
          active_referrals: number
          agent_id: string
          agent_name: string
          rank: number
          referral_code: string
          tier: string
          total_referrals: number
        }[]
      }
      get_agent_qr_analytics: {
        Args: { agent_referral_code: string }
        Returns: {
          conversion_rate: number
          conversions_last_30_days: number
          conversions_last_7_days: number
          scans_last_30_days: number
          scans_last_7_days: number
          total_conversions: number
          total_scans: number
          unique_scans: number
        }[]
      }
      get_agent_referral_codes: {
        Args: never
        Returns: {
          is_active: boolean
          referral_code: string
        }[]
      }
      get_agent_tier_progress: {
        Args: { agent_id_param: string }
        Returns: {
          current_referrals: number
          current_tier: string
          next_tier: string
          next_tier_threshold: number
          progress_percentage: number
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
        Args: never
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
        Args: never
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
      get_b2b_impact_metrics: { Args: never; Returns: Json }
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
      get_business_referral_info: {
        Args: { p_business_id: string }
        Returns: Json
      }
      get_business_verifications_admin_summary: {
        Args: never
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
      get_campaign_leaderboard: {
        Args: { p_campaign_id: string; p_limit?: number }
        Returns: {
          is_current_user: boolean
          points: number
          rank: number
          referrals: number
          user_id: string
          user_name: string
        }[]
      }
      get_coalition_stats: { Args: never; Returns: Json }
      get_community_impact_summary: { Args: never; Returns: Json }
      get_community_wealth_metrics: { Args: never; Returns: Json }
      get_directory_businesses: {
        Args: { p_limit?: number; p_offset?: number }
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
          location_name: string
          location_type: string
          logo_url: string
          name: string
          review_count: number
          state: string
          updated_at: string
          website: string
          zip_code: string
        }[]
      }
      get_download_trends: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          banner_count: number
          document_count: number
          download_count: number
          download_date: string
          email_count: number
          social_count: number
        }[]
      }
      get_hbcu_verification_document_url: {
        Args: { verification_id: string }
        Returns: string
      }
      get_hbcu_verifications_admin_summary: {
        Args: never
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
      get_material_analytics: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: {
          bronze_downloads: number
          gold_downloads: number
          material_id: string
          material_title: string
          material_type: string
          platinum_downloads: number
          silver_downloads: number
          total_downloads: number
          unique_agents: number
        }[]
      }
      get_materials_by_category: {
        Args: {
          p_category?: Database["public"]["Enums"]["marketing_material_category"]
        }
        Returns: {
          category: Database["public"]["Enums"]["marketing_material_category"]
          created_at: string
          description: string
          download_count: number
          file_path: string
          file_size: number
          file_type: string
          id: string
          is_featured: boolean
          tags: string[]
          thumbnail_path: string
          title: string
        }[]
      }
      get_materials_with_filters: {
        Args: {
          p_category_ids?: string[]
          p_tag_ids?: string[]
          p_type?: string
        }
        Returns: {
          categories: Json
          created_at: string
          description: string
          dimensions: string
          download_count: number
          file_size: number
          file_url: string
          id: string
          is_active: boolean
          tags: Json
          thumbnail_url: string
          title: string
          type: string
          updated_at: string
        }[]
      }
      get_parent_business_analytics: {
        Args: { p_parent_business_id: string }
        Returns: Json
      }
      get_platform_commission_summary: {
        Args: { p_end_date?: string; p_start_date?: string }
        Returns: Json
      }
      get_platform_stats: { Args: never; Returns: Json }
      get_public_business_info: {
        Args: never
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
        Args: never
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
      get_public_external_leads: {
        Args: { p_limit?: number }
        Returns: {
          business_description: string
          business_name: string
          category: string
          city: string
          confidence_score: number
          created_at: string
          data_quality_score: number
          id: string
          is_converted: boolean
          location: string
          state: string
          website_url: string
        }[]
      }
      get_public_profile_info: {
        Args: { user_ids: string[] }
        Returns: {
          avatar_url: string
          display_name: string
          id: string
        }[]
      }
      get_public_referral_codes: {
        Args: never
        Returns: {
          created_at: string
          is_active: boolean
          referral_code: string
        }[]
      }
      get_public_referral_codes_only: {
        Args: never
        Returns: {
          created_at: string
          is_active: boolean
          referral_code: string
        }[]
      }
      get_qr_scan_metrics: { Args: { p_business_id: string }; Returns: Json }
      get_safe_business_listings: {
        Args: never
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
        Args: never
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
      get_security_metrics: { Args: never; Returns: Json }
      get_sponsor_pipeline_summary: {
        Args: never
        Returns: {
          count: number
          stage: string
          total_value: number
          weighted_value: number
        }[]
      }
      get_test_questions_for_user: {
        Args: never
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
      get_tier_multiplier: { Args: { tier: string }; Returns: number }
      get_user_hbcu_status: { Args: { target_user_id?: string }; Returns: Json }
      get_user_milestone_progress: {
        Args: never
        Returns: {
          badge_color: string
          badge_icon: string
          badge_name: string
          description: string
          is_unlocked: boolean
          milestone_count: number
          milestone_id: string
          milestone_name: string
          progress_percent: number
          reward_cash: number
          reward_claimed: boolean
          reward_points: number
          unlocked_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id_param: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_verification_document_urls: {
        Args: { verification_id: string }
        Returns: {
          address_url: string
          ownership_url: string
          registration_url: string
        }[]
      }
      grant_initial_admin: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      grant_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      handle_api_error: {
        Args: {
          error_details?: Json
          error_message: string
          operation_name: string
        }
        Returns: Json
      }
      has_role:
        | {
            Args: { _role: Database["public"]["Enums"]["user_role"] }
            Returns: boolean
          }
        | {
            Args: {
              _role: Database["public"]["Enums"]["app_role"]
              _user_id: string
            }
            Returns: boolean
          }
        | { Args: { _role: string; _user_id: string }; Returns: boolean }
      has_transacted_with_business: {
        Args: { p_business_id: string; p_customer_id: string }
        Returns: boolean
      }
      increment_material_downloads: {
        Args: { material_id: string }
        Returns: undefined
      }
      insert_fraud_alerts_batch: { Args: { alerts: Json[] }; Returns: number }
      is_admin: { Args: never; Returns: boolean }
      is_admin_secure: { Args: never; Returns: boolean }
      is_business_owner: {
        Args: { _business_id: string; _user_id: string }
        Returns: boolean
      }
      is_business_owner_or_manager: {
        Args: {
          business_location_manager_id: string
          business_owner_id: string
          business_parent_id: string
        }
        Returns: boolean
      }
      is_business_suspended: {
        Args: { check_business_id: string }
        Returns: boolean
      }
      is_savings_circle_creator: {
        Args: { p_circle_id: string; p_user_id: string }
        Returns: boolean
      }
      is_savings_circle_member: {
        Args: { p_circle_id: string; p_user_id: string }
        Returns: boolean
      }
      is_shopping_list_creator: {
        Args: { p_list_id: string; p_user_id: string }
        Returns: boolean
      }
      is_shopping_list_member: {
        Args: { p_list_id: string; p_user_id: string }
        Returns: boolean
      }
      is_user_suspended: { Args: { check_user_id: string }; Returns: boolean }
      join_challenge: { Args: { p_challenge_id: string }; Returns: Json }
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
      manual_send_review_request: {
        Args: { p_booking_id: string }
        Returns: Json
      }
      mark_all_notifications_read: { Args: never; Returns: undefined }
      mark_notification_read: {
        Args: { notification_id: string }
        Returns: undefined
      }
      mark_qr_scan_converted: {
        Args: { p_referral_code: string; p_user_id: string }
        Returns: boolean
      }
      process_business_referral: {
        Args: { p_business_id: string; p_referral_code: string }
        Returns: Json
      }
      process_commission_payment: {
        Args: { p_batch_id?: string; p_commission_id: string }
        Returns: Json
      }
      process_pending_commissions: { Args: never; Returns: undefined }
      process_pending_referrals: { Args: never; Returns: Json }
      record_business_metric:
        | {
            Args: {
              p_business_id: string
              p_metadata?: Json
              p_metric_type: string
              p_metric_value: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_business_id: string
              p_metric_type: string
              p_metric_value: number
            }
            Returns: undefined
          }
      record_challenge_activity: {
        Args: {
          p_activity_type: string
          p_activity_value: number
          p_challenge_id: string
          p_metadata?: Json
        }
        Returns: undefined
      }
      record_commission: {
        Args: {
          p_amount: number
          p_booking_id: string
          p_business_id: string
          p_transaction_id: string
          p_transaction_type?: string
        }
        Returns: string
      }
      reject_corporate_subscription: {
        Args: {
          p_admin_notes?: string
          p_rejection_reason: string
          p_subscription_id: string
        }
        Returns: Json
      }
      request_account_deletion: {
        Args: { deletion_reason?: string }
        Returns: Json
      }
      require_mfa_for_admin: { Args: never; Returns: boolean }
      revoke_role: {
        Args: {
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: undefined
      }
      sanitize_text_input: {
        Args: { input_text: string; max_length?: number }
        Returns: string
      }
      search_directory_businesses: {
        Args: {
          p_category?: string
          p_city?: string
          p_limit?: number
          p_offset?: number
          p_search_term?: string
          p_state?: string
        }
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
          location_name: string
          location_type: string
          logo_url: string
          name: string
          review_count: number
          state: string
          updated_at: string
          website: string
          zip_code: string
        }[]
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
      track_material_download: {
        Args: { p_material_id: string; p_user_id: string }
        Returns: undefined
      }
      track_qr_scan: {
        Args: {
          p_ip_address?: unknown
          p_referral_code: string
          p_user_agent?: string
        }
        Returns: string
      }
      update_agent_tier: { Args: { p_agent_id: string }; Returns: undefined }
      update_sentiment_trends: {
        Args: { p_business_id: string; p_period_days?: number }
        Returns: Json
      }
      update_user_streak: {
        Args: { p_streak_type: string; p_user_id: string }
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
      validate_referral_code: {
        Args: { p_referral_code: string }
        Returns: Json
      }
      validate_test_answers: { Args: { answer_data: Json }; Returns: Json }
      validate_uuid_input: { Args: { input_uuid: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "customer" | "business" | "sales_agent"
      badge_category: "referrals" | "earnings" | "recruitment" | "special"
      badge_tier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
      hbcu_verification_status: "pending" | "approved" | "rejected"
      marketing_material_category:
        | "social_media"
        | "email_templates"
        | "graphics"
        | "presentations"
        | "qr_codes"
        | "videos"
        | "documents"
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
      badge_category: ["referrals", "earnings", "recruitment", "special"],
      badge_tier: ["bronze", "silver", "gold", "platinum", "diamond"],
      hbcu_verification_status: ["pending", "approved", "rejected"],
      marketing_material_category: [
        "social_media",
        "email_templates",
        "graphics",
        "presentations",
        "qr_codes",
        "videos",
        "documents",
      ],
      subscription_tier: ["free", "paid", "business_starter"],
      user_role: ["customer", "business", "admin", "sales_agent"],
    },
  },
} as const
