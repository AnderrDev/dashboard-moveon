'use client'

import { useState, useEffect } from 'react'
import { 
  mockDashboardStats, 
  mockSalesData, 
  mockTopProducts, 
  mockRecentOrders, 
  mockLowStockAlerts 
} from '@/lib/mock-data'
import { DashboardStats, SalesData, TopProduct, RecentOrder, LowStockAlert } from '@/types/dashboard'

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simular carga de datos con delay
    const loadMockData = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        setStats(mockDashboardStats)
        setSalesData(mockSalesData)
        setTopProducts(mockTopProducts)
        setRecentOrders(mockRecentOrders)
        setLowStockAlerts(mockLowStockAlerts)
      } catch (err) {
        console.error('Error loading mock data:', err)
        setError('Error cargando datos del dashboard')
      } finally {
        setLoading(false)
      }
    }
    
    loadMockData()
  }, [])

  const refetchData = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
  }

  return {
    stats,
    salesData,
    topProducts,
    recentOrders,
    lowStockAlerts,
    loading,
    error,
    refetch: refetchData
  }
}