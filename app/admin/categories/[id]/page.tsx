export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCategoryById } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Edit, Tag, Calendar, Package } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
    title: `${category.name} - Detalles de la Categoría`,
    description: category.description || `Detalles de la categoría ${category.name}`,
  }
}

// Componente skeleton para la página de detalle
function CategoryDetailSkeleton() {
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
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información principal skeleton */}
        <div className="space-y-6">
          {/* Imagen skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full max-w-md" />
            </CardContent>
          </Card>

          {/* Información básica skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas y fechas skeleton */}
        <div className="space-y-6">
          {/* Estadísticas skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Skeleton className="h-8 w-16 mx-auto mb-2" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Fechas skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar la información de la categoría
async function CategoryDetails({ categoryId }: { categoryId: string }) {
  const category = await getCategoryById(categoryId)
  
  if (!category) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/categories">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Categorías
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
            <p className="text-muted-foreground">Slug: {category.slug}</p>
          </div>
        </div>
        <Link href={`/admin/categories/${categoryId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Categoría
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información principal */}
        <div className="space-y-6">
          {/* Imagen de la categoría */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen de la Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {category.image_url ? (
                <div className="relative aspect-video w-full max-w-md">
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full max-w-md bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información básica */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-sm">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Slug</label>
                  <p className="text-sm font-mono">{category.slug}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Orden</label>
                  <p className="text-sm">{category.sort_order}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <p className="text-sm">
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </p>
                </div>
              </div>

              {category.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="text-sm mt-1">{category.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas y fechas */}
        <div className="space-y-6">
          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {category.products_count}
                </div>
                <p className="text-sm text-gray-600">Productos en esta categoría</p>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                Información de Fechas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">
                    {new Date(category.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <p className="text-sm">
                    {new Date(category.updated_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/admin/categories/${categoryId}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Categoría
                </Button>
              </Link>
              <Link href="/admin/products/new" className="w-full">
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Página principal
export default async function CategoryDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetails categoryId={params.id} />
    </Suspense>
  )
}