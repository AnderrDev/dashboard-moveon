import { createServerClient } from '@/lib/supabase'
import { mockProducts } from '@/lib/mock-data'
import { ProductWithCategory } from '@/types/dashboard'
import { Database } from '@/types/supabase'

type ProductRow = Database['public']['Tables']['products']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']

// Tipos para las consultas de productos
export interface ProductFilters {
  category_id?: string
  is_active?: boolean
  is_featured?: boolean
  search?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  low_stock?: boolean
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'created_at' | 'stock_quantity'
  direction: 'asc' | 'desc'
}

export interface ProductsQueryOptions {
  page?: number
  limit?: number
  filters?: ProductFilters
  sort?: ProductSortOptions
}

// Función para convertir ProductRow a ProductWithCategory
function mapProductRowToProductWithCategory(
  product: ProductRow,
  category?: CategoryRow
): ProductWithCategory {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    short_description: product.short_description || undefined,
    sku: product.sku,
    price: product.price,
    compare_price: product.compare_price || undefined,
    cost_price: product.cost_price || undefined,
    stock_quantity: product.stock_quantity,
    low_stock_threshold: product.low_stock_threshold,
    brand: product.brand || undefined,
    weight: product.weight || undefined,
    serving_size: product.serving_size || undefined,
    servings_per_container: product.servings_per_container || undefined,
    images: product.images,
    tags: product.tags,
    ingredients: product.ingredients,
    nutritional_info: product.nutritional_info,
    is_active: product.is_active,
    is_featured: product.is_featured,
    created_at: product.created_at,
    updated_at: product.updated_at,
    category: category ? {
      id: category.id,
      name: category.name,
      slug: category.slug
    } : undefined
  }
}

