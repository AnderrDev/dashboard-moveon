// Exportaciones de productos
export {
  getProducts,
  getProductsFromDatabase,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getLowStockProducts,
  searchProducts,
  getProductsByCategory,
  getProductStats,
  updateProduct,
  type ProductFilters,
  type ProductSortOptions,
  type ProductsQueryOptions
} from './products'

// Exportaciones de categorías
export {
  getCategories,
  getCategoriesFromDatabase,
  getCategoryById,
  getCategoryBySlug,
  getMainCategories,
  getSubcategories,
  getCategoryTree,
  searchCategories,
  getCategoryStats,
  type CategoryFilters,
  type CategorySortOptions,
  type CategoriesQueryOptions
} from './categories'

// Exportaciones de órdenes
export {
  getOrders,
  getOrdersFromDatabase,
  getOrderById,
  getOrderStats,
  type OrderFilters,
  type OrderSortOptions,
  type OrdersQueryOptions
} from './orders'

// Re-exportar tipos comunes
export type { ProductWithCategory, CategoryWithProducts, OrderWithDetails } from '@/types/dashboard' 