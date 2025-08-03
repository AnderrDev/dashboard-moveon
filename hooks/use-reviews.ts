'use client'

import { useState, useEffect } from 'react'
import { getReviews } from '@/lib/data'
import { Review } from '@/types/admin'

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { reviews: reviewsData } = await getReviews()
      setReviews(reviewsData)
    } catch (err) {
      console.error('Error loading reviews:', err)
      setError('Error al cargar reseñas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  return {
    reviews,
    loading,
    error,
    refetch: loadReviews
  }
}