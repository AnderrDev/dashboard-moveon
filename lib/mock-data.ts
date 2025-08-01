// Mock data para el dashboard administrativo
import { DashboardStats, SalesData, TopProduct, RecentOrder, LowStockAlert, ProductWithCategory, OrderWithDetails, CategoryWithProducts } from '@/types/dashboard'

// Datos mock para estadísticas del dashboard
export const mockDashboardStats: DashboardStats = {
  totalRevenue: 15420000, // $15,420,000 COP
  totalOrders: 342,
  totalCustomers: 1250,
  averageOrderValue: 45087, // $45,087 COP
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  conversionRate: 3.2
}

// Datos de ventas para el gráfico (últimos 30 días)
export const mockSalesData: SalesData[] = [
  { date: '2024-12-01', revenue: 320000, orders: 8 },
  { date: '2024-12-02', revenue: 450000, orders: 12 },
  { date: '2024-12-03', revenue: 380000, orders: 9 },
  { date: '2024-12-04', revenue: 520000, orders: 14 },
  { date: '2024-12-05', revenue: 290000, orders: 7 },
  { date: '2024-12-06', revenue: 680000, orders: 18 },
  { date: '2024-12-07', revenue: 750000, orders: 21 },
  { date: '2024-12-08', revenue: 420000, orders: 11 },
  { date: '2024-12-09', revenue: 580000, orders: 15 },
  { date: '2024-12-10', revenue: 390000, orders: 10 },
  { date: '2024-12-11', revenue: 640000, orders: 17 },
  { date: '2024-12-12', revenue: 720000, orders: 19 },
  { date: '2024-12-13', revenue: 480000, orders: 13 },
  { date: '2024-12-14', revenue: 560000, orders: 16 },
  { date: '2024-12-15', revenue: 410000, orders: 12 },
  { date: '2024-12-16', revenue: 690000, orders: 20 },
  { date: '2024-12-17', revenue: 530000, orders: 14 },
  { date: '2024-12-18', revenue: 620000, orders: 17 },
  { date: '2024-12-19', revenue: 470000, orders: 13 },
  { date: '2024-12-20', revenue: 780000, orders: 22 },
  { date: '2024-12-21', revenue: 650000, orders: 18 },
  { date: '2024-12-22', revenue: 590000, orders: 16 },
  { date: '2024-12-23', revenue: 720000, orders: 20 },
  { date: '2024-12-24', revenue: 450000, orders: 12 },
  { date: '2024-12-25', revenue: 320000, orders: 8 },
  { date: '2024-12-26', revenue: 680000, orders: 19 },
  { date: '2024-12-27', revenue: 740000, orders: 21 },
  { date: '2024-12-28', revenue: 560000, orders: 15 },
  { date: '2024-12-29', revenue: 620000, orders: 17 },
  { date: '2024-12-30', revenue: 580000, orders: 16 }
]

// Productos más vendidos
export const mockTopProducts: TopProduct[] = [
  {
    id: '1',
    name: 'Proteína Whey Gold 2.2kg',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
    revenue: 2850000,
    units_sold: 95,
    growth: 15.2
  },
  {
    id: '2',
    name: 'Creatina Monohidrato 300g',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
    revenue: 1920000,
    units_sold: 128,
    growth: 22.8
  },
  {
    id: '3',
    name: 'BCAA 2:1:1 120 cápsulas',
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400',
    revenue: 1650000,
    units_sold: 75,
    growth: 8.5
  },
  {
    id: '4',
    name: 'Pre-Entreno Extreme 300g',
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
    revenue: 1420000,
    units_sold: 62,
    growth: 18.3
  },
  {
    id: '5',
    name: 'Glutamina Pura 500g',
    image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
    revenue: 980000,
    units_sold: 49,
    growth: -2.1
  }
]

// Pedidos recientes
export const mockRecentOrders: RecentOrder[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    customer: {
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com'
    },
    total: 89990,
    status: 'confirmed',
    created_at: '2024-12-30T10:30:00Z'
  },
  {
    id: '2',
    order_number: 'ORD-2024-002',
    customer: {
      name: 'María González',
      email: 'maria.gonzalez@email.com'
    },
    total: 156500,
    status: 'processing',
    created_at: '2024-12-30T09:15:00Z'
  },
  {
    id: '3',
    order_number: 'ORD-2024-003',
    customer: {
      name: 'Andrés López',
      email: 'andres.lopez@email.com'
    },
    total: 67800,
    status: 'shipped',
    created_at: '2024-12-30T08:45:00Z'
  },
  {
    id: '4',
    order_number: 'ORD-2024-004',
    customer: {
      name: 'Laura Martínez',
      email: 'laura.martinez@email.com'
    },
    total: 234900,
    status: 'pending',
    created_at: '2024-12-29T16:20:00Z'
  },
  {
    id: '5',
    order_number: 'ORD-2024-005',
    customer: {
      name: 'Diego Herrera',
      email: 'diego.herrera@email.com'
    },
    total: 78450,
    status: 'delivered',
    created_at: '2024-12-29T14:10:00Z'
  },
  {
    id: '6',
    order_number: 'ORD-2024-006',
    customer: {
      name: 'Ana Jiménez',
      email: 'ana.jimenez@email.com'
    },
    total: 125600,
    status: 'confirmed',
    created_at: '2024-12-29T11:30:00Z'
  }
]

