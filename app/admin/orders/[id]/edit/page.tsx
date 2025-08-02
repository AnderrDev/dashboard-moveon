export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getOrderById } from '@/lib/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Package, Truck, DollarSign, MessageSquare } from 'lucide-react'
import Link from 'next/link'

// Generar metadata dinámica
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const order = await getOrderById(params.id)
  
  if (!order) {
    return {
      title: 'Pedido no encontrado',
      description: 'El pedido que buscas no existe'
    }
  }

  return {
    title: `Editar Pedido ${order.order_number} - Panel de Administración`,
    description: `Editar información del pedido ${order.order_number}`,
  }
}

// Componente skeleton para la página de editar
function EditOrderSkeleton() {
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
          {/* Order Information skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Order Items skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Addresses skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
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
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de contenido para manejar la carga asíncrona
async function EditOrderContent({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id)

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/admin/orders/${params.id}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Pedido
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Pedido</h1>
            <p className="text-muted-foreground">
              Pedido {order.order_number} - {order.customer.first_name} {order.customer.last_name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número de Pedido</label>
                  <p className="text-sm font-mono">{order.order_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                      minimumFractionDigits: 0
                    }).format(order.total_amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tracking</label>
                  <p className="text-sm">{order.tracking_number || 'Sin tracking'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notas</label>
                  <p className="text-sm">{order.customer_notes || 'Sin notas'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Productos del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name || 'Producto'}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity} × {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0
                        }).format(item.unit_price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0
                        }).format(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>Direcciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.shipping_address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dirección de Envío</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">
                    {typeof order.shipping_address === 'string' 
                      ? order.shipping_address 
                      : JSON.stringify(order.shipping_address, null, 2)
                    }
                  </p>
                </div>
              )}
              {order.billing_address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dirección de Facturación</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded border">
                    {typeof order.billing_address === 'string' 
                      ? order.billing_address 
                      : JSON.stringify(order.billing_address, null, 2)
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado del Pedido</label>
                <div className="mt-2">
                  <Badge variant="outline" className="text-sm">
                    {order.status === 'pending' && 'Pendiente'}
                    {order.status === 'confirmed' && 'Confirmado'}
                    {order.status === 'processing' && 'Procesando'}
                    {order.status === 'shipped' && 'Enviado'}
                    {order.status === 'delivered' && 'Entregado'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado del Pago</label>
                <div className="mt-2">
                  <Badge variant="outline" className="text-sm">
                    {order.payment_status === 'pending' && 'Pendiente'}
                    {order.payment_status === 'paid' && 'Pagado'}
                    {order.payment_status === 'failed' && 'Fallido'}
                    {order.payment_status === 'refunded' && 'Reembolsado'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <Truck className="mr-2 h-4 w-4" />
                Actualizar Envío
              </Button>
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Gestionar Pago
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contactar Cliente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Página principal
export default async function EditOrderPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<EditOrderSkeleton />}>
      <EditOrderContent params={params} />
    </Suspense>
  )
} 