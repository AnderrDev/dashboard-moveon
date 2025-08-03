'use client'

import { useState, useEffect } from 'react'
import { getOrders } from '@/lib/data'
import { OrderWithDetails } from '@/types/dashboard'

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { orders: ordersData } = await getOrders()
      setOrders(ordersData)
    } catch (err) {
      console.error('Error loading orders:', err)
      setError('Error al cargar órdenes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    refetch: loadOrders
  }
}