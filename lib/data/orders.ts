import { createServerClient } from '@/lib/supabase'
import { OrderWithDetails } from '@/types/dashboard'
import { Database } from '@/types/supabase'

type OrderRow = Database['public']['Tables']['orders']['Row']
type UserRow = Database['public']['Tables']['users']['Row']

// Tipos para las consultas de órdenes
export interface OrderFilters {
  status?: string
  payment_status?: string
  user_id?: string
  search?: string
  min_amount?: number
  max_amount?: number
  date_from?: string
  date_to?: string
}

export interface OrderSortOptions {
  field: 'created_at' | 'total_amount' | 'order_number'
  direction: 'asc' | 'desc'
}

export interface OrdersQueryOptions {
  page?: number
  limit?: number
  filters?: OrderFilters
  sort?: OrderSortOptions
}

// Función para convertir OrderRow a OrderWithDetails
function mapOrderRowToOrderWithDetails(
  order: OrderRow,
  customer?: UserRow,
  orderItems: any[] = []
): OrderWithDetails {
  return {
    id: order.id,
    order_number: order.order_number,
    user_id: order.user_id,
    status: order.status,
    payment_status: order.payment_status,
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    shipping_amount: order.shipping_amount,
    discount_amount: order.discount_amount,
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    payment_method_title: order.payment_method_title,
    stripe_payment_intent_id: order.stripe_payment_intent_id,
    billing_address: order.billing_address,
    shipping_address: order.shipping_address,
    shipping_method: order.shipping_method,
    shipping_method_title: order.shipping_method_title,
    tracking_number: order.tracking_number,
    customer_notes: order.customer_notes,
    admin_notes: order.admin_notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    shipped_at: order.shipped_at,
    delivered_at: order.delivered_at,
    customer: customer ? {
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email
    } : undefined,
    order_items: orderItems.map(item => ({
      id: item.id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    }))
  }
}

// Función para obtener órdenes de la base de datos
export async function getOrdersFromDatabase(options: OrdersQueryOptions = {}): Promise<{
  orders: OrderWithDetails[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const supabase = createServerClient()
    
    const {
      page = 1,
      limit = 20,
      filters = {},
      sort = { field: 'created_at', direction: 'desc' }
    } = options

    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:users(*),
        order_items(*)
      `)

    // Aplicar filtros
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status)
    }

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }

    if (filters.search) {
      query = query.or(`order_number.ilike.%${filters.search}%,customer_notes.ilike.%${filters.search}%`)
    }

    if (filters.min_amount !== undefined) {
      query = query.gte('total_amount', filters.min_amount)
    }

    if (filters.max_amount !== undefined) {
      query = query.lte('total_amount', filters.max_amount)
    }

    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    // Aplicar ordenamiento
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders from database:', error)
      throw new Error('Error al obtener órdenes de la base de datos')
    }

    const total = orders?.length || 0
    const totalPages = Math.ceil(total / limit)

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit
    const paginated = orders?.slice(from, to) || []

    // Mapear resultados
    const mappedOrders = paginated.map(order =>
      mapOrderRowToOrderWithDetails(
        order,
        order.customer as UserRow,
        order.order_items || []
      )
    )

    return {
      orders: mappedOrders,
      total,
      page,
      totalPages
    }

  } catch (error) {
    console.error('Error in getOrdersFromDatabase:', error)
    throw error
  }
}

// Función para obtener una orden específica por ID
export async function getOrderById(id: string): Promise<OrderWithDetails | null> {
  try {
    const supabase = createServerClient()
    
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:users(*),
        order_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order by ID:', error)
      return null
    }

    if (!order) {
      return null
    }

    return mapOrderRowToOrderWithDetails(
      order,
      order.customer as UserRow,
      order.order_items || []
    )

  } catch (error) {
    console.error('Error in getOrderById:', error)
    return null
  }
}

// Función para obtener estadísticas de órdenes
export async function getOrderStats(): Promise<{
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
}> {
  try {
    const supabase = createServerClient()

    const { data: orders, error } = await supabase
      .from('orders')
      .select('total_amount, status')

    if (error) {
      console.error('Error fetching orders for stats:', error)
      throw new Error('Error al obtener órdenes para estadísticas')
    }

    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    }

    orders?.forEach(order => {
      const status = order.status as keyof typeof statusCounts
      if (status in statusCounts) {
        statusCounts[status]++
      }
    })

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders: statusCounts.pending,
      processingOrders: statusCounts.processing,
      shippedOrders: statusCounts.shipped,
      deliveredOrders: statusCounts.delivered,
      cancelledOrders: statusCounts.cancelled
    }

  } catch (error) {
    console.error('Error in getOrderStats:', error)
    throw error
  }
}

// Función principal para obtener órdenes
export async function getOrders(options: OrdersQueryOptions = {}): Promise<{
  orders: OrderWithDetails[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    return await getOrdersFromDatabase(options)
  } catch (error) {
    console.error('Error in getOrders:', error)
    throw error
  }
} 