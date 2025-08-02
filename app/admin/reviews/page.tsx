export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getReviews, getReviewStats } from '@/lib/data'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  Star,
  Filter,
  Download,
  TrendingUp
} from 'lucide-react'
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
  title: 'Reseñas - Panel de Administración',
  description: 'Gestiona las reseñas y comentarios de productos desde el panel de administración',
}

// Componente de carga para estadísticas
async function ReviewStats() {
  const stats = await getReviewStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reseñas</CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.totalProducts} productos
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.approvedReviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round((stats.approvedReviews / stats.totalReviews) * 100)}% del total
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Requieren revisión
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
          <Star className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.verifiedReviews} verificadas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de carga para la tabla de reseñas
async function ReviewsTable() {
  const { reviews, total, page, totalPages } = await getReviews({
    page: 1,
    limit: 20,
    filters: { },
    sort: { field: 'created_at', direction: 'desc' }
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reseñas</CardTitle>
        <CardDescription>
          Lista completa de reseñas de productos. Total: {total} reseñas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={reviews}
          searchKey="title"
          searchPlaceholder="Buscar por título..."
        />
      </CardContent>
    </Card>
  )
}

// Componente de skeleton para carga
function ReviewStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

function ReviewsTableSkeleton() {
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
export default async function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reseñas</h1>
          <p className="text-muted-foreground">
            Gestiona las reseñas y comentarios de productos
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Exportar como CSV</DropdownMenuItem>
            <DropdownMenuItem>Exportar como Excel</DropdownMenuItem>
            <DropdownMenuItem>Exportar como PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Suspense fallback={<ReviewStatsSkeleton />}>
        <ReviewStats />
      </Suspense>
      <Suspense fallback={<ReviewsTableSkeleton />}>
        <ReviewsTable />
      </Suspense>
    </div>
  )
}