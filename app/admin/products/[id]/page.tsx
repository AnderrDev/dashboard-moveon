'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Tag,
  AlertTriangle,
  Star,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ProductWithCategory } from '@/types/dashboard'
import { mockProducts } from '@/lib/mock-data'
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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      // Simular carga de API
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const foundProduct = mockProducts.find(p => p.id === params.id)
      setProduct(foundProduct || null)
      setLoading(false)
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  const handleDelete = async () => {
    // Simular eliminación
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/admin/products')
  }

  const toggleStatus = async () => {
    if (product) {
      setProduct({ ...product, is_active: !product.is_active })
    }
  }

  const toggleFeatured = async () => {
    if (product) {
      setProduct({ ...product, is_featured: !product.is_featured })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando producto...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Producto no encontrado</h2>
        <p className="text-gray-600 mb-4">El producto que buscas no existe o ha sido eliminado.</p>
        <Link href="/admin/products">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
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
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={toggleStatus}>
            {product.is_active ? (
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
          <Link href={`/admin/products/${product.id}/edit`}>
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
                  Esta acción no se puede deshacer. El producto será eliminado permanentemente.
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

      {/* Status Badges */}
      <div className="flex items-center space-x-2">
        <Badge variant={product.is_active ? 'default' : 'secondary'}>
          {product.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
        {product.is_featured && (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Star className="mr-1 h-3 w-3" />
            Destacado
          </Badge>
        )}
        {product.stock_quantity <= product.low_stock_threshold && (
          <Badge variant="destructive">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Stock Bajo
          </Badge>
        )}
        {product.category && (
          <Badge variant="outline">
            <Tag className="mr-1 h-3 w-3" />
            {product.category.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Images */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`${product.name} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {product.images.length === 0 && (
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Descripción</h3>
                <p className="text-gray-600">{product.description || 'Sin descripción'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Descripción Corta</h3>
                <p className="text-gray-600">{product.short_description || 'Sin descripción corta'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Marca</h3>
                  <p className="text-gray-600">{product.brand || 'Sin marca'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Peso</h3>
                  <p className="text-gray-600">{product.weight ? `${product.weight}g` : 'No especificado'}</p>
                </div>
              </div>

              {product.serving_size && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Tamaño de Porción</h3>
                    <p className="text-gray-600">{product.serving_size}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Porciones por Envase</h3>
                    <p className="text-gray-600">{product.servings_per_container}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Precios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Precio de Venta</h3>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(product.price)}</p>
                </div>
                {product.compare_price && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Precio Comparativo</h3>
                    <p className="text-xl text-gray-500 line-through">{formatCurrency(product.compare_price)}</p>
                  </div>
                )}
                {product.cost_price && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Precio de Costo</h3>
                    <p className="text-xl text-gray-600">{formatCurrency(product.cost_price)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Stock Actual</h3>
                  <p className={`text-2xl font-bold ${
                    product.stock_quantity <= product.low_stock_threshold 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {product.stock_quantity} unidades
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Umbral de Stock Bajo</h3>
                  <p className="text-xl text-gray-600">{product.low_stock_threshold} unidades</p>
                </div>
              </div>
              {product.stock_quantity <= product.low_stock_threshold && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">Stock bajo - Requiere reposición</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags and Ingredients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Etiquetas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length === 0 && (
                    <p className="text-gray-500">Sin etiquetas</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {product.ingredients.map((ingredient, index) => (
                    <p key={index} className="text-sm text-gray-600">• {ingredient}</p>
                  ))}
                  {product.ingredients.length === 0 && (
                    <p className="text-gray-500">Sin ingredientes especificados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutritional Info */}
          {Object.keys(product.nutritional_info).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Información Nutricional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(product.nutritional_info).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 capitalize">{key.replace('_', ' ')}</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {value}{key.includes('calorie') ? '' : key.includes('mg') ? 'mg' : 'g'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}