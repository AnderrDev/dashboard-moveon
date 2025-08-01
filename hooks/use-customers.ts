'use client'

import { useState, useEffect } from 'react'
import { mockCustomers } from '@/lib/mock-admin-data'
import { Customer } from '@/types/admin'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        setCustomers(mockCustomers)
      } catch (err) {
        console.error('Error loading customers:', err)
        setError('Error cargando clientes')
      } finally {
        setLoading(false)
      }
    }
    
    loadCustomers()
  }, [])

  const toggleCustomerStatus = async (id: string) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { ...customer, is_active: !customer.is_active }
          : customer
      )
    )
  }

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { ...customer, ...data, updated_at: new Date().toISOString() }
          : customer
      )
    )
  }

  return {
    customers,
    loading,
    error,
    toggleCustomerStatus,
    updateCustomer,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}