// Alertas de inventario bajo
export const mockLowStockAlerts: LowStockAlert[] = [
  {
    id: '1',
    name: 'Proteína Whey Gold 2.2kg',
    sku: 'PWG-2200',
    current_stock: 2,
    threshold: 10,
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Pre-Entreno Extreme 300g',
    sku: 'PEE-300',
    current_stock: 4,
    threshold: 15,
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Omega 3 120 cápsulas',
    sku: 'OMG-120',
    current_stock: 1,
    threshold: 8,
    image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
]

// Productos con categorías
export const mockProducts: ProductWithCategory[] = [
  {
    id: '1',
    name: 'Proteína Whey Gold 2.2kg',
    slug: 'proteina-whey-gold-2200g',
    description: 'Proteína de suero de leche de alta calidad con excelente perfil de aminoácidos.',
    short_description: 'Proteína whey premium para desarrollo muscular',
    sku: 'PWG-2200',
    price: 89990,
    compare_price: 99990,
    cost_price: 65000,
    stock_quantity: 2,
    low_stock_threshold: 10,
    brand: 'NutriMax',
    weight: 2200,
    serving_size: '30g',
    servings_per_container: 73,
    images: ['https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['proteína', 'whey', 'músculo', 'recuperación'],
    ingredients: ['Concentrado de proteína de suero', 'Aislado de proteína de suero', 'Saborizantes naturales', 'Stevia'],
    nutritional_info: {
      calories: 120,
      protein: 25,
      carbs: 2,
      fat: 1,
      fiber: 0,
      sugar: 1
    },
    is_active: true,
    is_featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    category: {
      id: '1',
      name: 'Proteínas',
      slug: 'proteinas'
    }
  },
  {
    id: '2',
    name: 'Creatina Monohidrato 300g',
    slug: 'creatina-monohidrato-300g',
    description: 'Creatina monohidrato pura para aumentar la fuerza y potencia muscular.',
    short_description: 'Creatina pura para fuerza y potencia',
    sku: 'CRM-300',
    price: 45990,
    compare_price: 52990,
    cost_price: 32000,
    stock_quantity: 25,
    low_stock_threshold: 15,
    brand: 'PowerLift',
    weight: 300,
    serving_size: '5g',
    servings_per_container: 60,
    images: ['https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800'],
    tags: ['creatina', 'fuerza', 'potencia', 'rendimiento'],
    ingredients: ['Creatina monohidrato'],
    nutritional_info: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      creatine: 5000
    },
    is_active: true,
    is_featured: true,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-12-25T10:00:00Z',
    category: {
      id: '2',
      name: 'Creatinas',
      slug: 'creatinas'
    }
  }
]

// Categorías con productos
export const mockCategories: CategoryWithProducts[] = [
  {
    id: '1',
    name: 'Proteínas',
    slug: 'proteinas',
    description: 'Suplementos proteicos para desarrollo y recuperación muscular',
    image_url: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
    parent_id: null,
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    products_count: 15
  },
  {
    id: '2',
    name: 'Creatinas',
    slug: 'creatinas',
    description: 'Suplementos de creatina para fuerza y potencia',
    image_url: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800',
    parent_id: null,
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    products_count: 8
  },
  {
    id: '3',
    name: 'Pre-Entrenos',
    slug: 'pre-entrenos',
    description: 'Suplementos pre-entreno para energía y focus',
    image_url: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800',
    parent_id: null,
    sort_order: 3,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    products_count: 12
  },
  {
    id: '4',
    name: 'Aminoácidos',
    slug: 'aminoacidos',
    description: 'BCAA, glutamina y otros aminoácidos esenciales',
    image_url: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800',
    parent_id: null,
    sort_order: 4,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    products_count: 10
  },
  {
    id: '5',
    name: 'Vitaminas',
    slug: 'vitaminas',
    description: 'Vitaminas y minerales para salud general',
    image_url: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800',
    parent_id: null,
    sort_order: 5,
    is_active: true,
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-12-30T10:00:00Z',
    products_count: 18
  }
]

// Pedidos con detalles completos
export const mockOrdersWithDetails: OrderWithDetails[] = [
  {
    id: '1',
    order_number: 'ORD-2024-001',
    user_id: 'user-1',
    status: 'confirmed',
    payment_status: 'paid',
    subtotal: 89990,
    tax_amount: 17098,
    shipping_amount: 8000,
    discount_amount: 0,
    total_amount: 115088,
    billing_address: {
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      address_line_1: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postal_code: '110111',
      country: 'Colombia'
    },
    shipping_address: {
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      address_line_1: 'Calle 123 #45-67',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postal_code: '110111',
      country: 'Colombia'
    },
    tracking_number: 'TRK123456789',
    customer_notes: 'Entregar en horario de oficina',
    admin_notes: 'Cliente frecuente - prioridad alta',
    created_at: '2024-12-30T10:30:00Z',
    updated_at: '2024-12-30T11:00:00Z',
    customer: {
      id: 'user-1',
      first_name: 'Carlos',
      last_name: 'Rodríguez',
      email: 'carlos.rodriguez@email.com'
    },
    order_items: [
      {
        id: 'item-1',
        product_name: 'Proteína Whey Gold 2.2kg',
        product_sku: 'PWG-2200',
        product_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
        quantity: 1,
        unit_price: 89990,
        total_price: 89990
      }
    ]
  }
]