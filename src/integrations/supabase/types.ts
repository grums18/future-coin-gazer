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
      onchain_metrics: {
        Row: {
          active_addresses: number | null
          created_at: string | null
          exchange_inflows: number | null
          exchange_outflows: number | null
          id: string
          network_value: number | null
          timestamp: string
          token_symbol: string
          transaction_volume: number | null
        }
        Insert: {
          active_addresses?: number | null
          created_at?: string | null
          exchange_inflows?: number | null
          exchange_outflows?: number | null
          id?: string
          network_value?: number | null
          timestamp: string
          token_symbol: string
          transaction_volume?: number | null
        }
        Update: {
          active_addresses?: number | null
          created_at?: string | null
          exchange_inflows?: number | null
          exchange_outflows?: number | null
          id?: string
          network_value?: number | null
          timestamp?: string
          token_symbol?: string
          transaction_volume?: number | null
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          purchase_date: string | null
          purchase_price: number | null
          symbol: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          symbol: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          purchase_date?: string | null
          purchase_price?: number | null
          symbol?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prediction_history: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          id: string
          predicted_price: number | null
          prediction_days: number
          signal: string
          symbol: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          predicted_price?: number | null
          prediction_days: number
          signal: string
          symbol: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          predicted_price?: number | null
          prediction_days?: number
          signal?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
      }
      price_data: {
        Row: {
          close_price: number
          created_at: string | null
          high_price: number
          id: string
          low_price: number
          market_cap: number | null
          open_price: number
          timestamp: string
          token_symbol: string
          volume: number | null
        }
        Insert: {
          close_price: number
          created_at?: string | null
          high_price: number
          id?: string
          low_price: number
          market_cap?: number | null
          open_price: number
          timestamp: string
          token_symbol: string
          volume?: number | null
        }
        Update: {
          close_price?: number
          created_at?: string | null
          high_price?: number
          id?: string
          low_price?: number
          market_cap?: number | null
          open_price?: number
          timestamp?: string
          token_symbol?: string
          volume?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sentiment_data: {
        Row: {
          created_at: string | null
          fear_greed_index: number | null
          id: string
          news_sentiment: number | null
          sentiment_label: string | null
          sentiment_score: number | null
          social_mentions: number | null
          timestamp: string
          token_symbol: string
        }
        Insert: {
          created_at?: string | null
          fear_greed_index?: number | null
          id?: string
          news_sentiment?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          social_mentions?: number | null
          timestamp: string
          token_symbol: string
        }
        Update: {
          created_at?: string | null
          fear_greed_index?: number | null
          id?: string
          news_sentiment?: number | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          social_mentions?: number | null
          timestamp?: string
          token_symbol?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          blockchain: string | null
          coingecko_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          market_cap: number | null
          name: string
          symbol: string
          updated_at: string | null
        }
        Insert: {
          blockchain?: string | null
          coingecko_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          market_cap?: number | null
          name: string
          symbol: string
          updated_at?: string | null
        }
        Update: {
          blockchain?: string | null
          coingecko_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          market_cap?: number | null
          name?: string
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_signals: {
        Row: {
          confidence_score: number
          created_at: string | null
          expires_at: string | null
          id: string
          risk_level: string | null
          signal_type: string
          stop_loss: number | null
          target_price: number | null
          timeframe: string
          token_symbol: string
        }
        Insert: {
          confidence_score: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          risk_level?: string | null
          signal_type: string
          stop_loss?: number | null
          target_price?: number | null
          timeframe: string
          token_symbol: string
        }
        Update: {
          confidence_score?: number
          created_at?: string | null
          expires_at?: string | null
          id?: string
          risk_level?: string | null
          signal_type?: string
          stop_loss?: number | null
          target_price?: number | null
          timeframe?: string
          token_symbol?: string
        }
        Relationships: []
      }
      watchlist: {
        Row: {
          created_at: string | null
          id: string
          symbol: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          symbol: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: []
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
