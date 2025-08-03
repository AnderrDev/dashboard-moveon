'use client'

import { useState, useEffect } from 'react'
import { getSettings } from '@/lib/data'

export function useSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const settingsData = await getSettings()
      setSettings(settingsData)
    } catch (err) {
      console.error('Error loading settings:', err)
      setError('Error al cargar configuraciones')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    refetch: loadSettings
  }
}