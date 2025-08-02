export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getReviewById } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Edit, Star, User, Package, Calendar, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const review = await getReviewById(params.id)
  
  if (!review) {
    return {
      title: 'Reseña no encontrada',
      description: 'La reseña que buscas no existe'
    }
  }

  return {
    title: `${review.title} - Detalles de la Reseña`,
    description: `Detalles de la reseña de ${review.product_name}`,
  }
}

// Componente skeleton para la página de detalle
function ReviewDetailSkeleton() {
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
          {/* Información de la reseña skeleton */}
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
            </CardContent>
          </Card>

          {/* Comentario skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional skeleton */}
        <div className="space-y-6">
          {/* Estado skeleton */}
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
            </CardContent>
          </Card>

          {/* Acciones skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar la información de la reseña
async function ReviewDetails({ reviewId }: { reviewId: string }) {
  const review = await getReviewById(reviewId)
  
  if (!review) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/reviews">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Reseñas
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {review.title}
            </h1>
            <p className="text-muted-foreground">{review.product_name}</p>
          </div>
        </div>
        <Link href={`/admin/reviews/${reviewId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Reseña
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información principal */}
        <div className="space-y-6">
          {/* Información de la reseña */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Información de la Reseña
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Producto</label>
                  <p className="text-sm">{review.product_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="text-sm">{review.customer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{review.customer_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Calificación</label>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium">{review.rating}/5</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comentario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Comentario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Título</label>
                  <p className="text-lg font-medium mt-1">{review.title}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Comentario</label>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{review.comment}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información adicional */}
        <div className="space-y-6">
          {/* Estado de la reseña */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de la Reseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge variant={review.is_approved ? 'default' : 'secondary'}>
                      {review.is_approved ? 'Aprobada' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Compra Verificada</label>
                  <div className="mt-1">
                    <Badge variant={review.verified_purchase ? 'default' : 'secondary'}>
                      {review.verified_purchase ? 'Sí' : 'No'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">
                    {new Date(review.created_at).toLocaleDateString('es-CO', {
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
                    {new Date(review.updated_at).toLocaleDateString('es-CO', {
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
              <Link href={`/admin/reviews/${reviewId}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Reseña
                </Button>
              </Link>
              {review.is_approved ? (
                <Button variant="outline" className="w-full text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Rechazar Reseña
                </Button>
              ) : (
                <Button variant="outline" className="w-full text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar Reseña
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Ver Producto
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Página principal
export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<ReviewDetailSkeleton />}>
      <ReviewDetails reviewId={params.id} />
    </Suspense>
  )
} 