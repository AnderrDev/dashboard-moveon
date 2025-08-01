'use client'

import { useState, useEffect } from 'react'
import { mockReviews } from '@/lib/mock-admin-data'
import { Review } from '@/types/admin'

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        setReviews(mockReviews)
      } catch (err) {
        console.error('Error loading reviews:', err)
        setError('Error cargando reseñas')
      } finally {
        setLoading(false)
      }
    }
    
    loadReviews()
  }, [])

  const approveReview = async (id: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id 
          ? { ...review, is_approved: true, updated_at: new Date().toISOString() }
          : review
      )
    )
  }

  const rejectReview = async (id: string) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === id 
          ? { ...review, is_approved: false, updated_at: new Date().toISOString() }
          : review
      )
    )
  }

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(review => review.id !== id))
  }

  return {
    reviews,
    loading,
    error,
    approveReview,
    rejectReview,
    deleteReview,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}