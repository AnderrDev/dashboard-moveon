export const dynamic = 'force-dynamic'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getOrderById } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Edit, ShoppingCart, User, Package, Truck, DollarSign, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import Image from 'next/image'
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
    title: `Pedido ${order.order_number} - Detalles del Pedido`,
    description: `Detalles del pedido ${order.order_number} de ${order.customer.first_name} ${order.customer.last_name}`,
  }
}

// Componente skeleton para la página de detalle
function OrderDetailSkeleton() {
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
          {/* Información del cliente skeleton */}
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

          {/* Productos skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de pago y envío skeleton */}
        <div className="space-y-6">
          {/* Estado del pedido skeleton */}
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

          {/* Direcciones skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-16 w-full" />
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

// Componente para mostrar la información del pedido
async function OrderDetails({ orderId }: { orderId: string }) {
  const order = await getOrderById(orderId)
  
  if (!order) {
    notFound()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    processing: 'bg-purple-100 text-purple-800 border-purple-200',
    shipped: 'bg-green-100 text-green-800 border-green-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  }

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    refunded: 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const paymentStatusLabels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    failed: 'Fallido',
    refunded: 'Reembolsado'
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Pedidos
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pedido {order.order_number}</h1>
            <p className="text-muted-foreground">
              {order.customer.first_name} {order.customer.last_name}
            </p>
          </div>
        </div>
        <Link href={`/admin/orders/${orderId}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Pedido
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información principal */}
        <div className="space-y-6">
          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-sm">
                    {order.customer.first_name} {order.customer.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm flex items-center">
                    <Mail className="mr-1 h-3 w-3" />
                    {order.customer.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                  <p className="text-sm flex items-center">
                    <Phone className="mr-1 h-3 w-3" />
                    {'phone' in order.customer ? String(order.customer.phone) : 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID Cliente</label>
                  <p className="text-sm font-mono">{order.customer.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Productos del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Productos del Pedido
              </CardTitle>
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
                        Cantidad: {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.total_price)}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold">{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información de pago y envío */}
        <div className="space-y-6">
          {/* Estado del pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Estado del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="mt-1">
                    <Badge className={statusColors[order.status as keyof typeof statusColors]} variant="outline">
                      {statusLabels[order.status as keyof typeof statusLabels]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pago</label>
                  <div className="mt-1">
                    <Badge className={paymentStatusColors[order.payment_status as keyof typeof paymentStatusColors]} variant="outline">
                      {paymentStatusLabels[order.payment_status as keyof typeof paymentStatusLabels]}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total</label>
                  <p className="text-lg font-bold">{formatCurrency(order.total_amount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tracking</label>
                  <p className="text-sm">
                    {order.tracking_number ? (
                      <span className="flex items-center">
                        <Truck className="mr-1 h-3 w-3" />
                        {order.tracking_number}
                      </span>
                    ) : (
                      'Sin tracking'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direcciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Direcciones
              </CardTitle>
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
                    {new Date(order.created_at).toLocaleDateString('es-CO', {
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
                    {new Date(order.updated_at).toLocaleDateString('es-CO', {
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
              <Link href={`/admin/orders/${orderId}/edit`} className="w-full">
                <Button variant="outline" className="w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Pedido
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <Truck className="mr-2 h-4 w-4" />
                Actualizar Envío
              </Button>
              <Button variant="outline" className="w-full">
                <DollarSign className="mr-2 h-4 w-4" />
                Gestionar Pago
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Página principal
export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <OrderDetails orderId={params.id} />
    </Suspense>
  )
} 