'use client'

import { useState, useEffect } from 'react'
import { getCustomers } from '@/lib/data'
import { Customer } from '@/types/admin'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { customers: customersData } = await getCustomers()
      setCustomers(customersData)
    } catch (err) {
      console.error('Error loading customers:', err)
      setError('Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return {
    customers,
    loading,
    error,
    refetch: loadCustomers
  }
}