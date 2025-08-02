export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCategoryById } from '@/lib/data'
import { CategoryForm } from '@/components/forms/category-form'
import { Skeleton } from '@/components/ui/skeleton'

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const category = await getCategoryById(params.id)
  
  if (!category) {
    return {
      title: 'Categoría no encontrada',
      description: 'La categoría que buscas no existe'
    }
  }

  return {
    title: `Editar ${category.name} - Panel de Administración`,
    description: `Editar información de la categoría ${category.name}`,
  }
}

// Componente skeleton para la página de editar
function EditCategorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content skeleton */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Settings skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          {/* Status skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-16" />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-11" />
              </div>
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Página principal
export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<EditCategorySkeleton />}>
      <EditCategoryContent params={params} />
    </Suspense>
  )
}

// Componente de contenido para manejar la carga asíncrona
async function EditCategoryContent({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id)

  if (!category) {
    notFound()
  }

  return <CategoryForm mode="edit" category={category} />
}