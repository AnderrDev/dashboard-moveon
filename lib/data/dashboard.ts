import { createServerClient } from '@/lib/supabase'
import { getProducts, getLowStockProducts } from './products'
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
      throw new Error('Error al obtener pedidos para estadísticas')
    }

    const { data: customers, error: customersError } = await supabase
      .from('users')
      .select('id')

    if (customersError) {
      console.error('Error fetching customers for stats:', customersError)
      throw new Error('Error al obtener clientes para estadísticas')
    }

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')

    if (productsError) {
      console.error('Error fetching products for stats:', productsError)
      throw new Error('Error al obtener productos para estadísticas')
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
    throw error
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
      throw new Error('Error al obtener datos de ventas')
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
    throw error
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
      throw new Error('Error al obtener productos más vendidos')
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
    throw error
  }
}

// Función para obtener pedidos recientes
export async function getRecentOrders(): Promise<RecentOrder[]> {
  try {
    const supabase = createServerClient()
    
    // Primero intentamos con el join a usuarios
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

    // Si falla el join, intentamos sin él y retornamos datos simulados
    if (error) {
      console.warn('Error with user join, trying simple query:', error)
      const { data: simpleOrders, error: simpleError } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (simpleError) {
        console.error('Error fetching recent orders (simple query):', simpleError)
        return []
      }

      // Retornar datos con información básica cuando no hay join disponible
      return simpleOrders?.map(order => ({
        id: order.id,
        order_number: `ORD-${String(order.id).padStart(3, '0')}`,
        customer: {
          name: 'Cliente',
          email: 'cliente@example.com'
        },
        total: order.total_amount || 0,
        status: order.status || 'pending',
        created_at: order.created_at
      })) || []
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
    // En lugar de lanzar el error, retornamos un array vacío
    return []
  }
}

// Función para obtener alertas de stock bajo
export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  try {
    // Reutilizar la función existente de productos
    const lowStockProducts = await getLowStockProducts(10)
    
    // Transformar a formato de alertas
    const lowStockAlerts: LowStockAlert[] = lowStockProducts.map(product => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      current_stock: product.stock_quantity,
      threshold: product.low_stock_threshold,
      image: product.images?.[0]
    }))

    return lowStockAlerts
  } catch (error) {
    console.error('Error in getLowStockAlerts:', error)
    throw error
  }
} 