import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RecentOrder } from '@/types/dashboard'
import Link from 'next/link'

interface RecentOrdersProps {
  orders: RecentOrder[]
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusLabels = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {order.order_number}
                  </Link>
                  <Badge 
                    className={statusColors[order.status as keyof typeof statusColors]}
                    variant="secondary"
                  >
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {order.customer.name} • {order.customer.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(order.total)}
                </p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay pedidos recientes
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}