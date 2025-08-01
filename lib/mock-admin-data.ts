// Datos mock para las nuevas secciones administrativas
import { Customer, Review, ShippingMethod, ShippingZone, ReportData, SystemSettings } from '@/types/admin'

export const mockCustomers: Customer[] = [
  {
    id: 'user-1',
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 300 123 4567',
    role: 'customer',
    email_verified: true,
    is_active: true,
    last_login_at: '2024-12-30T10:30:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-30T10:30:00Z',
    total_orders: 12,
    total_spent: 1250000,
    average_order_value: 104167
  },
  {
    id: 'user-2',
    first_name: 'María',
    last_name: 'González',
    email: 'maria.gonzalez@email.com',
    phone: '+57 301 234 5678',
    role: 'customer',
    email_verified: true,
    is_active: true,
    last_login_at: '2024-12-29T15:20:00Z',
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-12-29T15:20:00Z',
    total_orders: 8,
    total_spent: 890000,
    average_order_value: 111250
  },
  {
    id: 'user-3',
    first_name: 'Andrés',
    last_name: 'López',
    email: 'andres.lopez@email.com',
    phone: '+57 302 345 6789',
    role: 'customer',
    email_verified: false,
    is_active: true,
    last_login_at: '2024-12-28T09:15:00Z',
    created_at: '2024-03-05T10:00:00Z',
    updated_at: '2024-12-28T09:15:00Z',
    total_orders: 5,
    total_spent: 450000,
    average_order_value: 90000
  },
  {
    id: 'user-4',
    first_name: 'Laura',
    last_name: 'Martínez',
    email: 'laura.martinez@email.com',
    phone: '+57 303 456 7890',
    role: 'customer',
    email_verified: true,
    is_active: false,
    last_login_at: '2024-11-15T14:30:00Z',
    created_at: '2024-04-20T10:00:00Z',
    updated_at: '2024-11-15T14:30:00Z',
    total_orders: 3,
    total_spent: 280000,
    average_order_value: 93333
  }
]

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    product_id: '1',
    product_name: 'Proteína Whey Gold 2.2kg',
    product_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_id: 'user-1',
    customer_name: 'Carlos Rodríguez',
    customer_email: 'carlos.rodriguez@email.com',
    order_id: '1',
    rating: 5,
    title: 'Excelente proteína',
    comment: 'La mejor proteína que he probado. Excelente sabor y se disuelve muy bien. Definitivamente la recomiendo.',
    verified_purchase: true,
    is_approved: true,
    created_at: '2024-12-25T10:00:00Z',
    updated_at: '2024-12-25T10:00:00Z'
  },
  {
    id: 'review-2',
    product_id: '2',
    product_name: 'Creatina Monohidrato 300g',
    product_image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_id: 'user-2',
    customer_name: 'María González',
    customer_email: 'maria.gonzalez@email.com',
    order_id: '2',
    rating: 4,
    title: 'Buena calidad',
    comment: 'Creatina de buena calidad, he notado mejoras en mi rendimiento. El precio es justo.',
    verified_purchase: true,
    is_approved: true,
    created_at: '2024-12-20T15:30:00Z',
    updated_at: '2024-12-20T15:30:00Z'
  },
  {
    id: 'review-3',
    product_id: '1',
    product_name: 'Proteína Whey Gold 2.2kg',
    product_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
    user_id: 'user-3',
    customer_name: 'Andrés López',
    customer_email: 'andres.lopez@email.com',
    rating: 3,
    title: 'Regular',
    comment: 'El producto está bien pero esperaba mejor sabor. La textura es un poco granulosa.',
    verified_purchase: false,
    is_approved: false,
    created_at: '2024-12-18T12:00:00Z',
    updated_at: '2024-12-18T12:00:00Z'
  }
]

export const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'shipping-1',
    name: 'Envío Estándar',
    description: 'Entrega en 3-5 días hábiles',
    price: 8000,
    estimated_days: 4,
    is_active: true,
    sort_order: 1,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'shipping-2',
    name: 'Envío Express',
    description: 'Entrega en 1-2 días hábiles',
    price: 15000,
    estimated_days: 1,
    is_active: true,
    sort_order: 2,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'shipping-3',
    name: 'Envío Gratis',
    description: 'Envío gratuito para compras mayores a $150.000',
    price: 0,
    estimated_days: 5,
    is_active: true,
    sort_order: 3,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z'
  }
]

export const mockShippingZones: ShippingZone[] = [
  {
    id: 'zone-1',
    name: 'Bogotá y Cundinamarca',
    description: 'Zona metropolitana de Bogotá',
    countries: ['Colombia'],
    states: ['Cundinamarca'],
    cities: ['Bogotá', 'Soacha', 'Chía', 'Zipaquirá'],
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    shipping_methods: mockShippingMethods
  },
  {
    id: 'zone-2',
    name: 'Medellín y Antioquia',
    description: 'Valle de Aburrá y municipios cercanos',
    countries: ['Colombia'],
    states: ['Antioquia'],
    cities: ['Medellín', 'Envigado', 'Itagüí', 'Bello'],
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
    shipping_methods: mockShippingMethods.slice(0, 2)
  }
]

export const mockReportData: ReportData[] = [
  {
    period: '2024-12',
    revenue: 15420000,
    orders: 342,
    customers: 1250,
    products_sold: 856,
    average_order_value: 45087,
    conversion_rate: 3.2
  },
  {
    period: '2024-11',
    revenue: 13850000,
    orders: 298,
    customers: 1180,
    products_sold: 742,
    average_order_value: 46477,
    conversion_rate: 2.9
  },
  {
    period: '2024-10',
    revenue: 12900000,
    orders: 275,
    customers: 1120,
    products_sold: 689,
    average_order_value: 46909,
    conversion_rate: 2.7
  }
]

export const mockSystemSettings: SystemSettings[] = [
  {
    id: 'setting-1',
    key: 'site_name',
    value: 'Suplementos Deportivos',
    type: 'string',
    category: 'general',
    description: 'Nombre del sitio web',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'setting-2',
    key: 'site_description',
    value: 'Tu tienda de confianza para suplementos deportivos',
    type: 'string',
    category: 'general',
    description: 'Descripción del sitio web',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'setting-3',
    key: 'currency',
    value: 'COP',
    type: 'string',
    category: 'general',
    description: 'Moneda del sitio',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'setting-4',
    key: 'tax_rate',
    value: '19',
    type: 'number',
    category: 'general',
    description: 'Tasa de impuesto (%)',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'setting-5',
    key: 'free_shipping_threshold',
    value: '150000',
    type: 'number',
    category: 'shipping',
    description: 'Monto mínimo para envío gratis',
    updated_at: '2024-12-01T10:00:00Z'
  },
  {
    id: 'setting-6',
    key: 'email_notifications',
    value: 'true',
    type: 'boolean',
    category: 'email',
    description: 'Activar notificaciones por email',
    updated_at: '2024-12-01T10:00:00Z'
  }
]