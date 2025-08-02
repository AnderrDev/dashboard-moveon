export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getOrders, getOrderStats } from '@/lib/data'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Truck,
  DollarSign,
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
  title: 'Pedidos - Panel de Administración',
  description: 'Gestiona todos los pedidos de tu tienda desde el panel de administración',
}

// Componente de carga para estadísticas
async function OrderStats() {
  const stats = await getOrderStats()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Requieren atención
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Procesando</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.processingOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            En preparación
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enviados</CardTitle>
          <Truck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.shippedOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">
            En tránsito
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total de pedidos
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de carga para la tabla de pedidos
async function OrdersTable() {
  const { orders, total, page, totalPages } = await getOrders({
    page: 1,
    limit: 20,
    filters: { },
    sort: { field: 'created_at', direction: 'desc' }
  })
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos</CardTitle>
        <CardDescription>
          Gestiona todos los pedidos de tu tienda. Total: {total} pedidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable 
          columns={columns} 
          data={orders}
          searchKey="order_number"
          searchPlaceholder="Buscar por número de pedido..."
        />
      </CardContent>
    </Card>
  )
}

// Componente de skeleton para carga
function OrderStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
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

function OrdersTableSkeleton() {
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
export default async function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gestiona todos los pedidos de tu tienda
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
      <Suspense fallback={<OrderStatsSkeleton />}>
        <OrderStats />
      </Suspense>
      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable />
      </Suspense>
    </div>
  )
}