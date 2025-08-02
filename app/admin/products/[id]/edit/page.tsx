import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductById, getCategories } from '@/lib/data'
import { EditProductForm } from './edit-product-form'

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductById(params.id)
  
  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no existe'
    }
  }

  return {
    title: `Editar ${product.name} - Panel de Administración`,
    description: `Editar información del producto ${product.name}`,
  }
}

// Página principal
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getProductById(params.id),
    getCategories({ filters: { is_active: true } })
  ])

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} categories={categories.categories} />
}