'use client'

import { useState, useEffect } from 'react'
import { getCategories } from '@/lib/data'
import { CategoryWithProducts } from '@/types/dashboard'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { categories: categoriesData } = await getCategories()
      setCategories(categoriesData)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Error al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: loadCategories
  }
}