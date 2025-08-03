'use client'

import { useState, useEffect } from 'react'
import { getReports } from '@/lib/data'

export function useReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReports = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const reportsData = await getReports()
      setReports(reportsData)
    } catch (err) {
      console.error('Error loading reports:', err)
      setError('Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  return {
    reports,
    loading,
    error,
    refetch: loadReports
  }
}