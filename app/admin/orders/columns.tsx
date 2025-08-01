'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { OrderWithDetails } from '@/types/dashboard'
import { MoreHorizontal, ArrowUpDown, Eye, Truck, CreditCard, MessageSquare } from 'lucide-react'
import Link from 'next/link'

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

export const columns: ColumnDef<OrderWithDetails>[] = [
  {
    accessorKey: 'order_number',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Pedido
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const order = row.original
      return (
        <div className="flex flex-col">
          <Link 
            href={`/admin/orders/${order.id}`}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            {order.order_number}
          </Link>
          <span className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'customer',
    header: 'Cliente',
    cell: ({ row }) => {
      const customer = row.original.customer
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer.first_name} {customer.last_name}</span>
          <span className="text-sm text-gray-500">{customer.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'order_items',
    header: 'Productos',
    cell: ({ row }) => {
      const items = row.original.order_items
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">{totalItems} producto{totalItems !== 1 ? 's' : ''}</span>
          <span className="text-sm text-gray-500">
            {items.length} artículo{items.length !== 1 ? 's' : ''}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'total_amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue('total_amount') as number
      
      return (
        <span className="font-medium">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
          }).format(total)}
        </span>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const status = row.getValue('status') as keyof typeof statusColors
      
      return (
        <Badge className={statusColors[status]} variant="outline">
          {statusLabels[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'payment_status',
    header: 'Pago',
    cell: ({ row }) => {
      const paymentStatus = row.getValue('payment_status') as keyof typeof paymentStatusColors
      
      return (
        <Badge className={paymentStatusColors[paymentStatus]} variant="outline">
          {paymentStatusLabels[paymentStatus]}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'tracking_number',
    header: 'Tracking',
    cell: ({ row }) => {
      const trackingNumber = row.getValue('tracking_number') as string
      
      return trackingNumber ? (
        <div className="flex items-center space-x-1">
          <Truck className="h-4 w-4 text-green-600" />
          <span className="text-sm font-mono">{trackingNumber}</span>
        </div>
      ) : (
        <span className="text-gray-400 text-sm">Sin tracking</span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.order_number)}
            >
              Copiar número de pedido
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Gestionar pago
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Truck className="mr-2 h-4 w-4" />
              Actualizar envío
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contactar cliente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]