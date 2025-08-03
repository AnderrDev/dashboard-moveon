'use client'

import { useState, useEffect } from 'react'
import { 
  getDashboardStats, 
  getSalesData, 
  getTopProducts, 
  getRecentOrders, 
  getLowStockAlerts 
} from '@/lib/data'
import { 
  DashboardStats, 
  SalesData, 
  TopProduct, 
  RecentOrder, 
  LowStockAlert 
} from '@/types/dashboard'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        dashboardStats,
        sales,
        topProductsData,
        recentOrdersData,
        lowStockAlertsData
      ] = await Promise.all([
        getDashboardStats(),
        getSalesData(),
        getTopProducts(),
        getRecentOrders(),
        getLowStockAlerts()
      ])

      setStats(dashboardStats)
      setSalesData(sales)
      setTopProducts(topProductsData)
      setRecentOrders(recentOrdersData)
      setLowStockAlerts(lowStockAlertsData)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    stats,
    salesData,
    topProducts,
    recentOrders,
    lowStockAlerts,
    loading,
    error,
    refetch: loadData
  }
}