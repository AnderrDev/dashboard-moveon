export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getCategories, getCategoryStats } from '@/lib/data'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Plus, 
  Tag, 
  TrendingUp, 
  Download,
  Filter,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Metadata estática para SEO
export const metadata: Metadata = {
  title: 'Categorías - Panel de Administración',
  description: 'Gestiona todas las categorías de tu tienda desde el panel de administración',
}

// Componente de carga para estadísticas
async function CategoryStats() {
  const stats = await getCategoryStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Categorías</CardTitle>
          <Tag className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.activeCategories} activas, {stats.totalCategories - stats.activeCategories} inactivas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías Activas</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalCategories > 0 ? ((stats.activeCategories / stats.totalCategories) * 100).toFixed(1) : 0}% del total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categorías Principales</CardTitle>
          <Eye className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.mainCategories}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Sin categoría padre
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de carga para la tabla de categorías
async function CategoriesTable() {
  const { categories, total, page, totalPages } = await getCategories({
    page: 1,
    limit: 20,
    filters: { },
    sort: { field: 'sort_order', direction: 'asc' }
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
        <CardDescription>
          Gestiona todas las categorías de tu tienda. Total: {total} categorías
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={categories}
          searchKey="name"
          searchPlaceholder="Buscar categorías..."
        />
      </CardContent>
    </Card>
  )
}

// Componente de skeleton para carga
function CategoryStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CategoriesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Página principal
export default async function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">
            Organiza tus productos por categorías
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </Link>
      </div>
      <Suspense fallback={<CategoryStatsSkeleton />}>
        <CategoryStats />
      </Suspense>
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesTable />
      </Suspense>
    </div>
  )
}