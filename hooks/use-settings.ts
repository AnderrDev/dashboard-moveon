'use client'

import { useState, useEffect } from 'react'
import { mockSystemSettings } from '@/lib/mock-admin-data'
import { SystemSettings } from '@/types/admin'

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        setSettings(mockSystemSettings)
      } catch (err) {
        console.error('Error loading settings:', err)
        setError('Error cargando configuración')
      } finally {
        setLoading(false)
      }
    }
    
    loadSettings()
  }, [])

  const updateSetting = async (id: string, value: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, value, updated_at: new Date().toISOString() }
          : setting
      )
    )
  }

  const getSettingByKey = (key: string) => {
    return settings.find(setting => setting.key === key)
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter(setting => setting.category === category)
  }

  return {
    settings,
    loading,
    error,
    updateSetting,
    getSettingByKey,
    getSettingsByCategory,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}