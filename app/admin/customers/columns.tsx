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
import { Customer } from '@/types/admin'
import { MoreHorizontal, ArrowUpDown, Eye, Mail, Ban, CheckCircle, UserX } from 'lucide-react'

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: 'first_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer.first_name} {customer.last_name}</span>
          <span className="text-sm text-gray-500">{customer.email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'phone',
    header: 'Teléfono',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string
      return phone ? (
        <span className="text-sm">{phone}</span>
      ) : (
        <span className="text-gray-400 text-sm">Sin teléfono</span>
      )
    },
  },
  {
    accessorKey: 'total_orders',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Pedidos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orders = row.getValue('total_orders') as number
      return (
        <div className="text-center">
          <span className="font-medium">{orders}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'total_spent',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Total Gastado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const total = row.getValue('total_spent') as number
      
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
    accessorKey: 'average_order_value',
    header: 'Promedio',
    cell: ({ row }) => {
      const avg = row.getValue('average_order_value') as number
      
      return (
        <span className="text-sm text-gray-600">
          {new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
          }).format(avg)}
        </span>
      )
    },
  },
  {
    accessorKey: 'email_verified',
    header: 'Email',
    cell: ({ row }) => {
      const verified = row.getValue('email_verified') as boolean
      
      return (
        <Badge variant={verified ? 'default' : 'secondary'}>
          {verified ? 'Verificado' : 'Pendiente'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'is_active',
    header: 'Estado',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      
      return (
        <Badge variant={isActive ? 'default' : 'destructive'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'last_login_at',
    header: 'Último Acceso',
    cell: ({ row }) => {
      const lastLogin = row.getValue('last_login_at') as string
      
      return lastLogin ? (
        <span className="text-sm text-gray-600">
          {new Date(lastLogin).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      ) : (
        <span className="text-gray-400 text-sm">Nunca</span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const customer = row.original

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
              onClick={() => navigator.clipboard.writeText(customer.email)}
            >
              Copiar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Enviar email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {customer.is_active ? (
              <DropdownMenuItem className="text-red-600">
                <Ban className="mr-2 h-4 w-4" />
                Desactivar cliente
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Activar cliente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]