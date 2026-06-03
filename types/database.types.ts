export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: "unread" | "read" | "replied";
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: "unread" | "read" | "replied";
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: "unread" | "read" | "replied";
          created_at?: string | null;
        };
        Relationships: [];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          alt_text: string | null;
          display_order: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          alt_text?: string | null;
          display_order?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          alt_text?: string | null;
          display_order?: number | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          availability: Database["public"]["Enums"]["product_availability"];
          brand: string | null;
          size: string | null;
          weight: string | null;
          packaging_type: string | null;
          unit_quantity: string | null;
          main_image_url: string | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          availability?: Database["public"]["Enums"]["product_availability"];
          brand?: string | null;
          size?: string | null;
          weight?: string | null;
          packaging_type?: string | null;
          unit_quantity?: string | null;
          main_image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          availability?: Database["public"]["Enums"]["product_availability"];
          brand?: string | null;
          size?: string | null;
          weight?: string | null;
          packaging_type?: string | null;
          unit_quantity?: string | null;
          main_image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          role: Database["public"]["Enums"]["user_role"];
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: string;
          page_key: string;
          title: string;
          content: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          facebook_url: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          page_key: string;
          title: string;
          content?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          page_key?: string;
          title?: string;
          content?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          facebook_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      product_availability: "available" | "out_of_stock" | "coming_soon";
      user_role: "admin";
    };
    CompositeTypes: Record<string, never>;
  };
};
