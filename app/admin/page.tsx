'use client'

import { useDashboardStats } from '@/hooks/use-dashboard-stats'
import { StatsCard } from '@/components/dashboard/stats-card'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { TopProducts } from '@/components/dashboard/top-products'
import { RecentOrders } from '@/components/dashboard/recent-orders'
import { LowStockAlerts } from '@/components/dashboard/low-stock-alerts'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  Loader2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AdminDashboard() {
  const {
    stats,
    salesData,
    topProducts,
    recentOrders,
    lowStockAlerts,
    loading,
    error
  } = useDashboardStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-6">
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu tienda de suplementos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change={stats?.revenueGrowth}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatsCard
          title="Pedidos"
          value={stats?.totalOrders || 0}
          change={stats?.ordersGrowth}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatsCard
          title="Clientes"
          value={stats?.totalCustomers || 0}
          change={stats?.customersGrowth}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="Valor Promedio"
          value={formatCurrency(stats?.averageOrderValue || 0)}
          change={stats?.conversionRate}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SalesChart data={salesData} />
        </div>

        {/* Top Products */}
        <div>
          <TopProducts products={topProducts} />
        </div>
      </div>

      {/* Recent Orders and Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={recentOrders} />
        <LowStockAlerts alerts={lowStockAlerts} />
      </div>
    </div>
  )
}