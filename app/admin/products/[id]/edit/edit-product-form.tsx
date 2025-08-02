'use client'

import { ProductForm } from '@/components/forms/product-form'
import { ProductWithCategory, CategoryWithProducts } from '@/types/dashboard'

interface EditProductFormProps {
  product: ProductWithCategory
  categories: CategoryWithProducts[]
}

export function EditProductForm({ product, categories }: EditProductFormProps) {
  return (
    <ProductForm 
      mode="edit" 
      product={product} 
      categories={categories}
    />
  )
} 