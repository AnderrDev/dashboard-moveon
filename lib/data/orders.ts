import { createServerClient } from '@/lib/supabase'
import { OrderWithDetails } from '@/types/dashboard'

// Datos mock básicos para fallback
const mockOrders: OrderWithDetails[] = [
  {
    id: '1',
    order_number: 'ORD-001',
    user_id: '1',
    status: 'pending',
    payment_status: 'pending',
    subtotal: 150000,
    tax_amount: 0,
    shipping_amount: 0,
    discount_amount: 0,
    total_amount: 150000,
    billing_address: {
      first_name: 'Juan',
      last_name: 'Pérez',
      address_line_1: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postal_code: '110111',
      country: 'CO',
      phone: '3001234567'
    },
    shipping_address: {
      first_name: 'Juan',
      last_name: 'Pérez',
      address_line_1: 'Calle 123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postal_code: '110111',
      country: 'CO',
      phone: '3001234567'
    },
    tracking_number: undefined,
    customer_notes: 'Pedido de prueba',
    admin_notes: undefined,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    customer: {
      id: '1',
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan@example.com'
    },
    order_items: [
      {
        id: '1',
        product_name: 'Producto de Prueba',
        product_sku: 'PROD-001',
        product_image: undefined,
        quantity: 2,
        unit_price: 75000,
        total_price: 150000
      }
    ]
  }
]

// Tipos para filtros y opciones de consulta
export interface OrderFilters {
  status?: string
  payment_status?: string
  user_id?: string
  search?: string
  date_from?: string
  date_to?: string
}

export interface OrderSortOptions {
  field: 'created_at' | 'total_amount' | 'order_number' | 'status'
  direction: 'asc' | 'desc'
}

export interface OrdersQueryOptions {
  page?: number
  limit?: number
  filters?: OrderFilters
  sort?: OrderSortOptions
}

// Función para mapear datos de la base de datos
function mapOrderRowToOrderWithDetails(order: any): OrderWithDetails {
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
    billing_address: order.billing_address,
    shipping_address: order.shipping_address,
    tracking_number: order.tracking_number,
    customer_notes: order.customer_notes,
    admin_notes: order.admin_notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    customer: order.customer || {
      id: '',
      first_name: '',
      last_name: '',
      email: ''
    },
    order_items: order.order_items?.map((item: any) => ({
      id: item.id,
      product_name: item.product_name,
      product_sku: item.product_sku,
      product_image: item.product_image,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price
    })) || []
  }
}

// Función para obtener órdenes desde la base de datos
export async function getOrdersFromDatabase(options: OrdersQueryOptions = {}): Promise<{
  orders: OrderWithDetails[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const supabase = createServerClient()
    const { page = 1, limit = 20, filters = {}, sort = { field: 'created_at', direction: 'desc' } } = options
    
    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:users(*),
        order_items:order_items(*)
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
      query = query.or(`order_number.ilike.%${filters.search}%,customer.first_name.ilike.%${filters.search}%,customer.last_name.ilike.%${filters.search}%`)
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    // Aplicar ordenamiento
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: orders, error, count } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      throw new Error('Error al obtener pedidos')
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      orders: (orders || []).map(mapOrderRowToOrderWithDetails),
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
        customer:customers(*),
        order_items:order_items(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return null
    }

    if (!order) {
      return null
    }

    return mapOrderRowToOrderWithDetails(order)

  } catch (error) {
    console.error('Error in getOrderById:', error)
    return null
  }
}

// Función para obtener estadísticas de órdenes
export async function getOrderStats(): Promise<{
  totalOrders: number
  pendingOrders: number
  processingOrders: number
  shippedOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalRevenue: number
  averageOrderValue: number
}> {
  try {
    const supabase = createServerClient()
    
    const [
      { count: totalOrders },
      { count: pendingOrders },
      { count: processingOrders },
      { count: shippedOrders },
      { count: deliveredOrders },
      { count: cancelledOrders },
      { data: revenueData }
    ] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'shipped'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
      supabase.from('orders').select('total_amount')
    ])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0

    return {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      processingOrders: processingOrders || 0,
      shippedOrders: shippedOrders || 0,
      deliveredOrders: deliveredOrders || 0,
      cancelledOrders: cancelledOrders || 0,
      totalRevenue,
      averageOrderValue
    }

  } catch (error) {
    console.error('Error in getOrderStats:', error)
    // Fallback a datos mock
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const averageOrderValue = mockOrders.length ? totalRevenue / mockOrders.length : 0

    return {
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      processingOrders: mockOrders.filter(o => o.status === 'processing').length,
      shippedOrders: mockOrders.filter(o => o.status === 'shipped').length,
      deliveredOrders: mockOrders.filter(o => o.status === 'delivered').length,
      cancelledOrders: mockOrders.filter(o => o.status === 'cancelled').length,
      totalRevenue,
      averageOrderValue
    }
  }
}

// Función principal para obtener órdenes (con fallback a mock)
export async function getOrders(options: OrdersQueryOptions = {}): Promise<{
  orders: OrderWithDetails[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    // Intentar obtener datos de la base de datos
    return await getOrdersFromDatabase(options)
  } catch (error) {
    console.warn('Falling back to mock data due to database error:', error)
    
    // Fallback a datos mock
    const { page = 1, limit = 20, filters = {} } = options
    
    let filteredOrders = mockOrders

    // Aplicar filtros básicos a los datos mock
    if (filters.status) {
      filteredOrders = filteredOrders.filter(o => o.status === filters.status)
    }
    if (filters.payment_status) {
      filteredOrders = filteredOrders.filter(o => o.payment_status === filters.payment_status)
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredOrders = filteredOrders.filter(o => 
        o.order_number.toLowerCase().includes(searchLower) ||
        o.customer.first_name.toLowerCase().includes(searchLower) ||
        o.customer.last_name.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar ordenamiento
    if (options.sort && filteredOrders) {
      filteredOrders.sort((a, b) => {
        const aValue = a[options.sort!.field]
        const bValue = b[options.sort!.field]
        return options.sort!.direction === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1)
      })
    }

    const total = filteredOrders.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return {
      orders: paginatedOrders,
      total,
      page,
      totalPages
    }
  }
} 