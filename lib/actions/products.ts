'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateProduct as updateProductData } from '@/lib/data/products'
import { ProductWithCategory } from '@/types/dashboard'

// Tipos para las acciones
export interface UpdateProductData {
  name?: string
  slug?: string
  description?: string
  short_description?: string
  sku?: string
  price?: number
  compare_price?: number
  cost_price?: number
  stock_quantity?: number
  low_stock_threshold?: number
  brand?: string
  weight?: number
  serving_size?: string
  servings_per_container?: number
  category_id?: string
  tags?: string[]
  ingredients?: string[]
  nutritional_info?: Record<string, any>
  images?: string[]
  is_active?: boolean
  is_featured?: boolean
}

// Acción para actualizar un producto
export async function updateProductAction(id: string, data: UpdateProductData) {
  try {
    // Validaciones básicas
    if (!id) {
      throw new Error('ID del producto es requerido')
    }

    if (data.name && data.name.trim().length === 0) {
      throw new Error('El nombre del producto es requerido')
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error('El precio no puede ser negativo')
    }

    if (data.stock_quantity !== undefined && data.stock_quantity < 0) {
      throw new Error('El stock no puede ser negativo')
    }

    // Actualizar producto
    const updatedProduct = await updateProductData(id, data)

    if (!updatedProduct) {
      throw new Error('No se pudo actualizar el producto')
    }

    // Revalidar rutas relacionadas
    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    revalidatePath(`/admin/products/${id}/edit`)

    return {
      success: true,
      product: updatedProduct,
      message: 'Producto actualizado correctamente'
    }

  } catch (error) {
    console.error('Error en updateProductAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar el producto'
    }
  }
}

// Acción para cambiar el estado activo de un producto
export async function toggleProductStatusAction(id: string, isActive: boolean) {
  try {
    const result = await updateProductAction(id, { is_active: isActive })
    
    if (result.success) {
      return {
        success: true,
        message: `Producto ${isActive ? 'activado' : 'desactivado'} correctamente`
      }
    }
    
    return result

  } catch (error) {
    console.error('Error en toggleProductStatusAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar el estado del producto'
    }
  }
}

// Acción para cambiar el estado destacado de un producto
export async function toggleProductFeaturedAction(id: string, isFeatured: boolean) {
  try {
    const result = await updateProductAction(id, { is_featured: isFeatured })
    
    if (result.success) {
      return {
        success: true,
        message: `Producto ${isFeatured ? 'marcado como destacado' : 'removido de destacados'} correctamente`
      }
    }
    
    return result

  } catch (error) {
    console.error('Error en toggleProductFeaturedAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar el estado destacado del producto'
    }
  }
}

// Acción para actualizar el stock de un producto
export async function updateProductStockAction(id: string, stockQuantity: number, lowStockThreshold?: number) {
  try {
    if (stockQuantity < 0) {
      throw new Error('El stock no puede ser negativo')
    }

    const updateData: UpdateProductData = {
      stock_quantity: stockQuantity
    }

    if (lowStockThreshold !== undefined) {
      updateData.low_stock_threshold = lowStockThreshold
    }

    const result = await updateProductAction(id, updateData)
    
    if (result.success) {
      return {
        success: true,
        message: 'Stock actualizado correctamente'
      }
    }
    
    return result

  } catch (error) {
    console.error('Error en updateProductStockAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el stock del producto'
    }
  }
}

// Acción para actualizar el precio de un producto
export async function updateProductPriceAction(
  id: string, 
  price: number, 
  comparePrice?: number, 
  costPrice?: number
) {
  try {
    if (price < 0) {
      throw new Error('El precio no puede ser negativo')
    }

    const updateData: UpdateProductData = {
      price
    }

    if (comparePrice !== undefined) {
      updateData.compare_price = comparePrice
    }

    if (costPrice !== undefined) {
      updateData.cost_price = costPrice
    }

    const result = await updateProductAction(id, updateData)
    
    if (result.success) {
      return {
        success: true,
        message: 'Precio actualizado correctamente'
      }
    }
    
    return result

  } catch (error) {
    console.error('Error en updateProductPriceAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al actualizar el precio del producto'
    }
  }
} 