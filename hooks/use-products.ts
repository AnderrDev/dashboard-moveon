'use client'

import { useState, useEffect } from 'react'
import { getProducts } from '@/lib/data'
import { ProductWithCategory } from '@/types/dashboard'

export function useProducts() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { products: productsData } = await getProducts()
      setProducts(productsData)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return {
    products,
    loading,
    error,
    refetch: loadProducts
  }
}