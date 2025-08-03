import { createServerClient } from '@/lib/supabase'
import { Customer } from '@/types/admin'
import { Database } from '@/types/supabase'

type CustomerRow = Database['public']['Tables']['users']['Row']

// Tipos para las consultas de clientes
export interface CustomerFilters {
  is_active?: boolean
  email_verified?: boolean
  role?: string
  search?: string
  date_from?: string
  date_to?: string
}

export interface CustomerSortOptions {
  field: 'created_at' | 'last_login_at' | 'first_name' | 'email'
  direction: 'asc' | 'desc'
}

export interface CustomersQueryOptions {
  page?: number
  limit?: number
  filters?: CustomerFilters
  sort?: CustomerSortOptions
}

// Función para convertir CustomerRow a Customer
function mapCustomerRowToCustomer(customer: CustomerRow): Customer {
  return {
    id: customer.id,
    email: customer.email,
    first_name: customer.first_name,
    last_name: customer.last_name,
    phone: customer.phone,
    role: customer.role,
    email_verified: customer.email_verified,
    is_active: customer.is_active,
    last_login_at: customer.last_login_at,
    created_at: customer.created_at,
    updated_at: customer.updated_at,
    total_orders: 0, // Calculado por separado
    total_spent: 0, // Calculado por separado
    average_order_value: 0 // Calculado por separado
  }
}

// Función para obtener clientes de la base de datos
export async function getCustomersFromDatabase(options: CustomersQueryOptions = {}): Promise<{
  customers: Customer[]
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
      console.error('Error fetching customers from database:', error)
      throw new Error('Error al obtener clientes de la base de datos')
    }

    const mappedCustomers = customers?.map(customer => 
      mapCustomerRowToCustomer(customer)
    ) || []

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

// Función para obtener un cliente específico por ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const supabase = createServerClient()
    
    const { data: customer, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching customer by ID:', error)
      return null
    }

    if (!customer) {
      return null
    }

    return mapCustomerRowToCustomer(customer)

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

    const { data: customers, error } = await supabase
      .from('users')
      .select('is_active, email_verified, created_at')

    if (error) {
      console.error('Error fetching customers for stats:', error)
      throw new Error('Error al obtener clientes para estadísticas')
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

    // Para estadísticas de ingresos, necesitarías consultar las órdenes
    const totalRevenue = 0 // Calculado por separado
    const averageOrderValue = 0 // Calculado por separado

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
    throw error
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
    console.error('Error in getCustomers:', error)
    throw error
  }
} 