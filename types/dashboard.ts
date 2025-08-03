export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  conversionRate: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  id: string
  name: string
  image: string
  revenue: number
  units_sold: number
  growth: number
}

export interface RecentOrder {
  id: string
  order_number: string
  customer: {
    name: string
    email: string
  }
  total: number
  status: string
  created_at: string
}

export interface LowStockAlert {
  id: string
  name: string
  sku: string
  current_stock: number
  threshold: number
  image?: string
}

export interface ProductWithCategory {
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
  images: string[]
  tags: string[]
  ingredients: string[]
  nutritional_info: Record<string, any>
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    slug: string
  }
}

export interface OrderWithDetails {
  id: string
  order_number: string
  user_id: string
  status: string
  payment_status: string
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
  customer?: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  order_items: Array<{
    id: string
    product_name: string
    product_sku: string
    product_image?: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

export interface CategoryWithProducts {
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
  products_count: number
  parent?: {
    id: string
    name: string
  }
  children?: Array<{
    id: string
    name: string
    slug: string
  }>
}