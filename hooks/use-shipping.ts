'use client'

import { useState, useEffect } from 'react'
import { getShippingZones, getShippingMethods } from '@/lib/data'

export function useShipping() {
  const [zones, setZones] = useState([])
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadShippingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [zonesData, methodsData] = await Promise.all([
        getShippingZones(),
        getShippingMethods()
      ])
      
      setZones(zonesData)
      setMethods(methodsData)
    } catch (err) {
      console.error('Error loading shipping data:', err)
      setError('Error al cargar datos de envío')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShippingData()
  }, [])

  return {
    zones,
    methods,
    loading,
    error,
    refetch: loadShippingData
  }
}