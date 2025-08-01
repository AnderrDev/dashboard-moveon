'use client'

import { useState, useEffect } from 'react'
import { mockProducts } from '@/lib/mock-data'
import { ProductWithCategory } from '@/types/dashboard'

export function useProducts() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        // Expandir los datos mock con más productos
        const expandedProducts: ProductWithCategory[] = [
          ...mockProducts,
          {
            id: '3',
            name: 'BCAA 2:1:1 120 cápsulas',
            slug: 'bcaa-211-120-capsulas',
            description: 'Aminoácidos de cadena ramificada para recuperación muscular y reducción de fatiga.',
            short_description: 'BCAA para recuperación y resistencia',
            sku: 'BCAA-120',
            price: 67800,
            compare_price: 75900,
            cost_price: 48000,
            stock_quantity: 18,
            low_stock_threshold: 12,
            brand: 'AminoMax',
            weight: 150,
            serving_size: '4 cápsulas',
            servings_per_container: 30,
            images: ['https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800'],
            tags: ['bcaa', 'aminoácidos', 'recuperación', 'resistencia'],
            ingredients: ['L-Leucina', 'L-Isoleucina', 'L-Valina', 'Gelatina'],
            nutritional_info: {
              leucine: 2500,
              isoleucine: 1250,
              valine: 1250,
              calories: 20
            },
            is_active: true,
            is_featured: false,
            created_at: '2024-03-01T10:00:00Z',
            updated_at: '2024-12-28T10:00:00Z',
            category: {
              id: '4',
              name: 'Aminoácidos',
              slug: 'aminoacidos'
            }
          },
          {
            id: '4',
            name: 'Pre-Entreno Extreme 300g',
            slug: 'pre-entreno-extreme-300g',
            description: 'Fórmula pre-entreno con cafeína, beta-alanina y citrulina para máxima energía y focus.',
            short_description: 'Pre-entreno para energía y concentración',
            sku: 'PEE-300',
            price: 78990,
            compare_price: 89990,
            cost_price: 55000,
            stock_quantity: 4,
            low_stock_threshold: 15,
            brand: 'EnergyBoost',
            weight: 300,
            serving_size: '10g',
            servings_per_container: 30,
            images: ['https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=800'],
            tags: ['pre-entreno', 'energía', 'cafeína', 'focus'],
            ingredients: ['Cafeína', 'Beta-Alanina', 'L-Citrulina', 'Taurina', 'Saborizantes'],
            nutritional_info: {
              caffeine: 200,
              beta_alanine: 3200,
              citrulline: 6000,
              calories: 15
            },
            is_active: true,
            is_featured: true,
            created_at: '2024-03-15T10:00:00Z',
            updated_at: '2024-12-29T10:00:00Z',
            category: {
              id: '3',
              name: 'Pre-Entrenos',
              slug: 'pre-entrenos'
            }
          },
          {
            id: '5',
            name: 'Glutamina Pura 500g',
            slug: 'glutamina-pura-500g',
            description: 'L-Glutamina pura para recuperación muscular y fortalecimiento del sistema inmune.',
            short_description: 'Glutamina para recuperación y sistema inmune',
            sku: 'GLU-500',
            price: 56990,
            compare_price: 64990,
            cost_price: 38000,
            stock_quantity: 32,
            low_stock_threshold: 20,
            brand: 'RecoveryMax',
            weight: 500,
            serving_size: '5g',
            servings_per_container: 100,
            images: ['https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=800'],
            tags: ['glutamina', 'recuperación', 'sistema inmune', 'aminoácido'],
            ingredients: ['L-Glutamina'],
            nutritional_info: {
              glutamine: 5000,
              calories: 20
            },
            is_active: true,
            is_featured: false,
            created_at: '2024-04-01T10:00:00Z',
            updated_at: '2024-12-27T10:00:00Z',
            category: {
              id: '4',
              name: 'Aminoácidos',
              slug: 'aminoacidos'
            }
          },
          {
            id: '6',
            name: 'Omega 3 120 cápsulas',
            slug: 'omega-3-120-capsulas',
            description: 'Ácidos grasos esenciales EPA y DHA para salud cardiovascular y cerebral.',
            short_description: 'Omega 3 para salud cardiovascular',
            sku: 'OMG-120',
            price: 42990,
            compare_price: 49990,
            cost_price: 28000,
            stock_quantity: 1,
            low_stock_threshold: 8,
            brand: 'HealthMax',
            weight: 120,
            serving_size: '2 cápsulas',
            servings_per_container: 60,
            images: ['https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=800'],
            tags: ['omega 3', 'epa', 'dha', 'salud cardiovascular'],
            ingredients: ['Aceite de pescado', 'EPA', 'DHA', 'Vitamina E'],
            nutritional_info: {
              epa: 360,
              dha: 240,
              calories: 10
            },
            is_active: true,
            is_featured: false,
            created_at: '2024-04-15T10:00:00Z',
            updated_at: '2024-12-26T10:00:00Z',
            category: {
              id: '5',
              name: 'Vitaminas',
              slug: 'vitaminas'
            }
          }
        ]
        
        setProducts(expandedProducts)
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Error cargando productos')
      } finally {
        setLoading(false)
      }
    }
    
    loadProducts()
  }, [])

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  const toggleProductStatus = async (id: string) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, is_active: !product.is_active }
          : product
      )
    )
  }

  return {
    products,
    loading,
    error,
    deleteProduct,
    toggleProductStatus,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}