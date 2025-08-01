'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag, 
  Package,
  ToggleLeft,
  ToggleRight,
  Eye,
  Loader2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryWithProducts } from '@/types/dashboard'
import { mockCategories } from '@/lib/mock-data'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function CategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<CategoryWithProducts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true)
      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundCategory = mockCategories.find(c => c.id === params.id)
      setCategory(foundCategory || null)
      setLoading(false)
    }

    if (params.id) {
      loadCategory()
    }
  }, [params.id])

  const handleDelete = async () => {
    // Simular eliminación
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/admin/categories')
  }

  const toggleStatus = async () => {
    if (category) {
      setCategory({ ...category, is_active: !category.is_active })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Cargando categoría...</span>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Tag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Categoría no encontrada</h2>
        <p className="text-gray-600 mb-4">La categoría que buscas no existe o ha sido eliminada.</p>
        <Link href="/admin/categories">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a categorías
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/categories">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{category.name}</h1>
            <p className="text-gray-600">/{category.slug}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={toggleStatus}>
            {category.is_active ? (
              <>
                <ToggleLeft className="mr-2 h-4 w-4" />
                Desactivar
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 h-4 w-4" />
                Activar
              </>
            )}
          </Button>
          <Link href={`/admin/categories/${category.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
                  {category.products_count > 0 && (
                    <span className="block mt-2 text-red-600 font-medium">
                      Advertencia: Esta categoría tiene {category.products_count} productos asociados.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center space-x-2">
        <Badge variant={category.is_active ? 'default' : 'secondary'}>
          {category.is_active ? 'Activa' : 'Inactiva'}
        </Badge>
        <Badge variant="outline">
          <Package className="mr-1 h-3 w-3" />
          {category.products_count} productos
        </Badge>
        <Badge variant="outline">
          Orden: {category.sort_order}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Image */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square rounded-lg overflow-hidden">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Tag className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Descripción</h3>
                <p className="text-gray-600">{category.description || 'Sin descripción'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Slug</h3>
                  <p className="text-gray-600 font-mono">/{category.slug}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Orden</h3>
                  <p className="text-gray-600">{category.sort_order}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Fecha de Creación</h3>
                  <p className="text-gray-600">
                    {new Date(category.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Última Actualización</h3>
                  <p className="text-gray-600">
                    {new Date(category.updated_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Productos en esta Categoría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {category.products_count}
                </div>
                <p className="text-gray-600 mb-4">
                  Productos en la categoría "{category.name}"
                </p>
                {category.products_count > 0 && (
                  <Link href={`/admin/products?category=${category.id}`}>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Productos
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parent/Children Categories */}
          {(category.parent_id || category.children) && (
            <Card>
              <CardHeader>
                <CardTitle>Jerarquía</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.parent_id && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Categoría Padre</h3>
                    <Badge variant="outline">
                      {mockCategories.find(c => c.id === category.parent_id)?.name || 'Categoría padre'}
                    </Badge>
                  </div>
                )}
                
                {category.children && category.children.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Subcategorías</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.children.map((child) => (
                        <Badge key={child.id} variant="outline">
                          {child.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}