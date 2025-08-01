'use client'

import { useState, useEffect } from 'react'
import { mockOrdersWithDetails } from '@/lib/mock-data'
import { OrderWithDetails } from '@/types/dashboard'

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        // Expandir los datos mock con más pedidos
        const expandedOrders: OrderWithDetails[] = [
          ...mockOrdersWithDetails,
          {
            id: '2',
            order_number: 'ORD-2024-002',
            user_id: 'user-2',
            status: 'processing',
            payment_status: 'paid',
            subtotal: 156500,
            tax_amount: 29735,
            shipping_amount: 8000,
            discount_amount: 15650,
            total_amount: 178585,
            billing_address: {
              first_name: 'María',
              last_name: 'González',
              address_line_1: 'Carrera 15 #32-45',
              city: 'Medellín',
              state: 'Antioquia',
              postal_code: '050001',
              country: 'Colombia'
            },
            shipping_address: {
              first_name: 'María',
              last_name: 'González',
              address_line_1: 'Carrera 15 #32-45',
              city: 'Medellín',
              state: 'Antioquia',
              postal_code: '050001',
              country: 'Colombia'
            },
            tracking_number: null,
            customer_notes: null,
            admin_notes: 'Cliente VIP - descuento aplicado',
            created_at: '2024-12-30T09:15:00Z',
            updated_at: '2024-12-30T10:30:00Z',
            customer: {
              id: 'user-2',
              first_name: 'María',
              last_name: 'González',
              email: 'maria.gonzalez@email.com'
            },
            order_items: [
              {
                id: 'item-2',
                product_name: 'Proteína Whey Gold 2.2kg',
                product_sku: 'PWG-2200',
                product_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
                quantity: 1,
                unit_price: 89990,
                total_price: 89990
              },
              {
                id: 'item-3',
                product_name: 'BCAA 2:1:1 120 cápsulas',
                product_sku: 'BCAA-120',
                product_image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400',
                quantity: 1,
                unit_price: 67800,
                total_price: 67800
              }
            ]
          },
          {
            id: '3',
            order_number: 'ORD-2024-003',
            user_id: 'user-3',
            status: 'shipped',
            payment_status: 'paid',
            subtotal: 67800,
            tax_amount: 12882,
            shipping_amount: 8000,
            discount_amount: 0,
            total_amount: 88682,
            billing_address: {
              first_name: 'Andrés',
              last_name: 'López',
              address_line_1: 'Calle 85 #12-34',
              city: 'Cali',
              state: 'Valle del Cauca',
              postal_code: '760001',
              country: 'Colombia'
            },
            shipping_address: {
              first_name: 'Andrés',
              last_name: 'López',
              address_line_1: 'Calle 85 #12-34',
              city: 'Cali',
              state: 'Valle del Cauca',
              postal_code: '760001',
              country: 'Colombia'
            },
            tracking_number: 'TRK987654321',
            customer_notes: 'Favor entregar después de las 2 PM',
            admin_notes: null,
            created_at: '2024-12-30T08:45:00Z',
            updated_at: '2024-12-30T14:20:00Z',
            customer: {
              id: 'user-3',
              first_name: 'Andrés',
              last_name: 'López',
              email: 'andres.lopez@email.com'
            },
            order_items: [
              {
                id: 'item-4',
                product_name: 'BCAA 2:1:1 120 cápsulas',
                product_sku: 'BCAA-120',
                product_image: 'https://images.pexels.com/photos/3683107/pexels-photo-3683107.jpeg?auto=compress&cs=tinysrgb&w=400',
                quantity: 1,
                unit_price: 67800,
                total_price: 67800
              }
            ]
          },
          {
            id: '4',
            order_number: 'ORD-2024-004',
            user_id: 'user-4',
            status: 'pending',
            payment_status: 'pending',
            subtotal: 234900,
            tax_amount: 44631,
            shipping_amount: 8000,
            discount_amount: 0,
            total_amount: 287531,
            billing_address: {
              first_name: 'Laura',
              last_name: 'Martínez',
              address_line_1: 'Avenida 68 #45-67',
              city: 'Bogotá',
              state: 'Cundinamarca',
              postal_code: '110221',
              country: 'Colombia'
            },
            shipping_address: {
              first_name: 'Laura',
              last_name: 'Martínez',
              address_line_1: 'Avenida 68 #45-67',
              city: 'Bogotá',
              state: 'Cundinamarca',
              postal_code: '110221',
              country: 'Colombia'
            },
            tracking_number: null,
            customer_notes: null,
            admin_notes: 'Pendiente confirmación de pago',
            created_at: '2024-12-29T16:20:00Z',
            updated_at: '2024-12-29T16:20:00Z',
            customer: {
              id: 'user-4',
              first_name: 'Laura',
              last_name: 'Martínez',
              email: 'laura.martinez@email.com'
            },
            order_items: [
              {
                id: 'item-5',
                product_name: 'Proteína Whey Gold 2.2kg',
                product_sku: 'PWG-2200',
                product_image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400',
                quantity: 2,
                unit_price: 89990,
                total_price: 179980
              },
              {
                id: 'item-6',
                product_name: 'Glutamina Pura 500g',
                product_sku: 'GLU-500',
                product_image: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400',
                quantity: 1,
                unit_price: 56990,
                total_price: 56990
              }
            ]
          }
        ]
        
        setOrders(expandedOrders)
      } catch (err) {
        console.error('Error loading orders:', err)
        setError('Error cargando pedidos')
      } finally {
        setLoading(false)
      }
    }
    
    loadOrders()
  }, [])

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, status, updated_at: new Date().toISOString() }
          : order
      )
    )
  }

  const updatePaymentStatus = async (id: string, paymentStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, payment_status: paymentStatus, updated_at: new Date().toISOString() }
          : order
      )
    )
  }

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    refetch: () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 500)
    }
  }
}