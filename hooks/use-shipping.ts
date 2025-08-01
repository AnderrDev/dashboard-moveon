'use client'

import { useState, useEffect } from 'react'
import { mockShippingZones, mockShippingMethods } from '@/lib/mock-admin-data'
import { ShippingZone, ShippingMethod } from '@/types/admin'

export function useShipping() {
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [methods, setMethods] = useState<ShippingMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadShippingData = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        setZones(mockShippingZones)
        setMethods(mockShippingMethods)
      } catch (err) {
        console.error('Error loading shipping data:', err)
        setError('Error cargando datos de envío')
      } finally {
        setLoading(false)
      }
    }
    
    loadShippingData()
  }, [])

  const toggleZoneStatus = async (id: string) => {
    setZones(prev => 
      prev.map(zone => 
        zone.id === id 
          ? { ...zone, is_active: !zone.is_active }
          : zone
      )
    )
  }

  const toggleMethodStatus = async (id: string) => {
    setMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, is_active: !method.is_active }
          : method
      )
    )
  }

  const updateMethod = async (id: string, data: Partial<ShippingMethod>) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    setMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, ...data, updated_at: new Date().toISOString() }
          : method
      )
    )
  }

  return {
    zones,
    methods,
    loading,
    error,
    toggleZoneStatus,
    toggleMethodStatus,
    updateMethod,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}