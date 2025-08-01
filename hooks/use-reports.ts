'use client'

import { useState, useEffect } from 'react'
import { mockReportData } from '@/lib/mock-admin-data'
import { ReportData } from '@/types/admin'

export function useReports() {
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        setReportData(mockReportData)
      } catch (err) {
        console.error('Error loading reports:', err)
        setError('Error cargando reportes')
      } finally {
        setLoading(false)
      }
    }
    
    loadReports()
  }, [])

  const generateReport = async (period: string) => {
    setLoading(true)
    // Simular generación de reporte
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return {
    reportData,
    loading,
    error,
    generateReport,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 1000)
    }
  }
}