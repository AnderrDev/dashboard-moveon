import { createServerClient } from '@/lib/supabase'
import { Review } from '@/types/admin'

// Tipos para filtros y opciones de consulta
export interface ReviewFilters {
  is_approved?: boolean
  verified_purchase?: boolean
  rating?: number
  search?: string
  date_from?: string
  date_to?: string
}

export interface ReviewSortOptions {
  field: 'created_at' | 'rating' | 'title' | 'product_name'
  direction: 'asc' | 'desc'
}

export interface ReviewsQueryOptions {
  page?: number
  limit?: number
  filters?: ReviewFilters
  sort?: ReviewSortOptions
}

// Datos mock básicos para fallback
const mockReviews: Review[] = [
  {
    id: '1',
    product_id: '1',
    product_name: 'Producto de Prueba',
    product_image: 'https://via.placeholder.com/100',
    user_id: '1',
    customer_name: 'Juan Pérez',
    customer_email: 'juan@example.com',
    order_id: '1',
    rating: 5,
    title: 'Excelente producto',
    comment: 'Muy buena calidad y envío rápido. Lo recomiendo totalmente.',
    verified_purchase: true,
    is_approved: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    product_id: '2',
    product_name: 'Otro Producto',
    product_image: 'https://via.placeholder.com/100',
    user_id: '2',
    customer_name: 'María García',
    customer_email: 'maria@example.com',
    order_id: '2',
    rating: 4,
    title: 'Buen producto',
    comment: 'Cumple con las expectativas. Buena relación calidad-precio.',
    verified_purchase: true,
    is_approved: false,
    created_at: '2024-01-10T15:30:00Z',
    updated_at: '2024-01-10T15:30:00Z'
  }
]

// Función para mapear datos de la base de datos
function mapReviewRowToReview(review: any): Review {
  return {
    id: review.id,
    product_id: review.product_id,
    product_name: review.product_name || 'Producto',
    product_image: review.product_image,
    user_id: review.user_id,
    customer_name: review.customer_name || 'Cliente',
    customer_email: review.customer_email || 'cliente@example.com',
    order_id: review.order_id,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    verified_purchase: review.verified_purchase,
    is_approved: review.is_approved,
    created_at: review.created_at,
    updated_at: review.updated_at
  }
}

// Función para obtener reseñas desde la base de datos
export async function getReviewsFromDatabase(options: ReviewsQueryOptions = {}): Promise<{
  reviews: Review[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const supabase = createServerClient()
    const { page = 1, limit = 20, filters = {}, sort = { field: 'created_at', direction: 'desc' } } = options
    
    let query = supabase
      .from('product_reviews')
      .select(`
        *,
        product:products(name, images),
        user:users(first_name, last_name, email)
      `)

    // Aplicar filtros
    if (filters.is_approved !== undefined) {
      query = query.eq('is_approved', filters.is_approved)
    }
    if (filters.verified_purchase !== undefined) {
      query = query.eq('verified_purchase', filters.verified_purchase)
    }
    if (filters.rating) {
      query = query.eq('rating', filters.rating)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,comment.ilike.%${filters.search}%,product.name.ilike.%${filters.search}%`)
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

    const { data: reviews, error, count } = await query

    if (error) {
      console.error('Error fetching reviews:', error)
      throw new Error('Error al obtener reseñas')
    }

    console.log('Raw reviews data:', reviews)

    const mappedReviews = reviews?.map(mapReviewRowToReview) || []
    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      reviews: mappedReviews,
      total,
      page,
      totalPages
    }
  } catch (error) {
    console.error('Error in getReviewsFromDatabase:', error)
    throw error
  }
}

// Función para obtener una reseña por ID
export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const supabase = createServerClient()
    
    const { data: review, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        product:products(name, images),
        user:users(first_name, last_name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching review:', error)
      return null
    }

    console.log('Raw review data:', review)

    return review ? mapReviewRowToReview(review) : null
  } catch (error) {
    console.error('Error in getReviewById:', error)
    return null
  }
}

// Función para obtener estadísticas de reseñas
export async function getReviewStats(): Promise<{
  totalReviews: number
  approvedReviews: number
  pendingReviews: number
  verifiedReviews: number
  averageRating: number
  totalProducts: number
}> {
  try {
    const supabase = createServerClient()
    
    // Obtener estadísticas básicas
    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('*')

    if (error) {
      console.error('Error fetching review stats:', error)
      throw new Error('Error al obtener estadísticas de reseñas')
    }

    const totalReviews = reviews?.length || 0
    const approvedReviews = reviews?.filter(r => r.is_approved).length || 0
    const pendingReviews = reviews?.filter(r => !r.is_approved).length || 0
    const verifiedReviews = reviews?.filter(r => r.verified_purchase).length || 0
    
    const averageRating = reviews?.length 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0

    // Obtener número de productos únicos
    const uniqueProducts = new Set(reviews?.map(r => r.product_id) || [])
    const totalProducts = uniqueProducts.size

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      verifiedReviews,
      averageRating,
      totalProducts
    }
  } catch (error) {
    console.error('Error in getReviewStats:', error)
    // Retornar datos mock en caso de error
    return {
      totalReviews: mockReviews.length,
      approvedReviews: mockReviews.filter(r => r.is_approved).length,
      pendingReviews: mockReviews.filter(r => !r.is_approved).length,
      verifiedReviews: mockReviews.filter(r => r.verified_purchase).length,
      averageRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
      totalProducts: 2
    }
  }
}

// Función principal para obtener reseñas
export async function getReviews(options: ReviewsQueryOptions = {}): Promise<{
  reviews: Review[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    return await getReviewsFromDatabase(options)
  } catch (error) {
    console.error('Falling back to mock data due to database error:', error)
    
    // Aplicar filtros a datos mock
    let filteredReviews = [...mockReviews]
    
    if (options.filters) {
      if (options.filters.is_approved !== undefined) {
        filteredReviews = filteredReviews.filter(r => r.is_approved === options.filters!.is_approved)
      }
      if (options.filters.verified_purchase !== undefined) {
        filteredReviews = filteredReviews.filter(r => r.verified_purchase === options.filters!.verified_purchase)
      }
      if (options.filters.rating) {
        filteredReviews = filteredReviews.filter(r => r.rating === options.filters!.rating)
      }
      if (options.filters.search) {
        const search = options.filters.search.toLowerCase()
        filteredReviews = filteredReviews.filter(r => 
          r.title.toLowerCase().includes(search) ||
          r.comment.toLowerCase().includes(search) ||
          r.product_name.toLowerCase().includes(search)
        )
      }
    }

    // Aplicar ordenamiento
    if (options.sort) {
      filteredReviews.sort((a, b) => {
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
    const paginatedReviews = filteredReviews.slice(from, to)
    const total = filteredReviews.length
    const totalPages = Math.ceil(total / limit)

    return {
      reviews: paginatedReviews,
      total,
      page,
      totalPages
    }
  }
} 