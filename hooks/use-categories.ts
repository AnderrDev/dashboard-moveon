'use client'

import { useState, useEffect } from 'react'
import { mockCategories } from '@/lib/mock-data'
import { CategoryWithProducts } from '@/types/dashboard'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        setCategories(mockCategories)
      } catch (err) {
        console.error('Error loading categories:', err)
        setError('Error cargando categorías')
      } finally {
        setLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  const deleteCategory = async (id: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    setCategories(prev => prev.filter(category => category.id !== id))
  }

  const toggleCategoryStatus = async (id: string) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, is_active: !category.is_active }
          : category
      )
    )
  }

  const updateCategory = async (id: string, data: Partial<CategoryWithProducts>) => {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...data, updated_at: new Date().toISOString() }
          : category
      )
    )
  }
  return {
    categories,
    loading,
    error,
    deleteCategory,
    toggleCategoryStatus,
    updateCategory,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}