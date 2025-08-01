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
import { Review } from '@/types/admin'
import { MoreHorizontal, ArrowUpDown, CheckCircle, X, Trash2, Star } from 'lucide-react'
import Image from 'next/image'

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: 'product_image',
    header: 'Producto',
    cell: ({ row }) => {
      const review = row.original
      
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 relative">
            {review.product_image ? (
              <Image
                src={review.product_image}
                alt={review.product_name}
                fill
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">IMG</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{review.product_name}</span>
            <span className="text-xs text-gray-500">{review.customer_name}</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Calificación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number
      
      return (
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium">{rating}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: 'Reseña',
    cell: ({ row }) => {
      const review = row.original
      
      return (
        <div className="max-w-xs">
          <p className="font-medium text-sm truncate">{review.title}</p>
          <p className="text-xs text-gray-500 truncate">{review.comment}</p>
        </div>
      )
    },
  },
  {
    accessorKey: 'customer_email',
    header: 'Cliente',
    cell: ({ row }) => {
      const email = row.getValue('customer_email') as string
      
      return (
        <span className="text-sm text-gray-600">{email}</span>
      )
    },
  },
  {
    accessorKey: 'verified_purchase',
    header: 'Verificada',
    cell: ({ row }) => {
      const verified = row.getValue('verified_purchase') as boolean
      
      return (
        <Badge variant={verified ? 'default' : 'secondary'}>
          {verified ? 'Sí' : 'No'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'is_approved',
    header: 'Estado',
    cell: ({ row }) => {
      const approved = row.getValue('is_approved') as boolean
      
      return (
        <Badge variant={approved ? 'default' : 'destructive'}>
          {approved ? 'Aprobada' : 'Pendiente'}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-8 px-2"
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at') as string)
      return (
        <span className="text-sm text-gray-600">
          {date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          })}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const review = row.original

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
              onClick={() => navigator.clipboard.writeText(review.comment)}
            >
              Copiar comentario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {review.is_approved ? (
              <DropdownMenuItem className="text-red-600">
                <X className="mr-2 h-4 w-4" />
                Rechazar reseña
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-600">
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar reseña
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar reseña
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]