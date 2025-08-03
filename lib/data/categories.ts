import { createServerClient } from '@/lib/supabase'
import { CategoryWithProducts } from '@/types/dashboard'
import { Database } from '@/types/supabase'

type CategoryRow = Database['public']['Tables']['categories']['Row']

// Tipos para las consultas de categorías
export interface CategoryFilters {
  is_active?: boolean
  parent_id?: string | null
  search?: string
}

export interface CategorySortOptions {
  field: 'name' | 'sort_order' | 'created_at'
  direction: 'asc' | 'desc'
}

export interface CategoriesQueryOptions {
  page?: number
  limit?: number
  filters?: CategoryFilters
  sort?: CategorySortOptions
}

// Función para convertir CategoryRow a CategoryWithProducts
function mapCategoryRowToCategoryWithProducts(
  category: CategoryRow,
  productsCount: number = 0
): CategoryWithProducts {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || undefined,
    image_url: category.image_url || undefined,
    parent_id: category.parent_id || undefined,
    sort_order: category.sort_order,
    is_active: category.is_active,
    created_at: category.created_at,
    updated_at: category.updated_at,
    products_count: productsCount
  }
}

// Función para obtener categorías de la base de datos
export async function getCategoriesFromDatabase(options: CategoriesQueryOptions = {}): Promise<{
  categories: CategoryWithProducts[]
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
      sort = { field: 'sort_order', direction: 'asc' }
    } = options

    let query = supabase
      .from('categories')
      .select(`
        *,
        products!inner(count)
      `)

    // Aplicar filtros
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active)
    }

    if (filters.parent_id !== undefined) {
      if (filters.parent_id === null) {
        query = query.is('parent_id', null)
      } else {
        query = query.eq('parent_id', filters.parent_id)
      }
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Aplicar ordenamiento
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Aplicar paginación
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: categories, error, count } = await query

    if (error) {
      console.error('Error fetching categories from database:', error)
      throw new Error('Error al obtener categorías de la base de datos')
    }

    const mappedCategories = categories?.map(category => 
      mapCategoryRowToCategoryWithProducts(
        category,
        category.products?.[0]?.count || 0
      )
    ) || []

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      categories: mappedCategories,
      total,
      page,
      totalPages
    }

  } catch (error) {
    console.error('Error in getCategoriesFromDatabase:', error)
    throw error
  }
}

// Función para obtener una categoría específica por ID
export async function getCategoryById(id: string): Promise<CategoryWithProducts | null> {
  try {
    const supabase = createServerClient()
    
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        products!inner(count)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category by ID:', error)
      return null
    }

    if (!category) {
      return null
    }

    return mapCategoryRowToCategoryWithProducts(
      category,
      category.products?.[0]?.count || 0
    )

  } catch (error) {
    console.error('Error in getCategoryById:', error)
    return null
  }
}

