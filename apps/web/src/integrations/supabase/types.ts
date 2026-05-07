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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      competencias_mensais: {
        Row: {
          bloqueada: boolean
          data_abertura: string
          data_fechamento: string | null
          grupo_id: string
          id: string
          mes_referencia: string
          status: string
        }
        Insert: {
          bloqueada?: boolean
          data_abertura?: string
          data_fechamento?: string | null
          grupo_id: string
          id?: string
          mes_referencia: string
          status?: string
        }
        Update: {
          bloqueada?: boolean
          data_abertura?: string
          data_fechamento?: string | null
          grupo_id?: string
          id?: string
          mes_referencia?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "competencias_mensais_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      faturamentos_mensais: {
        Row: {
          bloqueado: boolean
          data_atualizacao: string
          data_criacao: string
          data_registro: string
          grupo_id: string
          id: string
          membro_id: string
          mes_referencia: string
          valor_bruto: number
        }
        Insert: {
          bloqueado?: boolean
          data_atualizacao?: string
          data_criacao?: string
          data_registro?: string
          grupo_id: string
          id?: string
          membro_id: string
          mes_referencia: string
          valor_bruto: number
        }
        Update: {
          bloqueado?: boolean
          data_atualizacao?: string
          data_criacao?: string
          data_registro?: string
          grupo_id?: string
          id?: string
          membro_id?: string
          mes_referencia?: string
          valor_bruto?: number
        }
        Relationships: [
          {
            foreignKeyName: "faturamentos_mensais_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faturamentos_mensais_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      gargalos: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          descricao: string
          hotseat_id: string
          id: string
          membro_id: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          descricao: string
          hotseat_id: string
          id?: string
          membro_id: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          descricao?: string
          hotseat_id?: string
          id?: string
          membro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gargalos_hotseat_id_fkey"
            columns: ["hotseat_id"]
            isOneToOne: false
            referencedRelation: "hotseats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gargalos_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          icone: string | null
          id: string
          nome: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          icone?: string | null
          id?: string
          nome: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          icone?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      hotseats: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          data_hotseat: string
          grupo_id: string
          id: string
          lider_id: string
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          data_hotseat: string
          grupo_id: string
          id?: string
          lider_id: string
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          data_hotseat?: string
          grupo_id?: string
          id?: string
          lider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotseats_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotseats_lider_id_fkey"
            columns: ["lider_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      membros: {
        Row: {
          data_atualizacao: string
          data_criacao: string
          especialidade: string | null
          grupo_id: string
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          data_atualizacao?: string
          data_criacao?: string
          especialidade?: string | null
          grupo_id: string
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          data_atualizacao?: string
          data_criacao?: string
          especialidade?: string | null
          grupo_id?: string
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
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
