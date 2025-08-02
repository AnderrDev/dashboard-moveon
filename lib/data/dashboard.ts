import { createServerClient } from '@/lib/supabase'
import { getProducts } from './products'
import { getOrders } from './orders'
import { getCustomers } from './customers'
import { getReviews } from './reviews'
import { 
  DashboardStats, 
  SalesData, 
  TopProduct, 
  RecentOrder, 
  LowStockAlert 
} from '@/types/dashboard'

// Datos mock para fallback
const mockStats: DashboardStats = {
  totalRevenue: 12500000,
  totalOrders: 342,
  totalCustomers: 156,
  averageOrderValue: 36550,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  conversionRate: 3.8
}

const mockSalesData: SalesData[] = [
  { date: '2024-01-01', revenue: 450000, orders: 12 },
  { date: '2024-01-02', revenue: 520000, orders: 15 },
  { date: '2024-01-03', revenue: 380000, orders: 10 },
  { date: '2024-01-04', revenue: 610000, orders: 18 },
  { date: '2024-01-05', revenue: 490000, orders: 14 },
  { date: '2024-01-06', revenue: 720000, orders: 22 },
  { date: '2024-01-07', revenue: 680000, orders: 20 }
]

const mockTopProducts: TopProduct[] = [
  { id: '1', name: 'Proteína Whey Gold Standard', image: 'https://via.placeholder.com/100', revenue: 2250000, units_sold: 45, growth: 12.5 },
  { id: '2', name: 'Creatina Monohidratada', image: 'https://via.placeholder.com/100', revenue: 1900000, units_sold: 38, growth: 8.3 },
  { id: '3', name: 'BCAA Aminoácidos', image: 'https://via.placeholder.com/100', revenue: 1600000, units_sold: 32, growth: 15.2 },
  { id: '4', name: 'Pre-Workout Explosive', image: 'https://via.placeholder.com/100', revenue: 1400000, units_sold: 28, growth: 6.7 },
  { id: '5', name: 'Omega-3 Premium', image: 'https://via.placeholder.com/100', revenue: 1250000, units_sold: 25, growth: 9.1 }
]

const mockRecentOrders: RecentOrder[] = [
  { 
    id: '1', 
    order_number: 'ORD-001', 
    customer: { name: 'Juan Pérez', email: 'juan@example.com' }, 
    total: 125000, 
    status: 'completed', 
    created_at: '2024-01-15T10:30:00Z' 
  },
  { 
    id: '2', 
    order_number: 'ORD-002', 
    customer: { name: 'María García', email: 'maria@example.com' }, 
    total: 89000, 
    status: 'processing', 
    created_at: '2024-01-15T09:15:00Z' 
  },
  { 
    id: '3', 
    order_number: 'ORD-003', 
    customer: { name: 'Carlos López', email: 'carlos@example.com' }, 
    total: 156000, 
    status: 'shipped', 
    created_at: '2024-01-15T08:45:00Z' 
  },
  { 
    id: '4', 
    order_number: 'ORD-004', 
    customer: { name: 'Ana Rodríguez', email: 'ana@example.com' }, 
    total: 67000, 
    status: 'pending', 
    created_at: '2024-01-15T08:20:00Z' 
  },
  { 
    id: '5', 
    order_number: 'ORD-005', 
    customer: { name: 'Luis Martínez', email: 'luis@example.com' }, 
    total: 198000, 
    status: 'completed', 
    created_at: '2024-01-15T07:55:00Z' 
  }
]

const mockLowStockAlerts: LowStockAlert[] = [
  { id: '1', name: 'Proteína Whey Gold Standard', sku: 'PROT-001', current_stock: 5, threshold: 10, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Creatina Monohidratada', sku: 'CREA-001', current_stock: 3, threshold: 8, image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'BCAA Aminoácidos', sku: 'BCAA-001', current_stock: 7, threshold: 12, image: 'https://via.placeholder.com/100' },
  { id: '4', name: 'Pre-Workout Explosive', sku: 'PREW-001', current_stock: 2, threshold: 5, image: 'https://via.placeholder.com/100' }
]

// Función para obtener estadísticas del dashboard
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = createServerClient()
    
    // Obtener estadísticas básicas
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount, created_at')

    if (ordersError) {
      console.error('Error fetching orders for stats:', ordersError)
      return mockStats
    }

    const { data: customers, error: customersError } = await supabase
      .from('users')
      .select('id')

    if (customersError) {
      console.error('Error fetching customers for stats:', customersError)
      return mockStats
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')

    if (productsError) {
      console.error('Error fetching products for stats:', productsError)
      return mockStats
    }

    // Calcular estadísticas
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = orders?.length || 0
    const totalCustomers = customers?.length || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calcular crecimiento (simulado para este ejemplo)
    const revenueGrowth = 12.5
    const ordersGrowth = 8.3
    const customersGrowth = 15.2
    const conversionRate = 3.8

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      conversionRate
    }
  } catch (error) {
    console.error('Error in getDashboardStats:', error)
    return mockStats
  }
}

