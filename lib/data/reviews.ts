import { createServerClient } from '@/lib/supabase'
import { Review } from '@/types/admin'
import { Database } from '@/types/supabase'

type ReviewRow = Database['public']['Tables']['product_reviews']['Row']
type UserRow = Database['public']['Tables']['users']['Row']
type ProductRow = Database['public']['Tables']['products']['Row']

// Tipos para las consultas de reseñas
export interface ReviewFilters {
  is_approved?: boolean
  verified_purchase?: boolean
  rating?: number
  product_id?: string
  user_id?: string
  search?: string
}

export interface ReviewSortOptions {
  field: 'created_at' | 'rating' | 'updated_at'
  direction: 'asc' | 'desc'
}

export interface ReviewsQueryOptions {
  page?: number
  limit?: number
  filters?: ReviewFilters
  sort?: ReviewSortOptions
}

// Función para convertir ReviewRow a Review
function mapReviewRowToReview(
  review: ReviewRow,
  user?: UserRow,
  product?: ProductRow
): Review {
  return {
    id: review.id,
    product_id: review.product_id,
    user_id: review.user_id,
    order_id: review.order_id,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    verified_purchase: review.verified_purchase,
    is_approved: review.is_approved,
    created_at: review.created_at,
    updated_at: review.updated_at,
    user: user ? {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    } : undefined,
    product: product ? {
      id: product.id,
      name: product.name,
      slug: product.slug
    } : undefined
  }
}

// Función para obtener reseñas de la base de datos
export async function getReviewsFromDatabase(options: ReviewsQueryOptions = {}): Promise<{
  reviews: Review[]
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
      .from('product_reviews')
      .select(`
        *,
        user:users(first_name, last_name, email),
        product:products(name, slug)
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

    if (filters.product_id) {
      query = query.eq('product_id', filters.product_id)
    }

    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id)
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,comment.ilike.%${filters.search}%`)
    }

    // Aplicar ordenamiento
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reviews, error, count } = await query

    if (error) {
      console.error('Error fetching reviews from database:', error)
      throw new Error('Error al obtener reseñas de la base de datos')
    }

    const mappedReviews = reviews?.map(review => 
      mapReviewRowToReview(
        review,
        review.user as UserRow,
        review.product as ProductRow
      )
    ) || []

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

// Función para obtener una reseña específica por ID
export async function getReviewById(id: string): Promise<Review | null> {
  try {
    const supabase = createServerClient()
    
    const { data: review, error } = await supabase
      .from('product_reviews')
      .select(`
        *,
        user:users(first_name, last_name, email),
        product:products(name, slug)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching review by ID:', error)
      return null
    }

    if (!review) {
      return null
    }

    return mapReviewRowToReview(
      review,
      review.user as UserRow,
      review.product as ProductRow
    )

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
}> {
  try {
    const supabase = createServerClient()

    const { data: reviews, error } = await supabase
      .from('product_reviews')
      .select('rating, is_approved, verified_purchase')

    if (error) {
      console.error('Error fetching reviews for stats:', error)
      throw new Error('Error al obtener reseñas para estadísticas')
    }

    const totalReviews = reviews?.length || 0
    const approvedReviews = reviews?.filter(r => r.is_approved).length || 0
    const pendingReviews = reviews?.filter(r => !r.is_approved).length || 0
    const verifiedReviews = reviews?.filter(r => r.verified_purchase).length || 0
    const averageRating = totalReviews > 0 
      ? reviews?.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0
      : 0

    return {
      totalReviews,
      approvedReviews,
      pendingReviews,
      verifiedReviews,
      averageRating
    }

  } catch (error) {
    console.error('Error in getReviewStats:', error)
    throw error
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
    console.error('Error in getReviews:', error)
    throw error
  }
} 