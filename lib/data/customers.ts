import { createServerClient } from '@/lib/supabase'
import { Customer } from '@/types/admin'

// Tipos para filtros y opciones de consulta
export interface CustomerFilters {
  is_active?: boolean
  email_verified?: boolean
  role?: string
  search?: string
  date_from?: string
  date_to?: string
}

export interface CustomerSortOptions {
  field: 'created_at' | 'total_spent' | 'total_orders' | 'first_name' | 'last_name'
  direction: 'asc' | 'desc'
}

export interface CustomersQueryOptions {
  page?: number
  limit?: number
  filters?: CustomerFilters
  sort?: CustomerSortOptions
}

// Datos mock básicos para fallback
const mockCustomers: Customer[] = [
  {
    id: '1',
    first_name: 'Juan',
    last_name: 'Pérez',
    email: 'juan@example.com',
    phone: '3001234567',
    role: 'customer',
    email_verified: true,
    is_active: true,
    last_login_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    total_orders: 5,
    total_spent: 250000,
    average_order_value: 50000
  },
  {
    id: '2',
    first_name: 'María',
    last_name: 'García',
    email: 'maria@example.com',
    phone: '3009876543',
    role: 'customer',
    email_verified: false,
    is_active: true,
    last_login_at: '2024-01-10T15:30:00Z',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-10T15:30:00Z',
    total_orders: 3,
    total_spent: 180000,
    average_order_value: 60000
  }
]

// Función para mapear datos de la base de datos
function mapCustomerRowToCustomer(customer: any): Customer {
  return {
    id: customer.id,
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    email_verified: customer.email_verified,
    is_active: customer.is_active,
    last_login_at: customer.last_login_at,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
    total_orders: 0, // Por ahora usamos 0, se puede calcular después si es necesario
    total_spent: 0, // Por ahora usamos 0, se puede calcular después si es necesario
    average_order_value: 0 // Por ahora usamos 0, se puede calcular después si es necesario
  }
}

// Función para obtener clientes desde la base de datos
export async function getCustomersFromDatabase(options: CustomersQueryOptions = {}): Promise<{
  customers: Customer[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const supabase = createServerClient()
    const { page = 1, limit = 20, filters = {}, sort = { field: 'created_at', direction: 'desc' } } = options
    
    let query = supabase
      .from('users')
      .select('*')

    // Aplicar filtros
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }
    if (filters.email_verified !== undefined) {
      query = query.eq('email_verified', filters.email_verified)
    }
    if (filters.role) {
      query = query.eq('role', filters.role)
    }
    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
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

    const { data: customers, error, count } = await query

    if (error) {
      console.error('Error fetching customers:', error)
      throw new Error('Error al obtener clientes')
    }

    console.log('Raw customers data:', customers)

    const mappedCustomers = customers?.map(mapCustomerRowToCustomer) || []
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      customers: mappedCustomers,
      total,
      page,
      totalPages
    }
  } catch (error) {
    console.error('Error in getCustomersFromDatabase:', error)
    throw error
  }
}

// Función para obtener un cliente por ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const supabase = createServerClient()
    
    const { data: customer, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching customer:', error)
      return null
    }

    console.log('Raw customer data:', customer)

    return customer ? mapCustomerRowToCustomer(customer) : null
  } catch (error) {
    console.error('Error in getCustomerById:', error)
    return null
  }
}

// Función para obtener estadísticas de clientes
export async function getCustomerStats(): Promise<{
  totalCustomers: number
  activeCustomers: number
  verifiedCustomers: number
  newCustomersThisMonth: number
  totalRevenue: number
  averageOrderValue: number
}> {
  try {
    const supabase = createServerClient()
    
    // Obtener estadísticas básicas
    const { data: customers, error } = await supabase
      .from('users')
      .select('*')

    if (error) {
      console.error('Error fetching customer stats:', error)
      throw new Error('Error al obtener estadísticas de clientes')
    }

    const totalCustomers = customers?.length || 0
    const activeCustomers = customers?.filter(c => c.is_active).length || 0
    const verifiedCustomers = customers?.filter(c => c.email_verified).length || 0
    
    // Calcular clientes nuevos este mes
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const newCustomersThisMonth = customers?.filter(c => 
      new Date(c.created_at) >= thisMonth
    ).length || 0

    // Obtener estadísticas de pedidos
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_amount')

    if (ordersError) {
      console.error('Error fetching order stats:', error)
    }

    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const averageOrderValue = orders?.length ? totalRevenue / orders.length : 0

    return {
      totalCustomers,
      activeCustomers,
      verifiedCustomers,
      newCustomersThisMonth,
      totalRevenue,
      averageOrderValue
    }
  } catch (error) {
    console.error('Error in getCustomerStats:', error)
    // Retornar datos mock en caso de error
    return {
      totalCustomers: mockCustomers.length,
      activeCustomers: mockCustomers.filter(c => c.is_active).length,
      verifiedCustomers: mockCustomers.filter(c => c.email_verified).length,
      newCustomersThisMonth: 2,
      totalRevenue: mockCustomers.reduce((sum, c) => sum + c.total_spent, 0),
      averageOrderValue: mockCustomers.reduce((sum, c) => sum + c.average_order_value, 0) / mockCustomers.length
    }
  }
}

// Función principal para obtener clientes
export async function getCustomers(options: CustomersQueryOptions = {}): Promise<{
  customers: Customer[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    return await getCustomersFromDatabase(options)
  } catch (error) {
    console.error('Falling back to mock data due to database error:', error)
    
    // Aplicar filtros a datos mock
    let filteredCustomers = [...mockCustomers]
    
    if (options.filters) {
      if (options.filters.is_active !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.is_active === options.filters!.is_active)
      }
      if (options.filters.email_verified !== undefined) {
        filteredCustomers = filteredCustomers.filter(c => c.email_verified === options.filters!.email_verified)
      }
      if (options.filters.role) {
        filteredCustomers = filteredCustomers.filter(c => c.role === options.filters!.role)
      }
      if (options.filters.search) {
        const search = options.filters.search.toLowerCase()
        filteredCustomers = filteredCustomers.filter(c => 
          c.first_name.toLowerCase().includes(search) ||
          c.last_name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search)
        )
      }
    }

    // Aplicar ordenamiento
    if (options.sort) {
      filteredCustomers.sort((a, b) => {
        const aValue = a[options.sort!.field]
        const bValue = b[options.sort!.field]
        return options.sort!.direction === 'asc' 
          ? (aValue > bValue ? 1 : -1)
          : (aValue < bValue ? 1 : -1)
      })
    }

    // Aplicar paginación
    const { page = 1, limit = 20 } = options
    const from = (page - 1) * limit
    const to = from + limit
    const paginatedCustomers = filteredCustomers.slice(from, to)
    const total = filteredCustomers.length
    const totalPages = Math.ceil(total / limit)

    return {
      customers: paginatedCustomers,
      total,
      page,
      totalPages
    }
  }
} 