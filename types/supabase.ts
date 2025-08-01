export interface Database {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: string
          user_id: string
          type: 'billing' | 'shipping'
          is_default: boolean
          first_name: string
          last_name: string
          company?: string
          address_line_1: string
          address_line_2?: string
          city: string
          state: string
          postal_code: string
          country: string
          phone?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'billing' | 'shipping'
          is_default?: boolean
          first_name: string
          last_name: string
          company?: string
          address_line_1: string
          address_line_2?: string
          city: string
          state: string
          postal_code: string
          country?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'billing' | 'shipping'
          is_default?: boolean
          first_name?: string
          last_name?: string
          company?: string
          address_line_1?: string
          address_line_2?: string
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id?: string
          session_id?: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          session_id?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          image_url?: string
          parent_id?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          product_image?: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          product_sku: string
          product_image?: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          product_sku?: string
          product_image?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          tax_amount: number
          shipping_amount: number
          discount_amount: number
          total_amount: number
          payment_method?: string
          payment_method_title?: string
          stripe_payment_intent_id?: string
          billing_address: Record<string, any>
          shipping_address: Record<string, any>
          shipping_method?: string
          shipping_method_title?: string
          tracking_number?: string
          customer_notes?: string
          admin_notes?: string
          created_at: string
          updated_at: string
          shipped_at?: string
          delivered_at?: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount: number
          payment_method?: string
          payment_method_title?: string
          stripe_payment_intent_id?: string
          billing_address: Record<string, any>
          shipping_address: Record<string, any>
          shipping_method?: string
          shipping_method_title?: string
          tracking_number?: string
          customer_notes?: string
          admin_notes?: string
          created_at?: string
          updated_at?: string
          shipped_at?: string
          delivered_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: string
          payment_method_title?: string
          stripe_payment_intent_id?: string
          billing_address?: Record<string, any>
          shipping_address?: Record<string, any>
          shipping_method?: string
          shipping_method_title?: string
          tracking_number?: string
          customer_notes?: string
          admin_notes?: string
          created_at?: string
          updated_at?: string
          shipped_at?: string
          delivered_at?: string
        }
      }
      product_reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id?: string
          rating: number
          title: string
          comment: string
          verified_purchase: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_id?: string
          rating: number
          title: string
          comment: string
          verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_id?: string
          rating?: number
          title?: string
          comment?: string
          verified_purchase?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          short_description?: string
          sku: string
          price: number
          compare_price?: number
          cost_price?: number
          stock_quantity: number
          low_stock_threshold: number
          brand?: string
          weight?: number
          serving_size?: string
          servings_per_container?: number
          category_id?: string
          images: string[]
          tags: string[]
          ingredients: string[]
          nutritional_info: Record<string, any>
          is_active: boolean
          is_featured: boolean
          meta_title?: string
          meta_description?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          short_description?: string
          sku: string
          price: number
          compare_price?: number
          cost_price?: number
          stock_quantity?: number
          low_stock_threshold?: number
          brand?: string
          weight?: number
          serving_size?: string
          servings_per_container?: number
          category_id?: string
          images?: string[]
          tags?: string[]
          ingredients?: string[]
          nutritional_info?: Record<string, any>
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string
          meta_description?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string
          sku?: string
          price?: number
          compare_price?: number
          cost_price?: number
          stock_quantity?: number
          low_stock_threshold?: number
          brand?: string
          weight?: number
          serving_size?: string
          servings_per_container?: number
          category_id?: string
          images?: string[]
          tags?: string[]
          ingredients?: string[]
          nutritional_info?: Record<string, any>
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string
          meta_description?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          phone?: string
          role: 'admin' | 'customer'
          email_verified: boolean
          is_active: boolean
          last_login_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          first_name: string
          last_name: string
          phone?: string
          role?: 'admin' | 'customer'
          email_verified?: boolean
          is_active?: boolean
          last_login_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          first_name?: string
          last_name?: string
          phone?: string
          role?: 'admin' | 'customer'
          email_verified?: boolean
          is_active?: boolean
          last_login_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
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
  }
}