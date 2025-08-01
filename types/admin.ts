// Tipos adicionales para las nuevas secciones del admin
export interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  role: 'admin' | 'customer'
  email_verified: boolean
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
  total_orders: number
  total_spent: number
  average_order_value: number
}

export interface Review {
  id: string
  product_id: string
  product_name: string
  product_image?: string
  user_id: string
  customer_name: string
  customer_email: string
  order_id?: string
  rating: number
  title: string
  comment: string
  verified_purchase: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface ShippingMethod {
  id: string
  name: string
  description?: string
  price: number
  estimated_days: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ShippingZone {
  id: string
  name: string
  description?: string
  countries: string[]
  states?: string[]
  cities?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
  shipping_methods: ShippingMethod[]
}

export interface ReportData {
  period: string
  revenue: number
  orders: number
  customers: number
  products_sold: number
  average_order_value: number
  conversion_rate: number
}

export interface SystemSettings {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  category: 'general' | 'payment' | 'shipping' | 'email' | 'seo'
  description?: string
  updated_at: string
}