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

// Exportaciones de clientes
export {
  getCustomers,
  getCustomersFromDatabase,
  getCustomerById,
  getCustomerStats,
  type CustomerFilters,
  type CustomerSortOptions,
  type CustomersQueryOptions
} from './customers'

// Exportaciones de reseñas
export {
  getReviews,
  getReviewsFromDatabase,
  getReviewById,
  getReviewStats,
  type ReviewFilters,
  type ReviewSortOptions,
  type ReviewsQueryOptions
} from './reviews'

// Exportaciones del dashboard
export {
  getDashboardStats,
  getSalesData,
  getTopProducts,
  getRecentOrders,
  getLowStockAlerts
} from './dashboard'

// Re-exportar tipos comunes
export type { ProductWithCategory, CategoryWithProducts, OrderWithDetails } from '@/types/dashboard'
export type { Customer, Review } from '@/types/admin' 