// Función para obtener una categoría por slug
export async function getCategoryBySlug(slug: string): Promise<CategoryWithProducts | null> {
  try {
    const supabase = createServerClient()
    
    const { data: category, error } = await supabase
      .from('categories')
      .select(`
        *,
        products!inner(count)
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }

    if (!category) {
      return null
    }

    return mapCategoryRowToCategoryWithProducts(
      category,
      category.products?.[0]?.count || 0
    )

  } catch (error) {
    console.error('Error in getCategoryBySlug:', error)
    return null
  }
}

// Función para obtener categorías principales (sin padre)
export async function getMainCategories(): Promise<CategoryWithProducts[]> {
  try {
    const { categories } = await getCategoriesFromDatabase({
      filters: { parent_id: null, is_active: true },
      sort: { field: 'sort_order', direction: 'asc' }
    })

    return categories

  } catch (error) {
    console.error('Error in getMainCategories:', error)
    throw error
  }
}

// Función para obtener subcategorías de una categoría padre
export async function getSubcategories(parentId: string): Promise<CategoryWithProducts[]> {
  try {
    const { categories } = await getCategoriesFromDatabase({
      filters: { parent_id: parentId, is_active: true },
      sort: { field: 'sort_order', direction: 'asc' }
    })

    return categories

  } catch (error) {
    console.error('Error in getSubcategories:', error)
    throw error
  }
}

// Función para obtener el árbol completo de categorías
export async function getCategoryTree(): Promise<CategoryWithProducts[]> {
  try {
    const { categories } = await getCategoriesFromDatabase({
      filters: { is_active: true },
      sort: { field: 'sort_order', direction: 'asc' }
    })

    // Construir el árbol de categorías
    const categoryMap = new Map<string, CategoryWithProducts>()
    const rootCategories: CategoryWithProducts[] = []

    // Primero, mapear todas las categorías
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Luego, construir el árbol
    categories.forEach(category => {
      const mappedCategory = categoryMap.get(category.id)!
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push({
            id: mappedCategory.id,
            name: mappedCategory.name,
            slug: mappedCategory.slug
          })
        }
      } else {
        rootCategories.push(mappedCategory)
      }
    })

    return rootCategories

  } catch (error) {
    console.error('Error in getCategoryTree:', error)
    throw error
  }
}

// Función para buscar categorías
export async function searchCategories(searchTerm: string, limit: number = 20): Promise<CategoryWithProducts[]> {
  try {
    const { categories } = await getCategoriesFromDatabase({
      filters: { search: searchTerm, is_active: true },
      limit,
      sort: { field: 'name', direction: 'asc' }
    })

    return categories

  } catch (error) {
    console.error('Error in searchCategories:', error)
    throw error
  }
}

// Función para obtener estadísticas de categorías
export async function getCategoryStats(): Promise<{
  totalCategories: number
  activeCategories: number
  mainCategories: number
  subcategories: number
}> {
  try {
    const supabase = createServerClient()
    
    const [
      { count: totalCategories },
      { count: activeCategories },
      { count: mainCategories },
      { count: subcategories }
    ] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('categories').select('*', { count: 'exact', head: true }).is('parent_id', null),
      supabase.from('categories').select('*', { count: 'exact', head: true }).not('parent_id', 'is', null)
    ])

    return {
      totalCategories: totalCategories || 0,
      activeCategories: activeCategories || 0,
      mainCategories: mainCategories || 0,
      subcategories: subcategories || 0
    }

  } catch (error) {
    console.error('Error in getCategoryStats:', error)
    throw error
  }
}

// Función principal para obtener categorías
export async function getCategories(options: CategoriesQueryOptions = {}): Promise<{
  categories: CategoryWithProducts[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    return await getCategoriesFromDatabase(options)
  } catch (error) {
    console.error('Error in getCategories:', error)
    throw error
  }
}

// Función para crear una nueva categoría
export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active?: boolean
}): Promise<CategoryWithProducts | null> {
  try {
    const supabase = createServerClient()
    
    // Preparar datos para inserción
    const insertData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url,
      sort_order: data.sort_order,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      console.error('Error creating category:', error)
      throw new Error('Error al crear la categoría')
    }

    if (!newCategory) {
      return null
    }

    return mapCategoryRowToCategoryWithProducts(newCategory, 0)

  } catch (error) {
    console.error('Error in createCategory:', error)
    throw error
  }
}

// Función para actualizar una categoría
export async function updateCategory(id: string, data: {
  name?: string
  slug?: string
  description?: string
  image_url?: string
  sort_order?: number
  is_active?: boolean
}): Promise<CategoryWithProducts | null> {
  try {
    const supabase = createServerClient()
    
    // Preparar datos para actualización
    const updateData = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image_url: data.image_url,
      sort_order: data.sort_order,
      is_active: data.is_active,
      updated_at: new Date().toISOString()
    }

    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating category:', error)
      throw new Error('Error al actualizar la categoría')
    }

    if (!updatedCategory) {
      return null
    }

    return mapCategoryRowToCategoryWithProducts(updatedCategory, 0)

  } catch (error) {
    console.error('Error in updateCategory:', error)
    throw error
  }
} 