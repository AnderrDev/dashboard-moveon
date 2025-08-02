# Data Layer - Capa de Datos

Esta carpeta contiene la lógica de acceso a datos siguiendo las mejores prácticas de Next.js con App Router y Server-Side Rendering.

## Estructura

```
lib/data/
├── index.ts          # Exportaciones principales
├── products.ts       # Funciones para productos
├── categories.ts     # Funciones para categorías
└── README.md        # Esta documentación
```

## Características Principales

### ✅ Server-Side Rendering (SSR)
- Todas las funciones son `async` y se ejecutan en el servidor
- Soporte completo para Server Components de Next.js
- Metadata dinámica generada en el servidor

### ✅ Fallback a Datos Mock
- Si la base de datos no está disponible, automáticamente usa datos mock
- Desarrollo sin dependencias externas
- Transición suave entre desarrollo y producción

### ✅ Tipado Completo
- TypeScript con tipos estrictos
- Interfaces bien definidas para filtros y opciones
- Autocompletado y validación en tiempo de compilación

### ✅ Optimización de Rendimiento
- Consultas optimizadas con Supabase
- Paginación eficiente
- Caché automático de Next.js

## Uso Básico

### Importar Funciones

```typescript
import { 
  getProducts, 
  getProductById, 
  getCategories,
  getCategoryBySlug 
} from '@/lib/data'
```

### Obtener Productos

```typescript
// Obtener todos los productos
const { products, total, page, totalPages } = await getProducts()

// Con filtros
const { products } = await getProducts({
  filters: { 
    is_active: true,
    category_id: 'cat-123'
  },
  sort: { field: 'name', direction: 'asc' },
  page: 1,
  limit: 20
})

// Buscar productos
const products = await searchProducts('proteína', 10)

// Productos destacados
const featuredProducts = await getFeaturedProducts(6)
```

### Obtener Categorías

```typescript
// Todas las categorías
const { categories } = await getCategories()

// Categorías principales
const mainCategories = await getMainCategories()

// Árbol completo de categorías
const categoryTree = await getCategoryTree()

// Buscar categorías
const categories = await searchCategories('proteínas')
```

## Uso en Páginas

### Página con Server Components

```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/data'

export default async function ProductsPage() {
  const { products, total } = await getProducts({
    filters: { is_active: true },
    limit: 20
  })

  return (
    <div>
      <h1>Productos ({total})</h1>
      {/* Renderizar productos */}
    </div>
  )
}
```

### Metadata Dinámica

```typescript
// app/products/[id]/page.tsx
import { getProductById } from '@/lib/data'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id)
  
  if (!product) {
    return { title: 'Producto no encontrado' }
  }

  return {
    title: product.name,
    description: product.description
  }
}
```

### Manejo de Errores

```typescript
import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)
  
  if (!product) {
    notFound() // Renderiza la página 404
  }

  return <ProductDetails product={product} />
}
```

## Filtros Disponibles

### ProductFilters

```typescript
interface ProductFilters {
  category_id?: string
  is_active?: boolean
  is_featured?: boolean
  search?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  low_stock?: boolean
}
```

### CategoryFilters

```typescript
interface CategoryFilters {
  is_active?: boolean
  parent_id?: string | null
  search?: string
}
```

## Opciones de Ordenamiento

### ProductSortOptions

```typescript
interface ProductSortOptions {
  field: 'name' | 'price' | 'created_at' | 'stock_quantity'
  direction: 'asc' | 'desc'
}
```

### CategorySortOptions

```typescript
interface CategorySortOptions {
  field: 'name' | 'sort_order' | 'created_at'
  direction: 'asc' | 'desc'
}
```

## Funciones Especializadas

### Productos

- `getProducts()` - Lista paginada con filtros
- `getProductById(id)` - Producto específico por ID
- `getProductBySlug(slug)` - Producto por slug
- `getFeaturedProducts(limit)` - Productos destacados
- `getLowStockProducts(limit)` - Productos con stock bajo
- `searchProducts(term, limit)` - Búsqueda de productos
- `getProductsByCategory(slug, options)` - Productos por categoría
- `getProductStats()` - Estadísticas de productos

### Categorías

- `getCategories()` - Lista paginada con filtros
- `getCategoryById(id)` - Categoría específica por ID
- `getCategoryBySlug(slug)` - Categoría por slug
- `getMainCategories()` - Categorías principales
- `getSubcategories(parentId)` - Subcategorías
- `getCategoryTree()` - Árbol completo de categorías
- `searchCategories(term, limit)` - Búsqueda de categorías
- `getCategoryStats()` - Estadísticas de categorías

## Configuración de Base de Datos

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Estructura de Tablas

Las funciones esperan las siguientes tablas en Supabase:

- `products` - Productos
- `categories` - Categorías
- `users` - Usuarios
- `orders` - Pedidos
- `order_items` - Items de pedidos

## Mejores Prácticas

### 1. Usar Server Components
```typescript
// ✅ Correcto
export default async function Page() {
  const data = await getProducts()
  return <div>{/* render */}</div>
}

// ❌ Evitar
'use client'
export default function Page() {
  const [data, setData] = useState()
  useEffect(() => {
    // fetch data
  }, [])
}
```

### 2. Manejar Estados de Carga
```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductList />
    </Suspense>
  )
}
```

### 3. Metadata Dinámica
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.id)
  return {
    title: data.title,
    description: data.description
  }
}
```

### 4. Manejo de Errores
```typescript
try {
  const data = await getProducts()
  return <ProductList products={data.products} />
} catch (error) {
  // Fallback a datos mock automático
  console.warn('Database error, using mock data:', error)
}
```

## Migración desde Hooks

### Antes (Client Components)
```typescript
'use client'
import { useProducts } from '@/hooks/use-products'

export default function ProductsPage() {
  const { products, loading, error } = useProducts()
  
  if (loading) return <Loading />
  if (error) return <Error />
  
  return <ProductList products={products} />
}
```

### Después (Server Components)
```typescript
import { getProducts } from '@/lib/data'

export default async function ProductsPage() {
  const { products } = await getProducts()
  return <ProductList products={products} />
}
```

## Ventajas de esta Arquitectura

1. **Rendimiento**: Server-side rendering más rápido
2. **SEO**: Contenido renderizado en el servidor
3. **UX**: Sin estados de carga inicial
4. **Mantenibilidad**: Lógica centralizada
5. **Escalabilidad**: Fácil agregar nuevas funciones
6. **Desarrollo**: Fallback automático a datos mock
7. **Producción**: Conexión directa a base de datos

## Próximos Pasos

- [ ] Agregar funciones para órdenes
- [ ] Agregar funciones para usuarios
- [ ] Implementar caché con React Cache
- [ ] Agregar validación con Zod
- [ ] Crear funciones de mutación (CRUD) 