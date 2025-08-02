export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { 
  getDashboardStats, 
  getSalesData, 
  getTopProducts, 
  getRecentOrders, 
  getLowStockAlerts 
} from '@/lib/data'
import { StatsCard } from '@/components/dashboard/stats-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { TopProducts } from '@/components/dashboard/top-products'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp
} from 'lucide-react'

// Metadata estática para SEO
export const metadata: Metadata = {
  title: 'Dashboard - Panel de Administración',
  description: 'Resumen general de tu tienda de suplementos',
}

// Función para formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

// Componente para las estadísticas del dashboard
async function DashboardStats() {
  const stats = await getDashboardStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Ingresos Totales"
        value={formatCurrency(stats.totalRevenue)}
        change={stats.revenueGrowth}
        icon={<DollarSign className="h-5 w-5" />}
      />
      <StatsCard
        title="Pedidos"
        value={stats.totalOrders}
        change={stats.ordersGrowth}
        icon={<ShoppingCart className="h-5 w-5" />}
      />
      <StatsCard
        title="Clientes"
        value={stats.totalCustomers}
        change={stats.customersGrowth}
        icon={<Users className="h-5 w-5" />}
      />
      <StatsCard
        title="Valor Promedio"
        value={formatCurrency(stats.averageOrderValue)}
        change={stats.conversionRate}
        icon={<TrendingUp className="h-5 w-5" />}
      />
    </div>
  )
}

// Componente para el gráfico de ventas
async function SalesChartSection() {
  const salesData = await getSalesData()

  return (
    <div className="lg:col-span-2">
      <SalesChart data={salesData} />
    </div>
  )
}

// Componente para productos más vendidos
async function TopProductsSection() {
  const topProducts = await getTopProducts()

  return <TopProducts products={topProducts} />
}

// Componente para pedidos recientes
async function RecentOrdersSection() {
  const recentOrders = await getRecentOrders()

  return <RecentOrders orders={recentOrders} />
}

// Componente para alertas de stock
async function LowStockAlertsSection() {
  const lowStockAlerts = await getLowStockAlerts()

  return <LowStockAlerts alerts={lowStockAlerts} />
}

// Componentes skeleton para carga
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="lg:col-span-2 p-6 border rounded-lg">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}

function ProductsSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertsSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Página principal del dashboard
export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu tienda de suplementos
        </p>
      </div>

      {/* Stats Cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <Suspense fallback={<ChartSkeleton />}>
          <SalesChartSection />
        </Suspense>

        {/* Top Products */}
        <Suspense fallback={<ProductsSkeleton />}>
          <TopProductsSection />
        </Suspense>
      </div>

      {/* Recent Orders and Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<OrdersSkeleton />}>
          <RecentOrdersSection />
        </Suspense>
        <Suspense fallback={<AlertsSkeleton />}>
          <LowStockAlertsSection />
        </Suspense>
      </div>
    </div>
  )
}