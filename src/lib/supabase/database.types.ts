// Generated from the Supabase schema — do not edit by hand.
// Regenerate with the Supabase MCP `generate_typescript_types` tool, or:
//   npx supabase gen types typescript --project-id iouiuvgyzujvrkyjihvg

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          company: string | null;
          email: string;
          id: string;
          message: string;
          name: string;
          phone: string | null;
          reference: string;
          source: string;
          status: string;
          subject: string | null;
          submitted_at: string;
        };
        Insert: {
          company?: string | null;
          email: string;
          id?: string;
          message: string;
          name: string;
          phone?: string | null;
          reference: string;
          source?: string;
          status?: string;
          subject?: string | null;
          submitted_at?: string;
        };
        Update: {
          company?: string | null;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          phone?: string | null;
          reference?: string;
          source?: string;
          status?: string;
          subject?: string | null;
          submitted_at?: string;
        };
        Relationships: [];
      };
      quote_requests: {
        Row: {
          cargo_description: string;
          cargo_type: string;
          company_name: string;
          contact_name: string;
          created_at: string;
          destination_city: string;
          destination_country: string;
          email: string;
          id: string;
          needs_customs: string;
          notes: string | null;
          origin_city: string;
          phone: string;
          preferred_contact: string;
          ready_date: string;
          reference: string;
          service: string;
          status: string;
          unit_count: number | null;
          weight_kg: number;
        };
        Insert: {
          cargo_description: string;
          cargo_type: string;
          company_name: string;
          contact_name: string;
          created_at?: string;
          destination_city: string;
          destination_country: string;
          email: string;
          id?: string;
          needs_customs: string;
          notes?: string | null;
          origin_city: string;
          phone: string;
          preferred_contact: string;
          ready_date: string;
          reference: string;
          service: string;
          status?: string;
          unit_count?: number | null;
          weight_kg: number;
        };
        Update: {
          cargo_description?: string;
          cargo_type?: string;
          company_name?: string;
          contact_name?: string;
          created_at?: string;
          destination_city?: string;
          destination_country?: string;
          email?: string;
          id?: string;
          needs_customs?: string;
          notes?: string | null;
          origin_city?: string;
          phone?: string;
          preferred_contact?: string;
          ready_date?: string;
          reference?: string;
          service?: string;
          status?: string;
          unit_count?: number | null;
          weight_kg?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