// Función para obtener datos de ventas
export async function getSalesData(): Promise<SalesData[]> {
  try {
    const supabase = createServerClient()
    
    // Obtener datos de los últimos 7 días
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching sales data:', error)
      return mockSalesData
    }

    // Agrupar por fecha
    const salesByDate = new Map<string, { revenue: number; orders: number }>()
    
    orders?.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0]
      const current = salesByDate.get(date) || { revenue: 0, orders: 0 }
      current.revenue += order.total_amount || 0
      current.orders += 1
      salesByDate.set(date, current)
    })

    // Convertir a formato requerido
    const salesData: SalesData[] = Array.from(salesByDate.entries()).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders
    }))

    return salesData
  } catch (error) {
    console.error('Error in getSalesData:', error)
    return mockSalesData
  }
}

// Función para obtener productos más vendidos
export async function getTopProducts(): Promise<TopProduct[]> {
  try {
    const supabase = createServerClient()
    
    // Obtener productos con sus ventas
    const { data: orderItems, error } = await supabase
      .from('order_items')
      .select(`
        quantity,
        unit_price,
        product:products(id, name, images)
      `)

    if (error) {
      console.error('Error fetching top products:', error)
      return mockTopProducts
    }

    // Agrupar por producto
    const productSales = new Map<string, { name: string; units_sold: number; revenue: number; image?: string }>()
    
    orderItems?.forEach(item => {
      const product = Array.isArray(item.product) ? item.product[0] : item.product
      const productId = product?.id
      if (productId && product) {
        const current = productSales.get(productId) || { 
          name: product.name || 'Producto', 
          units_sold: 0, 
          revenue: 0,
          image: product.images?.[0]
        }
        current.units_sold += item.quantity || 0
        current.revenue += (item.quantity || 0) * (item.unit_price || 0)
        productSales.set(productId, current)
      }
    })

    // Convertir a formato requerido y ordenar por ventas
    const topProducts: TopProduct[] = Array.from(productSales.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        image: data.image || '',
        revenue: data.revenue,
        units_sold: data.units_sold,
        growth: Math.random() * 20 // Simulado para este ejemplo
      }))
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, 5)

    return topProducts
  } catch (error) {
    console.error('Error in getTopProducts:', error)
    return mockTopProducts
  }
}

// Función para obtener pedidos recientes
export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const supabase = createServerClient()
    
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        customer:users(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent orders:', error)
      return mockRecentOrders
    }

    const recentOrders: RecentOrder[] = orders?.map(order => {
      const customer = Array.isArray(order.customer) ? order.customer[0] : order.customer
      return {
        id: order.id,
        order_number: `ORD-${String(order.id).padStart(3, '0')}`,
        customer: {
          name: customer ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Cliente' : 'Cliente',
          email: customer?.email || 'cliente@example.com'
        },
        total: order.total_amount || 0,
        status: order.status || 'pending',
        created_at: order.created_at
      }
    }) || []

    return recentOrders
  } catch (error) {
    console.error('Error in getRecentOrders:', error)
    return mockRecentOrders
  }
}

// Función para obtener alertas de stock bajo
export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  try {
    const supabase = createServerClient()
    // Obtener todos los productos activos
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, stock_quantity, low_stock_threshold, images, is_active')
      .eq('is_active', true)

    if (error) {
      console.error('Error fetching low stock alerts:', error)
      return []
    }

    // Filtrar productos con stock bajo en JS (igual que la tabla de productos)
    const lowStockProducts = (products || []).filter(
      (p) => typeof p.stock_quantity === 'number' && typeof p.low_stock_threshold === 'number' && p.stock_quantity <= p.low_stock_threshold
    )
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 10)

    const lowStockAlerts: LowStockAlert[] = lowStockProducts.map(product => ({
      id: product.id,
      name: product.name,
      sku: `SKU-${product.id}`,
      current_stock: product.stock_quantity || 0,
      threshold: product.low_stock_threshold || 0,
      image: product.images?.[0]
    }))

    return lowStockAlerts
  } catch (error) {
    console.error('Error in getLowStockAlerts:', error)
    return []
  }
} 