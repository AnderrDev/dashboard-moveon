'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateCategory as updateCategoryData, createCategory as createCategoryData } from '@/lib/data/categories'
import { CategoryWithProducts } from '@/types/dashboard'

// Tipos para las acciones
export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  image_url?: string
  sort_order: number
  is_active?: boolean
}

export interface UpdateCategoryData {
  name?: string
  slug?: string
  description?: string
  image_url?: string
  sort_order?: number
  is_active?: boolean
}

// Acción para crear una nueva categoría
export async function createCategoryAction(data: CreateCategoryData) {
  try {
    // Validaciones básicas
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido')
    }

    if (!data.slug || data.slug.trim().length === 0) {
      throw new Error('El slug de la categoría es requerido')
    }

    if (data.sort_order < 0) {
      throw new Error('El orden no puede ser negativo')
    }

    // Crear categoría
    const newCategory = await createCategoryData(data)

    if (!newCategory) {
      throw new Error('No se pudo crear la categoría')
    }

    // Revalidar rutas relacionadas
    revalidatePath('/admin/categories')
    revalidatePath('/admin/categories/new')

    return {
      success: true,
      category: newCategory,
      message: 'Categoría creada correctamente'
    }

  } catch (error) {
    console.error('Error en createCategoryAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al crear la categoría'
    }
  }
}

// Acción para actualizar una categoría
export async function updateCategoryAction(id: string, data: UpdateCategoryData) {
  try {
    // Validaciones básicas
    if (!id) {
      throw new Error('ID de la categoría es requerido')
    }

    if (data.name && data.name.trim().length === 0) {
      throw new Error('El nombre de la categoría es requerido')
    }

    if (data.slug && data.slug.trim().length === 0) {
      throw new Error('El slug de la categoría es requerido')
    }

    if (data.sort_order !== undefined && data.sort_order < 0) {
      throw new Error('El orden no puede ser negativo')
    }

    // Actualizar categoría
    const updatedCategory = await updateCategoryData(id, data)

    if (!updatedCategory) {
      throw new Error('No se pudo actualizar la categoría')
    }

    // Revalidar rutas relacionadas
    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}`)
    revalidatePath(`/admin/categories/${id}/edit`)

    return {
      success: true,
      category: updatedCategory,
      message: 'Categoría actualizada correctamente'
    }

  } catch (error) {
    console.error('Error en updateCategoryAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al actualizar la categoría'
    }
  }
}

// Acción para cambiar el estado activo de una categoría
export async function toggleCategoryStatusAction(id: string, isActive: boolean) {
  try {
    const result = await updateCategoryAction(id, { is_active: isActive })
    
    if (result.success) {
      return {
        success: true,
        message: `Categoría ${isActive ? 'activada' : 'desactivada'} correctamente`
      }
    }
    
    return result

  } catch (error) {
    console.error('Error en toggleCategoryStatusAction:', error)
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar el estado de la categoría'
    }
  }
} 