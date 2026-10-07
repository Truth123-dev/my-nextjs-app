export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type OrganizationRow = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};

type MembershipRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: Database["public"]["Enums"]["user_role"];
  created_at: string;
};

type AccountRow = {
  id: string;
  organization_id: string;
  currency: string;
  balance: number;
  created_at: string;
};

type TransactionRow = {
  id: string;
  organization_id: string;
  account_id: string;
  amount: number;
  type: Database["public"]["Enums"]["transaction_type"];
  status: Database["public"]["Enums"]["transaction_status"];
  reference: string;
  recipient_name: string;
  recipient_account: string;
  description: string | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: OrganizationRow;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["organizations"]["Insert"]
        >;
        Relationships: [];
      };
      memberships: {
        Row: MembershipRow;
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: Database["public"]["Enums"]["user_role"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["memberships"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      accounts: {
        Row: AccountRow;
        Insert: {
          id?: string;
          organization_id: string;
          currency?: string;
          balance?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["accounts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "accounts_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
        ];
      };
      transactions: {
        Row: TransactionRow;
        Insert: {
          id?: string;
          organization_id: string;
          account_id: string;
          amount: number;
          type: Database["public"]["Enums"]["transaction_type"];
          status?: Database["public"]["Enums"]["transaction_status"];
          reference: string;
          recipient_name: string;
          recipient_account: string;
          description?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "transactions_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_has_role: {
        Args: {
          org_id: string;
          allowed_roles: Database["public"]["Enums"]["user_role"][];
        };
        Returns: boolean;
      };
      create_organization: {
        Args: { p_name: string };
        Returns: OrganizationRow;
      };
      execute_transfer: {
        Args: {
          p_org_id: string;
          p_account_id: string;
          p_amount: number;
          p_recipient_name: string;
          p_recipient_account: string;
          p_description: string;
          p_reference: string;
        };
        Returns: TransactionRow;
      };
      get_organization_analytics: {
        Args: { p_org_id: string };
        Returns: {
          currency: string;
          transaction_count: number;
          credits_total: number;
          debits_total: number;
          pending_count: number;
        }[];
      };
    };
    Enums: {
      user_role: "owner" | "admin" | "finance_manager" | "viewer";
      transaction_status: "pending" | "completed" | "failed" | "flagged";
      transaction_type: "credit" | "debit";
    };
    CompositeTypes: Record<string, never>;
  };
}
