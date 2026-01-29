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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string | null
          address: string | null
          annual_revenue: number | null
          city: string | null
          country: string | null
          created_at: string
          employee_count: number | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          owner_id: string | null
          parent_account_id: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          owner_id?: string | null
          parent_account_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          annual_revenue?: number | null
          city?: string | null
          country?: string | null
          created_at?: string
          employee_count?: number | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          owner_id?: string | null
          parent_account_id?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string
          entity_id: string | null
          entity_name: string
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          action: string
          created_at?: string
          description: string
          entity_id?: string | null
          entity_name: string
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string
          entity_id?: string | null
          entity_name?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string
          user_name?: string
          user_role?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          account_id: string | null
          attachments: Json | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          direction: string | null
          duration_minutes: number | null
          external_id: string | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          lead_id: string | null
          opportunity_id: string | null
          outcome: string | null
          scheduled_at: string | null
          source: string | null
          subject: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          attachments?: Json | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          direction?: string | null
          duration_minutes?: number | null
          external_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          source?: string | null
          subject?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          attachments?: Json | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          direction?: string | null
          duration_minutes?: number | null
          external_id?: string | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          lead_id?: string | null
          opportunity_id?: string | null
          outcome?: string | null
          scheduled_at?: string | null
          source?: string | null
          subject?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          account_id: string | null
          created_at: string
          department: string | null
          email: string | null
          first_name: string
          id: string
          influence_level: number | null
          is_primary: boolean | null
          job_title: string | null
          last_name: string
          linkedin_url: string | null
          mobile: string | null
          notes: string | null
          phone: string | null
          role_type: string | null
          sentiment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name: string
          id?: string
          influence_level?: number | null
          is_primary?: boolean | null
          job_title?: string | null
          last_name: string
          linkedin_url?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          role_type?: string | null
          sentiment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          first_name?: string
          id?: string
          influence_level?: number | null
          is_primary?: boolean | null
          job_title?: string | null
          last_name?: string
          linkedin_url?: string | null
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          role_type?: string | null
          sentiment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          address: string | null
          city: string | null
          company_name: string | null
          converted_account_id: string | null
          converted_at: string | null
          converted_contact_id: string | null
          converted_opportunity_id: string | null
          country: string | null
          created_at: string
          description: string | null
          email: string | null
          first_name: string
          id: string
          industry: string | null
          job_title: string | null
          last_name: string
          lead_source: string | null
          owner_id: string | null
          phone: string | null
          postal_code: string | null
          rating: string | null
          score: number | null
          state: string | null
          status: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          converted_account_id?: string | null
          converted_at?: string | null
          converted_contact_id?: string | null
          converted_opportunity_id?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          first_name: string
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name: string
          lead_source?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: string | null
          score?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string | null
          converted_account_id?: string | null
          converted_at?: string | null
          converted_contact_id?: string | null
          converted_opportunity_id?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          first_name?: string
          id?: string
          industry?: string | null
          job_title?: string | null
          last_name?: string
          lead_source?: string | null
          owner_id?: string | null
          phone?: string | null
          postal_code?: string | null
          rating?: string | null
          score?: number | null
          state?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_account_id_fkey"
            columns: ["converted_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_contact_id_fkey"
            columns: ["converted_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_opportunity_id_fkey"
            columns: ["converted_opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          account_id: string | null
          actual_close_date: string | null
          amount: number | null
          competitor: string | null
          created_at: string
          currency: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          lead_source: string | null
          loss_reason: string | null
          name: string
          next_step: string | null
          owner_id: string | null
          primary_contact_id: string | null
          probability: number | null
          stage: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          actual_close_date?: string | null
          amount?: number | null
          competitor?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          loss_reason?: string | null
          name: string
          next_step?: string | null
          owner_id?: string | null
          primary_contact_id?: string | null
          probability?: number | null
          stage?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          actual_close_date?: string | null
          amount?: number | null
          competitor?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          lead_source?: string | null
          loss_reason?: string | null
          name?: string
          next_step?: string | null
          owner_id?: string | null
          primary_contact_id?: string | null
          probability?: number | null
          stage?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          region: string | null
          role: string
          team_id: string | null
          team_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          region?: string | null
          role?: string
          team_id?: string | null
          team_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          region?: string | null
          role?: string
          team_id?: string | null
          team_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          account_id: string | null
          assigned_to: string | null
          completed_at: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          due_time: string | null
          id: string
          is_recurring: boolean | null
          lead_id: string | null
          opportunity_id: string | null
          parent_task_id: string | null
          priority: string | null
          recurrence_end_date: string | null
          recurrence_pattern: string | null
          reminder_at: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_recurring?: boolean | null
          lead_id?: string | null
          opportunity_id?: string | null
          parent_task_id?: string | null
          priority?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_at?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          id?: string
          is_recurring?: boolean | null
          lead_id?: string | null
          opportunity_id?: string | null
          parent_task_id?: string | null
          priority?: string | null
          recurrence_end_date?: string | null
          recurrence_pattern?: string | null
          reminder_at?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
