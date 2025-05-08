export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_status: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
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
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: { query: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