// Función para obtener productos de la base de datos
export async function getProductsFromDatabase(options: ProductsQueryOptions = {}): Promise<{
  products: ProductWithCategory[]
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
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)

    // Aplicar filtros simples directamente en Supabase
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`)
    }

    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price)
    }

    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price)
    }

    if (filters.in_stock) {
      query = query.gt('stock_quantity', 0)
    }

    // No aplicar .lte(stock_quantity, raw...) porque no está soportado

    // Aplicar ordenamiento
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // No aplicamos paginación aún si hay filtro `low_stock`, porque vamos a filtrar manualmente

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products from database:', error)
      throw new Error('Error al obtener productos de la base de datos')
    }

    let filteredProducts = products || []

    // Aplicar filtro low_stock en JS
    if (filters.low_stock) {
      filteredProducts = filteredProducts.filter(
        (p) => p.stock_quantity <= p.low_stock_threshold
      )
    }

    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)

    // Aplicar paginación en JS (después de filtros)
    const from = (page - 1) * limit
    const to = from + limit
    const paginated = filteredProducts.slice(from, to)

    // Mapear resultados
    const mappedProducts = paginated.map(product =>
      mapProductRowToProductWithCategory(
        product,
        product.categories as CategoryRow
      )
    )

    return {
      products: mappedProducts,
      total,
      page,
      totalPages
    }

  } catch (error) {
    console.error('Error in getProductsFromDatabase:', error)
    throw error
  }
}


// Función para obtener un producto específico por ID
export async function getProductById(id: string): Promise<ProductWithCategory | null> {
  try {
    const supabase = createServerClient()
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching product by ID:', error)
      return null
    }

    if (!product) {
      return null
    }

    return mapProductRowToProductWithCategory(
      product,
      product.categories as CategoryRow
    )

  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

// Función para obtener un producto por slug
export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  try {
    const supabase = createServerClient()
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }

    if (!product) {
      return null
    }

    return mapProductRowToProductWithCategory(
      product,
      product.categories as CategoryRow
    )

  } catch (error) {
    console.error('Error in getProductBySlug:', error)
    return null
  }
}

// Función para obtener productos destacados
export async function getFeaturedProducts(limit: number = 6): Promise<ProductWithCategory[]> {
  try {
    const { products } = await getProductsFromDatabase({
      filters: { is_featured: true, is_active: true },
      limit,
      sort: { field: 'created_at', direction: 'desc' }
    })

    return products

  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    // Fallback a datos mock
    return mockProducts.filter(p => p.is_featured).slice(0, limit)
  }
}

// Función para obtener productos con stock bajo
export async function getLowStockProducts(limit: number = 10): Promise<ProductWithCategory[]> {
  try {
    const { products } = await getProductsFromDatabase({
      filters: { low_stock: true, is_active: true },
      limit,
      sort: { field: 'stock_quantity', direction: 'asc' }
    })

    return products

  } catch (error) {
    console.error('Error in getLowStockProducts:', error)
    // Fallback a datos mock
    return mockProducts.filter(p => p.stock_quantity <= p.low_stock_threshold).slice(0, limit)
  }
}

// Función para buscar productos
export async function searchProducts(searchTerm: string, limit: number = 20): Promise<ProductWithCategory[]> {
  try {
    const { products } = await getProductsFromDatabase({
      filters: { search: searchTerm, is_active: true },
      limit,
      sort: { field: 'name', direction: 'asc' }
    })

    return products

  } catch (error) {
    console.error('Error in searchProducts:', error)
    // Fallback a datos mock
    const searchLower = searchTerm.toLowerCase()
    return mockProducts.filter(p => 
      p.is_active && (
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      )
    ).slice(0, limit)
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(
  categorySlug: string,
  options: Omit<ProductsQueryOptions, 'filters'> = {}
): Promise<{
  products: ProductWithCategory[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    // Primero obtener la categoría por slug
    const supabase = createServerClient()
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (categoryError || !category) {
      throw new Error('Categoría no encontrada')
    }

    // Luego obtener productos de esa categoría
    return await getProductsFromDatabase({
      ...options,
      filters: {
        category_id: category.id,
        is_active: true,
        ...(options as any).filters
      }
    })

  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    // Fallback a datos mock
    const mockProductsInCategory = mockProducts.filter(p => 
      p.category?.slug === categorySlug && p.is_active
    )
    
    const { page = 1, limit = 20 } = options
    const from = (page - 1) * limit
    const to = from + limit
    
    return {
      products: mockProductsInCategory.slice(from, to),
      total: mockProductsInCategory.length,
      page,
      totalPages: Math.ceil(mockProductsInCategory.length / limit)
    }
  }
}

// Función para obtener estadísticas de productos
export async function getProductStats(): Promise<{
  totalProducts: number
  activeProducts: number
  featuredProducts: number
  lowStockProducts: number
  outOfStockProducts: number
}> {
  try {
    const supabase = createServerClient()

    // Consultas paralelas
    const [
      { count: totalProducts },
      { count: activeProducts },
      { count: featuredProducts },
      { count: outOfStockProducts },
      { data: stockData, error: stockError }
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('stock_quantity', 0),
      supabase.from('products').select('stock_quantity, low_stock_threshold') // 👈 solo traemos los campos necesarios
    ])

    if (stockError) throw stockError

    const lowStockProducts = stockData?.filter(
      (p) => p.stock_quantity <= p.low_stock_threshold
    ).length ?? 0

    return {
      totalProducts: totalProducts || 0,
      activeProducts: activeProducts || 0,
      featuredProducts: featuredProducts || 0,
      lowStockProducts,
      outOfStockProducts: outOfStockProducts || 0
    }

  } catch (error) {
    console.error('Error in getProductStats:', error)
    // Fallback a datos mock si falla Supabase
    const activeProducts = mockProducts.filter(p => p.is_active)
    const featuredProducts = mockProducts.filter(p => p.is_featured)
    const lowStockProducts = mockProducts.filter(p => p.stock_quantity <= p.low_stock_threshold)
    const outOfStockProducts = mockProducts.filter(p => p.stock_quantity === 0)

    return {
      totalProducts: mockProducts.length,
      activeProducts: activeProducts.length,
      featuredProducts: featuredProducts.length,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length
    }
  }
}


// Función para actualizar un producto
export async function updateProduct(id: string, data: {
  name?: string
  slug?: string
  description?: string
  short_description?: string
  sku?: string
  price?: number
  compare_price?: number
  cost_price?: number
  stock_quantity?: number
  low_stock_threshold?: number
  brand?: string
  weight?: number
  serving_size?: string
  servings_per_container?: number
  category_id?: string
  tags?: string[]
  ingredients?: string[]
  nutritional_info?: Record<string, any>
  images?: string[]
  is_active?: boolean
  is_featured?: boolean
}): Promise<ProductWithCategory | null> {
  try {
    const supabase = createServerClient()
    
    // Preparar datos para actualización
    const updateData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      short_description: data.short_description,
      sku: data.sku,
      price: data.price,
      compare_price: data.compare_price,
      cost_price: data.cost_price,
      stock_quantity: data.stock_quantity,
      low_stock_threshold: data.low_stock_threshold,
      brand: data.brand,
      weight: data.weight,
      serving_size: data.serving_size,
      servings_per_container: data.servings_per_container,
      category_id: data.category_id,
      tags: data.tags,
      ingredients: data.ingredients,
      nutritional_info: data.nutritional_info,
      images: data.images,
      is_active: data.is_active,
      is_featured: data.is_featured,
      updated_at: new Date().toISOString()
    }

    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw new Error('Error al actualizar el producto')
    }

    if (!updatedProduct) {
      return null
    }

    return mapProductRowToProductWithCategory(
      updatedProduct,
      updatedProduct.categories as CategoryRow
    )

  } catch (error) {
    console.error('Error in updateProduct:', error)
    throw error
  }
}

// Función principal para obtener productos (con fallback a mock)
export async function getProducts(options: ProductsQueryOptions = {}): Promise<{
  products: ProductWithCategory[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    // Intentar obtener datos de la base de datos
    return await getProductsFromDatabase(options)
  } catch (error) {
    console.warn('Falling back to mock data due to database error:', error)
    
    // Fallback a datos mock
    const { page = 1, limit = 20, filters = {} } = options
    
    let filteredProducts = mockProducts

    // Aplicar filtros básicos a los datos mock
    if (filters.is_active !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.is_active === filters.is_active)
    }

    if (filters.is_featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.is_featured === filters.is_featured)
    }

    if (filters.category_id) {
      filteredProducts = filteredProducts.filter(p => p.category?.id === filters.category_id)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower)
      )
    }

    if (filters.min_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.min_price!)
    }

    if (filters.max_price !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.max_price!)
    }

    if (filters.in_stock) {
      filteredProducts = filteredProducts.filter(p => p.stock_quantity > 0)
    }

    if (filters.low_stock) {
      filteredProducts = filteredProducts.filter(p => p.stock_quantity <= p.low_stock_threshold)
    }

    // Aplicar ordenamiento
    if (options.sort) {
      filteredProducts.sort((a, b) => {
        const aValue = a[options.sort!.field]
        const bValue = b[options.sort!.field]
        
        if (options.sort!.direction === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
      })
    }

    const total = filteredProducts.length
    const from = (page - 1) * limit
    const to = from + limit
    const paginatedProducts = filteredProducts.slice(from, to)

    return {
      products: paginatedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }
} 