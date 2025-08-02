export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getProductById } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Edit, Package, DollarSign, AlertTriangle, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
    title: `${product.name} - Detalles del Producto`,
    description: product.short_description || product.description || `Detalles del producto ${product.name}`,
  }
}

// Componente para mostrar la información del producto
async function ProductDetails({ productId }: { productId: string }) {
  const product = await getProductById(productId)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <Link href={`/admin/products/${productId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Producto
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información principal */}
        <div className="space-y-6">
          {/* Imagen del producto */}
          <Card>
            <CardHeader>
              <CardTitle>Imagen del Producto</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="relative aspect-square w-full max-w-md">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full max-w-md bg-gray-200 rounded-lg flex items-center justify-center">
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
                  <p className="text-sm">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="text-sm font-mono">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                  <p className="text-sm">
                    {product.category ? (
                      <Badge variant="secondary">{product.category.name}</Badge>
                    ) : (
                      'Sin categoría'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marca</label>
                  <p className="text-sm">{product.brand || 'No especificada'}</p>
                </div>
              </div>

              {product.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="text-sm mt-1">{product.description}</p>
                </div>
              )}

              {product.short_description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción Corta</label>
                  <p className="text-sm mt-1">{product.short_description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información de precios y stock */}
        <div className="space-y-6">
          {/* Precios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                Información de Precios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Precio de Venta</label>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(product.price)}
                  </p>
                </div>
                {product.compare_price && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Precio Comparativo</label>
                    <p className="text-lg line-through text-muted-foreground">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(product.compare_price)}
                    </p>
                  </div>
                )}
                {product.cost_price && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Precio de Costo</label>
                    <p className="text-sm">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(product.cost_price)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Información de Stock
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock Actual</label>
                  <p className={`text-2xl font-bold ${
                    product.stock_quantity <= product.low_stock_threshold 
                      ? 'text-red-600' 
                      : ''
                  }`}>
                    {product.stock_quantity}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Umbral de Stock Bajo</label>
                  <p className="text-sm">{product.low_stock_threshold}</p>
                </div>
              </div>

              {product.stock_quantity <= product.low_stock_threshold && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">
                    Stock bajo - Requiere reposición
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estado del producto */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Destacado</label>
                  <div className="mt-1">
                    {product.is_featured ? (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        <Star className="mr-1 h-3 w-3" />
                        Destacado
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">No destacado</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Información adicional */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información nutricional */}
        {product.nutritional_info && Object.keys(product.nutritional_info).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Información Nutricional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.nutritional_info).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </label>
                    <p className="text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ingredientes */}
        {product.ingredients && product.ingredients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ingredientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm">{ingredient}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información de peso y porciones */}
        {(product.weight || product.serving_size || product.servings_per_container) && (
          <Card>
            <CardHeader>
              <CardTitle>Especificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Peso</label>
                    <p className="text-sm">{product.weight}g</p>
                  </div>
                )}
                {product.serving_size && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tamaño de Porción</label>
                    <p className="text-sm">{product.serving_size}</p>
                  </div>
                )}
                {product.servings_per_container && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Porciones por Envase</label>
                    <p className="text-sm">{product.servings_per_container}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fechas */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
              <p className="text-sm">
                {new Date(product.created_at).toLocaleDateString('es-CO', {
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
                {new Date(product.updated_at).toLocaleDateString('es-CO', {
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
    </div>
  )
}

// Página principal
export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetails productId={params.id} />
}