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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      enquiries: {
        Row: {
          company: string
          company_size: string
          created_at: string
          email: string
          id: string
          manual_work: string | null
          name: string
          systems: string | null
        }
        Insert: {
          company: string
          company_size: string
          created_at?: string
          email: string
          id?: string
          manual_work?: string | null
          name: string
          systems?: string | null
        }
        Update: {
          company?: string
          company_size?: string
          created_at?: string
          email?: string
          id?: string
          manual_work?: string | null
          name?: string
          systems?: string | null
        }
        Relationships: []
      }
      goldmine_orders: {
        Row: {
          amount_pence: number
          category: string
          created_at: string
          currency: string
          customer_email: string
          drafts: Json | null
          engine_error: string | null
          engine_scan_id: string | null
          guest_token: string | null
          id: string
          is_fixture: boolean
          locality: string
          payment_provider: string | null
          payment_reference: string | null
          payment_status: string
          results: Json | null
          scan_status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_pence?: number
          category: string
          created_at?: string
          currency?: string
          customer_email: string
          drafts?: Json | null
          engine_error?: string | null
          engine_scan_id?: string | null
          guest_token?: string | null
          id?: string
          is_fixture?: boolean
          locality: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string
          results?: Json | null
          scan_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_pence?: number
          category?: string
          created_at?: string
          currency?: string
          customer_email?: string
          drafts?: Json | null
          engine_error?: string | null
          engine_scan_id?: string | null
          guest_token?: string | null
          id?: string
          is_fixture?: boolean
          locality?: string
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: string
          results?: Json | null
          scan_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      goldmine_payment_events: {
        Row: {
          event_id: string
          id: string
          order_id: string | null
          payload: Json | null
          provider: string
          received_at: string
        }
        Insert: {
          event_id: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          provider: string
          received_at?: string
        }
        Update: {
          event_id?: string
          id?: string
          order_id?: string | null
          payload?: Json | null
          provider?: string
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goldmine_payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "goldmine_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      outshine_purchases: {
        Row: {
          amount: number
          business_id: string
          business_snapshot: Json
          created_at: string
          currency: string
          environment: string
          id: string
          paid_at: string | null
          payment_status: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          business_id: string
          business_snapshot: Json
          created_at?: string
          currency?: string
          environment: string
          id?: string
          paid_at?: string | null
          payment_status?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          business_id?: string
          business_snapshot?: Json
          created_at?: string
          currency?: string
          environment?: string
          id?: string
          paid_at?: string | null
          payment_status?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      outshine_request_budgets: {
        Row: {
          bucket: string
          expires_at: string
          used: number
        }
        Insert: {
          bucket: string
          expires_at: string
          used?: number
        }
        Update: {
          bucket?: string
          expires_at?: string
          used?: number
        }
        Relationships: []
      }
      outshine_scan_credits: {
        Row: {
          business_id: string
          created_at: string
          environment: string
          id: string
          kind: string
          payment_status: string
          purchase_id: string | null
          stripe_session_id: string | null
          used_by: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          environment: string
          id?: string
          kind?: string
          payment_status?: string
          purchase_id?: string | null
          stripe_session_id?: string | null
          used_by?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          environment?: string
          id?: string
          kind?: string
          payment_status?: string
          purchase_id?: string | null
          stripe_session_id?: string | null
          used_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      outshine_scans: {
        Row: {
          business_id: string
          completed_at: string | null
          created_at: string
          credit_id: string | null
          environment: string
          expires_at: string | null
          id: string
          ip_hash: string
          snapshot: Json | null
          source: string
          status: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          business_id: string
          completed_at?: string | null
          created_at?: string
          credit_id?: string | null
          environment: string
          expires_at?: string | null
          id?: string
          ip_hash: string
          snapshot?: Json | null
          source?: string
          status?: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          business_id?: string
          completed_at?: string | null
          created_at?: string
          credit_id?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          ip_hash?: string
          snapshot?: Json | null
          source?: string
          status?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outshine_scans_credit_id_fkey"
            columns: ["credit_id"]
            isOneToOne: false
            referencedRelation: "outshine_scan_credits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outshine_scans_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "outshine_visitors"
            referencedColumns: ["id"]
          },
        ]
      }
      outshine_visitors: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
          token_hash: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
          token_hash: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
          token_hash?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      outshine_reserve_scan: {
        Args: {
          p_business: string
          p_environment: string
          p_fresh?: boolean
          p_ip: string
          p_user: string
          p_visitor: string
        }
        Returns: Json
      }
      outshine_take_budget: {
        Args: { p_bucket: string; p_expires: string; p_limit: number }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
    },
  },
} as const
