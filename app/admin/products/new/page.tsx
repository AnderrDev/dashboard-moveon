import { getCategories } from '@/lib/data'
import { ProductForm } from '@/components/forms/product-form'

export default async function NewProductPage() {
  const { categories } = await getCategories({ filters: { is_active: true } })
  
  return <ProductForm mode="create" categories={categories} />
}